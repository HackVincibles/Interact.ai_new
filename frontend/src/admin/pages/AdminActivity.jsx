import React, { useState, useEffect } from 'react';
export default function AdminActivity() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('http://localhost:5000/api/admin/activity', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('interact_admin_token') }})
      .then(r => r.json()).then(d => { setData(d.data); setLoading(false); });
  }, []);
  if (loading) return <div>Loading...</div>;
  return (
    <div className="admin-crud-page">
      <div className="admin-toolbar"><h2>Admin Activity Logs</h2></div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead><tr><th>ADMIN</th><th>ACTION</th><th>ENTITY</th><th>ID</th><th>TIME</th></tr></thead>
          <tbody>
            {data.map(a => (
              <tr key={a.id}><td>{a.admin_username}</td><td>{a.action}</td><td>{a.entity}</td><td>{a.entity_id || '-'}</td><td>{new Date(a.created_at).toLocaleString()}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
