import express from 'express';
import { getDashboardMetrics } from '../controllers/adminController.js';
import { getCourses, createCourse, updateCourse, deleteCourse, getQuestions, createQuestion, updateQuestion, deleteQuestion, getCareerPaths, createCareerPath, updateCareerPath, deleteCareerPath, getJobs, createJob, updateJob, deleteJob, getResources, createResource, updateResource, deleteResource, getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, getStudents, getInterviews, getActivityLogs } from '../controllers/adminCrudController.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(requireAdmin);

router.get('/dashboard-metrics', getDashboardMetrics);


router.get('/courses', getCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

router.get('/questions', getQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

router.get('/career-paths', getCareerPaths);
router.post('/career-paths', createCareerPath);
router.put('/career-paths/:id', updateCareerPath);
router.delete('/career-paths/:id', deleteCareerPath);

router.get('/jobs', getJobs);
router.post('/jobs', createJob);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);

router.get('/resources', getResources);
router.post('/resources', createResource);
router.put('/resources/:id', updateResource);
router.delete('/resources/:id', deleteResource);

router.get('/announcements', getAnnouncements);
router.post('/announcements', createAnnouncement);
router.put('/announcements/:id', updateAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);

router.get('/students', getStudents);
router.get('/interviews', getInterviews);
router.get('/activity', getActivityLogs);

export default router;
