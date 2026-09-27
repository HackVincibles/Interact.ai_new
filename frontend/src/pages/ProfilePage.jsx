import React, { useState, useEffect } from 'react';
import { 
  User, 
  BookOpen, 
  Award, 
  Briefcase, 
  MapPin, 
  Mail, 
  Code, 
  FileText, 
  Edit3, 
  Plus, 
  ExternalLink, 
  Download, 
  Share2, 
  CheckCircle2, 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  Camera, 
  ChevronRight,
  Target,
  Layers,
  Star,
  Globe,
  UploadCloud,
  X,
  Trash2
} from 'lucide-react';
import './ProfilePage.css';

export default function ProfilePage({ currentUser, onNavigate }) {
  const [viewMode, setViewMode] = useState('private'); // 'private' or 'public'
  const [activeSidebarItem, setActiveSidebarItem] = useState('profile');
  const [activeModal, setActiveModal] = useState(null); // 'cert', 'project', 'exp', 'goal', 'academic', 'skill', 'resume', 'avatar'

  const AVATARS = [
    { id: 'avatar_1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4' },
    { id: 'avatar_2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede' },
    { id: 'avatar_3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=ffdfbf' },
    { id: 'avatar_4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul&backgroundColor=d1d4f9' },
    { id: 'avatar_5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia&backgroundColor=c0aede' },
    { id: 'avatar_6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aman&backgroundColor=b6e3f4' },
    { id: 'avatar_7', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha&backgroundColor=ffdfbf' },
    { id: 'avatar_8', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir&backgroundColor=d1d4f9' },
  ];

  // Load user profile from localStorage or initialize with currentUser registration data
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(`interact_user_full_profile_${currentUser?.email}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return {
      fullName: currentUser?.fullName || '',
      degree: currentUser?.branch || '',
      college: currentUser?.collegeName || '',
      location: currentUser?.location || '',
      email: currentUser?.email || '',
      linkedin: '',
      github: '',
      leetcode: '',
      portfolio: '',
      avatarUrl: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      targetRole: '',
      goalStatement: '',
      cgpa: currentUser?.cgpa || '',
      class12: '',
      class10: '',
      certifications: [],
      projects: [],
      experiences: [],
      skills: {
        languages: [],
        web: [],
        tools: [],
      },
      resumeName: null,
      resumeUpdated: null,
    };
  });

  // Sync profile to localStorage
  useEffect(() => {
    if (currentUser?.email) {
      localStorage.setItem(`interact_user_full_profile_${currentUser.email}`, JSON.stringify(profile));
    }
  }, [profile, currentUser?.email]);

  // Temporary Modal Form State
  const [goalInput, setGoalInput] = useState({ targetRole: profile.targetRole, goalStatement: profile.goalStatement });
  const [academicInput, setAcademicInput] = useState({ degree: profile.degree, college: profile.college, cgpa: profile.cgpa, class12: profile.class12, class10: profile.class10 });
  const [certInput, setCertInput] = useState({ title: '', issuer: '', date: '' });
  const [projInput, setProjInput] = useState({ title: '', desc: '' });
  const [expInput, setExpInput] = useState({ role: '', company: '', duration: '', bullet: '' });
  const [skillInput, setSkillInput] = useState({ category: 'languages', skillName: '' });

  const sidebarNavItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'roadmap', label: 'My Roadmap', icon: Target },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'internships', label: 'My Internships', icon: Briefcase },
    { id: 'jobs', label: 'My Jobs', icon: Briefcase },
    { id: 'mock-interviews', label: 'My Mock Interviews', icon: Award },
    { id: 'resources', label: 'My Resources', icon: FileText },
    { id: 'certificates', label: 'My Certificates', icon: ShieldCheck },
  ];

  const handleSidebarClick = (itemId) => {
    setActiveSidebarItem(itemId);
    if (itemId !== 'profile' && onNavigate) {
      onNavigate(itemId);
    }
  };

  // Add Item Handlers
  const handleSaveGoal = () => {
    setProfile((prev) => ({
      ...prev,
      targetRole: goalInput.targetRole || 'Software Development Engineer (SDE)',
      goalStatement: goalInput.goalStatement || 'To build scalable engineering products and solve challenging technical problems.',
    }));
    setActiveModal(null);
  };

  const handleSaveAcademic = () => {
    setProfile((prev) => ({
      ...prev,
      degree: academicInput.degree || prev.degree,
      college: academicInput.college || prev.college,
      cgpa: academicInput.cgpa || prev.cgpa,
      class12: academicInput.class12 || prev.class12,
      class10: academicInput.class10 || prev.class10,
    }));
    setActiveModal(null);
  };

  const handleAddCert = () => {
    if (!certInput.title.trim()) return;
    const newCert = {
      id: Date.now(),
      title: certInput.title,
      issuer: certInput.issuer || 'Online Certification Provider',
      date: certInput.date || 'Recent',
    };
    setProfile((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newCert],
    }));
    setCertInput({ title: '', issuer: '', date: '' });
    setActiveModal(null);
  };

  const handleAddProject = () => {
    if (!projInput.title.trim()) return;
    const newProj = {
      id: Date.now(),
      title: projInput.title,
      desc: projInput.desc || 'Technical software project built with modern frameworks.',
    };
    setProfile((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj],
    }));
    setProjInput({ title: '', desc: '' });
    setActiveModal(null);
  };

  const handleAddExperience = () => {
    if (!expInput.role.trim()) return;
    const newExp = {
      id: Date.now(),
      role: expInput.role,
      company: expInput.company || 'Tech Startup',
      duration: expInput.duration || '2026',
      bullets: expInput.bullet ? [expInput.bullet] : ['Developed key features and worked with team members.'],
    };
    setProfile((prev) => ({
      ...prev,
      experiences: [...prev.experiences, newExp],
    }));
    setExpInput({ role: '', company: '', duration: '', bullet: '' });
    setActiveModal(null);
  };

  const handleAddSkill = () => {
    if (!skillInput.skillName.trim()) return;
    const cat = skillInput.category || 'languages';
    setProfile((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [cat]: [...(prev.skills[cat] || []), skillInput.skillName.trim()],
      },
    }));
    setSkillInput({ category: 'languages', skillName: '' });
    setActiveModal(null);
  };

  const handleUploadResumeSimulated = () => {
    setProfile((prev) => ({
      ...prev,
      resumeName: `${(prev.fullName || 'Candidate').replace(/\s+/g, '_')}_Resume.pdf`,
      resumeUpdated: `Updated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`,
    }));
    alert('Resume uploaded successfully! Your profile ATS radar score has been updated.');
    setActiveModal(null);
  };

  const handleSaveAvatar = async (avatarItem) => {
    setProfile(prev => ({ ...prev, avatarUrl: avatarItem.url, avatarId: avatarItem.id }));
    setActiveModal(null);
    try {
      const token = localStorage.getItem('interact_token');
      if (token) {
        await fetch('http://localhost:5000/api/users/avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ avatarId: avatarItem.id, avatarUrl: avatarItem.url, email: currentUser?.email })
        });
      }
    } catch (e) {
      console.warn('Failed to sync avatar to backend', e);
    }
  };

  return (
    <div className="profile-dashboard-layout animate-fade-in">
      <div className="container profile-workspace-container">
        
        {/* Left Dashboard Navigation Sidebar */}
        <aside className="dashboard-sidebar card-base">
          <div className="sidebar-brand-summary">
            <div className="user-avatar-mini">
              <img src={profile.avatarUrl} alt={profile.fullName || 'User'} />
            </div>
            <div>
              <h4 className="user-mini-name">{profile.fullName || 'Candidate Student'}</h4>
              <p className="user-mini-sub">{profile.degree || 'Student Member'}</p>
            </div>
          </div>

          <hr className="sidebar-divider" />

          <nav className="sidebar-nav-list">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSidebarItem === item.id;
              return (
                <button
                  key={item.id}
                  className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleSidebarClick(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Main Profile Workspace */}
        <main className="profile-main-content">
          
          {/* View Toggle Bar (Private vs Sharable Public Profile) */}
          <div className="profile-view-toggle-bar card-base">
            <div className="toggle-info">
              <Sparkles size={18} className="sparkle-gold" />
              <span>
                {viewMode === 'private' 
                  ? 'Private Student Dashboard (Editable)' 
                  : 'Public Sharable Candidate View (Verified Recruiter Preview)'}
              </span>
            </div>

            <div className="view-mode-buttons">
              <button 
                className={`mode-btn ${viewMode === 'private' ? 'active' : ''}`}
                onClick={() => setViewMode('private')}
              >
                <Edit3 size={15} />
                <span>Private View</span>
              </button>
              <button 
                className={`mode-btn ${viewMode === 'public' ? 'active' : ''}`}
                onClick={() => setViewMode('public')}
              >
                <Eye size={15} />
                <span>Public Share View</span>
              </button>
              {viewMode === 'public' && (
                <button 
                  className="btn-primary-purple share-link-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Verified candidate profile link copied to clipboard!');
                  }}
                >
                  <Share2 size={14} />
                  <span>Copy Sharable Link</span>
                </button>
              )}
            </div>
          </div>

          {/* Top Header Profile Card */}
          <div className="top-profile-card card-base">
            <div className="profile-header-main">
              <div className="avatar-large-container">
                <img src={profile.avatarUrl} alt={profile.fullName || 'User'} className="avatar-large-img" />
                {viewMode === 'private' && (
                  <button className="avatar-camera-btn" title="Change profile picture" onClick={() => setActiveModal('avatar')}>
                    <Camera size={14} />
                  </button>
                )}
              </div>

              <div className="profile-identity-details">
                <div className="name-edit-row">
                  <h1 className="profile-user-name">{profile.fullName || 'Student Candidate'}</h1>
                  {viewMode === 'private' && (
                    <button className="edit-pill-btn" onClick={() => setActiveModal('goal')}>
                      <Edit3 size={14} />
                      <span>Edit Goal</span>
                    </button>
                  )}
                </div>

                <p className="profile-degree-text">{profile.degree || 'Degree & Specialization Not Specified'}</p>
                <p className="profile-college-text">{profile.college || 'College / University Not Specified'}</p>

                <div className="profile-meta-chips">
                  {profile.location && <span className="meta-chip"><MapPin size={14} /> {profile.location}</span>}
                  {profile.email && <span className="meta-chip"><Mail size={14} /> {profile.email}</span>}
                  {profile.linkedin && (
                    <a href={`https://${profile.linkedin}`} target="_blank" rel="noreferrer" className="meta-chip link">
                      <ExternalLink size={14} /> LinkedIn
                    </a>
                  )}
                  {profile.github && (
                    <a href={`https://${profile.github}`} target="_blank" rel="noreferrer" className="meta-chip link">
                      <ExternalLink size={14} /> GitHub
                    </a>
                  )}
                </div>
              </div>

              {/* Ranks Summary Box */}
              <div className="ranks-summary-box">
                <div className="rank-summary-pill college">
                  <span>Campus Rank</span>
                  <strong>{currentUser?.collegeRank || '#--'}</strong>
                  <small>{profile.college ? profile.college.split(' ')[0] : 'Campus'}</small>
                </div>
                <div className="rank-summary-pill global">
                  <span>Global Rank</span>
                  <strong>{currentUser?.globalRank || '#--'}</strong>
                  <small>Verified</small>
                </div>
              </div>
            </div>
          </div>

          {/* Two-Column Responsive Workspace Grid */}
          <div className="profile-grid-2">
            
            {/* Left Column */}
            <div className="profile-col-left">
              
              {/* 1. Career Goal */}
              <div className="profile-section-card card-base">
                <div className="section-card-header">
                  <div className="title-with-icon">
                    <Target size={20} className="card-icon purple" />
                    <h3>Career Goal</h3>
                  </div>
                  {viewMode === 'private' && (
                    <button className="icon-edit-btn" onClick={() => setActiveModal('goal')}>
                      <Edit3 size={15} />
                    </button>
                  )}
                </div>

                {profile.targetRole || profile.goalStatement ? (
                  <>
                    {profile.targetRole && <div className="target-role-badge">{profile.targetRole}</div>}
                    {profile.goalStatement && <p className="goal-statement-text">"{profile.goalStatement}"</p>}
                  </>
                ) : (
                  <div className="empty-profile-block">
                    <p className="empty-block-text">No target career goal specified yet.</p>
                    {viewMode === 'private' && (
                      <button className="add-block-btn" onClick={() => setActiveModal('goal')}>
                        <Plus size={16} />
                        <span>Set Target Career Goal</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Academic Details */}
              <div className="profile-section-card card-base">
                <div className="section-card-header">
                  <div className="title-with-icon">
                    <GraduationCap size={20} className="card-icon blue" />
                    <h3>Academic Details</h3>
                  </div>
                  {viewMode === 'private' && (
                    <button className="icon-edit-btn" onClick={() => setActiveModal('academic')}><Edit3 size={15} /></button>
                  )}
                </div>

                {profile.degree || profile.college || profile.cgpa || profile.class12 || profile.class10 ? (
                  <div className="academic-list">
                    {(profile.degree || profile.college) && (
                      <div className="academic-item">
                        <div className="academic-info">
                          <strong>{profile.degree || 'Degree Program'}</strong>
                          <span>{profile.college || 'University'}</span>
                        </div>
                        {profile.cgpa && <div className="academic-score-badge green">CGPA {profile.cgpa}</div>}
                      </div>
                    )}

                    {profile.class12 && (
                      <div className="academic-item">
                        <div className="academic-info">
                          <strong>Class XII Senior Secondary</strong>
                        </div>
                        <div className="academic-score-badge blue">{profile.class12}</div>
                      </div>
                    )}

                    {profile.class10 && (
                      <div className="academic-item">
                        <div className="academic-info">
                          <strong>Class X High School</strong>
                        </div>
                        <div className="academic-score-badge blue">{profile.class10}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="empty-profile-block">
                    <p className="empty-block-text">No academic records or marks added yet.</p>
                    {viewMode === 'private' && (
                      <button className="add-block-btn" onClick={() => setActiveModal('academic')}>
                        <Plus size={16} />
                        <span>Add Academic Records</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 3. Certifications */}
              <div className="profile-section-card card-base">
                <div className="section-card-header">
                  <div className="title-with-icon">
                    <ShieldCheck size={20} className="card-icon orange" />
                    <h3>Certifications</h3>
                  </div>
                </div>

                {profile.certifications && profile.certifications.length > 0 ? (
                  <div className="certifications-list">
                    {profile.certifications.map((c) => (
                      <div key={c.id} className="cert-item">
                        <div className="cert-logo-circle">
                          <Award size={18} />
                        </div>
                        <div className="cert-details">
                          <strong>{c.title}</strong>
                          <span>{c.issuer}</span>
                        </div>
                        <span className="cert-date">{c.date}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-profile-block">
                    <p className="empty-block-text">No verified certifications added yet.</p>
                  </div>
                )}

                {viewMode === 'private' && (
                  <button className="add-block-btn" onClick={() => setActiveModal('cert')}>
                    <Plus size={16} />
                    <span>Add Certification</span>
                  </button>
                )}
              </div>

              {/* 4. Projects Showcase */}
              <div className="profile-section-card card-base">
                <div className="section-card-header">
                  <div className="title-with-icon">
                    <Layers size={20} className="card-icon pink" />
                    <h3>Projects</h3>
                  </div>
                </div>

                {profile.projects && profile.projects.length > 0 ? (
                  <div className="projects-list">
                    {profile.projects.map((p) => (
                      <div key={p.id} className="project-item">
                        <div className="project-info">
                          <strong>{p.title}</strong>
                          <p>{p.desc}</p>
                        </div>
                        <ChevronRight size={18} className="chevron-icon" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-profile-block">
                    <p className="empty-block-text">No technical projects added yet.</p>
                  </div>
                )}

                {viewMode === 'private' && (
                  <button className="add-block-btn" onClick={() => setActiveModal('project')}>
                    <Plus size={16} />
                    <span>Add Project</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="profile-col-right">
              
              {/* 1. Skills Matrix */}
              <div className="profile-section-card card-base">
                <div className="section-card-header">
                  <div className="title-with-icon">
                    <Code size={20} className="card-icon purple" />
                    <h3>Skills</h3>
                  </div>
                  {viewMode === 'private' && (
                    <button className="icon-edit-btn" onClick={() => setActiveModal('skill')}><Edit3 size={15} /></button>
                  )}
                </div>

                { (profile.skills.languages?.length > 0 || profile.skills.web?.length > 0 || profile.skills.tools?.length > 0) ? (
                  <>
                    {profile.skills.languages?.length > 0 && (
                      <div className="skills-category-block">
                        <span className="skill-cat-title">Programming Languages</span>
                        <div className="skill-pills-row">
                          {profile.skills.languages.map((s, i) => (
                            <span key={i} className="skill-pill">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.skills.web?.length > 0 && (
                      <div className="skills-category-block">
                        <span className="skill-cat-title">Web & Frameworks</span>
                        <div className="skill-pills-row">
                          {profile.skills.web.map((s, i) => (
                            <span key={i} className="skill-pill">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.skills.tools?.length > 0 && (
                      <div className="skills-category-block">
                        <span className="skill-cat-title">Tools & Databases</span>
                        <div className="skill-pills-row">
                          {profile.skills.tools.map((s, i) => (
                            <span key={i} className="skill-pill">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="empty-profile-block">
                    <p className="empty-block-text">No technical skills added yet.</p>
                    {viewMode === 'private' && (
                      <button className="add-block-btn" onClick={() => setActiveModal('skill')}>
                        <Plus size={16} />
                        <span>Add Skill</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Experience */}
              <div className="profile-section-card card-base">
                <div className="section-card-header">
                  <div className="title-with-icon">
                    <Briefcase size={20} className="card-icon blue" />
                    <h3>Experience</h3>
                  </div>
                </div>

                {profile.experiences && profile.experiences.length > 0 ? (
                  <div className="experiences-list">
                    {profile.experiences.map((exp) => (
                      <div key={exp.id} className="exp-item">
                        <div className="exp-role-row">
                          <strong>{exp.role}</strong>
                        </div>
                        <div className="exp-company-row">
                          <span>{exp.company}</span> • <small>{exp.duration}</small>
                        </div>
                        <ul className="exp-bullets">
                          {exp.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-profile-block">
                    <p className="empty-block-text">No work or internship experience added yet.</p>
                  </div>
                )}

                {viewMode === 'private' && (
                  <button className="add-block-btn" onClick={() => setActiveModal('exp')}>
                    <Plus size={16} />
                    <span>Add Experience</span>
                  </button>
                )}
              </div>

              {/* 3. Resume Manager */}
              <div className="profile-section-card card-base">
                <div className="section-card-header">
                  <div className="title-with-icon">
                    <FileText size={20} className="card-icon purple" />
                    <h3>Resume</h3>
                  </div>
                </div>

                {profile.resumeName ? (
                  <div className="resume-box">
                    <div className="resume-file-info">
                      <div className="pdf-icon-square">
                        <FileText size={24} />
                      </div>
                      <div>
                        <strong className="resume-filename">{profile.resumeName}</strong>
                        <p className="resume-update-date">{profile.resumeUpdated}</p>
                      </div>
                    </div>

                    <div className="resume-actions-group">
                      {viewMode === 'private' && (
                        <button className="btn-primary-purple resume-btn" onClick={handleUploadResumeSimulated}>
                          <UploadCloud size={14} />
                          <span>Replace Resume</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="empty-profile-block">
                    <p className="empty-block-text">No PDF resume uploaded yet.</p>
                    {viewMode === 'private' && (
                      <button className="btn-primary-purple add-block-btn" onClick={handleUploadResumeSimulated} style={{ color: '#fff' }}>
                        <UploadCloud size={16} />
                        <span>Upload Resume (PDF)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* --- INTERACTIVE MODALS FOR PROFILE DATA --- */}

      {/* Goal Modal */}
      {activeModal === 'goal' && (
        <div className="modal-backdrop-overlay">
          <div className="modal-box card-base">
            <h3>Set Target Career Goal</h3>
            <p>Define your primary target role and career ambition.</p>
            <input 
              type="text" 
              placeholder="Target Role (e.g. SDE-1 / Full Stack Engineer)" 
              value={goalInput.targetRole}
              onChange={(e) => setGoalInput({ ...goalInput, targetRole: e.target.value })}
              className="modal-input-field"
            />
            <textarea 
              placeholder="Career Ambition Statement..." 
              value={goalInput.goalStatement}
              onChange={(e) => setGoalInput({ ...goalInput, goalStatement: e.target.value })}
              className="modal-input-field"
              rows={3}
            />
            <div className="modal-actions-row">
              <button className="btn-outline-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button className="btn-primary-purple" onClick={handleSaveGoal}>Save Goal</button>
            </div>
          </div>
        </div>
      )}

      {/* Academic Modal */}
      {activeModal === 'academic' && (
        <div className="modal-backdrop-overlay">
          <div className="modal-box card-base">
            <h3>Academic Details</h3>
            <p>Update degree, college, and grades.</p>
            <input 
              type="text" 
              placeholder="Degree / Program (e.g. B.Tech Computer Science)" 
              value={academicInput.degree}
              onChange={(e) => setAcademicInput({ ...academicInput, degree: e.target.value })}
              className="modal-input-field"
            />
            <input 
              type="text" 
              placeholder="College / University Name" 
              value={academicInput.college}
              onChange={(e) => setAcademicInput({ ...academicInput, college: e.target.value })}
              className="modal-input-field"
            />
            <input 
              type="text" 
              placeholder="CGPA (e.g. 8.5/10)" 
              value={academicInput.cgpa}
              onChange={(e) => setAcademicInput({ ...academicInput, cgpa: e.target.value })}
              className="modal-input-field"
            />
            <div className="modal-actions-row">
              <button className="btn-outline-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button className="btn-primary-purple" onClick={handleSaveAcademic}>Save Details</button>
            </div>
          </div>
        </div>
      )}

      {/* Certification Modal */}
      {activeModal === 'cert' && (
        <div className="modal-backdrop-overlay">
          <div className="modal-box card-base">
            <h3>Add Certification</h3>
            <input 
              type="text" 
              placeholder="Certification Title (e.g. NPTEL Data Structures)" 
              value={certInput.title}
              onChange={(e) => setCertInput({ ...certInput, title: e.target.value })}
              className="modal-input-field"
            />
            <input 
              type="text" 
              placeholder="Issuer (e.g. IIT Kharagpur / Google / IBM)" 
              value={certInput.issuer}
              onChange={(e) => setCertInput({ ...certInput, issuer: e.target.value })}
              className="modal-input-field"
            />
            <input 
              type="text" 
              placeholder="Completion Date (e.g. Oct 2026)" 
              value={certInput.date}
              onChange={(e) => setCertInput({ ...certInput, date: e.target.value })}
              className="modal-input-field"
            />
            <div className="modal-actions-row">
              <button className="btn-outline-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button className="btn-primary-purple" onClick={handleAddCert}>Add Certification</button>
            </div>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {activeModal === 'project' && (
        <div className="modal-backdrop-overlay">
          <div className="modal-box card-base">
            <h3>Add Technical Project</h3>
            <input 
              type="text" 
              placeholder="Project Title" 
              value={projInput.title}
              onChange={(e) => setProjInput({ ...projInput, title: e.target.value })}
              className="modal-input-field"
            />
            <textarea 
              placeholder="Short Description of key tech stack & impact..." 
              value={projInput.desc}
              onChange={(e) => setProjInput({ ...projInput, desc: e.target.value })}
              className="modal-input-field"
              rows={3}
            />
            <div className="modal-actions-row">
              <button className="btn-outline-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button className="btn-primary-purple" onClick={handleAddProject}>Add Project</button>
            </div>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {activeModal === 'skill' && (
        <div className="modal-backdrop-overlay">
          <div className="modal-box card-base">
            <h3>Add Technical Skill</h3>
            <select 
              value={skillInput.category}
              onChange={(e) => setSkillInput({ ...skillInput, category: e.target.value })}
              className="modal-input-field"
            >
              <option value="languages">Programming Languages</option>
              <option value="web">Web & Frameworks</option>
              <option value="tools">Tools & Databases</option>
            </select>
            <input 
              type="text" 
              placeholder="Skill Name (e.g. Python, React.js, Docker)" 
              value={skillInput.skillName}
              onChange={(e) => setSkillInput({ ...skillInput, skillName: e.target.value })}
              className="modal-input-field"
            />
            <div className="modal-actions-row">
              <button className="btn-outline-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button className="btn-primary-purple" onClick={handleAddSkill}>Add Skill</button>
            </div>
          </div>
        </div>
      )}

      {/* Experience Modal */}
      {activeModal === 'exp' && (
        <div className="modal-backdrop-overlay">
          <div className="modal-box card-base">
            <h3>Add Work Experience</h3>
            <input 
              type="text" 
              placeholder="Role / Title (e.g. Web Dev Intern)" 
              value={expInput.role}
              onChange={(e) => setExpInput({ ...expInput, role: e.target.value })}
              className="modal-input-field"
            />
            <input 
              type="text" 
              placeholder="Company / Organization Name" 
              value={expInput.company}
              onChange={(e) => setExpInput({ ...expInput, company: e.target.value })}
              className="modal-input-field"
            />
            <input 
              type="text" 
              placeholder="Duration (e.g. Jun 2026 - Aug 2026)" 
              value={expInput.duration}
              onChange={(e) => setExpInput({ ...expInput, duration: e.target.value })}
              className="modal-input-field"
            />
            <input 
              type="text" 
              placeholder="Key achievement or responsibility..." 
              value={expInput.bullet}
              onChange={(e) => setExpInput({ ...expInput, bullet: e.target.value })}
              className="modal-input-field"
            />
            <div className="modal-actions-row">
              <button className="btn-outline-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button className="btn-primary-purple" onClick={handleAddExperience}>Add Experience</button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Modal */}
      {activeModal === 'avatar' && (
        <div className="modal-backdrop-overlay">
          <div className="modal-box card-base" style={{ maxWidth: '500px' }}>
            <h3>Choose your avatar</h3>
            <p>Select a verified profile avatar that represents your professional persona.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', margin: '20px 0' }}>
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => handleSaveAvatar(av)}
                  style={{
                    background: 'none',
                    border: profile.avatarId === av.id ? '2px solid var(--primary-purple)' : '2px solid transparent',
                    borderRadius: '50%',
                    padding: '4px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <img src={av.url} alt="avatar" style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                </button>
              ))}
            </div>
            <div className="modal-actions-row">
              <button className="btn-outline-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
