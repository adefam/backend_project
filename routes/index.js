import express from 'express';
import exampleController from '../controllers/exampleController.js';

const router = express.Router();

// Example route
router.get('/example', exampleController.getExample);
router.post('/example', exampleController.createExample);

export default router;
