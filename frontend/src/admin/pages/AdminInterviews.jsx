import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../config/api';

export default function AdminInterviews() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/interviews`, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('interact_admin_token') }})
      .then(r => r.json()).then(d => { setData(d.data); setLoading(false); });
  }, []);
  if (loading) return <div>Loading...</div>;
  return (
    <div className="admin-crud-page">
      <div className="admin-toolbar"><h2>Interview Management</h2></div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead><tr><th>ID</th><th>CANDIDATE</th><th>ROLE</th><th>SCORE</th><th>ACTIONS</th></tr></thead>
          <tbody>
            {data.map(i => (
              <tr key={i.id}><td>{i.id}</td><td>{i.candidate_name}</td><td>{i.target_role}</td><td>{i.score}</td><td><button className="admin-btn-small">View Report</button></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
