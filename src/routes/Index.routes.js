import { Router } from 'express';
import fs from 'fs';

export const router = Router();

//import demoRoutes from "./Demo.routes.js";
//import mediaRoutes from "./Media.routes.js";
import authRoutes from "./Auth.routes.js"
import taskRoutes from "./Task.routes.js"

import { list } from '../controllers/Task.controller.js';
import createSlug from '../controllers/utils.js';
import User from '../models/User.model.js';

router.get('/', async (req, res) => {
    //res.send('Prueba para Jenkins!')
    let user = await User.findOne({ email: 'pepe@gmail.com'});
    
    //res.send(users)

    res.send(user)
});

//router.use("/demo", demoRoutes);

//router.use('/media', mediaRoutes);

router.use('/auth', authRoutes);

router.get('/api/:company/tasks/list', (req, res) => {
    let company = req.params.company;
    company = createSlug(company);
    list(req, res, company);
});

router.use('/api/:company/tasks', taskRoutes);


/** 
 * Para cualquier ruta que no exista 404 pero si lo habilito
 * no tengo acceso a la carpeta media de las imagenes
 */
/* router.use('*', (req, res) => {
    res.status(404);

    if(req.accepts('json')) {
        res.json({ 'error': '404 Not Found' });
    } else {
        res.type('text').send('404 Not Found');
    }
}) */

