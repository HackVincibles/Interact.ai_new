import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import GamifiedLeaderboard from './pages/GamifiedLeaderboard';
import ProfilePage from './pages/ProfilePage';
import CareerPathsPage from './pages/CareerPathsPage';
import CoursesPage from './pages/CoursesPage';
import InternshipsPage from './pages/InternshipsPage';
import JobsPage from './pages/JobsPage';
import ResumeStudioPage from './pages/ResumeStudioPage';
import MockInterviewPage from './pages/MockInterviewPage';
import NotificationsPage from './pages/NotificationsPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';
import ErrorPage from './pages/ErrorPage';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';
import OnboardingWizard from './components/OnboardingWizard';
import LeaderboardModal from './components/LeaderboardModal';
import AuthGuard from './components/AuthGuard';
import { NotificationProvider } from './context/NotificationContext';
import { auth, logOut as firebaseLogOut } from './services/firebase';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [verificationIdToVerify, setVerificationIdToVerify] = useState(null);
  
  // Strict Auth State: Default false (No dummy data when unauthenticated)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('interact_is_logged_in') === 'true';
  });
  
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('interact_user_role') || 'student';
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Student Profile: null when unauthenticated
  const [studentProfile, setStudentProfile] = useState(() => {
    const saved = localStorage.getItem('interact_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('interact_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('interact_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Save auth state changes to localStorage
  useEffect(() => {
    localStorage.setItem('interact_is_logged_in', isLoggedIn);
    localStorage.setItem('interact_user_role', userRole);
    if (studentProfile) {
      localStorage.setItem('interact_user_profile', JSON.stringify(studentProfile));
    } else {
      localStorage.removeItem('interact_user_profile');
    }
  }, [isLoggedIn, userRole, studentProfile]);

  useEffect(() => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    
    if (path.startsWith('/verify/')) {
      const vid = path.split('/verify/')[1];
      if (vid) {
        setVerificationIdToVerify(vid);
        setActiveTab('verify');
      }
    } else if (searchParams.has('gd_join')) {
      setActiveTab('mock-interviews');
    }
  }, []);

  // Firebase Auth listener - proven working with Google OAuth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('[AUTH] event: onAuthStateChanged');
      console.log('[AUTH] has user:', !!user);

      if (user) {
        const email = user.email || '';
        const fullName = user.displayName || email.split('@')[0] || 'Google Candidate';
        console.log('[AUTH] provider:', user.providerData?.[0]?.providerId || 'unknown');
        console.log('[AUTH] app status: AUTHENTICATED');

        setStudentProfile(prev => {
          if (prev && prev.email === email) return prev;
          return {
            fullName,
            email,
            collegeName: '',
            branch: '',
            collegeRank: 'Unranked',
            globalRank: 'Unranked',
            cgpa: '',
          };
        });
        setUserRole('student');
        setIsLoggedIn(true);
        localStorage.setItem('interact_is_logged_in', 'true');
      } else {
        console.log('[AUTH] app status: UNAUTHENTICATED');
        localStorage.removeItem('interact_is_logged_in');
        localStorage.removeItem('interact_user_profile');
        localStorage.removeItem('interact_user_role');
        setIsLoggedIn(false);
        setStudentProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterSuccess = (profileData) => {
    const newProfile = {
      fullName: profileData.fullName || profileData.email?.split('@')[0] || 'Registered Student',
      email: profileData.email || '',
      collegeName: profileData.collegeName || '',
      branch: profileData.branch || '',
      collegeRank: profileData.collegeRank || 'Unranked',
      globalRank: profileData.globalRank || 'Unranked',
      cgpa: profileData.cgpa || '',
    };
    setStudentProfile(newProfile);
    setIsLoggedIn(true);
    setUserRole('student');
    setIsOnboardingOpen(true);
  };

  const handleLoginSuccess = (userData) => {
    if (userData.role === 'admin' || userData.isAdmin) {
      setUserRole('admin');
      setIsLoggedIn(true);
      setActiveTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const loadedProfile = {
      fullName: userData.fullName || userData.email?.split('@')[0] || 'Registered Student',
      email: userData.email || '',
      collegeName: userData.collegeName || '',
      branch: userData.branch || '',
      collegeRank: userData.collegeRank || 'Unranked',
      globalRank: userData.globalRank || 'Unranked',
      cgpa: userData.cgpa || '',
    };

    setStudentProfile(loadedProfile);
    setUserRole('student');
    setIsLoggedIn(true);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOnboardingComplete = (completedProfile) => {
    setIsOnboardingOpen(false);
    setStudentProfile((prev) => ({
      ...prev,
      ...completedProfile,
    }));
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('student');
    setStudentProfile(null);
    localStorage.removeItem('interact_is_logged_in');
    localStorage.removeItem('interact_user_role');
    localStorage.removeItem('interact_user_profile');
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NotificationProvider>
    <div className="app-root">
      {/* Hide Navbar during dedicated full-page auth screens */}
      {activeTab !== 'register' && activeTab !== 'login' && (
        <Navbar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          isLoggedIn={isLoggedIn}
          currentUser={studentProfile}
          onGetStartedClick={() => handleTabChange('register')}
          onLogoutClick={handleLogout}
          onOpenLeaderboard={() => handleTabChange('leaderboard')}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* Main Router View */}
      <main className="app-main-content">
        {/* Full Page Registration View */}
        {activeTab === 'register' && (
          <RegisterPage 
            onNavigate={handleTabChange}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}

        {/* Full Page Login View */}
        {activeTab === 'login' && (
          <LoginPage 
            onNavigate={handleTabChange}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {/* Home View (2-Page Concept: Landing vs Home) */}
        {activeTab === 'home' && (
          isLoggedIn ? (
            /* Logged-In Candidate Home Dashboard (Image 2) */
            <HomePage 
              onNavigate={handleTabChange}
            />
          ) : (
            /* Unregistered Guest Landing Page (Image 1) */
            <LandingPage 
              onGetStarted={() => handleTabChange('register')}
              onNavigate={handleTabChange}
            />
          )
        )}

        {activeTab === 'verify' && verificationIdToVerify && (
           <VerifyCertificatePage verificationId={verificationIdToVerify} onNavigate={handleTabChange} />
        )}

        {/* Public Modules */}
        {activeTab === 'career-paths' && <CareerPathsPage onNavigate={handleTabChange} />}
        {activeTab === 'courses' && <CoursesPage onNavigate={handleTabChange} />}

        {/* Protected Feature: Gamified Leaderboard */}
        {activeTab === 'leaderboard' && (
          isLoggedIn ? (
            <GamifiedLeaderboard 
              currentUser={studentProfile}
              onSelectUserProfile={(user) => alert(`Viewing public profile for ${user.name}`)}
            />
          ) : (
            <AuthGuard featureTitle="Gamified Leaderboard & Ranks" onNavigate={handleTabChange} />
          )
        )}

        {/* Protected Feature: Student Profile */}
        {activeTab === 'profile' && (
          isLoggedIn ? (
            <ProfilePage 
              currentUser={studentProfile}
              onNavigate={handleTabChange}
            />
          ) : (
            <AuthGuard featureTitle="Student Profile Dashboard" onNavigate={handleTabChange} />
          )
        )}

        {/* Protected Feature: Internships Hub */}
        {activeTab === 'internships' && (
          isLoggedIn ? (
            <InternshipsPage 
              currentUser={studentProfile}
              onNavigate={handleTabChange}
            />
          ) : (
            <AuthGuard featureTitle="Internships Matcher & Web Scanner" onNavigate={handleTabChange} />
          )
        )}

        {/* Protected Feature: Full-Time Jobs Hub */}
        {activeTab === 'jobs' && (
          isLoggedIn ? (
            <JobsPage 
              currentUser={studentProfile}
              onNavigate={handleTabChange}
            />
          ) : (
            <AuthGuard featureTitle="Full-Time Jobs Matcher & Web Scanner" onNavigate={handleTabChange} />
          )
        )}

        {/* Protected Feature: Resume Studio */}
        {(activeTab === 'resources' || activeTab === 'resume-studio') && (
          isLoggedIn ? (
            <ResumeStudioPage 
              currentUser={studentProfile}
              onNavigate={handleTabChange}
            />
          ) : (
            <AuthGuard featureTitle="AI Resume Studio & ATS Scanner" onNavigate={handleTabChange} />
          )
        )}

        {/* Protected Feature: AI Mock Interview Simulator */}
        {activeTab === 'mock-interviews' && (
          isLoggedIn ? (
            <MockInterviewPage 
              currentUser={studentProfile}
              onNavigate={handleTabChange}
              onInterviewStateChange={setIsInterviewActive}
            />
          ) : (
            <AuthGuard featureTitle="AI Mock Interview Simulator & IDE" onNavigate={handleTabChange} />
          )
        )}

        {/* Protected Feature: Notifications Center */}
        {activeTab === 'notifications' && (
          isLoggedIn ? (
            <NotificationsPage 
              onNavigate={handleTabChange}
            />
          ) : (
            <AuthGuard featureTitle="Notification Center" onNavigate={handleTabChange} />
          )
        )}

        {/* Catch-all: 404 for any unknown tab */}
        {![
          'home', 'register', 'login', 'career-paths', 'courses',
          'internships', 'jobs', 'resources', 'resume-studio',
          'mock-interviews', 'leaderboard', 'profile', 'notifications',
          'verify',
        ].includes(activeTab) && (
          <ErrorPage code={404} onNavigate={handleTabChange} />
        )}
      </main>

      {/* Footer (Hidden on dedicated full-page auth screens and active interviews) */}
      {activeTab !== 'register' && activeTab !== 'login' && !isInterviewActive && (
        <Footer 
          onTabChange={handleTabChange} 
          onAdminLoginClick={() => handleTabChange('login')}
        />
      )}

      {/* Floating Chatbot Widget in Bottom-Right Corner */}
      <ChatbotWidget 
        isHidden={isInterviewActive || activeTab === 'register' || activeTab === 'login'} 
        onNavigate={handleTabChange}
      />

      {/* Student Onboarding Wizard */}
      <OnboardingWizard 
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
        initialName={studentProfile?.fullName || ''}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal 
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentUser={studentProfile}
        onSelectUserProfile={(user) => alert(`Viewing public profile for ${user.name}`)}
      />
    </div>
    </NotificationProvider>
  );
}
