import express from 'express';
import { list, create, update, deleteTask, booking } from '../controllers/Task.controller.js';

const router = express.Router();

router.get('/list', list);
router.post('/create', create);
router.post('/update', update);
router.post('/delete', deleteTask);
router.post('/booking', booking);

export default router;