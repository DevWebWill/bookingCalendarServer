import express from "express";
import { getMedia, uploadImages, deleteMedia } from "../controllers/Media.controller.js";

const router = express.Router();

router.get('/', getMedia);

router.post('/upload-images', uploadImages);

router.post('/delete-image', deleteMedia);

export default router;