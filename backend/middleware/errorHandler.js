const errorHandler = (err, req, res, next) => { // I have to think about this
	// Default to a 500 Internal Server Error if no status code has been set
	const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
	res.status(statusCode);
	res.json({
	  message: err.message,
	  stack: process.env.NODE_ENV === 'production' ? 'X' : err.stack,
	});
  }

module.exports = errorHandler;
