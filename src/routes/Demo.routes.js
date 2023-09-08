import express from "express";
import { getDemos, setDemo } from "../controllers/Demo.controller.js";

const router = express.Router();

router.get('/', getDemos);

router.post('/set-demo', setDemo);

export default router;