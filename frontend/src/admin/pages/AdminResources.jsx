import React, { useState, useEffect } from 'react';
import '../AdminApp.css';

export default function AdminResources() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('interact_admin_token');
      const res = await fetch('http://localhost:5000/api/admin/resources', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const json = await res.json();
      if (json.success) setData(json.data);
      else setError('Failed to load data');
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('interact_admin_token');
      await fetch('http://localhost:5000/api/admin/resources/' + id, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      fetchData();
    } catch (err) {
      alert('Error deleting');
    }
  };

  if (loading) return <div className="admin-loading">Loading Resources...</div>;
  if (error) return <div className="admin-error-box">{error}</div>;

  return (
    <div className="admin-crud-page">
      <div className="admin-toolbar">
        <h2>Resources</h2>
        <button className="admin-btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add New'}
        </button>
      </div>

      {showForm && (
        <div className="admin-widget" style={{marginBottom: '24px'}}>
          <h3>Add New Resource</h3>
          <p>Full form editor will be launched here.</p>
        </div>
      )}

      {data.length === 0 ? (
        <div className="admin-empty-state">
          <h3>No resources yet</h3>
          <p>Create your first resource to start building.</p>
          <button className="admin-btn-primary" onClick={() => setShowForm(true)}>+ Add Resource</button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>TITLE</th><th>CATEGORY</th><th>TYPE</th><th>IS PUBLISHED</th><th>IS FEATURED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td>{item.title?.toString()}</td><td>{item.category?.toString()}</td><td>{item.type?.toString()}</td><td>{item.is_published?.toString()}</td><td>{item.is_featured?.toString()}</td>
                  <td>
                    <button className="admin-btn-small">Edit</button>
                    <button className="admin-btn-small admin-btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
