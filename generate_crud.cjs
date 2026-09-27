const fs = require('fs');
const path = require('path');

const modules = [
  { name: 'Course', plural: 'courses', table: 'courses', fields: ['title', 'provider', 'category', 'difficulty', 'duration', 'rating', 'thumbnail', 'external_url', 'description', 'is_featured', 'is_published'] },
  { name: 'Question', plural: 'questions', table: 'interview_questions', fields: ['question', 'category', 'difficulty', 'interview_type', 'expected_skills', 'evaluation_criteria', 'ideal_answer', 'time_limit', 'is_active'] },
  { name: 'CareerPath', plural: 'career-paths', table: 'career_paths', fields: ['name', 'description', 'required_skills', 'recommended_courses', 'recommended_interview_type', 'resources', 'difficulty', 'is_featured', 'is_published'] },
  { name: 'Job', plural: 'jobs', table: 'jobs', fields: ['company', 'title', 'location', 'job_type', 'stipend_salary', 'apply_url', 'description', 'is_featured', 'is_published'] },
  { name: 'Resource', plural: 'resources', table: 'resources', fields: ['title', 'description', 'category', 'url', 'thumbnail', 'author', 'tags', 'is_featured', 'is_published'] },
  { name: 'Announcement', plural: 'announcements', table: 'announcements', fields: ['title', 'description', 'cta_text', 'cta_url', 'start_date', 'end_date', 'priority', 'is_published'] }
];

let routesContent = '';
let controllersContent = `import { dbPool } from '../config/database.js';\n\n`;

for (const mod of modules) {
  const capPlural = mod.name + 's';
  const apiPath = mod.plural;
  const table = mod.table;
  
  // Controller
  controllersContent += `
export const get${capPlural} = async (req, res, next) => {
  try {
    const result = await dbPool.query('SELECT * FROM ${table} ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
};

export const create${mod.name} = async (req, res, next) => {
  try {
    const fields = ${JSON.stringify(mod.fields)};
    const values = fields.map(f => req.body[f]);
    const placeholders = fields.map((_, i) => '$' + (i + 1)).join(', ');
    
    // Add simple logging
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, metadata) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Created', '${mod.name}', JSON.stringify(req.body)]);

    const result = await dbPool.query(
      \`INSERT INTO ${table} (\${fields.join(', ')}) VALUES (\${placeholders}) RETURNING *\`,
      values
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};

export const update${mod.name} = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = Object.keys(req.body).filter(k => ${JSON.stringify(mod.fields)}.includes(k));
    if(fields.length === 0) return res.json({ success: true });
    const setClause = fields.map((f, i) => \`\${f} = $\${i + 1}\`).join(', ');
    const values = fields.map(f => req.body[f]);
    values.push(id);
    
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, entity_id) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Updated', '${mod.name}', id]);

    const result = await dbPool.query(
      \`UPDATE ${table} SET \${setClause} WHERE id = $\${values.length} RETURNING *\`,
      values
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};

export const delete${mod.name} = async (req, res, next) => {
  try {
    const { id } = req.params;
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, entity_id) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Deleted', '${mod.name}', id]);
    await dbPool.query('DELETE FROM ${table} WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) { next(err); }
};
`;

  // Routes
  routesContent += `
router.get('/${apiPath}', get${capPlural});
router.post('/${apiPath}', create${mod.name});
router.put('/${apiPath}/:id', update${mod.name});
router.delete('/${apiPath}/:id', delete${mod.name});
`;
}

// Add Students and Interviews Read-Only Controllers
controllersContent += `
export const getStudents = async (req, res, next) => {
  try {
    const result = await dbPool.query("SELECT id, full_name, email, college_name, branch, grad_year, created_at FROM users WHERE role != 'admin' AND role != 'superadmin' ORDER BY id DESC");
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
};

export const getInterviews = async (req, res, next) => {
  try {
    const result = await dbPool.query(\`
      SELECT i.id, i.domain, i.target_role, i.score, i.created_at, u.full_name as candidate_name, u.email as candidate_email
      FROM interviews i 
      JOIN users u ON i.user_id = u.id 
      ORDER BY i.id DESC
    \`);
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
};

export const getActivityLogs = async (req, res, next) => {
  try {
    const result = await dbPool.query('SELECT * FROM admin_activity_logs ORDER BY id DESC LIMIT 100');
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
};
`;

routesContent += `
router.get('/students', getStudents);
router.get('/interviews', getInterviews);
router.get('/activity', getActivityLogs);
`;

const controllersFile = path.join(__dirname, 'backend/src/controllers/adminCrudController.js');
const routesFile = path.join(__dirname, 'backend/src/routes/adminRoutes.js');

fs.writeFileSync(controllersFile, controllersContent);
console.log('Created backend/src/controllers/adminCrudController.js');

let existingRoutes = fs.readFileSync(routesFile, 'utf8');
const imports = `import { getDashboardMetrics } from '../controllers/adminController.js';\n` + 
                `import { ${modules.map(m => `get${m.name}s, create${m.name}, update${m.name}, delete${m.name}`).join(', ')}, getStudents, getInterviews, getActivityLogs } from '../controllers/adminCrudController.js';`;
                
existingRoutes = existingRoutes.replace(/import { getDashboardMetrics.*?;\n/, imports + '\n');
existingRoutes = existingRoutes.replace(/export default router;/, routesContent + '\nexport default router;');

fs.writeFileSync(routesFile, existingRoutes);
console.log('Updated backend/src/routes/adminRoutes.js');
