const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;


app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});


const bookRoutes = require('./routes/books');
app.use('/api/books', bookRoutes);


app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});


app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
