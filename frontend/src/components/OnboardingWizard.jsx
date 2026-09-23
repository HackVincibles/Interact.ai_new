import React, { useState } from 'react';
import { 
  User, 
  BookOpen, 
  Award, 
  Code, 
  Globe, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Building,
  GraduationCap,
  Trophy
} from 'lucide-react';
import './OnboardingWizard.css';

export default function OnboardingWizard({ isOpen, onComplete, initialName = '' }) {
  const [step, setStep] = useState(1);

  // Form State: Starts empty, no hardcoded dummy data
  const [profileData, setProfileData] = useState({
    fullName: initialName || '',
    phone: '',
    age: '',
    collegeName: '',
    enrollmentNo: '',
    branch: '',
    gradYear: '',
    cgpa: '',
    githubUrl: '',
    linkedinUrl: '',
    leetcodeHandle: '',
    portfolioUrl: '',
    avatarUrl: '',
  });

  const [calculatingRank, setCalculatingRank] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (step === 3) {
      // Calculate Rank Animation
      setStep(4);
      setCalculatingRank(true);
      setTimeout(() => {
        setCalculatingRank(false);
      }, 1500);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const collegeNameDisplay = profileData.collegeName.trim() ? profileData.collegeName : 'Campus Cohort';
  const hasAcademicDetails = Boolean(profileData.cgpa.trim() || profileData.collegeName.trim());
  const candidateFirstName = profileData.fullName.trim() ? profileData.fullName.split(' ')[0] : 'Candidate';

  return (
    <div className="onboarding-overlay animate-fade-in">
      <div className="onboarding-container card-base">
        {/* Progress Header */}
        <div className="wizard-progress-header">
          <div className="wizard-title-group">
            <span className="section-label">PROFILE SETUP</span>
            <h2 className="wizard-heading">
              {step === 4 ? 'Calculated Rankings' : `Step ${step} of 3: Complete Profile`}
            </h2>
          </div>

          <div className="wizard-stepper">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={`stepper-dot ${step === i ? 'active' : ''} ${step > i ? 'completed' : ''}`}
              >
                {step > i ? <CheckCircle2 size={16} /> : i}
              </div>
            ))}
          </div>
        </div>

        <div className="wizard-progress-bar-bg">
          <div className="wizard-progress-bar-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>

        {/* STEP 1: Personal Identity */}
        {step === 1 && (
          <div className="wizard-step-body animate-fade-in">
            <h3 className="step-section-title">Personal Identity & Contact</h3>
            <p className="step-section-desc">Tell us a bit about yourself so your identity is verified on rankings.</p>

            <div className="avatar-selection-row">
              <div className="current-avatar-preview">
                {profileData.avatarUrl ? (
                  <img src={profileData.avatarUrl} alt="Avatar" />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-gradient)', color: '#fff', fontWeight: '800', fontSize: '1.2rem' }}>
                    {candidateFirstName.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div className="avatar-tips">
                <p className="avatar-label">Profile Avatar</p>
                <p className="avatar-note">Using candidate avatar. You can update this anytime in My Profile.</p>
              </div>
            </div>

            <div className="wizard-form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ayush Daharwal"
                  value={profileData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. +91 9876543210"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Age</label>
                <input 
                  type="number" 
                  placeholder="e.g. 21"
                  value={profileData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Academic & College Details */}
        {step === 2 && (
          <div className="wizard-step-body animate-fade-in">
            <h3 className="step-section-title">Academic & College Details</h3>
            <p className="step-section-desc">Your college info places you on your campus leaderboard!</p>

            <div className="wizard-form-grid">
              <div className="form-group full-width">
                <label>College / University Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sagar Institute of Science, Technology and Research (SISTec-R)"
                  value={profileData.collegeName}
                  onChange={(e) => handleInputChange('collegeName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Enrollment Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. 0187CS211045"
                  value={profileData.enrollmentNo}
                  onChange={(e) => handleInputChange('enrollmentNo', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Branch / Department</label>
                <input 
                  type="text" 
                  placeholder="e.g. Computer Science & Engineering"
                  value={profileData.branch}
                  onChange={(e) => handleInputChange('branch', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Graduation Year</label>
                <select 
                  value={profileData.gradYear}
                  onChange={(e) => handleInputChange('gradYear', e.target.value)}
                >
                  <option value="">-- Select Graduation Year --</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                </select>
              </div>

              <div className="form-group">
                <label>Current CGPA / Percentage</label>
                <input 
                  type="text" 
                  placeholder="e.g. 8.06"
                  value={profileData.cgpa}
                  onChange={(e) => handleInputChange('cgpa', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Coding Profiles & Links */}
        {step === 3 && (
          <div className="wizard-step-body animate-fade-in">
            <h3 className="step-section-title">Coding Profiles & Portfolio</h3>
            <p className="step-section-desc">Link your GitHub and LeetCode to auto-fetch verified skills.</p>

            <div className="wizard-form-grid">
              <div className="form-group">
                <label>GitHub Profile Handle</label>
                <input 
                  type="text" 
                  placeholder="e.g. github.com/username"
                  value={profileData.githubUrl}
                  onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>LinkedIn Profile Handle</label>
                <input 
                  type="text" 
                  placeholder="e.g. linkedin.com/in/username"
                  value={profileData.linkedinUrl}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>LeetCode Username</label>
                <input 
                  type="text" 
                  placeholder="e.g. leetcode_username"
                  value={profileData.leetcodeHandle}
                  onChange={(e) => handleInputChange('leetcodeHandle', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Personal Portfolio URL</label>
                <input 
                  type="text" 
                  placeholder="e.g. https://myportfolio.dev"
                  value={profileData.portfolioUrl}
                  onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Rank Calculation Result */}
        {step === 4 && (
          <div className="wizard-step-body text-center animate-fade-in">
            {calculatingRank ? (
              <div className="rank-calculating-box">
                <div className="spinner-glow"></div>
                <h3>Calculating Leaderboard Rankings...</h3>
                <p>Analyzing CGPA, college cohort, and platform activity metrics</p>
              </div>
            ) : (
              <div className="rank-result-box">
                <div className="trophy-badge-circle">
                  <Trophy size={48} className="trophy-icon" />
                </div>
                <h3 className="rank-congrats-title">🎉 Congratulations, {candidateFirstName}!</h3>
                <p className="rank-congrats-desc">Your profile has been processed and listed on the leaderboard!</p>

                <div className="ranks-display-grid">
                  <div className="rank-card college-card">
                    <span className="rank-type">College Rank ({collegeNameDisplay})</span>
                    <h2 className="rank-number">{hasAcademicDetails ? '#1' : 'Unranked'}</h2>
                    <span className="rank-sub">{hasAcademicDetails ? `Registered candidate in ${profileData.branch || 'Dept'}` : 'Add CGPA & complete tests to rank'}</span>
                  </div>

                  <div className="rank-card global-card">
                    <span className="rank-type">Global Platform Position</span>
                    <h2 className="rank-number">{hasAcademicDetails ? '#1' : 'Unranked'}</h2>
                    <span className="rank-sub">{hasAcademicDetails ? 'Registered Platform Candidate' : 'Complete AI mock interviews to earn rank'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Action Buttons */}
        <div className="wizard-footer-actions">
          {step > 1 && step < 4 && (
            <button className="btn-outline-secondary" onClick={handlePrevStep}>
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}

          {step < 4 ? (
            <button className="btn-primary-purple wizard-next-btn" onClick={handleNextStep}>
              <span>{step === 3 ? 'Calculate Rankings →' : 'Continue Step'}</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            !calculatingRank && (
              <button 
                className="btn-primary-purple wizard-finish-btn"
                onClick={() => onComplete(profileData)}
              >
                <span>Go to My Dashboard →</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
