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
    { title: 'Client Acquisition Mastery', enrollments: 5120, revenue: 378400 },
    { title: 'Agency Scaling OS', enrollments: 4210, revenue: 324170 },
    { title: 'Creator Monetization Blueprint', enrollments: 3890, revenue: 287860 },
    { title: 'High-Ticket Offer Architecture', enrollments: 3320, revenue: 272240 }
  ],
  topExperts: [
    { name: 'Tai Lopez', rating: 4.7, totalStudents: 228000 },
    { name: 'Iman Gadzhi', rating: 4.8, totalStudents: 174500 },
    { name: 'Sam Ovens', rating: 4.8, totalStudents: 162300 },
    { name: 'Alex Hormozi', rating: 4.9, totalStudents: 149200 }
  ],
  trafficData: [
    { day: 'Mon', visits: 12400 },
    { day: 'Tue', visits: 13150 },
    { day: 'Wed', visits: 13820 },
    { day: 'Thu', visits: 14780 },
    { day: 'Fri', visits: 15360 },
    { day: 'Sat', visits: 10240 },
    { day: 'Sun', visits: 9440 }
  ],
  socialData: {
    followers: 824000,
    engagementRate: 7.1
  },
  revenueEstimates: {
    monthlyRevenue: 1642000,
    growthPercent: 14.3
  },
  offers: [
    { name: 'Scale Sprint (4 Weeks)', conversionRate: 8.6 },
    { name: 'Authority Funnel Intensive', conversionRate: 7.4 },
    { name: 'Premium Mentorship Upgrade', conversionRate: 5.7 }
  ],
  landingPages: [
    { name: 'Agency Growth Hub', visitors: 28750, conversionRate: 9.2 },
    { name: 'Personal Brand Launchpad', visitors: 24310, conversionRate: 8.1 },
    { name: 'Course Creator Accelerator', visitors: 21980, conversionRate: 8.7 }
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

function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  return res.redirect('/login');
}

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

app.use(express.static(path.join(__dirname, 'public'), { index: false }));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
