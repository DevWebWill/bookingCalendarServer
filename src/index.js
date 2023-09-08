import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import credentials from '../middleware/credentials.js';
import errorHandler from '../middleware/error_handler.js';
import corsOptions from './config/cors.js';
import { router } from './routes/Index.routes.js'
import connect from './config/database.js';
import authentication from '../middleware/authentication.js';
import socket from './socket.js'

import http from 'http';

/** CONFIGURATIONS */

//Configura __dirname para poder usarlo globalmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
global.__dirname = __dirname;

//Selecciona el .env segun entorno
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

const app = express();

// Allow Origin Middleware
app.use(credentials);

// Get User Middleware
app.use(authentication);

app.use(morgan("common"));
app.use(express.json());
app.use(cors(corsOptions));

/** MIDDLEWARE FOR COOKIES */
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public', 'media'),
  filename: function (req, file, cb) {
    cb(null, path.parse(file.originalname).name.toLowerCase().split(' ').join('-') + '-' + Date.now() + path.extname(file.originalname));
  }
});
app.use(multer({
  storage: storage
  //dest: path.join(__dirname, 'public', 'media')
}).array('files', 12));

/** ROUTES */
app.use(router);

/** STATIC FILES */
app.use(express.static(path.join(__dirname, 'public')));

/** Default error handler */
app.use(errorHandler);

const httpServer = http.createServer(app);
socket(httpServer);

const PORT = 3000;

/** DB CONNECTION */
connect();

mongoose.connection.once('open', () => {
  httpServer.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT} y conectado a la base de datos`))
})