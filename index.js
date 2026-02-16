const path = require('path');
const express = require('express');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

const DEMO_USER = {
  username: 'admin',
  password: 'password123'
};

const mockData = {
  topCourses: [
    { title: 'Advanced JavaScript Architecture', enrollments: 4520, revenue: 339000 },
    { title: 'Data Analytics with Python', enrollments: 3890, revenue: 291750 },
    { title: 'Product Management Masterclass', enrollments: 3120, revenue: 265200 },
    { title: 'UI/UX Strategy for SaaS', enrollments: 2760, revenue: 193200 }
  ],
  topExperts: [
    { name: 'Sarah Kim', rating: 4.9, totalStudents: 18400 },
    { name: 'David Morales', rating: 4.8, totalStudents: 16750 },
    { name: 'Amina Hassan', rating: 4.8, totalStudents: 14520 },
    { name: 'Lucas Zhang', rating: 4.7, totalStudents: 13210 }
  ],
  trafficData: [
    { day: 'Mon', visits: 9200 },
    { day: 'Tue', visits: 9800 },
    { day: 'Wed', visits: 10300 },
    { day: 'Thu', visits: 11050 },
    { day: 'Fri', visits: 12100 },
    { day: 'Sat', visits: 8600 },
    { day: 'Sun', visits: 7900 }
  ],
  socialData: {
    followers: 187500,
    engagementRate: 6.4
  },
  revenueEstimates: {
    monthlyRevenue: 1185000,
    growthPercent: 12.7
  },
  offers: [
    { name: 'Spring Upskill Bundle', conversionRate: 7.8 },
    { name: 'Career Accelerator Pack', conversionRate: 6.3 },
    { name: 'One-on-One Mentor Add-on', conversionRate: 4.9 }
  ],
  landingPages: [
    { name: 'Data Science Bootcamp', visitors: 22300, conversionRate: 8.1 },
    { name: 'Leadership Fast Track', visitors: 17850, conversionRate: 6.9 },
    { name: 'Design Systems Intensive', visitors: 15440, conversionRate: 7.4 }
  ]
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: 'replace-this-secret-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }
  })
);

app.use(express.static(path.join(__dirname, 'public')));

function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  return res.redirect('/login');
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/login', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }

  return res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');

  const isValidUser = username === DEMO_USER.username && password === DEMO_USER.password;

  if (!isValidUser) {
    return res.redirect('/login?error=invalid_credentials');
  }

  req.session.user = { username: DEMO_USER.username };
  return res.redirect('/dashboard');
});

app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/api/dashboard-data', requireAuth, (req, res) => {
  res.json(mockData);
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
