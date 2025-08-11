import bcrypt from 'bcrypt';
import db from '../models/index.js';
import AppError from '../utils/appError.js';
import { generateToken, generateRefreshToken } from '../utils/generateToken.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';


const { User, sequelize } = db;

export const signup = asyncHandler(async (req, res, next) => {
  let transaction; // Declare transaction variable outside try block for rollback in case of error
  try {
    const { firstName, lastName, email, password } = req.body;

    // Step 1: Validate input
    if (!firstName || !lastName || !email || !password) {
      throw new AppError('All fields are required', 400);
    }

    // Step 1.1: Normalize and sanitize input
    const normalizedEmail = email.trim().toLowerCase();

    // Step 1.3: Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Step 1.4 Start transaction
    transaction = await sequelize.transaction();

    // Step 2: Check if user already exists
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      throw new AppError('Email already exists', 409);
    }

    // Step 3: Create new user
    const newUser = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    },
      { transaction });

    // Step 3.1: Generate JWT token
    const token = generateToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Optionally, you can store the refresh token in the database for later use
    // Store refresh token in DB
    await User.update(
      { refreshToken },
      { where: { id: newUser.id }, transaction }
    );

    // Step 3.2: Commit transaction
    await transaction.commit();

    // Step 4: Set cookie or return token based on platform
    // Check if the request is from a web client or mobile client
    if (req.platform === 'web') {
      // === Set cookie (for web clients) ===
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // only true in production (HTTPS)
        sameSite: 'strict', // or 'lax' if you want to allow some cross-site
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        token,
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
        },
      });
    } else {
      return res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        token,
        refreshToken, // Include refresh token in the response for mobile clients
         // Return user details without password
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
        },
      });
    }
  } catch (err) {
    if (transaction) await transaction.rollback(); // Rollback transaction on error
    return next(err);
  }
});


export const login = (req, res, next) => {
  res.json({
    status: 'success',
    message: 'Login route are working'
  })
};


export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  let refreshToken;

  if (req.platform === 'web') {
    refreshToken = req.cookies.refreshToken;
  } else {
    refreshToken = req.body.refreshToken;
  }

  if (!refreshToken) {
    throw new AppError('Refresh token missing', 401);
  }

  // Verify refresh token
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
    if (err) {
      return next(new AppError('Invalid or expired refresh token', 403));
    }

    const user = await User.findByPk(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return next(new AppError('Invalid refresh token', 403));
    }

    // Generate new tokens
    const newAccessToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Save new refresh token in DB
    await User.update(
      { refreshToken: newRefreshToken },
      { where: { id: user.id } }
    );

    if (req.platform === 'web') {
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.json({ accessToken: newAccessToken });
    } else {
      return res.json({
        accessToken: newAccessToken,
        refreshToken: req.platform === 'web' ? undefined : newRefreshToken
      });
    }
  });
});
