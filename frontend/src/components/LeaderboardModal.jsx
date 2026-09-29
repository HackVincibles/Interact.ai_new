import React, { useState } from 'react';
import { Trophy, Medal, Search, Filter, Globe, Building, Award, X, ExternalLink, Sparkles } from 'lucide-react';
import './LeaderboardModal.css';

export default function LeaderboardModal({ isOpen, onClose, currentUser, onSelectUserProfile }) {
  const [activeTab, setActiveTab] = useState('college'); // 'college' or 'global'
  const [searchQuery, setSearchQuery] = useState('');
  const [leaderboardList, setLeaderboardList] = useState([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/leaderboard?type=${activeTab}`);
        if (res.ok) {
          const data = await res.json();
          setLeaderboardList(data.leaderboard || []);
        }
      } catch (err) {
        console.warn('Leaderboard modal API error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const campusName = currentUser?.collegeName?.trim() ? currentUser.collegeName : 'Campus Cohort';
  const filteredList = leaderboardList.filter((item) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (item.college && item.college.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="leaderboard-overlay animate-fade-in">
      <div className="leaderboard-modal card-base">
        {/* Header */}
        <div className="leaderboard-header">
          <div className="header-title-group">
            <div className="trophy-circle">
              <Trophy size={24} className="trophy-gold" />
            </div>
            <div>
              <h2 className="leaderboard-heading">Real Student Leaderboard</h2>
              <p className="leaderboard-sub">
                {activeTab === 'college' 
                  ? `${campusName} Standings` 
                  : 'Global Registered Candidate Standings'}
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="leaderboard-controls-row">
          <div className="leaderboard-tabs">
            <button 
              className={`leader-tab ${activeTab === 'college' ? 'active' : ''}`}
              onClick={() => setActiveTab('college')}
            >
              <Building size={16} />
              <span>Campus Rank</span>
            </button>
            <button 
              className={`leader-tab ${activeTab === 'global' ? 'active' : ''}`}
              onClick={() => setActiveTab('global')}
            >
              <Globe size={16} />
              <span>Global Rank</span>
            </button>
          </div>

          <div className="search-filter-box">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search student or rank..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* User Current Position Banner */}
        <div className="user-position-banner">
          <div className="user-banner-left">
            <div className="student-avatar" style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--primary-gradient)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
              {(currentUser?.fullName || 'U').charAt(0)}
            </div>
            <div>
              <p className="banner-name">{currentUser?.fullName || 'Candidate'} (You)</p>
              <p className="banner-details">{currentUser?.branch || 'Department'} • Registered Candidate</p>
            </div>
          </div>
          <div className="user-banner-ranks">
            <div className="rank-badge-item">
              <span>Campus Position</span>
              <strong>{currentUser?.collegeRank || 'Unranked'}</strong>
            </div>
            <div className="rank-badge-item">
              <span>Global Position</span>
              <strong>{currentUser?.globalRank || 'Unranked'}</strong>
            </div>
          </div>
        </div>

        {(!currentUser?.collegeName || currentUser?.collegeRank === 'Unranked' || currentUser?.globalRank === 'Unranked') && (
          <p className="unranked-notice-text" style={{ color: '#f87171', fontSize: '0.88rem', textAlign: 'center', margin: '12px 0 4px 0', fontWeight: '500' }}>
            fill college details and complete profile to get ranked.
          </p>
        )}

        {/* Leaderboard Table */}
        <div className="table-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student</th>
                <th>{activeTab === 'college' ? 'Department' : 'College'}</th>
                <th>Points Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No registered candidates found on the leaderboard.
                  </td>
                </tr>
              ) : (
                filteredList.map((st) => (
                  <tr key={st.rank} className={st.isUser ? 'user-highlight-row' : ''}>
                    <td className="rank-cell">
                      {st.rank === 1 && <span className="medal-pill gold">🥇 #1</span>}
                      {st.rank === 2 && <span className="medal-pill silver">🥈 #2</span>}
                      {st.rank === 3 && <span className="medal-pill bronze">🥉 #3</span>}
                      {st.rank > 3 && <span className="rank-num">#{st.rank}</span>}
                    </td>
                    <td className="student-cell">
                      <div className="student-avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-gradient)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.8rem', marginRight: '8px' }}>
                        {(st.name || 'U').charAt(0)}
                      </div>
                      <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                        <div className="student-name-row">
                          <strong className="student-name">{st.name}</strong>
                          {st.badge && <span className="badge-tag">{st.badge}</span>}
                          {st.isUser && <span className="you-pill">YOU</span>}
                        </div>
                      </div>
                    </td>
                    <td className="dept-cell">{st.college || st.branch}</td>
                    <td className="points-cell">
                      <Sparkles size={14} className="sparkle-gold" />
                      <strong>{st.points} pts</strong>
                    </td>
                    <td className="action-cell">
                      <button 
                        className="view-profile-btn"
                        onClick={() => {
                          onSelectUserProfile && onSelectUserProfile(st);
                          onClose();
                        }}
                      >
                        <span>Public Profile</span>
                        <ExternalLink size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
