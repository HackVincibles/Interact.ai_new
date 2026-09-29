import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Search, 
  Award, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  ExternalLink,
  ChevronRight,
  User,
  Star
} from 'lucide-react';
import API_BASE_URL from '../config/api';

export default function GamifiedLeaderboard({ currentUser, onSelectUserProfile }) {
  const [activeTab, setActiveTab] = useState('all-time'); // 'weekly' or 'all-time'
  const [searchQuery, setSearchQuery] = useState('');
  const [leaderboardList, setLeaderboardList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Derive level/title based on XP
  const getRankTitle = (xp) => {
    if (xp >= 5000) return 'Career Champion';
    if (xp >= 3000) return 'Skilled Candidate';
    if (xp >= 1500) return 'Rising Developer';
    if (xp >= 500) return 'Explorer';
    return 'Beginner';
  };

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        // Defaulting to all-time database ranking for now
        const res = await fetch(`${API_BASE_URL}/api/leaderboard?type=global`);
        if (res.ok) {
          const data = await res.json();
          // Assuming backend returns points as string like '5,240'
          let list = data.leaderboard || [];
          
          // Inject dummy avatars if not present, but use real names & XP
          list = list.map(item => ({
            ...item,
            pointsNum: parseInt(item.points.replace(/,/g, '') || '0'),
            avatar: item.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name.split(' ')[0]}&backgroundColor=b6e3f4`,
            title: getRankTitle(parseInt(item.points.replace(/,/g, '') || '0'))
          }));

          setLeaderboardList(list);
        }
      } catch (err) {
        console.warn('Leaderboard API fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [activeTab]);

  const filteredList = leaderboardList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const top3 = filteredList.slice(0, 3);
  const others = filteredList.slice(3);

  // Current User Context (mocked for Progress panel based on real leaderboard if possible)
  const myRank = leaderboardList.find(u => u.email === currentUser?.email) || {
    rank: leaderboardList.length + 1,
    pointsNum: 0,
    points: '0',
    title: 'Beginner',
    name: currentUser?.fullName || 'Candidate',
    avatar: currentUser?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User&backgroundColor=c0aede'
  };

  const nextRank = myRank.rank > 1 ? leaderboardList[myRank.rank - 2] : null;
  const xpNeeded = nextRank ? (nextRank.pointsNum - myRank.pointsNum) : 0;
  const progressPercent = nextRank ? Math.min(100, Math.max(0, (myRank.pointsNum / nextRank.pointsNum) * 100)) : 100;

  return (
    <div className="gamified-leaderboard-root animate-fade-in">
      <div className="gamified-container">
        
        {/* LEFT COLUMN: LEADERBOARD MAIN */}
        <div className="leaderboard-main-col">
          
          {/* Header & Switcher */}
          <div className="gamified-header-bar card-base">
            <div className="tab-switcher">
              <button 
                className={`gamified-tab-btn ${activeTab === 'weekly' ? 'active' : ''}`}
                onClick={() => setActiveTab('weekly')}
              >
                Weekly
              </button>
              <button 
                className={`gamified-tab-btn ${activeTab === 'all-time' ? 'active' : ''}`}
                onClick={() => setActiveTab('all-time')}
              >
                All Time
              </button>
            </div>
            
            <div className="my-rank-quick">
              <span>My Rank</span>
              <div className="my-rank-badge">#{myRank.rank}</div>
            </div>
          </div>

          {/* PODIUM AREA */}
          <div className="gamified-podium-area card-base">
            
            {top3[1] && (
              <div className="podium-pillar silver-pillar">
                <div className="podium-avatar-box">
                  <img src={top3[1].avatar} alt={top3[1].name} />
                  <div className="rank-circle silver">2</div>
                </div>
                <div className="podium-info">
                  <h4>{top3[1].name.split(' ')[0]}</h4>
                  <p className="podium-xp">{top3[1].points} XP</p>
                </div>
                <div className="pillar-block silver-block"></div>
              </div>
            )}

            {top3[0] && (
              <div className="podium-pillar gold-pillar">
                <div className="podium-avatar-box">
                  <div className="crown-icon">👑</div>
                  <img src={top3[0].avatar} alt={top3[0].name} className="gold-avatar" />
                  <div className="rank-circle gold">1</div>
                </div>
                <div className="podium-info">
                  <h4>{top3[0].name.split(' ')[0]}</h4>
                  <p className="podium-xp">{top3[0].points} XP</p>
                </div>
                <div className="pillar-block gold-block"></div>
              </div>
            )}

            {top3[2] && (
              <div className="podium-pillar bronze-pillar">
                <div className="podium-avatar-box">
                  <img src={top3[2].avatar} alt={top3[2].name} />
                  <div className="rank-circle bronze">3</div>
                </div>
                <div className="podium-info">
                  <h4>{top3[2].name.split(' ')[0]}</h4>
                  <p className="podium-xp">{top3[2].points} XP</p>
                </div>
                <div className="pillar-block bronze-block"></div>
              </div>
            )}
            
          </div>

          {/* RANKINGS LIST */}
          <div className="gamified-rankings-list card-base">
            <div className="rankings-list-header">
              <h3>Rankings</h3>
              <div className="search-box">
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Search competitor..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="rankings-list-body">
              {others.length === 0 ? (
                <div className="empty-rankings">No other competitors found.</div>
              ) : (
                others.map(item => (
                  <div key={item.rank} className={`ranking-row ${item.email === currentUser?.email ? 'is-me' : ''}`}>
                    <div className="rank-num">#{item.rank}</div>
                    <div className="rank-avatar">
                      <img src={item.avatar} alt="avatar" />
                    </div>
                    <div className="rank-details">
                      <strong>{item.name}</strong>
                      <span className="rank-title-sub">{item.title}</span>
                    </div>
                    <div className="rank-xp">
                      {item.points} XP
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: PROGRESS PANEL */}
        <div className="leaderboard-side-col">
          
          <div className="progress-panel card-base">
            <h3 className="panel-title">Your Progress</h3>
            
            <div className="progress-avatar-wrap">
              <img src={myRank.avatar} alt="My Avatar" />
              <div className="progress-level-badge">{myRank.title}</div>
            </div>
            
            <h2 className="progress-name">{myRank.name}</h2>
            <div className="progress-rank-highlight">Rank #{myRank.rank}</div>
            
            {(!currentUser?.collegeName || currentUser?.collegeRank === 'Unranked' || currentUser?.globalRank === 'Unranked' || myRank.rank === 'Unranked') && (
              <p className="unranked-notice-text" style={{ color: '#f87171', fontSize: '0.85rem', textAlign: 'center', margin: '10px 0', fontWeight: '500' }}>
                fill college details and complete profile to get ranked.
              </p>
            )}
            
            <div className="progress-xp-total">
              <Sparkles size={18} className="gold-sparkle" />
              <span><strong>{myRank.points}</strong> Total XP</span>
            </div>

            {nextRank ? (
              <div className="progress-bar-section">
                <div className="progress-bar-labels">
                  <span>Current</span>
                  <span>#{nextRank.rank} {nextRank.name.split(' ')[0]}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <div className="progress-hint">
                  {xpNeeded.toLocaleString()} XP to reach Rank #{nextRank.rank}
                </div>
              </div>
            ) : (
              <div className="progress-bar-section">
                <div className="progress-hint" style={{ textAlign: 'center', color: '#fbbf24' }}>
                  You are the #1 Champion! 🏆
                </div>
              </div>
            )}

            <hr className="panel-divider" />

            <div className="achievements-mini">
              <h4>Recent Achievements</h4>
              <div className="achievement-item">
                <div className="ach-icon"><Flame size={16} color="#ef4444" /></div>
                <div className="ach-text">Interview Streak (3 days)</div>
              </div>
              <div className="achievement-item">
                <div className="ach-icon"><Award size={16} color="#3b82f6" /></div>
                <div className="ach-text">Profile Verified</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
