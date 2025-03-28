const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const authRoutes = require('../src/routes/auth.routes');
const cors = require('cors');
const userRoutes = require("../src/routes/user.routes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use("/api/users", userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to MEAN backend');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

module.exports = app;