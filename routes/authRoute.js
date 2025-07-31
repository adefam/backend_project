import express from 'express';
import { login, signup } from '../controllers/authController.js';
import validate from '../middlewares/validate.js';
import { validateSignupInput } from '../utils/validators.js';

const router = express.Router();

router.post('/signup', validate(validateSignupInput, 'body'), signup);

router.post('/login', login)

export default router;
