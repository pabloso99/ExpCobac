const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin === 'http://localhost:3001' || origin === 'http://192.168.100.10:3001') {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400 // 24 horas
};

module.exports = corsOptions;
