import bcrypt from 'bcrypt';
import db from '../models/index.js';
import AppError from '../utils/appError.js';

const {User} = db;

export const signup = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
    
        // Step 1: Validate input
        if (!firstName || !lastName || !email || !password) {
          throw new AppError('All fields are required', 400);
        }
    
        // Step 2: Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          throw new AppError('Email already exists', 409);
        }
    
        // Step 3: Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);
    
        // Step 4: Create new user
        const newUser = await User.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
        });
    
        // Step 5: Send response (excluding password)
        return res.status(201).json({
          status: 'success',
          message: 'User registered successfully',
          user: {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
          },
        });
    
      } catch (error) {
        next(error)
      }
};



export const login = (req, res, next) => {
    res.json({
        status: 'success',
        message: 'Login route are working'
    })
};
