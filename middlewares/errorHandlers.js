export const notFoundHandler = (req, res, next) => {
    res.status(404).send('Router Not Found');
  };


  
  export const errorHandler = (err, req, res, next) => {
    // Log the error details to the console
    console.error({
      code: err.code || 500,
      message: err.message,
      stack: err.stack,
      error: err.name,
    });
  
    // Respond to the client
    res.status(err.code || 500).json({
      code: err.code || 500,
      msg: err.message || 'Internal Server Error',
      error: err.name || 'InternalServerError',
    });
  };
  