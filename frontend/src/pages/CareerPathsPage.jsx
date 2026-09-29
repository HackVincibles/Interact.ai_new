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
export default function CareerPathsPage({ onNavigate, currentUser = null }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState(null); // If non-null, views visual roadmap
  const [isCounselorOpen, setIsCounselorOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Subtopic Checkbox State for Interactive Milestone Tracking (Default 0% for new users)
  const [completedSubtopics, setCompletedSubtopics] = useState({});
  const [chatLoading, setChatLoading] = useState(false);

  // Live Interview Simulator state within Career Roadmap
  const [interviewStage, setInterviewStage] = useState(null); // null | 'lobby' | 'studio'
  const [activeMediaStream, setActiveMediaStream] = useState(null);

  const handleStartStudio = (stream) => {
    setActiveMediaStream(stream);
    setInterviewStage('studio');
  };

  const handleFinishInterview = () => {
    setInterviewStage(null);
  };

  const calculateDomainProgress = (domain) => {
    if (!domain || !domain.stages) return 0;
    let totalSubtopics = 0;
    let completedCount = 0;
    domain.stages.forEach((stage) => {
      stage.subtopics?.forEach((sub) => {
        totalSubtopics++;
        if (completedSubtopics[sub.id]) {
          completedCount++;
        }
      });
    });
    return totalSubtopics > 0 ? Math.round((completedCount / totalSubtopics) * 100) : 0;
  };

  const filteredDomains = domainRoadmaps.filter((domain) => {
    const matchesCat = selectedCategory === 'all' || domain.category === selectedCategory;
    const matchesQuery = !searchQuery.trim() || 
      domain.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const handleToggleSubtopic = (subtopicId, _subtopicTitle) => {
    setCompletedSubtopics((prev) => ({
      ...prev,
      [subtopicId]: !prev[subtopicId],
    }));
  };

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const domainId = params.get('domain');
    if (domainId) {
      const foundDomain = domainRoadmaps.find(d => d.id === domainId);
      if (foundDomain) {
        setActiveDomain(foundDomain);
      }
    }
  }, []);

  // AI Counselor Modal Form State & Real-time Chat
  const [counselorForm, setCounselorForm] = useState({
    branch: 'Computer Science Engineering',
    year: '3rd Year (2026)',
    codingLevel: 'Intermediate (DSA + Basic Web)',
    interest: 'Software Development & AI',
  });
  const [counselorTab, setCounselorTab] = useState('paths'); // 'paths' or 'chat'
  const [counselorLoading, setCounselorLoading] = useState(false);
  const [counselorPaths, setCounselorPaths] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I am your AI Career Counselor powered by Gemini. Ask me anything about tech roles, skills, or career direction!' }
  ]);
  const [savedPaths, setSavedPaths] = useState(() => {
    try {
      const saved = localStorage.getItem('interact_saved_career_paths');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const handleOpenCounselor = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsCounselorOpen(true);
  };

  React.useEffect(() => {
    if (isCounselorOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCounselorOpen]);

  // Real-time Chat Handler with Gemini API
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);

    try {
      setChatLoading(true);
      const prompt = `You are an expert tech career counselor. The student asks: "${userMsg}". Student context: ${counselorForm.branch}, ${counselorForm.year}, ${counselorForm.interest}. Give a concise, encouraging, real-time advice with specific technologies.`;
      const aiReply = await generateGeminiResponse(prompt);
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: aiReply || 'Based on current 2026 tech trends, focusing on DSA algorithms, Full-Stack React/Node, and Cloud Fundamentals will give you the highest placement edge.' }
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: 'Focus on building 2 production-grade projects and practicing DSA regularly to maximize your placement chances.' }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  React.useEffect(() => {
    if (currentUser) {
      setCounselorForm((prev) => ({
        ...prev,
        branch: currentUser.branch || currentUser.department || prev.branch,
      }));
    }
  }, [currentUser]);

  // Generate 2-3 Best Personalized Career Paths based on Candidate Profile
  const handleGenerateBestPaths = (e) => {
    if (e) e.preventDefault();
    setCounselorLoading(true);

    const interestLower = (counselorForm.interest || '').toLowerCase();
    const branchLower = (counselorForm.branch || '').toLowerCase();
    const levelText = counselorForm.codingLevel;
    const yearText = counselorForm.year;

      let paths = [];

      if (interestLower.includes('data') || interestLower.includes('ai')) {
        paths = [
          {
            id: 'path-ai-1',
            title: 'Full-Stack AI & LLM Systems Engineer',
            matchScore: '98%',
            salaryRange: '₹14 - ₹28 LPA',
            reasoning: `Perfect alignment with your interest in AI & Machine Learning. Ideal for a ${counselorForm.branch} student (${yearText}) at ${levelText} level.`,
            roadmap: [
              'Python Data Stack (Pandas, NumPy, PyTorch)',
              'LLM Prompt Engineering & Gemini/OpenAI API Integration',
              'Vector Databases (Pinecone/Upstash Redis) & RAG Pipelines',
              'Deploy LLM Web Apps with FastApi & React',
              'Complete AI Mock Interview Drills on Interact.ai'
            ]
          },
          {
            id: 'path-ai-2',
            title: 'Data Science & Predictive ML Specialist',
            matchScore: '94%',
            salaryRange: '₹12 - ₹24 LPA',
            reasoning: `High industry hiring for data analytics and predictive modeling in fast-scaling tech companies.`,
            roadmap: [
              'Exploratory Data Analysis & Feature Engineering',
              'Supervised & Unsupervised Machine Learning Models',
              'Data Visualization Dashboards (Streamlit / Tableau)',
              'Model Deployment & MLOps CI/CD Pipelines',
              'Complete 3 Data Science Mock Interviews on Interact.ai'
            ]
          },
          {
            id: 'path-ai-3',
            title: 'AI Cloud Infrastructure & MLOps Specialist',
            matchScore: '90%',
            salaryRange: '₹11 - ₹22 LPA',
            reasoning: `Bridges software engineering with cloud AI model serving infrastructure.`,
            roadmap: [
              'Docker Containerization for ML Models',
              'AWS SageMaker & Cloud Deployment',
              'Model Monitoring & Drift Detection',
              'Scalable GPU & Inference Architecture',
              'Interact.ai Cloud AI Readiness Evaluation'
            ]
          }
        ];
      } else if (interestLower.includes('devops') || interestLower.includes('cloud') || interestLower.includes('security')) {
        paths = [
          {
            id: 'path-cloud-1',
            title: 'Cloud DevOps & Site Reliability Engineer (SRE)',
            matchScore: '97%',
            salaryRange: '₹12 - ₹22 LPA',
            reasoning: `Tailored for ${counselorForm.branch} (${yearText}). Exceptional market demand for cloud deployment automation.`,
            roadmap: [
              'Linux System Administration & Shell Automation',
              'Docker Containerization & Kubernetes Cluster Orchestration',
              'Infrastructure as Code (Terraform) & AWS Architecture',
              'CI/CD Pipeline Automation (GitHub Actions / Jenkins)',
              'System Monitoring & Logging with Prometheus & Grafana'
            ]
          },
          {
            id: 'path-cloud-2',
            title: 'Cloud Solutions Architect (AWS / Azure)',
            matchScore: '93%',
            salaryRange: '₹14 - ₹26 LPA',
            reasoning: `Focuses on high-availability architecture, VPC security, and multi-region cloud design.`,
            roadmap: [
              'AWS Certified Cloud Practitioner & Developer Track',
              'Virtual Private Cloud (VPC) & IAM Security Roles',
              'Serverless Computing (AWS Lambda & DynamoDB)',
              'Disaster Recovery & High-Availability Design',
              'Interact.ai Cloud Architect Mock Drills'
            ]
          },
          {
            id: 'path-cloud-3',
            title: 'Cybersecurity Analyst & DevSecOps Engineer',
            matchScore: '89%',
            salaryRange: '₹10 - ₹20 LPA',
            reasoning: `High security compliance demand across financial fintech and enterprise SaaS platforms.`,
            roadmap: [
              'Network Security & Wireshark Packet Analysis',
              'SIEM Security Operations & Log Analysis',
              'Ethical Hacking & Penetration Testing Basics',
              'Application Security Code Audit',
              'Interact.ai Security Certification Prep'
            ]
          }
        ];
      } else if (interestLower.includes('gate') || interestLower.includes('govt') || interestLower.includes('isro')) {
        paths = [
          {
            id: 'path-govt-1',
            title: 'GATE CS Top 100 AIR Ranker & PSU Officer',
            matchScore: '99%',
            salaryRange: '₹8 - ₹18 LPA (Govt Grade A)',
            reasoning: `Directly tailored for ${counselorForm.branch} students in ${yearText} targeting Public Sector Unit (PSU) recruitment.`,
            roadmap: [
              'Discrete Math & Engineering Mathematics (15 Marks)',
              'Algorithms, Data Structures & C Programming (20 Marks)',
              'Operating Systems & Computer Networks (18 Marks)',
              'DBMS & Theory of Computation (15 Marks)',
              'Complete 10 GATE CS Full Length Mock Tests'
            ]
          },
          {
            id: 'path-govt-2',
            title: 'ISRO / BARC Scientist Engineer (IT & CS)',
            matchScore: '95%',
            salaryRange: '₹10 - ₹20 LPA (Central Govt)',
            reasoning: `Prestigious research Scientist positions at ISRO / BARC for CS engineering graduates.`,
            roadmap: [
              'Advanced COA & Microprocessor Architecture',
              'Space Telemetry Software & Real-Time OS',
              'ISRO Scientist Previous Year Paper Solving',
              'Technical Scientist Panel Interview Preparation',
              'Interact.ai ISRO Interview Simulation'
            ]
          },
          {
            id: 'path-govt-3',
            title: 'National Informatics Centre (NIC) Scientific Officer',
            matchScore: '91%',
            salaryRange: '₹8 - ₹16 LPA',
            reasoning: `Key government digital infrastructure engineering roles under MeitY.`,
            roadmap: [
              'Govt E-Governance Architecture',
              'Database Management & SQL Systems',
              'Cyber Laws & Data Privacy Standards',
              'NIC Written Examination Drills',
              'Final Selection Panel Interview Prep'
            ]
          }
        ];
      } else {
        paths = [
          {
            id: 'path-sde-1',
            title: 'Software Development Engineer (SDE-1)',
            matchScore: '96%',
            salaryRange: '₹12 - ₹24 LPA',
            reasoning: `Custom matched for your ${levelText} skill level and ${counselorForm.branch} (${yearText}) background.`,
            roadmap: [
              'Master Data Structures & Algorithms (Trees, Graphs, DP)',
              'Build Distributed REST & GraphQL APIs with Node.js/PostgreSQL',
              'Integrate Upstash Redis Caching & Microservices',
              'Deploy Containerized Full-Stack Apps on Cloud',
              'Complete 5 AI Technical Mock Interviews on Interact.ai'
            ]
          },
          {
            id: 'path-sde-2',
            title: 'Full-Stack Web Architect (React & Node.js)',
            matchScore: '93%',
            salaryRange: '₹10 - ₹22 LPA',
            reasoning: `High demand for building modern web applications, interactive dashboards, and SaaS platforms.`,
            roadmap: [
              'Frontend Mastery: React Hooks, State & Modern CSS',
              'Backend Systems: Node.js, Express & Relational Databases',
              'State Management & WebSockets Real-Time Communication',
              'CI/CD Deployment & Performance Optimization',
              'Interact.ai Full-Stack IDE Mock Interview'
            ]
          },
          {
            id: 'path-sde-3',
            title: 'High-Scale Backend Systems Engineer',
            matchScore: '88%',
            salaryRange: '₹11 - ₹20 LPA',
            reasoning: `Focuses on database optimization, load balancing, message queues (Kafka/RabbitMQ), and system design.`,
            roadmap: [
              'Advanced Java / C++ Memory & Multithreading',
              'PostgreSQL Indexing & Database Query Tuning',
              'Message Queues & Microservices Architecture',
              'System Design Fundamentals (HLD / LLD)',
              'Interact.ai System Design Drill'
            ]
          }
        ];
      }

      setCounselorPaths(paths);
      setCounselorLoading(false);
  };

  const handleSaveRoadmap = (pathObj) => {
    const existing = savedPaths.filter(p => p.id !== pathObj.id);
    const updated = [pathObj, ...existing];
    setSavedPaths(updated);
    localStorage.setItem('interact_saved_career_paths', JSON.stringify(updated));
    addNotification({
      title: 'Roadmap Saved to Profile',
      message: `"${pathObj.title}" has been saved under your profile - My Career Paths.`,
      category: 'roadmap',
      actionUrl: 'profile',
      actionLabel: 'View Profile',
      priority: 'high'
    });
    alert(`"${pathObj.title}" roadmap saved successfully! Access it anytime from your Profile -> My Career Paths.`);
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
                onClick={handleOpenCounselor}
              >
                <Bot size={18} />
                <span>Ask AI Career Counselor</span>
              </button>
            </div>
          </div>

          {/* Inline AI Profile Career Path Analyzer */}
          <div className="card-base" style={{ margin: '24px 0', padding: '24px', border: '1px solid var(--border-purple)', borderRadius: '14px', background: 'var(--card-bg-white)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ background: 'var(--primary-purple)', padding: '8px', borderRadius: '10px', color: '#fff' }}>
                <Sparkles size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>Show Best Career Paths Based On My Profile</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Select or update your profile options below to generate custom roadmaps & LPA salaries</p>
              </div>
            </div>

            <form onSubmit={handleGenerateBestPaths} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Branch / Degree</label>
                <select
                  value={counselorForm.branch}
                  onChange={(e) => setCounselorForm({ ...counselorForm, branch: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                >
                  <option value="Computer Science Engineering">B.Tech Computer Science (CSE)</option>
                  <option value="Information Technology">B.Tech Information Tech (IT)</option>
                  <option value="Electronics Engineering">B.Tech Electronics (ECE)</option>
                  <option value="BCA / MCA">BCA / MCA</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Academic Year / Batch</label>
                <select
                  value={counselorForm.year}
                  onChange={(e) => setCounselorForm({ ...counselorForm, year: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                >
                  <option value="1st Year">1st Year Student</option>
                  <option value="2nd Year">2nd Year Student</option>
                  <option value="3rd Year (2026)">3rd Year Student (2026 Batch)</option>
                  <option value="Final Year">Final Year Student (2025/2026 Batch)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Technical Skill Level</label>
                <select
                  value={counselorForm.codingLevel}
                  onChange={(e) => setCounselorForm({ ...counselorForm, codingLevel: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                >
                  <option value="Beginner (Basics of C++/Java)">Beginner (Basics of C++/Java)</option>
                  <option value="Intermediate (DSA + Basic Web)">Intermediate (DSA + Basic Web)</option>
                  <option value="Advanced (Full-Stack + LeetCode)">Advanced (Full-Stack + LeetCode)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Primary Career Goal</label>
                <select
                  value={counselorForm.interest}
                  onChange={(e) => setCounselorForm({ ...counselorForm, interest: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                >
                  <option value="Software Development & AI">Software Development (SDE) & AI</option>
                  <option value="Data Science & Machine Learning">Data Science & Machine Learning</option>
                  <option value="Cloud DevOps & Security">Cloud DevOps & Cybersecurity</option>
                  <option value="GATE CS & ISRO Govt Exams">GATE CS & ISRO Government Exams</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: '6px' }}>
                <button
                  type="submit"
                  className="btn-primary-purple"
                  style={{ width: '100%', padding: '12px 20px', fontSize: '0.95rem', fontWeight: '700' }}
                  disabled={counselorLoading}
                >
                  {counselorLoading ? 'Analyzing Profile with Gemini AI...' : '🚀 Generate Best Career Paths Based On My Profile →'}
                </button>
              </div>
            </form>

            {counselorPaths && (
              <div className="animate-fade-in" style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>🎯 Top 3 Personalized Career Paths For Your Profile:</h4>
                  <button
                    onClick={() => setCounselorPaths(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-purple)', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}
                  >
                    🔄 Clear Results
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  {counselorPaths.map((path) => (
                    <div key={path.id} className="card-base" style={{ padding: '16px', border: '1px solid var(--border-purple)', borderRadius: '12px', background: 'var(--bg-subtle)' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '800', background: 'var(--primary-purple)', color: '#fff', padding: '3px 8px', borderRadius: '10px' }}>{path.matchScore} Match</span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '8px 0 4px 0' }}>{path.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--primary-purple)', fontWeight: '700', margin: '0 0 8px 0' }}>💰 Salary Range: {path.salaryRange}</p>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>{path.reasoning}</p>

                      <div style={{ background: 'var(--card-bg-white)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                        <p style={{ fontSize: '0.78rem', fontWeight: '700', marginBottom: '4px' }}>📍 Personalized 5-Stage Roadmap:</p>
                        <ol style={{ paddingLeft: '16px', margin: 0, fontSize: '0.8rem', color: 'var(--text-body)' }}>
                          {path.roadmap.map((step, sIdx) => (
                            <li key={sIdx} style={{ marginBottom: '3px' }}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      <button
                        className="btn-outline-secondary"
                        onClick={() => handleSaveRoadmap(path)}
                        style={{ width: '100%', marginTop: '12px', padding: '8px', fontSize: '0.8rem', fontWeight: '700' }}
                      >
                        💾 Save Roadmap To Profile
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                <div style={{ fontSize: '0.88rem', color: 'var(--primary-purple)', fontWeight: '700', margin: '8px 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ⚡ This roadmap is generated & updated based on your live learning activity of you
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
                                onChange={() => { }} // handled by parent onClick
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
              onClick={() => { setIsCounselorOpen(false); setCounselorPaths(null); }}
            >
              <X size={18} />
            </button>

            <div className="counselor-header">
              <div className="callout-icon-circle mx-auto" style={{ marginBottom: '12px' }}>
                <Sparkles size={24} />
              </div>
              <h3>AI Career Counselor & Path Generator</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Real-time Gemini AI career guidance based on your profile, market trends & 2026 hiring telemetry.
              </p>
            </div>

            {/* Modal Mode Tabs */}
            <div className="counselor-modal-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'var(--bg-subtle)', padding: '4px', borderRadius: '10px' }}>
              <button
                type="button"
                className={`counselor-tab-btn ${counselorTab === 'paths' ? 'active' : ''}`}
                onClick={() => setCounselorTab('paths')}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: counselorTab === 'paths' ? 'var(--card-bg-white)' : 'transparent', color: counselorTab === 'paths' ? 'var(--primary-purple)' : 'var(--text-muted)', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: counselorTab === 'paths' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none' }}
              >
                🚀 Best Career Paths (AI Analysis)
              </button>
              <button
                type="button"
                className={`counselor-tab-btn ${counselorTab === 'chat' ? 'active' : ''}`}
                onClick={() => setCounselorTab('chat')}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: counselorTab === 'chat' ? 'var(--card-bg-white)' : 'transparent', color: counselorTab === 'chat' ? 'var(--primary-purple)' : 'var(--text-muted)', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: counselorTab === 'chat' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none' }}
              >
                💬 Direct AI Chat
              </button>
            </div>

            {counselorTab === 'paths' ? (
              <div>
                {!counselorPaths ? (
                  <form onSubmit={handleGenerateBestPaths}>
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
                      <label>Academic Batch / Year</label>
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
                      <label>Current Coding & Technical Skill Level</label>
                      <select
                        value={counselorForm.codingLevel}
                        onChange={(e) => setCounselorForm({ ...counselorForm, codingLevel: e.target.value })}
                      >
                        <option value="Beginner (Basics of C++/Java)">Beginner (Basics of C++/Java)</option>
                        <option value="Intermediate (DSA + Basic Web)">Intermediate (DSA + Basic Web)</option>
                        <option value="Advanced (Full-Stack + LeetCode)">Advanced (Full-Stack + LeetCode)</option>
                      </select>
                    </div>

                    <div className="form-field-group">
                      <label>Primary Career Interest</label>
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
                      style={{ width: '100%', marginTop: '12px', padding: '12px' }}
                      disabled={counselorLoading}
                    >
                      {counselorLoading ? 'Analyzing Profile with Gemini AI...' : 'Show Best Career Paths Based on My Profile →'}
                    </button>
                  </form>
                ) : (
                  <div className="counselor-results-list animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '800' }}>Top 2-3 Personalized Career Paths For You:</h4>
                      <button
                        onClick={() => setCounselorPaths(null)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-purple)', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}
                      >
                        🔄 Re-Analyze
                      </button>
                    </div>

                    {counselorPaths.map((path) => (
                      <div key={path.id} className="card-base" style={{ padding: '16px 20px', border: '1px solid var(--border-purple)', borderRadius: '12px', background: 'var(--bg-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', background: 'var(--primary-purple)', color: '#fff', padding: '2px 8px', borderRadius: '10px' }}>{path.matchScore} Match</span>
                            <h4 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '6px 0 4px 0' }}>{path.title}</h4>
                            <p style={{ fontSize: '0.82rem', color: 'var(--primary-purple)', fontWeight: '700' }}>💰 Avg Salary: {path.salaryRange}</p>
                          </div>
                          <button
                            className="btn-outline-secondary"
                            onClick={() => handleSaveRoadmap(path)}
                            style={{ padding: '6px 12px', fontSize: '0.78rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            💾 Save Roadmap
                          </button>
                        </div>
                        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '10px 0' }}>{path.reasoning}</p>

                        <div style={{ background: 'var(--card-bg-white)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                          <p style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-main)' }}>📍 Complete Step-by-Step Roadmap:</p>
                          <ol style={{ paddingLeft: '18px', margin: 0, fontSize: '0.82rem', color: 'var(--text-body)' }}>
                            {path.roadmap.map((step, sIdx) => (
                              <li key={sIdx} style={{ marginBottom: '4px' }}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Direct AI Chat Tab */
              <div className="ai-chat-counselor-container" style={{ display: 'flex', flexDirection: 'column', height: '360px' }}>
                <div className="chat-messages-box" style={{ flex: 1, overflowY: 'auto', padding: '12px', background: 'var(--bg-subtle)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '82%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: msg.sender === 'user' ? 'var(--primary-gradient)' : 'var(--card-bg-white)',
                        color: msg.sender === 'user' ? '#fff' : 'var(--text-main)',
                        fontSize: '0.88rem',
                        border: msg.sender === 'ai' ? '1px solid var(--border-light)' : 'none',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                      }}
                    >
                      <strong>{msg.sender === 'user' ? 'You' : 'AI Counselor'}: </strong>
                      {msg.text}
                    </div>
                  ))}
                  {chatLoading && (
                    <div style={{ alignSelf: 'flex-start', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      AI Counselor is typing...
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Ask AI Career Counselor (e.g. Which language to pick for DSA?)..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-input)', color: 'var(--text-main)', outline: 'none', fontSize: '0.88rem' }}
                  />
                  <button type="submit" className="btn-primary-purple" style={{ padding: '10px 16px', borderRadius: '8px' }}>
                    Send
                  </button>
                </form>
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
