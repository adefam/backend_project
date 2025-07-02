import { UserAuthError } from '../middlewares/errors.js';

export const getExample = (req, res, next) => {
  try {
    console.log('object');
    const userHasPermission = true;
    if (!userHasPermission) {
      throw new UserAuthError('You do not have permission to access this resource');
    }
    res.send('Get Example');
  } catch (err) {
    next(err);
  }
};

export const createExample = (req, res, next) => {
  try {
    res.send('Create Example');
  } catch (err) {
    next(err);
  }
};

export default {
  getExample,
  createExample
};
  