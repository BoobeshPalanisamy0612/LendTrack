const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { startReminderJob } = require('./utils/reminderJob');

const authRoutes = require('./routes/authRoutes');
const loanRoutes = require('./routes/loanRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const familyRoutes = require('./routes/familyRoutes');
const exportRoutes = require('./routes/exportRoutes');

// Connect Database
connectDB();

const app = express();

/* =========================
   SECURITY
========================= */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/* =========================
   CORS FIX (IMPORTANT)
========================= */
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/* =========================
   BODY PARSERS
========================= */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =========================
   LOGGING
========================= */
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/* =========================
   RATE LIMITING
========================= */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many attempts, please try again later',
  },
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

/* =========================
   STATIC FILES
========================= */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* =========================
   ROUTES
========================= */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LendTrack Backend Running Successfully',
    version: '1.0.0',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LendTrack API is running',
    timestamp: new Date().toISOString(),
  });
});

console.log('✅ Mounting auth routes...');
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/export', exportRoutes);

/* =========================
   ERROR HANDLERS
========================= */
app.use(notFound);
app.use(errorHandler);

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `LendTrack API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );

  startReminderJob();
});

/* =========================
   GLOBAL ERROR HANDLING
========================= */
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);

  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;