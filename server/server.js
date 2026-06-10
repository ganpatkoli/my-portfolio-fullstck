import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { User, Project, Service, Tech, Experience, Testimonial, Message, Social } from "./models.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// AWS S3 Configuration
const s3Configured = !!(
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_REGION &&
  process.env.AWS_BUCKET_NAME
);

let s3Client = null;
if (s3Configured) {
  s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  console.log("AWS S3 client initialized successfully.");
} else {
  console.log("AWS credentials not fully configured. Using local uploads fallback.");
}

// Ensure local fallback uploads directory exists
const localUploadsDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(localUploadsDir)) {
  fs.mkdirSync(localUploadsDir, { recursive: true });
}

// Multer Config
const storage = multer.memoryStorage();
const upload = multer({ storage });


const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio";
const JWT_SECRET = process.env.JWT_SECRET || "super-secure-portfolio-jwt-secret-key-123";

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://my-portfolio-fullstack-woad.vercel.app",
        "https://apis.appmitra.org/"
      ];
      const isAllowed =
        allowedOrigins.includes(origin) || origin.endsWith(".vercel.app");
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Database Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log(`Connected to MongoDB at ${MONGODB_URI}`))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// ============================================================================
// IMAGE UPLOAD ROUTE (S3 with Local Fallback)
// ============================================================================

app.post("/api/upload", authenticateToken, upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const bucketName = process.env.AWS_BUCKET_NAME;
    const urls = [];

    for (const file of req.files) {
      const fileExtension = file.originalname.split(".").pop();
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;

      if (s3Configured && s3Client) {
        // Upload to S3
        const uniqueKey = `projects/${filename}`;
        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: uniqueKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        });
        await s3Client.send(command);
        urls.push(`https://${bucketName}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${uniqueKey}`);
      } else {
        // Fallback to local file saving
        const localPath = path.join(localUploadsDir, filename);
        await fs.promises.writeFile(localPath, file.buffer);
        const host = req.get("host") || `localhost:${PORT}`;
        const protocol = req.protocol || "http";
        urls.push(`${protocol}://${host}/uploads/${filename}`);
      }
    }

    res.json({ urls });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload files", error: error.message });
  }
});

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, username: user.username });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/auth/verify", authenticateToken, (req, res) => {
  res.json({ valid: true, username: req.user.username });
});

// ============================================================================
// PROJECTS CRUD ROUTES
// ============================================================================

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/projects", authenticateToken, async (req, res) => {
  try {
    const project = new Project(req.body);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/projects/:id", authenticateToken, async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProject) return res.status(404).json({ message: "Project not found" });
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/projects/:id", authenticateToken, async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================================
// SERVICES CRUD ROUTES
// ============================================================================

app.get("/api/services", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/services", authenticateToken, async (req, res) => {
  try {
    const service = new Service(req.body);
    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/services/:id", authenticateToken, async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedService) return res.status(404).json({ message: "Service not found" });
    res.json(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/services/:id", authenticateToken, async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================================
// TECH SKILLS CRUD ROUTES
// ============================================================================

app.get("/api/tech", async (req, res) => {
  try {
    const tech = await Tech.find();
    res.json(tech);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/tech", authenticateToken, async (req, res) => {
  try {
    const techSkill = new Tech(req.body);
    const savedTech = await techSkill.save();
    res.status(201).json(savedTech);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/tech/:id", authenticateToken, async (req, res) => {
  try {
    const updatedTech = await Tech.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTech) return res.status(404).json({ message: "Tech skill not found" });
    res.json(updatedTech);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/tech/:id", authenticateToken, async (req, res) => {
  try {
    const deletedTech = await Tech.findByIdAndDelete(req.params.id);
    if (!deletedTech) return res.status(404).json({ message: "Tech skill not found" });
    res.json({ message: "Tech skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================================
// EXPERIENCE CRUD ROUTES
// ============================================================================

app.get("/api/experience", async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/experience", authenticateToken, async (req, res) => {
  try {
    const exp = new Experience(req.body);
    const savedExp = await exp.save();
    res.status(201).json(savedExp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/experience/:id", authenticateToken, async (req, res) => {
  try {
    const updatedExp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedExp) return res.status(404).json({ message: "Experience not found" });
    res.json(updatedExp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/experience/:id", authenticateToken, async (req, res) => {
  try {
    const deletedExp = await Experience.findByIdAndDelete(req.params.id);
    if (!deletedExp) return res.status(404).json({ message: "Experience not found" });
    res.json({ message: "Experience deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================================
// TESTIMONIALS CRUD ROUTES
// ============================================================================

app.get("/api/testimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/testimonials", authenticateToken, async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    const savedTestimonial = await testimonial.save();
    res.status(201).json(savedTestimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/testimonials/:id", authenticateToken, async (req, res) => {
  try {
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTestimonial) return res.status(404).json({ message: "Testimonial not found" });
    res.json(updatedTestimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/testimonials/:id", authenticateToken, async (req, res) => {
  try {
    const deletedTestimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deletedTestimonial) return res.status(404).json({ message: "Testimonial not found" });
    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================================
// MESSAGES (CONTACT FORM) CRUD ROUTES
// ============================================================================

app.post("/api/messages", async (req, res) => {
  try {
    const message = new Message(req.body);
    const savedMessage = await message.save();
    res.status(201).json({ success: true, data: savedMessage });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.get("/api/messages", authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/messages/:id", authenticateToken, async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);
    if (!deletedMessage) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================================
// SOCIAL LINKS CRUD ROUTES
// ============================================================================

app.get("/api/socials", async (req, res) => {
  try {
    const socials = await Social.find();
    res.json(socials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/socials", authenticateToken, async (req, res) => {
  try {
    const social = new Social(req.body);
    const savedSocial = await social.save();
    res.status(201).json(savedSocial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/socials/:id", authenticateToken, async (req, res) => {
  try {
    const updatedSocial = await Social.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSocial) return res.status(404).json({ message: "Social link not found" });
    res.json(updatedSocial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/socials/:id", authenticateToken, async (req, res) => {
  try {
    const deletedSocial = await Social.findByIdAndDelete(req.params.id);
    if (!deletedSocial) return res.status(404).json({ message: "Social link not found" });
    res.json({ message: "Social link deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start Server
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

app.get("/api/test", async (req, res) => {
  res.send("Hello World")
});


export default app;
