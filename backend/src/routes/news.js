import express from 'express';
import axios from 'axios';
import articleController from "../controllers/article.js"
const router = express.Router();


router.get("/news", articleController)
export default router;