import express from 'express';
import { login, signup, refreshAccessToken } from '../controllers/authController.js';
import validate from '../middlewares/validate.js';
import { validateSignupInput } from '../utils/validators.js';

const router = express.Router();

router.post('/signup', validate(validateSignupInput, 'body'), signup);

router.post('/login', login)

router.post('/refresh-token', refreshAccessToken);

export default router;
