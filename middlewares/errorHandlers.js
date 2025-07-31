export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    code: 404,
    msg: 'Route Not Found',
    error: 'NotFoundError',
  });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.code || 500;
  const message = err.message || 'Internal Server Error';
  const errorName = err.name || 'InternalServerError';

  console.error({
    code: statusCode,
    message,
    stack: err.stack,
    error: errorName,
  });

  res.status(statusCode).json({
    code: statusCode,
    msg: message,
    error: errorName,
  });
};

  // export const errorHandler = (err, req, res, next) => {
  //   // Log the error details to the console
  //   console.error({
  //     code: err.code || 500,
  //     message: err.message,
  //     stack: err.stack,
  //     error: err.name,
  //   });
  
  //   // Respond to the client
  //   res.status(err.code || 500).json({
  //     code: err.code || 500,
  //     msg: err.message || 'Internal Server Error',
  //     error: err.name || 'InternalServerError',
  //   });
  // };
