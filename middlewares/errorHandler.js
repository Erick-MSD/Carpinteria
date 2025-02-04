// middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
      message: 'Algo salió mal, por favor intentalo de nuevo más tarde',
      error: err.message,
    });
  }
  
  module.exports = errorHandler;
  