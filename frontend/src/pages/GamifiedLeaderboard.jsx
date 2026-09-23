import React, { useState } from 'react';
import { 
  Trophy, 
  Building, 
  Globe, 
  Search, 
  Filter, 
  Award, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  ExternalLink, 
  Medal, 
  CheckCircle2, 
  User 
} from 'lucide-react';
import './GamifiedLeaderboard.css';

export default function GamifiedLeaderboard({ currentUser, onSelectUserProfile }) {
  const [activeTab, setActiveTab] = useState('college'); // 'college' or 'global'
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [leaderboardList, setLeaderboardList] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/leaderboard?type=${activeTab}`);
        if (res.ok) {
          const data = await res.json();
          setLeaderboardList(data.leaderboard || []);
        }
      } catch (err) {
        console.warn('Leaderboard API fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [activeTab]);

  const campusName = currentUser?.collegeName?.trim() ? currentUser.collegeName : 'Campus Cohort';
  const filteredList = leaderboardList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.college && item.college.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const top3 = filteredList.slice(0, 3);

  return (
    <div className="gamified-leaderboard-root animate-fade-in">
      {/* Header Banner */}
      <section className="leaderboard-hero-banner">
        <div className="container">
          <div className="hero-banner-card">
            <div className="banner-text-content">
              <span className="section-label">GAMIFIED LEADERBOARD</span>
              <h1 className="banner-title">
                Campus & Global <span className="purple-gradient-text">Hall of Fame</span>
              </h1>
              <p className="banner-subtitle">
                Compete with real registered peers from your campus and institutions nationwide. Earn points by completing AI mock interviews and verifying skills!
              </p>

              {/* User Rank Summary Chips */}
              <div className="user-rank-chips-row">
                <div className="rank-chip college">
                  <Building size={16} />
                  <span>{campusName}: <strong>{currentUser?.collegeRank || 'Unranked'}</strong></span>
                </div>
                <div className="rank-chip global">
                  <Globe size={16} />
                  <span>Global Position: <strong>{currentUser?.globalRank || 'Unranked'}</strong></span>
                </div>
                <div className="rank-chip points">
                  <Sparkles size={16} className="sparkle-icon" />
                  <span>Total Registered: <strong>{leaderboardList.length} Students</strong></span>
                </div>
              </div>
            </div>

            <div className="banner-graphic">
              <div className="trophy-3d-glow">
                <Trophy size={80} className="trophy-hero-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Container */}
      <section className="leaderboard-workspace-section">
        <div className="container">
          {/* Top Control Bar: Tabs & Search Filters */}
          <div className="leaderboard-nav-bar card-base">
            <div className="tab-switcher-group">
              <button 
                className={`leaderboard-tab-btn ${activeTab === 'college' ? 'active' : ''}`}
                onClick={() => setActiveTab('college')}
              >
                <Building size={18} />
                <span>Campus Cohort ({campusName})</span>
              </button>
              <button 
                className={`leaderboard-tab-btn ${activeTab === 'global' ? 'active' : ''}`}
                onClick={() => setActiveTab('global')}
              >
                <Globe size={18} />
                <span>Global Standings</span>
              </button>
            </div>

            <div className="filters-group">
              <div className="search-input-wrapper">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search candidate by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select 
                className="filter-select"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="all">All Departments</option>
                <option value="cse">Computer Science (CSE)</option>
                <option value="it">Information Tech (IT)</option>
                <option value="ece">Electronics (ECE)</option>
              </select>
            </div>
          </div>

          {/* Top 3 Podium Showcase */}
          <div className="podium-showcase-grid">
            {/* Rank 2 (Silver) */}
            {top3[1] && (
              <div className="podium-card silver card-base">
                <div className="podium-rank-badge silver">2</div>
                <div className="podium-avatar-wrapper">
                  <img src={top3[1].avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"} alt={top3[1].name} />
                  <span className="medal-icon silver">🥈</span>
                </div>
                <h3 className="podium-name">{top3[1].name}</h3>
                <p className="podium-sub">{top3[1].college || top3[1].branch}</p>
                <div className="podium-points-tag">{top3[1].points} pts</div>
                <span className="podium-badge-pill">{top3[1].badge || '🥈 Rank 2'}</span>
              </div>
            )}

            {/* Rank 1 (Gold) */}
            {top3[0] && (
              <div className="podium-card gold card-base champion">
                <div className="crown-glow">👑</div>
                <div className="podium-rank-badge gold">1</div>
                <div className="podium-avatar-wrapper gold-ring">
                  <img src={top3[0].avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"} alt={top3[0].name} />
                  <span className="medal-icon gold">🥇</span>
                </div>
                <h3 className="podium-name">{top3[0].name}</h3>
                <p className="podium-sub">{top3[0].college || top3[0].branch}</p>
                <div className="podium-points-tag gold-bg">{top3[0].points} pts</div>
                <span className="podium-badge-pill gold-pill">{top3[0].badge || '👑 Rank 1'}</span>
              </div>
            )}

            {/* Rank 3 (Bronze) */}
            {top3[2] && (
              <div className="podium-card bronze card-base">
                <div className="podium-rank-badge bronze">3</div>
                <div className="podium-avatar-wrapper">
                  <img src={top3[2].avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"} alt={top3[2].name} />
                  <span className="medal-icon bronze">🥉</span>
                </div>
                <h3 className="podium-name">{top3[2].name}</h3>
                <p className="podium-sub">{top3[2].college || top3[2].branch}</p>
                <div className="podium-points-tag">{top3[2].points} pts</div>
                <span className="podium-badge-pill">{top3[2].badge || '🥉 Rank 3'}</span>
              </div>
            )}
          </div>

          {/* Leaderboard Table List */}
          <div className="leaderboard-table-card card-base">
            <table className="main-rankings-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Candidate</th>
                  <th>{activeTab === 'college' ? 'Branch / Batch' : 'Institution'}</th>
                  <th>CGPA</th>
                  <th>Points</th>
                  <th>Public Profile</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No registered candidates on the leaderboard yet. Be the first to build points!
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => (
                  <tr key={item.rank} className={item.isUser ? 'highlight-user-row' : ''}>
                    <td className="rank-trend-cell">
                      <div className="rank-display">
                        <span className="rank-number-text">#{item.rank}</span>
                        {item.change && item.change.startsWith('+') && (
                          <span className="trend-up" title="Ranked up!"><TrendingUp size={14} /> {item.change}</span>
                        )}
                        {item.change && item.change.startsWith('-') && (
                          <span className="trend-down" title="Rank dropped"><TrendingDown size={14} /> {item.change}</span>
                        )}
                      </div>
                    </td>

                    <td className="candidate-cell">
                      <img src={item.avatar} alt={item.name} className="candidate-avatar" />
                      <div>
                        <div className="candidate-name-row">
                          <strong className="candidate-name">{item.name}</strong>
                          {item.isUser && <span className="you-badge">YOU</span>}
                          {item.badge && <span className="special-badge">{item.badge}</span>}
                        </div>
                        <span className="candidate-sub">{item.branch}</span>
                      </div>
                    </td>

                    <td className="institution-cell">
                      {item.college || item.branch}
                    </td>

                    <td className="streak-cell">
                      {item.streak ? (
                        <div className="streak-pill">
                          <Flame size={14} className="flame-icon" />
                          <span>{item.streak}</span>
                        </div>
                      ) : (
                        <span className="no-streak">—</span>
                      )}
                    </td>

                    <td className="skills-cell">
                      <div className="skills-pills-wrap">
                        {item.skills?.map((sk, i) => (
                          <span key={i} className="sk-pill">{sk}</span>
                        ))}
                      </div>
                    </td>

                    <td className="points-cell">
                      <Sparkles size={14} className="sparkle-gold" />
                      <strong>{item.points} pts</strong>
                    </td>

                    <td className="action-cell">
                      <button 
                        className="btn-outline-secondary profile-link-btn"
                        onClick={() => onSelectUserProfile && onSelectUserProfile(item)}
                      >
                        <span>View Profile</span>
                        <ExternalLink size={13} />
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
