require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');
const MongoStore = require('connect-mongo');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const customRoutes = require('./routes/custom');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      tlsAllowInvalidCertificates: true,
      serverSelectionTimeoutMS: 20000
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}
connectDB();


app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname,'public','uploads')));
app.use(express.urlencoded({ extended:true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_session',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/custom', customRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', apiRoutes);

// Pages
app.get('/buy', (req,res)=> res.sendFile(path.join(__dirname,'public','buy.html')));
app.get('/customize', (req,res)=> res.sendFile(path.join(__dirname,'public','customize.html')));
app.get('/dashboard', (req,res)=> res.sendFile(path.join(__dirname,'public','dashboard.html')));
app.get('/admin', (req,res)=> res.sendFile(path.join(__dirname,'public','admin.html')));
app.get('/cart', (req,res)=> res.sendFile(path.join(__dirname,'public','cart.html')));
app.get('/profile', (req,res)=> res.sendFile(path.join(__dirname,'public','profile.html')));
app.get('/', (req,res) => res.sendFile(path.join(__dirname,'public','index.html')));

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
