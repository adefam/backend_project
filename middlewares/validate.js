import AppError from '../utils/appError.js';

const validate = (validatorFn, source = 'body') => {
  return (req, res, next) => {
    const { isValid, errors } = validatorFn(req[source]);
    if (!isValid) {
      return next(new AppError(errors.join(', '), 400, 'ValidationError'));
    }
    next();
  };
};

export default validate;
