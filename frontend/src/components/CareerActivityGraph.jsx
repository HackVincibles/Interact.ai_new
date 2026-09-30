import React, { useState, useEffect } from 'react';
import { Calendar, Flame, Trophy, Sparkles, TrendingUp, Info } from 'lucide-react';
import './CareerActivityGraph.css';
import API_BASE_URL from '../config/api';

export default function CareerActivityGraph({ currentUser, customHistory }) {
  const [activityMap, setActivityMap] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [activeDaysCount, setActiveDaysCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivityData() {
      try {
        setLoading(true);
        let records = customHistory || [];

        if (!customHistory) {
          const res = await fetch(`${API_BASE_URL}/api/interview/history?userId=` + (currentUser?.id || 1))
            .catch(() => null);
          if (res && res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.history)) {
              records = data.history;
            }
          }
        }

        // Aggregate sessions by YYYY-MM-DD date string
        const counts = {};
        let total = 0;

        records.forEach(item => {
          const dateStr = item.created_at || item.createdAt || new Date().toISOString();
          const dateKey = dateStr.split('T')[0];
          counts[dateKey] = (counts[dateKey] || 0) + 1;
          total += 1;
        });

        // Also check localStorage for local offline practice sessions
        try {
          const localSaved = localStorage.getItem(`interact_practice_history_${currentUser?.email}`);
          if (localSaved) {
            const parsed = JSON.parse(localSaved);
            if (Array.isArray(parsed)) {
              parsed.forEach(item => {
                const dateKey = (item.date || new Date().toISOString()).split('T')[0];
                counts[dateKey] = (counts[dateKey] || 0) + 1;
                total += 1;
              });
            }
          }
        } catch (e) {}

        setActivityMap(counts);
        setTotalCount(total);
        setActiveDaysCount(Object.keys(counts).length);

        // Calculate Streaks
        const sortedDates = Object.keys(counts).sort();
        let curStreak = 0;
        let maxStreak = 0;

        const today = new Date();
        for (let i = 0; i < 365; i++) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const key = d.toISOString().split('T')[0];

          if (counts[key]) {
            curStreak += 1;
            if (curStreak > maxStreak) maxStreak = curStreak;
          } else if (i > 0) {
            // Break streak if a day is missed (except for today if user hasn't practiced yet today)
            if (i === 1 && !counts[today.toISOString().split('T')[0]]) {
              // Streak can continue from yesterday if today is not over yet
            } else {
              break;
            }
          }
        }

        setCurrentStreak(curStreak);
        setLongestStreak(maxStreak);

      } catch (err) {
        console.warn('Activity graph data notice:', err);
      } finally {
        setLoading(false);
      }
    }

    loadActivityData();
  }, [currentUser, customHistory]);

  // Generate 52 weeks of dates ending today
  const generateWeeksData = () => {
    const weeks = [];
    const today = new Date();
    
    // Find nearest past Sunday for column alignment
    const endDate = new Date(today);
    const dayOfWeek = endDate.getDay();
    
    // Total 52 weeks * 7 days = 364 days
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - (51 * 7 + dayOfWeek));

    let currentDate = new Date(startDate);

    for (let w = 0; w < 52; w++) {
      const weekDays = [];
      for (let d = 0; d < 7; d++) {
        const dateKey = currentDate.toISOString().split('T')[0];
        const count = activityMap[dateKey] || 0;
        
        // Intensity Level 0 - 4
        let level = 0;
        if (count === 1) level = 1;
        else if (count === 2) level = 2;
        else if (count >= 3 && count <= 4) level = 3;
        else if (count >= 5) level = 4;

        weekDays.push({
          date: new Date(currentDate),
          dateKey,
          count,
          level
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(weekDays);
    }

    return weeks;
  };

  const weeksData = generateWeeksData();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="career-graph-card card-base animate-fade-in">
      {/* Header */}
      <div className="graph-header">
        <div className="graph-title-area">
          <h3 className="graph-title">
            <Calendar size={18} color="var(--primary-purple)" />
            Career Readiness Activity
          </h3>
          <p className="graph-subtitle">
            Visualizing your daily career preparation, AI mock interviews, and practice assessments
          </p>
        </div>

        <div className="graph-stats-row">
          <div className="graph-stat-badge">
            <Sparkles size={14} className="sparkle-gold" />
            <span>Total Practices: <strong>{totalCount}</strong></span>
          </div>

          <div className="graph-stat-badge">
            <Flame size={14} color="#ef4444" />
            <span>Current Streak: <strong>{currentStreak} days</strong></span>
          </div>

          <div className="graph-stat-badge">
            <Trophy size={14} color="#fbbf24" />
            <span>Active Days: <strong>{activeDaysCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Grid Wrapper */}
      <div className="graph-grid-wrapper">
        <div className="graph-calendar-container">
          
          {/* Month Labels */}
          <div className="graph-months-row">
            {months.map((m, idx) => (
              <span key={idx} className="graph-month-label">{m}</span>
            ))}
          </div>

          {/* Days & Weeks Grid */}
          <div className="graph-days-and-grid">
            <div className="graph-day-labels">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            <div className="graph-weeks-grid">
              {weeksData.map((week, wIdx) => (
                <div key={wIdx} className="graph-week-col">
                  {week.map((day, dIdx) => (
                    <div 
                      key={dIdx} 
                      className="graph-cell"
                      data-level={day.level}
                    >
                      <div className="graph-cell-tooltip">
                        {day.count === 0 
                          ? `No activity on ${day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                          : `${day.count} practice ${day.count === 1 ? 'activity' : 'activities'} on ${day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Footer Legend */}
      <div className="graph-footer">
        <span>Learn & practice regularly to maintain your career readiness streak</span>

        <div className="graph-legend">
          <span>Less</span>
          <div className="legend-cells">
            <div className="graph-cell" data-level="0" />
            <div className="graph-cell" data-level="1" />
            <div className="graph-cell" data-level="2" />
            <div className="graph-cell" data-level="3" />
            <div className="graph-cell" data-level="4" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Zero Activity Notice */}
      {totalCount === 0 && !loading && (
        <div className="empty-activity-notice">
          <Info size={16} color="var(--primary-purple)" />
          <span>No practice activity recorded yet. Complete your first mock interview, aptitude test, or practice round to start building your career activity streak!</span>
        </div>
      )}
    </div>
  );
}
