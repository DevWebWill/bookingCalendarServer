import express from 'express';
import { list, create, update, deleteTask, booking } from '../controllers/Task.controller.js';
import auth from '../../middleware/auth.js';
import verifyJWT from './verifyjwt.js';
import { createSlug } from '../controllers/utils.js';

const router = express.Router({ mergeParams: true }); // Habilitar mergeParams

router.get('/list', (req, res) => {
    let company = req.params.company;
    company = createSlug(company);
    list(req, res, company);
});

router.post('/create',  verifyJWT, (req, res) => {
    create(req, res)
});

router.post('/update',  verifyJWT, update);
router.post('/delete',  verifyJWT, deleteTask);

router.post('/booking', verifyJWT, (req, res) => {
    booking(req, res)
});

export default router;