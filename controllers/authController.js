import bcrypt from 'bcrypt';
import db from '../models/index.js';

const {User} = db;

export const signup = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
    
        // Step 1: Validate input
        if (!firstName || !lastName || !email || !password) {
          return res.status(400).json({
            status: 'fail',
            message: 'All fields are required',
          });
        }
    
        // Step 2: Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(409).json({
            status: 'fail',
            message: 'Email is already registered',
          });
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
        console.error('Signup Error:', error);
        return res.status(500).json({
          status: 'error',
          message: 'An error occurred while processing your request',
        });
      }
};

export const login = (req, res, next) => {
    res.json({
        status: 'success',
        message: 'Login route are working'
    })
};
