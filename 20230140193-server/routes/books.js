const express = require('express');
const router = express.Router();

let books = [
  { id: 1, title: 'Laskar Pelangi', author: 'Andrea Hirata' },
  { id: 2, title: 'Negeri 5 Menara', author: 'Ahmad Fuadi' }
];

// Read All
router.get('/', (req, res) => {
  res.json(books);
});

// Read One
router.get('/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

// Create
router.post('/', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author)
    return res.status(400).json({ message: 'Title and author are required' });

  const book = { id: books.length + 1, title, author };
  books.push(book);
  res.status(201).json(book);
});

// Update
router.put('/:id', (req, res) => {
  const { title, author } = req.body;
  const book = books.find(b => b.id === parseInt(req.params.id));

  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (!title || !author)
    return res.status(400).json({ message: 'Title and author are required' });

  book.title = title;
  book.author = author;
  res.json(book);
});

// Delete
router.delete('/:id', (req, res) => {
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Book not found' });

  const deleted = books.splice(index, 1);
  res.json({ message: 'Book deleted', book: deleted[0] });
});

module.exports = router;
