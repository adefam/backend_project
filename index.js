import 'dotenv/config';
import express from 'express';

import cors from 'cors'; // Enable CORS for all routes and Allows backend to accept requests from different origins

import { notFoundHandler, errorHandler } from './middlewares/errorHandlers.js';
import authRouter from './routes/authRoute.js';
import indexRouter from './routes/index.js';
import db from './models/index.js';

const app = express();
const port = process.env.PORT || 3000;

const env = process.env.NODE_ENV || 'development';

//Middleware to parse JSON bodies
app.use(express.json());

app.use(cors()); // Use CORS middleware to allow cross-origin requests

// Serve static files from the "public" directory
// app.use(express.static(path.join(__dirname, 'public')));


// Default Page
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to home page'
  })
})

// General Routes Loader
app.use('/api/v1/auth', authRouter);
app.use('/api', indexRouter);



// Error Handling middleware
app.use(notFoundHandler);
app.use(errorHandler);


(async () => {
  try {
    await db.sequelize.sync();
    console.log('Database synchronized successfully.');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to synchronize the database:', error.message);
  }
})();
