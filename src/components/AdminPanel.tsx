import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  LogOut, 
  FolderGit2, 
  Briefcase, 
  Cpu, 
  MessageSquare, 
  Quote, 
  Layers, 
  Lock, 
  User as UserIcon,
  CheckCircle,
  AlertTriangle,
  Share2
} from "lucide-react";
import { API_BASE } from "../lib/api";

type Tab = "projects" | "services" | "tech" | "experience" | "testimonials" | "messages" | "socials";

export const AdminPanel: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("portfolio_token"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Navigation
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  
  // Data lists
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [techList, setTechList] = useState<any[]>([]);
  const [experienceList, setExperienceList] = useState<any[]>([]);
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [socialsList, setSocialsList] = useState<any[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form states (Add/Edit)
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  // Dynamic Form Field states
  const [formData, setFormData] = useState<any>({});

  // Verify auth on mount
  useEffect(() => {
    if (token) {
      fetch(`${API_BASE}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(data => {
          setUsername(data.username);
        })
        .catch(() => {
          handleLogout();
        });
    }
  }, [token]);

  // Load active tab data
  useEffect(() => {
    if (token) {
      loadTabData();
    }
  }, [token, activeTab]);

  const loadTabData = () => {
    setLoading(true);
    fetch(`${API_BASE}/${activeTab}`, {
      headers: activeTab === "messages" ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (activeTab === "projects") setProjectsList(data);
        else if (activeTab === "services") setServicesList(data);
        else if (activeTab === "tech") setTechList(data);
        else if (activeTab === "experience") setExperienceList(data);
        else if (activeTab === "testimonials") setTestimonialsList(data);
        else if (activeTab === "messages") setMessagesList(data);
        else if (activeTab === "socials") setSocialsList(data);
      })
      .catch(err => {
        console.error(`Failed to load ${activeTab}:`, err);
        showActionMessage(`Failed to load ${activeTab} data`, "error");
      })
      .finally(() => setLoading(false));
  };

  const showActionMessage = (text: string, type: "success" | "error") => {
    setActionMessage({ text, type });
    setTimeout(() => {
      setActionMessage(null);
    }, 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      localStorage.setItem("portfolio_token", data.token);
      setToken(data.token);
      setUsername(data.username);
      setPassword("");
    } catch (err: any) {
      setAuthError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("portfolio_token");
    setToken(null);
    setUsername("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadingImages(true);
    const files = Array.from(e.target.files);
    const uploadFormData = new FormData();
    files.forEach(file => {
      uploadFormData.append("images", file);
    });
    
    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: uploadFormData
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }
      
      const uploadedUrls = data.urls || [];
      if (activeTab === "socials") {
        setFormData((prev: any) => ({
          ...prev,
          icon: uploadedUrls[0] || ""
        }));
        showActionMessage("Icon uploaded successfully!", "success");
      } else {
        setFormData((prev: any) => ({
          ...prev,
          images: [...(prev.images || []), ...uploadedUrls]
        }));
        showActionMessage("Images uploaded successfully!", "success");
      }
    } catch (err: any) {
      showActionMessage(err.message || "Failed to upload.", "error");
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData((prev: any) => ({
      ...prev,
      images: (prev.images || []).filter((_: any, idx: number) => idx !== indexToRemove)
    }));
  };

  // CRUD Actions
  const openAddForm = () => {
    setEditingItem(null);
    // Initialize default fields based on active tab
    if (activeTab === "projects") {
      setFormData({
        title: "", role: "", description: "", detailedDescription: "",
        tags: "", githubUrl: "https://github.com/ganpatkoli", liveUrl: "https://ganpatkoli.netlify.app/",
        techCategory: "Frontend", relationCategory: "Client", client: "",
        images: []
      });
    } else if (activeTab === "services") {
      setFormData({
        title: "", description: "", techs: "", accentBg: "bg-violet-500",
        iconBgClass: "bg-violet-50 dark:bg-violet-950/20", iconTextClass: "text-violet-600 dark:text-violet-400",
        iconBorderClass: "border-violet-100 dark:border-violet-500/10", iconName: "Cpu"
      });
    } else if (activeTab === "tech") {
      setFormData({
        name: "", category: "frontend", iconName: "SiReact",
        hoverGlow: "hover:shadow-[0_0_15px_rgba(97,218,251,0.15)] hover:border-[#61DAFB]/40"
      });
    } else if (activeTab === "experience") {
      setFormData({
        title: "", role: "", company: "", companyFull: "",
        color: "text-purple-400", borderColor: "border-purple-500/20",
        glowColor: "shadow-[0_0_15px_rgba(168,85,247,0.15)]", points: "", skills: ""
      });
    } else if (activeTab === "testimonials") {
      setFormData({
        quote: "", name: "", title: "", company: "",
        avatarBg: "from-blue-500 to-cyan-500", initials: ""
      });
    } else if (activeTab === "socials") {
      setFormData({
        name: "", link: "", icon: ""
      });
    }
    setIsFormOpen(true);
  };

  const openEditForm = (item: any) => {
    setEditingItem(item);
    
    // Copy item values into formData, converting arrays to comma strings for editing
    const preparedData = { ...item };
    if (item.tags && Array.isArray(item.tags)) preparedData.tags = item.tags.join(", ");
    if (item.techs && Array.isArray(item.techs)) preparedData.techs = item.techs.join(", ");
    if (item.skills && Array.isArray(item.skills)) preparedData.skills = item.skills.join(", ");
    if (item.points && Array.isArray(item.points)) preparedData.points = item.points.join("\n");
    preparedData.images = item.images || [];
    
    setFormData(preparedData);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const res = await fetch(`${API_BASE}/${activeTab}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Delete failed");
      
      showActionMessage("Item deleted successfully", "success");
      loadTabData();
    } catch (err) {
      showActionMessage("Delete failed. Please try again.", "error");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Convert back comma separated lists to arrays
    const submissionBody = { ...formData };
    if (typeof submissionBody.tags === "string") {
      submissionBody.tags = submissionBody.tags.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    if (typeof submissionBody.techs === "string") {
      submissionBody.techs = submissionBody.techs.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    if (typeof submissionBody.skills === "string") {
      submissionBody.skills = submissionBody.skills.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    if (typeof submissionBody.points === "string") {
      submissionBody.points = submissionBody.points.split("\n").map((s: string) => s.trim()).filter(Boolean);
    }
    
    const url = editingItem 
      ? `${API_BASE}/${activeTab}/${editingItem._id}`
      : `${API_BASE}/${activeTab}`;
      
    const method = editingItem ? "PUT" : "POST";
    
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(submissionBody)
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Save failed");
      }
      
      showActionMessage(editingItem ? "Item updated successfully!" : "Item added successfully!", "success");
      setIsFormOpen(false);
      setEditingItem(null);
      loadTabData();
    } catch (err: any) {
      showActionMessage(err.message || "Submit failed.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  if (!token) {
    // RENDER LOGIN SCREEN
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden select-none">
        {/* Glowing Portal Circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
        
        {/* Back Link to site */}
        <div className="absolute top-8 left-8">
          <a href="/" className="text-xs text-neutral-450 hover:text-white transition-colors flex items-center gap-1.5 font-bold uppercase tracking-wider font-mono">
            ← Back to Portfolio
          </a>
        </div>

        <div className="w-full max-w-md bg-neutral-950/60 border border-white/[0.06] rounded-3xl p-8 backdrop-blur-xl relative z-10 shadow-2xl">
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 mb-2">
              <Lock size={28} />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Admin Console</h1>
            <p className="text-xs text-neutral-400">Log in to manage your portfolio collections.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {authError && (
              <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                  <UserIcon size={14} />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                  <Lock size={14} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3 rounded-xl border border-violet-500/30 bg-violet-600/20 hover:bg-violet-600/40 hover:border-violet-500/60 text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_15px_rgba(139,92,246,0.1)] hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                "Access Console"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // RENDER ADMIN PANEL DASHBOARD
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans select-none">
      
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-neutral-950/70 border-b border-white/[0.06] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-violet-500/10">
            K
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight leading-none">Ganpat Koli</h1>
            <p className="text-[10px] text-neutral-450 uppercase tracking-widest font-mono mt-1">Portfolio Admin Console</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Session: <span className="text-white font-bold">{username}</span></span>
          </div>

          <a href="/" target="_blank" rel="noreferrer" className="text-xs font-semibold px-4 py-2 border border-white/10 hover:border-white/20 rounded-xl transition-all">
            View Live Site
          </a>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* 2. Side Tabs Menu */}
        <aside className="w-full md:w-64 border-r border-white/[0.06] bg-neutral-950/20 p-4 space-y-1 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible pb-2.5 md:pb-0 gap-1 md:gap-0 select-none">
          <span className="hidden md:block text-[9px] uppercase tracking-widest font-semibold text-neutral-500 font-mono px-3 mb-2.5">
            Collections
          </span>
          
          {(["projects", "services", "tech", "experience", "testimonials", "messages", "socials"] as const).map(tab => {
            const getIconComponent = () => {
              if (tab === "projects") return <FolderGit2 size={15} />;
              if (tab === "services") return <Layers size={15} />;
              if (tab === "tech") return <Cpu size={15} />;
              if (tab === "experience") return <Briefcase size={15} />;
              if (tab === "testimonials") return <Quote size={15} />;
              if (tab === "socials") return <Share2 size={15} />;
              return <MessageSquare size={15} />;
            };
            
            const isTabActive = activeTab === tab;
            
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setIsFormOpen(false);
                  setEditingItem(null);
                }}
                className={`flex-none md:flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                  isTabActive 
                    ? "bg-violet-600/10 border-violet-500/30 text-violet-400 shadow-sm"
                    : "border-transparent text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {getIconComponent()}
                <span>{tab}</span>
              </button>
            );
          })}
        </aside>

        {/* 3. Primary Console Viewport */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          
          {/* Action toast feedback message */}
          {actionMessage && (
            <div className={`fixed bottom-8 right-8 z-[200] px-5 py-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 animate-slide-up ${
              actionMessage.type === "success" 
                ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-400" 
                : "bg-rose-950/80 border-rose-500/30 text-rose-400"
            }`}>
              {actionMessage.type === "success" ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
              <span className="text-xs font-semibold">{actionMessage.text}</span>
            </div>
          )}

          {/* Tab Header Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5 select-none">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight capitalize flex items-center gap-2">
                {activeTab} Management
              </h2>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                {activeTab === "messages" 
                  ? "View and clean client form submissions recorded directly in database." 
                  : `Add, edit, or delete items from the ${activeTab} collection.`}
              </p>
            </div>
            
            {activeTab !== "messages" && !isFormOpen && (
              <button 
                onClick={openAddForm}
                className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-500 hover:shadow-[0_0_15px_rgba(109,40,217,0.4)] transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Add {activeTab.slice(0, -1)}</span>
              </button>
            )}
          </div>

          {/* Core Content Layout Area */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-8 h-8 border-3 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
              <p className="text-xs text-neutral-500 font-medium font-mono">Retrieving Collection Database...</p>
            </div>
          ) : isFormOpen ? (
            
            // ============================================================================
            // DYNAMIC DUCK-TYPED DATA ENTRY FORM
            // ============================================================================
            
            <div className="w-full max-w-3xl bg-neutral-950/40 border border-white/[0.06] rounded-2xl p-6 md:p-8 backdrop-blur-xl animate-fade-in shadow-xl select-none">
              <h3 className="text-base font-extrabold tracking-tight mb-6 flex items-center gap-1.5">
                <Edit3 size={15} className="text-violet-400" />
                <span>{editingItem ? `Edit Existing ${activeTab.slice(0, -1)}` : `Add New ${activeTab.slice(0, -1)}`}</span>
              </h3>
              
              <form onSubmit={handleFormSubmit} className="space-y-5">
                
                {/* ─── Projects Form ─── */}
                {activeTab === "projects" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Title</label>
                        <input type="text" name="title" required value={formData.title || ""} onChange={handleInputChange} placeholder="Project Name" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Role</label>
                        <input type="text" name="role" required value={formData.role || ""} onChange={handleInputChange} placeholder="Front-End Developer, Fullstack, etc." className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Short Description</label>
                      <input type="text" name="description" required value={formData.description || ""} onChange={handleInputChange} placeholder="Brief sentence for grid display" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Detailed Description</label>
                      <textarea name="detailedDescription" required rows={4} value={formData.detailedDescription || ""} onChange={handleInputChange} placeholder="Expanded overview of features, optimizations, and challenges" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40 resize-none" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Category</label>
                        <select name="techCategory" value={formData.techCategory || "Frontend"} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40">
                          <option value="Frontend">Frontend</option>
                          <option value="Backend">Backend</option>
                          <option value="Fullstack">Fullstack</option>
                          <option value="App">App</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Relationship</label>
                        <select name="relationCategory" value={formData.relationCategory || "Client"} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40">
                          <option value="Client">Client Project</option>
                          <option value="Company Product">Company Product</option>
                          <option value="Personal">Personal</option>
                          <option value="Self">Self / In-House</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Client Name (Optional)</label>
                        <input type="text" name="client" value={formData.client || ""} onChange={handleInputChange} placeholder="o2 Technology, LegalTerm, etc." className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Tags (Comma Separated)</label>
                      <input type="text" name="tags" value={formData.tags || ""} onChange={handleInputChange} placeholder="React, Node.js, WebSockets, TypeScript" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">GitHub Repo Link</label>
                        <input type="text" name="githubUrl"  value={formData.githubUrl || ""} onChange={handleInputChange} placeholder="https://github.com/..." className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Live Deployment Link</label>
                        <input type="text" name="liveUrl"  value={formData.liveUrl || ""} onChange={handleInputChange} placeholder="https://..." className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                    </div>

                    {/* S3 Image Upload Component */}
                    <div className="space-y-3 pt-2">
                      <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Project Screenshots / Images</label>
                      <div className="flex flex-col gap-3">
                        <div className="relative border border-dashed border-white/20 rounded-xl p-6 bg-white/[0.02] flex flex-col items-center justify-center gap-2 hover:bg-white/[0.04] transition-all cursor-pointer">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImages}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                          />
                          {uploadingImages ? (
                            <>
                              <div className="w-6 h-6 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
                              <span className="text-xs text-neutral-400">Uploading to storage...</span>
                            </>
                          ) : (
                            <>
                              <Plus size={20} className="text-neutral-400" />
                              <span className="text-xs font-semibold text-neutral-350">Choose Images to Upload</span>
                              <span className="text-[10px] text-neutral-500">Supports PNG, JPG, WebP up to 10 files</span>
                            </>
                          )}
                        </div>

                        {/* Uploaded Previews Grid */}
                        {formData.images && formData.images.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                            {formData.images.map((url: string, index: number) => (
                              <div key={index} className="relative group rounded-xl overflow-hidden aspect-video border border-white/10 bg-neutral-900">
                                <img
                                  src={url}
                                  alt={`screenshot-${index}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                                    title="Delete Image"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── Services Form ─── */}
                {activeTab === "services" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Title</label>
                        <input type="text" name="title" required value={formData.title || ""} onChange={handleInputChange} placeholder="SaaS Development" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Lucide Icon Name</label>
                        <input type="text" name="iconName" required value={formData.iconName || ""} onChange={handleInputChange} placeholder="Cpu, Layers, Smartphone, TrendingUp, RefreshCw, Handshake" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Description</label>
                      <textarea name="description" required rows={3} value={formData.description || ""} onChange={handleInputChange} placeholder="Describe the service details..." className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40 resize-none" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Key Technologies (Comma Separated)</label>
                      <input type="text" name="techs" value={formData.techs || ""} onChange={handleInputChange} placeholder="React-JS, Node.js, Stripe API" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Accent BG (Tailwind)</label>
                        <input type="text" name="accentBg" required value={formData.accentBg || "bg-violet-500"} onChange={handleInputChange} placeholder="bg-violet-500" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Icon Text Class</label>
                        <input type="text" name="iconTextClass" required value={formData.iconTextClass || "text-violet-600 dark:text-violet-400"} onChange={handleInputChange} placeholder="text-violet-600 dark:text-violet-400" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── Tech Skills Form ─── */}
                {activeTab === "tech" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Skill Name</label>
                        <input type="text" name="name" required value={formData.name || ""} onChange={handleInputChange} placeholder="ReactJS, Next.js, Docker" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Category</label>
                        <select name="category" value={formData.category || "frontend"} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40">
                          <option value="frontend">Frontend</option>
                          <option value="backend">Backend</option>
                          <option value="databases">Databases</option>
                          <option value="tools">Workspace Tools</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">React Icon Name (Si / Tb Packs)</label>
                        <input type="text" name="iconName" required value={formData.iconName || ""} onChange={handleInputChange} placeholder="SiReact, SiNextdotjs, TbApi" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Hover Glow Class (Tailwind)</label>
                        <input type="text" name="hoverGlow" required value={formData.hoverGlow || ""} onChange={handleInputChange} placeholder="hover:shadow-[0_0_15px_rgba(97,218,251,0.15)] hover:border-[#61DAFB]/40" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── Experience Form ─── */}
                {activeTab === "experience" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Company Name</label>
                        <input type="text" name="company" required value={formData.company || ""} onChange={handleInputChange} placeholder="Codeverse IT" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Company Full Title</label>
                        <input type="text" name="companyFull" required value={formData.companyFull || ""} onChange={handleInputChange} placeholder="Codeverse IT Pvt Ltd" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Role Title</label>
                        <input type="text" name="role" required value={formData.role || ""} onChange={handleInputChange} placeholder="Team Lead - Front-End" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Date Range</label>
                        <input type="text" name="title" required value={formData.title || ""} onChange={handleInputChange} placeholder="Mar 2024 - Present" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Points / Bullet Details (One Per Line - HTML Tags Allowed)</label>
                      <textarea name="points" required rows={4} value={formData.points || ""} onChange={handleInputChange} placeholder="&lt;strong&gt;Leadership:&lt;/strong&gt; Managed front-end teams..." className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40 resize-none font-mono" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Skills Utilized (Comma Separated)</label>
                      <input type="text" name="skills" value={formData.skills || ""} onChange={handleInputChange} placeholder="React, Node.js, Redux, AWS" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Theme Color Class</label>
                        <input type="text" name="color" required value={formData.color || "text-purple-400"} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Border Color Class</label>
                        <input type="text" name="borderColor" required value={formData.borderColor || "border-purple-500/20"} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Glow Shadow Class</label>
                        <input type="text" name="glowColor" required value={formData.glowColor || "shadow-[0_0_15px_rgba(168,85,247,0.15)]"} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── Testimonials Form ─── */}
                {activeTab === "testimonials" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Author Name</label>
                        <input type="text" name="name" required value={formData.name || ""} onChange={handleInputChange} placeholder="Onkar Prasad" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Initials</label>
                        <input type="text" name="initials" required value={formData.initials || ""} onChange={handleInputChange} placeholder="OP" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Role Title</label>
                        <input type="text" name="title" required value={formData.title || ""} onChange={handleInputChange} placeholder="Founder" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Company</label>
                        <input type="text" name="company" required value={formData.company || ""} onChange={handleInputChange} placeholder="o2 Technology" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Testimonial Quote</label>
                      <textarea name="quote" required rows={3} value={formData.quote || ""} onChange={handleInputChange} placeholder="Write testimonial recommendations..." className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40 resize-none" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Avatar Gradient Class</label>
                      <input type="text" name="avatarBg" required value={formData.avatarBg || "from-blue-500 to-cyan-500"} onChange={handleInputChange} placeholder="from-blue-500 to-cyan-500" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                    </div>
                  </div>
                )}

                {/* ─── Socials Form ─── */}
                {activeTab === "socials" && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Platform Name</label>
                      <input type="text" name="name" required value={formData.name || ""} onChange={handleInputChange} placeholder="LinkedIn" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Social Profile URL</label>
                      <input type="text" name="link" required value={formData.link || ""} onChange={handleInputChange} placeholder="https://www.linkedin.com/in/username" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40" />
                    </div>

                    {/* Social Icon Upload */}
                    <div className="space-y-3 pt-2">
                      <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 font-mono">Platform Logo / Icon (Optional)</label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* File Upload Option */}
                        <div className="space-y-1.5">
                          <span className="text-[9px] uppercase tracking-widest font-semibold text-neutral-500 font-mono">Option A: Upload File</span>
                          <div className="relative border border-dashed border-white/20 rounded-xl p-4 bg-white/[0.02] flex flex-col items-center justify-center gap-1.5 hover:bg-white/[0.04] transition-all cursor-pointer h-24">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={uploadingImages}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />
                            {uploadingImages ? (
                              <div className="w-5 h-5 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
                            ) : (
                              <>
                                <Plus size={16} className="text-neutral-400" />
                                <span className="text-[10px] font-semibold text-neutral-350">Upload Icon File</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* URL Paste Option */}
                        <div className="space-y-1.5 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <span className="text-[9px] uppercase tracking-widest font-semibold text-neutral-500 font-mono">Option B: Paste Image URL</span>
                            <input
                              type="text"
                              name="icon"
                              value={formData.icon || ""}
                              onChange={handleInputChange}
                              placeholder="https://example.com/icon.png"
                              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/40"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Preview */}
                      {formData.icon && (
                        <div className="pt-2">
                          <span className="text-[9px] uppercase tracking-widest font-semibold text-neutral-500 font-mono block mb-1">Active Icon Preview</span>
                          <div className="relative group rounded-xl overflow-hidden w-20 h-20 border border-white/10 bg-neutral-900 flex items-center justify-center">
                            <img
                              src={formData.icon}
                              alt="Uploaded icon"
                              className="w-12 h-12 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).alt = "Invalid URL";
                              }}
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => setFormData((prev: any) => ({ ...prev, icon: "" }))}
                                className="p-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                                title="Remove Icon"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Form Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSubmitting && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    <span>Save {activeTab.slice(0, -1)}</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingItem(null);
                    }}
                    className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-neutral-400 hover:text-white font-semibold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            
            // ============================================================================
            // COLLECTION TABLES & LISTS
            // ============================================================================
            
            <div className="w-full bg-neutral-950/20 border border-white/[0.06] rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl select-none">
              
              {/* ─── Projects List Table ─── */}
              {activeTab === "projects" && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs text-neutral-400">
                    <thead className="bg-white/5 border-b border-white/10 text-white uppercase tracking-wider font-mono font-semibold">
                      <tr>
                        <th className="p-4">Title</th>
                        <th className="p-4">Role / Category</th>
                        <th className="p-4">Tags</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {projectsList.length === 0 ? (
                        <tr><td colSpan={4} className="p-8 text-center text-neutral-500 font-mono">No projects found. Add your first project!</td></tr>
                      ) : (
                        projectsList.map(project => (
                          <tr key={project._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-bold text-white text-sm">
                              {project.title}
                              {project.client && <span className="block text-[10px] font-semibold text-neutral-400 font-sans mt-0.5">{project.client}</span>}
                            </td>
                            <td className="p-4 space-y-1">
                              <span className="block font-medium text-white">{project.role}</span>
                              <span className="inline-block px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 font-bold font-mono text-[8px] uppercase">{project.techCategory}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {project.tags && project.tags.map((t: string) => (
                                  <span key={t} className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-medium text-neutral-350 border border-white/5">{t}</span>
                                ))}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <button onClick={() => openEditForm(project)} className="p-1.5 rounded-lg border border-white/10 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-400 transition-all cursor-pointer"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete(project._id)} className="p-1.5 rounded-lg border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 transition-all cursor-pointer"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ─── Services List Table ─── */}
              {activeTab === "services" && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs text-neutral-400">
                    <thead className="bg-white/5 border-b border-white/10 text-white uppercase tracking-wider font-mono font-semibold">
                      <tr>
                        <th className="p-4">Title / Icon</th>
                        <th className="p-4">Description</th>
                        <th className="p-4">Techs</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {servicesList.length === 0 ? (
                        <tr><td colSpan={4} className="p-8 text-center text-neutral-500 font-mono">No services found. Add your first service!</td></tr>
                      ) : (
                        servicesList.map(srv => (
                          <tr key={srv._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-bold text-white text-sm">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-mono font-semibold border rounded-lg px-2 py-1 bg-white/5 border-white/10 text-neutral-300`}>{srv.iconName}</span>
                                <span>{srv.title}</span>
                              </div>
                            </td>
                            <td className="p-4 max-w-xs truncate">{srv.description}</td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {srv.techs && srv.techs.map((t: string) => (
                                  <span key={t} className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-medium text-neutral-350 border border-white/5">{t}</span>
                                ))}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <button onClick={() => openEditForm(srv)} className="p-1.5 rounded-lg border border-white/10 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-400 transition-all cursor-pointer"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete(srv._id)} className="p-1.5 rounded-lg border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 transition-all cursor-pointer"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ─── Tech Skills List Table ─── */}
              {activeTab === "tech" && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs text-neutral-400">
                    <thead className="bg-white/5 border-b border-white/10 text-white uppercase tracking-wider font-mono font-semibold">
                      <tr>
                        <th className="p-4">Skill Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Icon Name</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {techList.length === 0 ? (
                        <tr><td colSpan={4} className="p-8 text-center text-neutral-500 font-mono">No tech skills found. Add your first skill!</td></tr>
                      ) : (
                        techList.map(skill => (
                          <tr key={skill._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-bold text-white text-sm">{skill.name}</td>
                            <td className="p-4 capitalize">
                              <span className="inline-block px-2 py-0.5 rounded bg-white/5 text-[9px] font-bold text-neutral-350 tracking-wider font-mono uppercase">{skill.category}</span>
                            </td>
                            <td className="p-4 font-mono text-neutral-300">{skill.iconName}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <button onClick={() => openEditForm(skill)} className="p-1.5 rounded-lg border border-white/10 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-400 transition-all cursor-pointer"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete(skill._id)} className="p-1.5 rounded-lg border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 transition-all cursor-pointer"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ─── Experience List Table ─── */}
              {activeTab === "experience" && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs text-neutral-400">
                    <thead className="bg-white/5 border-b border-white/10 text-white uppercase tracking-wider font-mono font-semibold">
                      <tr>
                        <th className="p-4">Company / Date</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Skills</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {experienceList.length === 0 ? (
                        <tr><td colSpan={4} className="p-8 text-center text-neutral-500 font-mono">No work experiences found. Add one!</td></tr>
                      ) : (
                        experienceList.map(exp => (
                          <tr key={exp._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-bold text-white text-sm">
                              {exp.company}
                              <span className="block text-[10px] text-neutral-400 font-sans font-semibold mt-0.5">{exp.title}</span>
                            </td>
                            <td className="p-4 text-white font-medium">{exp.role}</td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {exp.skills && exp.skills.map((s: string) => (
                                  <span key={s} className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-medium text-neutral-350 border border-white/5">{s}</span>
                                ))}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <button onClick={() => openEditForm(exp)} className="p-1.5 rounded-lg border border-white/10 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-400 transition-all cursor-pointer"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete(exp._id)} className="p-1.5 rounded-lg border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 transition-all cursor-pointer"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ─── Testimonials List Table ─── */}
              {activeTab === "testimonials" && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs text-neutral-400">
                    <thead className="bg-white/5 border-b border-white/10 text-white uppercase tracking-wider font-mono font-semibold">
                      <tr>
                        <th className="p-4">Author / Company</th>
                        <th className="p-4">Quote</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {testimonialsList.length === 0 ? (
                        <tr><td colSpan={3} className="p-8 text-center text-neutral-500 font-mono">No testimonials found.</td></tr>
                      ) : (
                        testimonialsList.map(test => (
                          <tr key={test._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-bold text-white text-sm">
                              {test.name}
                              <span className="block text-[10px] text-neutral-400 font-sans font-semibold mt-0.5">{test.title} at {test.company}</span>
                            </td>
                            <td className="p-4 max-w-md truncate italic">"{test.quote}"</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <button onClick={() => openEditForm(test)} className="p-1.5 rounded-lg border border-white/10 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-400 transition-all cursor-pointer"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete(test._id)} className="p-1.5 rounded-lg border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 transition-all cursor-pointer"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ─── Messages / Inbox List Table ─── */}
              {activeTab === "messages" && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs text-neutral-400">
                    <thead className="bg-white/5 border-b border-white/10 text-white uppercase tracking-wider font-mono font-semibold">
                      <tr>
                        <th className="p-4">Sender Info</th>
                        <th className="p-4">Message</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {messagesList.length === 0 ? (
                        <tr><td colSpan={4} className="p-8 text-center text-neutral-500 font-mono">Your inbox is clean. No messages received yet.</td></tr>
                      ) : (
                        messagesList.map(msg => (
                          <tr key={msg._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-bold text-white text-sm">
                              {msg.name}
                              <span className="block text-[10px] text-violet-400 font-mono mt-0.5">{msg.email}</span>
                              {msg.company && <span className="block text-[9px] text-neutral-500 mt-0.5">Subject: {msg.company}</span>}
                            </td>
                            <td className="p-4 max-w-sm whitespace-normal leading-relaxed text-neutral-300">{msg.message}</td>
                            <td className="p-4 font-mono text-[10px] text-neutral-500">{new Date(msg.createdAt).toLocaleString()}</td>
                            <td className="p-4">
                              <button onClick={() => handleDelete(msg._id)} className="p-1.5 rounded-lg border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 transition-all cursor-pointer"><Trash2 size={14} /></button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ─── Socials List Table ─── */}
              {activeTab === "socials" && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs text-neutral-400">
                    <thead className="bg-white/5 border-b border-white/10 text-white uppercase tracking-wider font-mono font-semibold">
                      <tr>
                        <th className="p-4 w-16">Icon</th>
                        <th className="p-4">Platform Name</th>
                        <th className="p-4">Profile URL</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {socialsList.length === 0 ? (
                        <tr><td colSpan={4} className="p-8 text-center text-neutral-500 font-mono">No social links found.</td></tr>
                      ) : (
                        socialsList.map(social => (
                          <tr key={social._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4">
                              {social.icon ? (
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                  <img src={social.icon} alt={social.name} className="w-5 h-5 object-contain" />
                                </div>
                              ) : (
                                <span className="text-neutral-600 font-mono text-[9px]">None</span>
                              )}
                            </td>
                            <td className="p-4 font-bold text-white text-sm">
                              {social.name}
                            </td>
                            <td className="p-4 max-w-md truncate font-mono text-neutral-300">
                              <a href={social.link} target="_blank" rel="noreferrer" className="hover:underline text-violet-400">
                                {social.link}
                              </a>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <button onClick={() => openEditForm(social)} className="p-1.5 rounded-lg border border-white/10 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-400 transition-all cursor-pointer"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete(social._id)} className="p-1.5 rounded-lg border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 transition-all cursor-pointer"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          )}

        </main>
      </div>
    </div>
  );
};
