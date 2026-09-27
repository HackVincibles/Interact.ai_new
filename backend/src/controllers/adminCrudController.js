import { dbPool } from '../config/database.js';


export const getCourses = async (req, res, next) => {
  try {
    const result = await dbPool.query('SELECT * FROM courses ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
};

export const createCourse = async (req, res, next) => {
  try {
    const fields = ["title","provider","category","difficulty","duration","rating","thumbnail","external_url","description","is_featured","is_published"];
    const values = fields.map(f => req.body[f]);
    const placeholders = fields.map((_, i) => '$' + (i + 1)).join(', ');
    
    // Add simple logging
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, metadata) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Created', 'Course', JSON.stringify(req.body)]);

    const result = await dbPool.query(
      `INSERT INTO courses (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};

export const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = Object.keys(req.body).filter(k => ["title","provider","category","difficulty","duration","rating","thumbnail","external_url","description","is_featured","is_published"].includes(k));
    if(fields.length === 0) return res.json({ success: true });
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const values = fields.map(f => req.body[f]);
    values.push(id);
    
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, entity_id) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Updated', 'Course', id]);

    const result = await dbPool.query(
      `UPDATE courses SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, entity_id) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Deleted', 'Course', id]);
    await dbPool.query('DELETE FROM courses WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) { next(err); }
};

export const getQuestions = async (req, res, next) => {
  try {
    const result = await dbPool.query('SELECT * FROM interview_questions ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
};

export const createQuestion = async (req, res, next) => {
  try {
    const fields = ["question","category","difficulty","interview_type","expected_skills","evaluation_criteria","ideal_answer","time_limit","is_active"];
    const values = fields.map(f => req.body[f]);
    const placeholders = fields.map((_, i) => '$' + (i + 1)).join(', ');
    
    // Add simple logging
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, metadata) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Created', 'Question', JSON.stringify(req.body)]);

    const result = await dbPool.query(
      `INSERT INTO interview_questions (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = Object.keys(req.body).filter(k => ["question","category","difficulty","interview_type","expected_skills","evaluation_criteria","ideal_answer","time_limit","is_active"].includes(k));
    if(fields.length === 0) return res.json({ success: true });
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const values = fields.map(f => req.body[f]);
    values.push(id);
    
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, entity_id) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Updated', 'Question', id]);

    const result = await dbPool.query(
      `UPDATE interview_questions SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, entity_id) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Deleted', 'Question', id]);
    await dbPool.query('DELETE FROM interview_questions WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) { next(err); }
};

export const getCareerPaths = async (req, res, next) => {
  try {
    const result = await dbPool.query('SELECT * FROM career_paths ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
};

export const createCareerPath = async (req, res, next) => {
  try {
    const fields = ["name","description","required_skills","recommended_courses","recommended_interview_type","resources","difficulty","is_featured","is_published"];
    const values = fields.map(f => req.body[f]);
    const placeholders = fields.map((_, i) => '$' + (i + 1)).join(', ');
    
    // Add simple logging
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, metadata) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Created', 'CareerPath', JSON.stringify(req.body)]);

    const result = await dbPool.query(
      `INSERT INTO career_paths (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};

export const updateCareerPath = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = Object.keys(req.body).filter(k => ["name","description","required_skills","recommended_courses","recommended_interview_type","resources","difficulty","is_featured","is_published"].includes(k));
    if(fields.length === 0) return res.json({ success: true });
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const values = fields.map(f => req.body[f]);
    values.push(id);
    
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, entity_id) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Updated', 'CareerPath', id]);

    const result = await dbPool.query(
      `UPDATE career_paths SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};

export const deleteCareerPath = async (req, res, next) => {
  try {
    const { id } = req.params;
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, entity_id) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Deleted', 'CareerPath', id]);
    await dbPool.query('DELETE FROM career_paths WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) { next(err); }
};

export const getJobs = async (req, res, next) => {
  try {
    const result = await dbPool.query('SELECT * FROM jobs ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
};

export const createJob = async (req, res, next) => {
  try {
    const fields = ["company","title","location","job_type","stipend_salary","apply_url","description","is_featured","is_published"];
    const values = fields.map(f => req.body[f]);
    const placeholders = fields.map((_, i) => '$' + (i + 1)).join(', ');
    
    // Add simple logging
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, metadata) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Created', 'Job', JSON.stringify(req.body)]);

    const result = await dbPool.query(
      `INSERT INTO jobs (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};

export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = Object.keys(req.body).filter(k => ["company","title","location","job_type","stipend_salary","apply_url","description","is_featured","is_published"].includes(k));
    if(fields.length === 0) return res.json({ success: true });
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const values = fields.map(f => req.body[f]);
    values.push(id);
    
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, entity_id) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Updated', 'Job', id]);

    const result = await dbPool.query(
      `UPDATE jobs SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};

export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, entity_id) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Deleted', 'Job', id]);
    await dbPool.query('DELETE FROM jobs WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) { next(err); }
};

export const getResources = async (req, res, next) => {
  try {
    const result = await dbPool.query('SELECT * FROM resources ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
};

export const createResource = async (req, res, next) => {
  try {
    const fields = ["title","description","category","url","thumbnail","author","tags","is_featured","is_published"];
    const values = fields.map(f => req.body[f]);
    const placeholders = fields.map((_, i) => '$' + (i + 1)).join(', ');
    
    // Add simple logging
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, metadata) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Created', 'Resource', JSON.stringify(req.body)]);

    const result = await dbPool.query(
      `INSERT INTO resources (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};

export const updateResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = Object.keys(req.body).filter(k => ["title","description","category","url","thumbnail","author","tags","is_featured","is_published"].includes(k));
    if(fields.length === 0) return res.json({ success: true });
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const values = fields.map(f => req.body[f]);
    values.push(id);
    
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, entity_id) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Updated', 'Resource', id]);

    const result = await dbPool.query(
      `UPDATE resources SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};

export const deleteResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, entity_id) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Deleted', 'Resource', id]);
    await dbPool.query('DELETE FROM resources WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) { next(err); }
};

export const getAnnouncements = async (req, res, next) => {
  try {
    const result = await dbPool.query('SELECT * FROM announcements ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
};

export const createAnnouncement = async (req, res, next) => {
  try {
    const fields = ["title","description","cta_text","cta_url","start_date","end_date","priority","is_published"];
    const values = fields.map(f => req.body[f]);
    const placeholders = fields.map((_, i) => '$' + (i + 1)).join(', ');
    
    // Add simple logging
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, metadata) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Created', 'Announcement', JSON.stringify(req.body)]);

    const result = await dbPool.query(
      `INSERT INTO announcements (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};

export const updateAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = Object.keys(req.body).filter(k => ["title","description","cta_text","cta_url","start_date","end_date","priority","is_published"].includes(k));
    if(fields.length === 0) return res.json({ success: true });
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const values = fields.map(f => req.body[f]);
    values.push(id);
    
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, entity_id) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Updated', 'Announcement', id]);

    const result = await dbPool.query(
      `UPDATE announcements SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    await dbPool.query('INSERT INTO admin_activity_logs (admin_id, admin_username, action, entity, entity_id) VALUES ($1, $2, $3, $4, $5)', [req.user.id, req.user.username, 'Deleted', 'Announcement', id]);
    await dbPool.query('DELETE FROM announcements WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) { next(err); }
};

export const getStudents = async (req, res, next) => {
  try {
    const result = await dbPool.query("SELECT id, full_name, email, college_name, branch, grad_year, created_at FROM users WHERE role != 'admin' AND role != 'superadmin' ORDER BY id DESC");
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
};

export const getInterviews = async (req, res, next) => {
  try {
    const result = await dbPool.query(`
      SELECT i.id, i.domain, i.target_role, i.score, i.created_at, u.full_name as candidate_name, u.email as candidate_email
      FROM interviews i 
      JOIN users u ON i.user_id = u.id 
      ORDER BY i.id DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
};

export const getActivityLogs = async (req, res, next) => {
  try {
    const result = await dbPool.query('SELECT * FROM admin_activity_logs ORDER BY id DESC LIMIT 100');
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
};
