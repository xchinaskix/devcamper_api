const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const path = require('path');
const sanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

const connectDB = require('./config/db');
const logger = require('./middleware/logger');

// load env vars
dotenv.config({ path: './config/config.env' });

connectDB();

// route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

// body parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

// dev login middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// file uploading
app.use(fileupload());

// sanitize data
app.use(sanitize());

// set security headers
app.use(helmet({contentSecurityPolicy: false}));

// prevent xss attacks
app.use(xss());

// log requests
// app.use(logger);

// rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 100
});
app.use(limiter);

// prevent http param polution
app.use(hpp());

// enable cors
app.use(cors())

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
// const HOSTNAME = process.env.NODE_ENV === 'development' ? '0.0.0.0' : '134.122.12.82';

const server = app.listen(
  PORT,
  // HOSTNAME,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // close server & exit process
  server.close(() => process.exit(1));
});
