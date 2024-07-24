const path = require('path');
const express = require('express');
const blogRoutes = require('./routes/blog');
const db = require('./data/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use blog routes
app.use(blogRoutes);

app.use((req, res) => {
  res.status(404).render('404');
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render('500');
});

const port = process.env.PORT || 4000; // Use environment variable for port

db.connectToDatabase()
  .then(() => {
    console.log('Connected to database');
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => {
    console.error('Failed to connect to the database', error);
  });
