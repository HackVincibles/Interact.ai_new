import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../config/api';

export default function AdminStudents() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/students`, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('interact_admin_token') }})
      .then(r => r.json()).then(d => { setData(d.data); setLoading(false); });
  }, []);
  if (loading) return <div>Loading...</div>;
  return (
    <div className="admin-crud-page">
      <div className="admin-toolbar"><h2>Students Management</h2></div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead><tr><th>ID</th><th>NAME</th><th>EMAIL</th><th>COLLEGE</th><th>ACTIONS</th></tr></thead>
          <tbody>
            {data.map(u => (
              <tr key={u.id}><td>{u.id}</td><td>{u.full_name}</td><td>{u.email}</td><td>{u.college_name}</td><td><button className="admin-btn-small">View Profile</button></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
