const fs = require('fs');
const path = require('path');

const modules = [
  { name: 'Course', plural: 'courses', endpoint: 'courses', title: 'Courses', fields: ['title', 'provider', 'category', 'difficulty', 'is_published', 'is_featured'] },
  { name: 'Question', plural: 'questions', endpoint: 'questions', title: 'Question Bank', fields: ['question', 'category', 'difficulty', 'interview_type', 'is_active'] },
  { name: 'CareerPath', plural: 'careerPaths', endpoint: 'career-paths', title: 'Career Paths', fields: ['name', 'difficulty', 'is_published', 'is_featured'] },
  { name: 'Job', plural: 'jobs', endpoint: 'jobs', title: 'Jobs & Internships', fields: ['company', 'title', 'location', 'job_type', 'is_published', 'is_featured'] },
  { name: 'Resource', plural: 'resources', endpoint: 'resources', title: 'Resources', fields: ['title', 'category', 'type', 'is_published', 'is_featured'] },
  { name: 'Announcement', plural: 'announcements', endpoint: 'announcements', title: 'Announcements', fields: ['title', 'priority', 'is_published'] }
];

const outDir = path.join(__dirname, 'frontend/src/admin/pages');
if (!fs.existsSync(outDir)) { fs.mkdirSync(outDir, { recursive: true }); }

for (const mod of modules) {
  const componentName = 'Admin' + mod.name + 's';
  const tableHeaders = mod.fields.map(f => '<th>' + f.replace(/_/g, ' ').toUpperCase() + '</th>').join('');
  const tableData = mod.fields.map(f => '<td>{item.' + f + '?.toString()}</td>').join('');
  
  const code = "import React, { useState, useEffect } from 'react';\n" +
"import '../AdminApp.css';\n\n" +
"export default function " + componentName + "() {\n" +
"  const [data, setData] = useState([]);\n" +
"  const [loading, setLoading] = useState(true);\n" +
"  const [error, setError] = useState('');\n" +
"  const [showForm, setShowForm] = useState(false);\n\n" +
"  useEffect(() => { fetchData(); }, []);\n\n" +
"  const fetchData = async () => {\n" +
"    try {\n" +
"      const token = localStorage.getItem('interact_admin_token');\n" +
"      const res = await fetch('http://localhost:5000/api/admin/" + mod.endpoint + "', {\n" +
"        headers: { 'Authorization': 'Bearer ' + token }\n" +
"      });\n" +
"      const json = await res.json();\n" +
"      if (json.success) setData(json.data);\n" +
"      else setError('Failed to load data');\n" +
"    } catch (err) {\n" +
"      setError('Connection error');\n" +
"    } finally {\n" +
"      setLoading(false);\n" +
"    }\n" +
"  };\n\n" +
"  const handleDelete = async (id) => {\n" +
"    if (!window.confirm('Delete this item? This action cannot be undone.')) return;\n" +
"    try {\n" +
"      const token = localStorage.getItem('interact_admin_token');\n" +
"      await fetch('http://localhost:5000/api/admin/" + mod.endpoint + "/' + id, {\n" +
"        method: 'DELETE',\n" +
"        headers: { 'Authorization': 'Bearer ' + token }\n" +
"      });\n" +
"      fetchData();\n" +
"    } catch (err) {\n" +
"      alert('Error deleting');\n" +
"    }\n" +
"  };\n\n" +
"  if (loading) return <div className=\"admin-loading\">Loading " + mod.title + "...</div>;\n" +
"  if (error) return <div className=\"admin-error-box\">{error}</div>;\n\n" +
"  return (\n" +
"    <div className=\"admin-crud-page\">\n" +
"      <div className=\"admin-toolbar\">\n" +
"        <h2>" + mod.title + "</h2>\n" +
"        <button className=\"admin-btn-primary\" onClick={() => setShowForm(!showForm)}>\n" +
"          {showForm ? 'Cancel' : '+ Add New'}\n" +
"        </button>\n" +
"      </div>\n\n" +
"      {showForm && (\n" +
"        <div className=\"admin-widget\" style={{marginBottom: '24px'}}>\n" +
"          <h3>Add New " + mod.name + "</h3>\n" +
"          <p>Full form editor will be launched here.</p>\n" +
"        </div>\n" +
"      )}\n\n" +
"      {data.length === 0 ? (\n" +
"        <div className=\"admin-empty-state\">\n" +
"          <h3>No " + mod.plural + " yet</h3>\n" +
"          <p>Create your first " + mod.name.toLowerCase() + " to start building.</p>\n" +
"          <button className=\"admin-btn-primary\" onClick={() => setShowForm(true)}>+ Add " + mod.name + "</button>\n" +
"        </div>\n" +
"      ) : (\n" +
"        <div className=\"admin-table-container\">\n" +
"          <table className=\"admin-table\">\n" +
"            <thead>\n" +
"              <tr>\n" +
"                " + tableHeaders + "\n" +
"                <th>ACTIONS</th>\n" +
"              </tr>\n" +
"            </thead>\n" +
"            <tbody>\n" +
"              {data.map(item => (\n" +
"                <tr key={item.id}>\n" +
"                  " + tableData + "\n" +
"                  <td>\n" +
"                    <button className=\"admin-btn-small\">Edit</button>\n" +
"                    <button className=\"admin-btn-small admin-btn-danger\" onClick={() => handleDelete(item.id)}>Delete</button>\n" +
"                  </td>\n" +
"                </tr>\n" +
"              ))}\n" +
"            </tbody>\n" +
"          </table>\n" +
"        </div>\n" +
"      )}\n" +
"    </div>\n" +
"  );\n" +
"}\n";

  fs.writeFileSync(path.join(outDir, componentName + '.jsx'), code);
}

const studentsCode = "import React, { useState, useEffect } from 'react';\n" +
"export default function AdminStudents() {\n" +
"  const [data, setData] = useState([]);\n" +
"  const [loading, setLoading] = useState(true);\n" +
"  useEffect(() => {\n" +
"    fetch('http://localhost:5000/api/admin/students', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('interact_admin_token') }})\n" +
"      .then(r => r.json()).then(d => { setData(d.data); setLoading(false); });\n" +
"  }, []);\n" +
"  if (loading) return <div>Loading...</div>;\n" +
"  return (\n" +
"    <div className=\"admin-crud-page\">\n" +
"      <div className=\"admin-toolbar\"><h2>Students Management</h2></div>\n" +
"      <div className=\"admin-table-container\">\n" +
"        <table className=\"admin-table\">\n" +
"          <thead><tr><th>ID</th><th>NAME</th><th>EMAIL</th><th>COLLEGE</th><th>ACTIONS</th></tr></thead>\n" +
"          <tbody>\n" +
"            {data.map(u => (\n" +
"              <tr key={u.id}><td>{u.id}</td><td>{u.full_name}</td><td>{u.email}</td><td>{u.college_name}</td><td><button className=\"admin-btn-small\">View Profile</button></td></tr>\n" +
"            ))}\n" +
"          </tbody>\n" +
"        </table>\n" +
"      </div>\n" +
"    </div>\n" +
"  );\n" +
"}\n";
fs.writeFileSync(path.join(outDir, 'AdminStudents.jsx'), studentsCode);

const interviewsCode = "import React, { useState, useEffect } from 'react';\n" +
"export default function AdminInterviews() {\n" +
"  const [data, setData] = useState([]);\n" +
"  const [loading, setLoading] = useState(true);\n" +
"  useEffect(() => {\n" +
"    fetch('http://localhost:5000/api/admin/interviews', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('interact_admin_token') }})\n" +
"      .then(r => r.json()).then(d => { setData(d.data); setLoading(false); });\n" +
"  }, []);\n" +
"  if (loading) return <div>Loading...</div>;\n" +
"  return (\n" +
"    <div className=\"admin-crud-page\">\n" +
"      <div className=\"admin-toolbar\"><h2>Interview Management</h2></div>\n" +
"      <div className=\"admin-table-container\">\n" +
"        <table className=\"admin-table\">\n" +
"          <thead><tr><th>ID</th><th>CANDIDATE</th><th>ROLE</th><th>SCORE</th><th>ACTIONS</th></tr></thead>\n" +
"          <tbody>\n" +
"            {data.map(i => (\n" +
"              <tr key={i.id}><td>{i.id}</td><td>{i.candidate_name}</td><td>{i.target_role}</td><td>{i.score}</td><td><button className=\"admin-btn-small\">View Report</button></td></tr>\n" +
"            ))}\n" +
"          </tbody>\n" +
"        </table>\n" +
"      </div>\n" +
"    </div>\n" +
"  );\n" +
"}\n";
fs.writeFileSync(path.join(outDir, 'AdminInterviews.jsx'), interviewsCode);

const activityCode = "import React, { useState, useEffect } from 'react';\n" +
"export default function AdminActivity() {\n" +
"  const [data, setData] = useState([]);\n" +
"  const [loading, setLoading] = useState(true);\n" +
"  useEffect(() => {\n" +
"    fetch('http://localhost:5000/api/admin/activity', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('interact_admin_token') }})\n" +
"      .then(r => r.json()).then(d => { setData(d.data); setLoading(false); });\n" +
"  }, []);\n" +
"  if (loading) return <div>Loading...</div>;\n" +
"  return (\n" +
"    <div className=\"admin-crud-page\">\n" +
"      <div className=\"admin-toolbar\"><h2>Admin Activity Logs</h2></div>\n" +
"      <div className=\"admin-table-container\">\n" +
"        <table className=\"admin-table\">\n" +
"          <thead><tr><th>ADMIN</th><th>ACTION</th><th>ENTITY</th><th>ID</th><th>TIME</th></tr></thead>\n" +
"          <tbody>\n" +
"            {data.map(a => (\n" +
"              <tr key={a.id}><td>{a.admin_username}</td><td>{a.action}</td><td>{a.entity}</td><td>{a.entity_id || '-'}</td><td>{new Date(a.created_at).toLocaleString()}</td></tr>\n" +
"            ))}\n" +
"          </tbody>\n" +
"        </table>\n" +
"      </div>\n" +
"    </div>\n" +
"  );\n" +
"}\n";
fs.writeFileSync(path.join(outDir, 'AdminActivity.jsx'), activityCode);

console.log('Generated frontend pages.');
