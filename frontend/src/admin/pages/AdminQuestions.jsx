import React, { useState, useEffect } from 'react';
import '../AdminApp.css';

export default function AdminQuestions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('interact_admin_token');
      const res = await fetch('http://localhost:5000/api/admin/questions', {
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
      await fetch('http://localhost:5000/api/admin/questions/' + id, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      fetchData();
    } catch (err) {
      alert('Error deleting');
    }
  };

  if (loading) return <div className="admin-loading">Loading Question Bank...</div>;
  if (error) return <div className="admin-error-box">{error}</div>;

  return (
    <div className="admin-crud-page">
      <div className="admin-toolbar">
        <h2>Question Bank</h2>
        <button className="admin-btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add New'}
        </button>
      </div>

      {showForm && (
        <div className="admin-widget" style={{marginBottom: '24px'}}>
          <h3>Add New Question</h3>
          <p>Full form editor will be launched here.</p>
        </div>
      )}

      {data.length === 0 ? (
        <div className="admin-empty-state">
          <h3>No questions yet</h3>
          <p>Create your first question to start building.</p>
          <button className="admin-btn-primary" onClick={() => setShowForm(true)}>+ Add Question</button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>QUESTION</th><th>CATEGORY</th><th>DIFFICULTY</th><th>INTERVIEW TYPE</th><th>IS ACTIVE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td>{item.question?.toString()}</td><td>{item.category?.toString()}</td><td>{item.difficulty?.toString()}</td><td>{item.interview_type?.toString()}</td><td>{item.is_active?.toString()}</td>
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
