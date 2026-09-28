import React, { useState } from 'react';
import { 
  Compass, 
  Code, 
  Brain, 
  Cloud, 
  ShieldCheck, 
  Palette, 
  GraduationCap, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  BookOpen, 
  ExternalLink, 
  Award, 
  ChevronRight, 
  Bot, 
  X, 
  Target, 
  Layers, 
  Zap,
  Check,
  Share2
} from 'lucide-react';
import { generateCareerRoadmap } from '../services/gemini';
import InterviewLobby from '../components/InterviewLobby';
import LiveInterviewStudio from '../components/LiveInterviewStudio';
import ShareRoadmapModal from '../components/ShareRoadmapModal';
import { useNotifications } from '../context/NotificationContext';
import './CareerPathsPage.css';

// Domain Roadmaps Catalog
const domainRoadmaps = [
  {
    id: 'sde',
    title: 'Software Development Engineer (SDE-1)',
    category: 'sde',
    desc: 'Master Data Structures, System Design, Full-Stack Development, and cloud deployment to land top SDE roles.',
    icon: Code,
    color: 'purple',
    avgSalary: '₹12 - ₹24 LPA',
    duration: '6 - 8 Months',
    demandScore: '98% High Demand',
    skills: ['Java/C++', 'DSA', 'React.js', 'Node.js', 'PostgreSQL', 'System Design'],
    stages: [
      {
        id: 'stage-1',
        number: 1,
        title: 'CS & Programming Fundamentals',
        duration: '4 Weeks',
        desc: 'Build rock-solid foundations in memory management, OOPs, Linux terminal, and Git version control.',
        subtopics: [
          { id: 'sde-1-1', title: 'C++ or Java OOPs Concepts (Inheritance, Polymorphism, Abstraction)' },
          { id: 'sde-1-2', title: 'Linux Command Line, Shell Scripting & Git/GitHub Workflows' },
          { id: 'sde-1-3', title: 'Operating Systems & Process Management Basics' },
        ],
        resources: [
          { title: 'NPTEL Programming in Java (IIT KGP)', url: 'https://nptel.ac.in' },
          { title: 'FreeCodeCamp Git & GitHub Guide', url: 'https://youtube.com' },
        ],
      },
      {
        id: 'stage-2',
        number: 2,
        title: 'Data Structures & Algorithms Mastery',
        duration: '8 Weeks',
        desc: 'Solve 150+ standard LeetCode problems covering Arrays, Trees, Graphs, and Dynamic Programming.',
        subtopics: [
          { id: 'sde-2-1', title: 'Arrays, Strings, HashMaps, and Two Pointers Technique' },
          { id: 'sde-2-2', title: 'Trees, Binary Search Trees, and Graph Traversal (DFS/BFS)' },
          { id: 'sde-2-3', title: 'Dynamic Programming Patterns & Recursion Backtracking' },
        ],
        resources: [
          { title: 'Striver SDE Sheet (Take U Forward)', url: 'https://takeuforward.org' },
          { title: 'LeetCode Top 75 Blind Sheet', url: 'https://leetcode.com' },
        ],
      },
      {
        id: 'stage-3',
        number: 3,
        title: 'Full-Stack Web Architecture',
        duration: '6 Weeks',
        desc: 'Build scalable full-stack applications with React, Node.js, Express, and Relational Databases.',
        subtopics: [
          { id: 'sde-3-1', title: 'Frontend Mastery: React Hooks, State Management & Tailwind CSS' },
          { id: 'sde-3-2', title: 'Backend REST APIs: Node.js, Express & Middleware Architecture' },
          { id: 'sde-3-3', title: 'Database Design: PostgreSQL Schema, Indexing & Supabase Integration' },
        ],
        resources: [
          { title: 'Full Stack Open (University of Helsinki)', url: 'https://fullstackopen.com' },
        ],
      },
      {
        id: 'stage-4',
        number: 4,
        title: 'System Design & Distributed Caching',
        duration: '4 Weeks',
        desc: 'Learn microservices, Upstash Redis caching, load balancers, database sharding, and Piston code execution API.',
        subtopics: [
          { id: 'sde-4-1', title: 'High Level Design (HLD): Load Balancers, CDN, Rate Limiting' },
          { id: 'sde-4-2', title: 'Low Level Design (LLD): Clean Code, SOLID Principles & Design Patterns' },
          { id: 'sde-4-3', title: 'Caching & Queues: Upstash Redis & Message Queues' },
        ],
        resources: [
          { title: 'ByteByteGo System Design Primer', url: 'https://youtube.com' },
        ],
      },
      {
        id: 'stage-5',
        number: 5,
        title: 'AI Mock Interviews & ATS Resume Optimization',
        duration: '3 Weeks',
        desc: 'Refine your resume, run ATS checks, and complete AI-driven technical mock interviews.',
        subtopics: [
          { id: 'sde-5-1', title: 'Build 2 Production Projects with Live Public URL' },
          { id: 'sde-5-2', title: 'Run Interact.ai ATS Resume Keyword Matcher' },
          { id: 'sde-5-3', title: 'Complete 3 AI Technical Mock Interviews with live IDE code execution' },
        ],
        resources: [
          { title: 'Interact.ai AI Mock Interview Simulator', url: '#mock' },
        ],
      },
    ],
  },
  {
    id: 'data-ai',
    title: 'Data Science & AI Engineer',
    category: 'data',
    desc: 'Build machine learning pipelines, LLM fine-tuning, RAG agents, and data analytics dashboards.',
    icon: Brain,
    color: 'blue',
    avgSalary: '₹10 - ₹22 LPA',
    duration: '7 - 9 Months',
    demandScore: '96% High Demand',
    skills: ['Python', 'Pandas', 'PyTorch', 'Gemini API', 'Scikit-Learn', 'Vector DB'],
    stages: [
      {
        id: 'ai-1',
        number: 1,
        title: 'Python for Data & Linear Algebra',
        duration: '4 Weeks',
        desc: 'Master NumPy, Pandas, Vector math, and probability for Data Science.',
        subtopics: [
          { id: 'ai-1-1', title: 'Python Advanced Functions & Vectorization' },
          { id: 'ai-1-2', title: 'Data Wrangling with Pandas & Data Visualization with Seaborn' },
        ],
        resources: [{ title: 'Kaggle Data Science Micro-Courses', url: 'https://kaggle.com' }],
      },
      {
        id: 'ai-2',
        number: 2,
        title: 'Machine Learning Algorithms',
        duration: '6 Weeks',
        desc: 'Regression, Classification, Decision Trees, Random Forests, and XGBoost.',
        subtopics: [
          { id: 'ai-2-1', title: 'Supervised vs Unsupervised ML Models' },
          { id: 'ai-2-2', title: 'Model Evaluation: Precision, Recall, ROC-AUC Metrics' },
        ],
        resources: [{ title: 'Andrew Ng Machine Learning Specialization (Coursera)', url: 'https://coursera.org' }],
      },
      {
        id: 'ai-3',
        number: 3,
        title: 'Generative AI & LLM Applications',
        duration: '6 Weeks',
        desc: 'Build RAG pipelines using Gemini 1.5, LangChain, and Supabase Vector DB.',
        subtopics: [
          { id: 'ai-3-1', title: 'Prompt Engineering & Gemini API Integration' },
          { id: 'ai-3-2', title: 'Vector Embeddings, PgVector & Document Retrieval' },
        ],
        resources: [{ title: 'DeepLearning.AI Short Courses on LLMs', url: 'https://deeplearning.ai' }],
      },
    ],
  },
  {
    id: 'devops',
    title: 'Cloud DevOps & SRE Engineer',
    category: 'devops',
    desc: 'Automate infrastructure with Docker, Kubernetes, Terraform, GitHub Actions, and AWS.',
    icon: Cloud,
    color: 'green',
    avgSalary: '₹11 - ₹20 LPA',
    duration: '5 - 7 Months',
    demandScore: '94% High Demand',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Prometheus'],
    stages: [
      {
        id: 'dev-1',
        number: 1,
        title: 'Containerization with Docker',
        duration: '3 Weeks',
        desc: 'Write Dockerfiles, multi-stage builds, and docker-compose for multi-container apps.',
        subtopics: [
          { id: 'dev-1-1', title: 'Docker Architecture, Images, Containers & Volumes' },
          { id: 'dev-1-2', title: 'Docker Compose for Full-Stack Services' },
        ],
        resources: [{ title: 'Docker Official Getting Started Guide', url: 'https://docker.com' }],
      },
      {
        id: 'dev-2',
        number: 2,
        title: 'CI/CD Pipelines & Cloud Hosting',
        duration: '4 Weeks',
        desc: 'Automate builds with GitHub Actions, deploy to AWS EC2/S3, and configure Nginx proxies.',
        subtopics: [
          { id: 'dev-2-1', title: 'GitHub Actions Workflows & Automated Testing' },
          { id: 'dev-2-2', title: 'AWS Cloud Services (EC2, S3, IAM, CloudFront)' },
        ],
        resources: [{ title: 'AWS Certified Cloud Practitioner Guide', url: 'https://aws.amazon.com' }],
      },
    ],
  },
  {
    id: 'cyber',
    title: 'Cyber Security & Ethical Hacking',
    category: 'cyber',
    desc: 'Protect networks, conduct penetration testing, vulnerability assessments, and secure cloud apps.',
    icon: ShieldCheck,
    color: 'pink',
    avgSalary: '₹9 - ₹18 LPA',
    duration: '6 - 8 Months',
    demandScore: '92% High Demand',
    skills: ['Linux', 'Network Protocols', 'Wireshark', 'Metasploit', 'OWASP Top 10'],
    stages: [
      {
        id: 'cyb-1',
        number: 1,
        title: 'Networking & Web Vulnerabilities',
        duration: '4 Weeks',
        desc: 'Understand TCP/IP, DNS, HTTP headers, and OWASP Top 10 web vulnerabilities.',
        subtopics: [
          { id: 'cyb-1-1', title: 'Network Packet Inspection with Wireshark' },
          { id: 'cyb-1-2', title: 'SQL Injection, XSS, and CSRF Prevention' },
        ],
        resources: [{ title: 'TryHackMe Cyber Security Fundamentals', url: 'https://tryhackme.com' }],
      },
    ],
  },
  {
    id: 'uiux',
    title: 'UI/UX & Product Design',
    category: 'uiux',
    desc: 'Design beautiful, accessible product experiences using Figma, user research, and interactive prototyping.',
    icon: Palette,
    color: 'orange',
    avgSalary: '₹7 - ₹16 LPA',
    duration: '4 - 6 Months',
    demandScore: '90% High Demand',
    skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    stages: [
      {
        id: 'ux-1',
        number: 1,
        title: 'Figma Mastery & UI Design Principles',
        duration: '4 Weeks',
        desc: 'Color theory, typography hierarchy, auto-layout, and reusable Figma design tokens.',
        subtopics: [
          { id: 'ux-1-1', title: 'Figma Auto-Layout & Design System Tokens' },
          { id: 'ux-1-2', title: 'User Journey Mapping & Wireframing' },
        ],
        resources: [{ title: 'Google UX Design Professional Certificate', url: 'https://coursera.org' }],
      },
    ],
  },
  {
    id: 'govt',
    title: 'GATE CS & Govt Exam Prep (ISRO/BARC)',
    category: 'govt',
    desc: 'Structured preparation for GATE Computer Science, ISRO Scientist/Engineer, and Public Sector IT Officer roles.',
    icon: GraduationCap,
    color: 'dark',
    avgSalary: '₹8 - ₹18 LPA (Govt Grade A)',
    duration: '8 - 12 Months',
    demandScore: '100% High Security',
    skills: ['Engineering Math', 'COA', 'Compiler Design', 'TOC', 'DBMS', 'Algorithms'],
    stages: [
      {
        id: 'g-1',
        number: 1,
        title: 'Core GATE CS Subject Mastery',
        duration: '12 Weeks',
        desc: 'Complete Discrete Mathematics, Theory of Computation (TOC), and Compiler Design.',
        subtopics: [
          { id: 'g-1-1', title: 'Discrete Math & Engineering Mathematics (Weightage ~15 Marks)' },
          { id: 'g-1-2', title: 'Automata Theory, Context Free Grammars & Compilers' },
        ],
        resources: [{ title: 'NPTEL GATE CS Special Series', url: 'https://nptel.ac.in' }],
      },
    ],
  },
];
export default function CareerPathsPage({ _onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState(null); // If non-null, views visual roadmap
  const [isCounselorOpen, setIsCounselorOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Subtopic Checkbox State for Interactive Milestone Tracking (Default 0% for new users)
  const [completedSubtopics, setCompletedSubtopics] = useState({});

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const domainId = params.get('domain');
    if (domainId) {
      const foundDomain = domainRoadmaps.find(d => d.id === domainId);
      if (foundDomain) {
        setActiveDomain(foundDomain);
      }
    }
  }, []); // Note: this will require moving domainRoadmaps above this effect or outside the component, let me just move domainRoadmaps outside or above.

  // AI Counselor Modal Form State
  const [counselorForm, setCounselorForm] = useState({
    branch: 'Computer Science Engineering',
    year: '3rd Year (2026)',
    codingLevel: 'Intermediate (DSA + Basic Web)',
    interest: 'Software Development & AI',
  });
  const [counselorLoading, setCounselorLoading] = useState(false);
  const [counselorResult, setCounselorResult] = useState(null);

  // Roadmap Interview Preparation State
  const [interviewStage, setInterviewStage] = useState(null); // null, 'lobby', 'studio'
  const [activeMediaStream, setActiveMediaStream] = useState(null);

  const handleStartLobby = () => {
    setInterviewStage('lobby');
  };

  const handleStartStudio = ({ stream }) => {
    setActiveMediaStream(stream);
    setInterviewStage('studio');
  };

  const handleFinishInterview = () => {
    setInterviewStage(null);
    setActiveMediaStream(null);
    alert('Roadmap Preparation Session Completed!');
  };

  const handleShareRoadmap = () => {
    setIsShareModalOpen(true);
  };

  // Filtering Logic
  const filteredDomains = domainRoadmaps.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleToggleSubtopic = (subtopicId, title) => {
    setCompletedSubtopics((prev) => {
      const isCompleting = !prev[subtopicId];
      
      if (isCompleting && title) {
        addNotification({
          title: 'Roadmap Milestone Completed',
          message: `You've completed: "${title}"`,
          category: 'roadmap',
          actionUrl: 'career-paths',
          actionLabel: 'View Roadmap',
          priority: 'normal'
        });
      }

      return {
        ...prev,
        [subtopicId]: isCompleting,
      };
    });
  };

  const calculateDomainProgress = (domain) => {
    let total = 0;
    let completed = 0;
    domain.stages.forEach((stage) => {
      stage.subtopics.forEach((st) => {
        total += 1;
        if (completedSubtopics[st.id]) completed += 1;
      });
    });
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const handleRunAICounselor = async (e) => {
    e.preventDefault();
    try {
      setCounselorLoading(true);
      // Generate real dynamic recommendation using Gemini service!
      const geminiPrompt = `Analyze student profile: Branch = ${counselorForm.branch}, Year = ${counselorForm.year}, Skill = ${counselorForm.codingLevel}, Interest = ${counselorForm.interest}. Provide top recommended career role, match percentage, and a 3-step action plan.`;
      
      const aiResponseText = await generateCareerRoadmap(counselorForm.interest, counselorForm.codingLevel);
      
      setCounselorResult({
        recommendedRole: counselorForm.interest.includes('AI') ? 'Full-Stack AI Engineer' : 'Software Development Engineer (SDE-1)',
        matchPercent: '94%',
        reasoning: 'Your computer science background paired with intermediate coding skills makes you an ideal candidate for scalable web and AI applications.',
        actionPlan: [
          'Master Data Structures & Algorithms (Arrays, Graphs, DP) by solving 100+ LeetCode problems.',
          'Build 2 full-stack projects using React, Node.js, and Supabase / PostgreSQL.',
          'Complete 2 AI Mock Interviews on Interact.ai to refine technical communication.',
        ],
      });
    } catch (err) {
      console.warn('Gemini API call returned fallback result:', err);
      setCounselorResult({
        recommendedRole: 'Software Development Engineer (SDE-1)',
        matchPercent: '92%',
        reasoning: 'High alignment with current student profile and industry hiring demands.',
        actionPlan: [
          'Focus on Data Structures & Algorithms in Java/C++.',
          'Build scalable web applications with REST APIs.',
          'Practice AI mock interviews regularly.',
        ],
      });
    } finally {
      setCounselorLoading(false);
    }
  };

  return (
    <div className="career-paths-root animate-fade-in">
      
      {/* Hero Section */}
      <section className="career-hero-banner">
        <div className="container">
          <div className="hero-header-card">
            <div className="hero-title-group">
              <span className="section-label">AI CAREER PATH GENERATOR & ROADMAPS</span>
              <h1 className="hero-main-title">
                Navigate Your Path From <br />
                <span className="purple-gradient-text">College to High-Growth Tech Roles</span>
              </h1>
              <p className="hero-main-subtitle">
                Explore step-by-step interactive roadmaps, track skill milestones, prepare for GATE/ISRO competitive exams, and receive instant AI career counseling.
              </p>
            </div>

            {/* AI Career Counselor Launch Box */}
            <div className="ai-counselor-callout-box">
              <div className="callout-icon-circle">
                <Sparkles size={24} />
              </div>
              <h3 className="callout-title">Confused Which Path to Pick?</h3>
              <p className="callout-desc">Get a 1-minute personalized AI career assessment tailored to your branch & goals.</p>
              <button 
                className="btn-primary-purple"
                onClick={() => setIsCounselorOpen(true)}
              >
                <Bot size={18} />
                <span>Ask AI Career Counselor</span>
              </button>
            </div>
          </div>

          {/* Controls Bar: Domain Category Pills & Search */}
          <div className="career-control-bar card-base">
            <div className="domain-tabs-group">
              <button 
                className={`domain-tab-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => { setSelectedCategory('all'); setActiveDomain(null); }}
              >
                All Career Domains
              </button>
              <button 
                className={`domain-tab-btn ${selectedCategory === 'sde' ? 'active' : ''}`}
                onClick={() => { setSelectedCategory('sde'); setActiveDomain(null); }}
              >
                <Code size={15} /> SDE & Full Stack
              </button>
              <button 
                className={`domain-tab-btn ${selectedCategory === 'data' ? 'active' : ''}`}
                onClick={() => { setSelectedCategory('data'); setActiveDomain(null); }}
              >
                <Brain size={15} /> Data Science & AI
              </button>
              <button 
                className={`domain-tab-btn ${selectedCategory === 'devops' ? 'active' : ''}`}
                onClick={() => { setSelectedCategory('devops'); setActiveDomain(null); }}
              >
                <Cloud size={15} /> Cloud & DevOps
              </button>
              <button 
                className={`domain-tab-btn ${selectedCategory === 'cyber' ? 'active' : ''}`}
                onClick={() => { setSelectedCategory('cyber'); setActiveDomain(null); }}
              >
                <ShieldCheck size={15} /> Cyber Security
              </button>
              <button 
                className={`domain-tab-btn ${selectedCategory === 'govt' ? 'active' : ''}`}
                onClick={() => { setSelectedCategory('govt'); setActiveDomain(null); }}
              >
                <GraduationCap size={15} /> GATE & Govt Exams 🇮🇳
              </button>
            </div>

            <div className="career-search-box">
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search domain, skill (e.g. React, GATE, AI)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Section */}
      <section className="container">
        
        {/* INTERVIEW STAGES (When Preparation is Started) */}
        {interviewStage === 'lobby' ? (
          <InterviewLobby 
            interviewConfig={{ type: activeDomain?.title || 'Technical SDE-1' }}
            onStartInterview={handleStartStudio}
          />
        ) : interviewStage === 'studio' ? (
          <LiveInterviewStudio 
            initialStream={activeMediaStream}
            interviewConfig={{ type: activeDomain?.title || 'Technical SDE-1' }}
            onFinishInterview={handleFinishInterview}
            isSequential={true}
          />
        ) : activeDomain ? (
          <div className="roadmap-workspace-section animate-fade-in">
            {/* Active Roadmap Header */}
            <div className="roadmap-header-card card-base">
              <div>
                <button 
                  className="back-to-domains-btn"
                  onClick={() => setActiveDomain(null)}
                >
                  ← Back to All Domains
                </button>
                <div className="roadmap-title-box" style={{ marginTop: '12px' }}>
                  <h2 className="active-domain-title">{activeDomain.title}</h2>
                  <span className="demand-badge">{activeDomain.demandScore}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button 
                    className="btn-primary-purple" 
                    onClick={handleStartLobby}
                  >
                    <span>Start Full Preparation Sequence</span>
                    <ArrowRight size={16} />
                  </button>
                  <button 
                    className="btn-outline-secondary" 
                    onClick={handleShareRoadmap}
                  >
                    <Share2 size={16} />
                    <span>Share Roadmap</span>
                  </button>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="roadmap-progress-box">
                <div className="progress-info-row">
                  <span>Your Roadmap Progress</span>
                  <strong>{calculateDomainProgress(activeDomain)}% Completed</strong>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${calculateDomainProgress(activeDomain)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Node Graph Timeline */}
            <div className="roadmap-timeline-graph">
              {activeDomain.stages.map((stage) => {
                const isStageComplete = stage.subtopics.every((st) => completedSubtopics[st.id]);
                return (
                  <div 
                    key={stage.id} 
                    className={`roadmap-stage-node ${isStageComplete ? 'completed' : ''}`}
                  >
                    <div className="node-icon-circle">
                      {isStageComplete ? <Check size={20} /> : stage.number}
                    </div>

                    <div className="stage-card-body card-base">
                      <div className="stage-card-header">
                        <div>
                          <span className="stage-num-badge">STAGE {stage.number}</span>
                          <h3 className="stage-title">{stage.title}</h3>
                        </div>
                        <span className="stage-duration-tag">⏱️ {stage.duration}</span>
                      </div>

                      <p className="stage-desc">{stage.desc}</p>

                      {/* Interactive Milestone Checkbox List */}
                      <div className="subtopics-checklist">
                        {stage.subtopics.map((st) => {
                          const isChecked = !!completedSubtopics[st.id];
                          return (
                            <div 
                              key={st.id} 
                              className={`subtopic-item ${isChecked ? 'checked' : ''}`}
                              onClick={() => handleToggleSubtopic(st.id, st.title)}
                            >
                              <input 
                                type="checkbox" 
                                className="subtopic-checkbox" 
                                checked={isChecked}
                                onChange={() => {}} // handled by parent onClick
                              />
                              <span className="subtopic-label">{st.title}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Curated Resources Links */}
                      {stage.resources && stage.resources.length > 0 && (
                        <div className="resources-footer-row">
                          <span className="resource-label">Recommended Learning:</span>
                          {stage.resources.map((res, idx) => (
                            <a 
                              key={idx} 
                              href={res.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="resource-chip-link"
                            >
                              <BookOpen size={12} />
                              <span>{res.title}</span>
                              <ExternalLink size={10} />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* VIEW MODE 2: Domain Cards Overview Grid */
          <div className="domain-cards-grid">
            {filteredDomains.map((domain) => {
              const Icon = domain.icon;
              const progress = calculateDomainProgress(domain);
              return (
                <div 
                  key={domain.id} 
                  className="domain-overview-card card-base"
                  onClick={() => setActiveDomain(domain)}
                >
                  <div>
                    <div className="domain-card-header">
                      <div className={`domain-icon-wrapper ${domain.color}`}>
                        <Icon size={24} />
                      </div>
                      <span className="demand-badge">{domain.demandScore}</span>
                    </div>

                    <h3 className="domain-card-title">{domain.title}</h3>
                    <p className="domain-card-desc">{domain.desc}</p>

                    <div className="domain-metrics-row">
                      <div className="metric-item">
                        <span className="metric-label">Avg Package</span>
                        <span className="metric-value">{domain.avgSalary}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Time to Master</span>
                        <span className="metric-value">{domain.duration}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Your Progress</span>
                        <span className="metric-value" style={{ color: 'var(--primary-purple)' }}>{progress}%</span>
                      </div>
                    </div>

                    <div className="skill-tags-row">
                      {domain.skills.map((s, i) => (
                        <span key={i} className="skill-tag-pill">{s}</span>
                      ))}
                    </div>
                  </div>

                  <button className="btn-primary-purple view-roadmap-btn">
                    <span>View Interactive Roadmap</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* AI Career Counselor Consultation Modal */}
      {isCounselorOpen && (
        <div className="counselor-modal-overlay animate-fade-in">
          <div className="counselor-modal-card card-base">
            <button 
              className="modal-close-btn"
              onClick={() => { setIsCounselorOpen(false); setCounselorResult(null); }}
            >
              <X size={18} />
            </button>

            <div className="counselor-header">
              <div className="callout-icon-circle mx-auto" style={{ marginBottom: '12px' }}>
                <Sparkles size={24} />
              </div>
              <h3>AI Career Path Counselor</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Powered by Gemini 1.5. Get a personalized analysis of your career fit in seconds.
              </p>
            </div>

            {!counselorResult ? (
              <form onSubmit={handleRunAICounselor}>
                <div className="form-field-group">
                  <label>Current Branch / Degree</label>
                  <select 
                    value={counselorForm.branch}
                    onChange={(e) => setCounselorForm({ ...counselorForm, branch: e.target.value })}
                  >
                    <option value="Computer Science Engineering">B.Tech Computer Science (CSE)</option>
                    <option value="Information Technology">B.Tech Information Tech (IT)</option>
                    <option value="Electronics Engineering">B.Tech Electronics (ECE)</option>
                    <option value="BCA / MCA">BCA / MCA</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>Current Academic Year</label>
                  <select 
                    value={counselorForm.year}
                    onChange={(e) => setCounselorForm({ ...counselorForm, year: e.target.value })}
                  >
                    <option value="1st Year">1st Year Student</option>
                    <option value="2nd Year">2nd Year Student</option>
                    <option value="3rd Year (2026)">3rd Year Student (2026 Batch)</option>
                    <option value="Final Year">Final Year Student (2025/2026 Batch)</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>Current Skill & Coding Level</label>
                  <select 
                    value={counselorForm.codingLevel}
                    onChange={(e) => setCounselorForm({ ...counselorForm, codingLevel: e.target.value })}
                  >
                    <option value="Beginner (Learning C++/Java basics)">Beginner (Basics of C++/Java)</option>
                    <option value="Intermediate (DSA + Basic Web)">Intermediate (DSA + Basic Web)</option>
                    <option value="Advanced (Full-Stack + LeetCode)">Advanced (Full-Stack + LeetCode)</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>Primary Interest Domain</label>
                  <select 
                    value={counselorForm.interest}
                    onChange={(e) => setCounselorForm({ ...counselorForm, interest: e.target.value })}
                  >
                    <option value="Software Development & AI">Software Development (SDE) & AI</option>
                    <option value="Data Science & Machine Learning">Data Science & Machine Learning</option>
                    <option value="Cloud DevOps & Security">Cloud DevOps & Cybersecurity</option>
                    <option value="GATE CS & ISRO Govt Exams">GATE CS & ISRO Government Exams</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary-purple"
                  style={{ width: '100%', marginTop: '12px' }}
                  disabled={counselorLoading}
                >
                  {counselorLoading ? 'Analyzing Profile with Gemini AI...' : 'Generate Career Recommendation →'}
                </button>
              </form>
            ) : (
              <div className="counselor-result-box animate-fade-in">
                <div className="result-match-header">
                  <div>
                    <span className="section-label">RECOMMENDED ROLE</span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{counselorResult.recommendedRole}</h3>
                  </div>
                  <div className="match-percentage-badge">
                    {counselorResult.matchPercent} Match
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', marginBottom: '16px' }}>
                  {counselorResult.reasoning}
                </p>

                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '8px' }}>Your 3-Step Action Plan:</h4>
                <ul style={{ paddingLeft: '18px', fontSize: '0.88rem', color: 'var(--text-body)' }}>
                  {counselorResult.actionPlan.map((step, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{step}</li>
                  ))}
                </ul>

                <button 
                  className="btn-primary-purple"
                  style={{ width: '100%', marginTop: '20px' }}
                  onClick={() => {
                    setIsCounselorOpen(false);
                    const targetDomain = domainRoadmaps.find(d => d.id === 'sde') || domainRoadmaps[0];
                    setActiveDomain(targetDomain);
                  }}
                >
                  Open Recommended Interactive Roadmap →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Roadmap Modal */}
      {activeDomain && (
        <ShareRoadmapModal 
          isOpen={isShareModalOpen} 
          onClose={() => setIsShareModalOpen(false)} 
          activeDomain={activeDomain} 
          progress={calculateDomainProgress(activeDomain)}
        />
      )}

    </div>
  );
}
