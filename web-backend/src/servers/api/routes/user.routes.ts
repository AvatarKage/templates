import { Router } from 'express';
import { getUsers, getUser, createUser } from '../controllers/user.controller.js';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/create', createUser);

export default router;