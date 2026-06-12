import mongoose from "mongoose";

// User Model (for admin auth)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Project Model
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String, required: true },
  detailedDescription: { type: String, required: true },
  tags: [{ type: String }],
  githubUrl: { type: String, required: false },
  liveUrl: { type: String, required: false },
  techCategory: { type: String, required: true, enum: ["Frontend", "Backend", "App" , "Fullstack"] },
  relationCategory: { type: String, required: true, enum: ["Client", "Personal", "Self", "Company", "Company Product"] },
  client: { type: String },
  images: [{ type: String }]
});

// Service Model
const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techs: [{ type: String }],
  accentBg: { type: String, required: true },
  iconBgClass: { type: String, required: true },
  iconTextClass: { type: String, required: true },
  iconBorderClass: { type: String, required: true },
  iconName: { type: String, required: true } // Name of Lucide or custom icon (e.g. Cpu, Layers, etc.)
});

// Tech Skill Model
const techSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true, enum: ["frontend", "backend", "databases", "tools"] },
  iconName: { type: String, required: true }, // SimpleIcon slug (e.g. nextdotjs, react) or React-Icon name
  hoverGlow: { type: String, required: true } // Tailwind hover shadow class
});

// Experience Model
const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Date range (e.g. Mar 2024 - Present)
  role: { type: String, required: true },
  company: { type: String, required: true },
  companyFull: { type: String, required: true },
  color: { type: String, required: true },
  borderColor: { type: String, required: true },
  glowColor: { type: String, required: true },
  points: [{ type: String }],
  skills: [{ type: String }]
});

// Testimonial Model
const testimonialSchema = new mongoose.Schema({
  quote: { type: String, required: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  avatarBg: { type: String, required: true },
  initials: { type: String, required: true }
});

// Message Model (from contact form submissions)
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Social Model
const socialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  link: { type: String, required: true },
  icon: { type: String }
});

// CV / Resume Model
const cvSchema = new mongoose.Schema({
  url: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

export const User = mongoose.model("User", userSchema);
export const Project = mongoose.model("Project", projectSchema);
export const Service = mongoose.model("Service", serviceSchema);
export const Tech = mongoose.model("Tech", techSchema);
export const Experience = mongoose.model("Experience", experienceSchema);
export const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export const Message = mongoose.model("Message", messageSchema);
export const Social = mongoose.model("Social", socialSchema);
export const Cv = mongoose.model("Cv", cvSchema);
