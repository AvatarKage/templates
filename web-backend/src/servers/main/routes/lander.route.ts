import { Router } from 'express';
import { sendWelcomeMessage } from '../controllers/lander.controller.js';

const router = Router();

router.get('/', sendWelcomeMessage);

export default router;