const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some((user) => user.username === username);
}

const authenticatedUser = (username, password) => {
  return users.some((user) => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string" || !authenticatedUser(username.trim(), password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const token = jwt.sign({ username: username.trim() }, "secretkey", { expiresIn: "1h" });
  return res.status(200).json({ message: "User successfully logged in", token });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  const { review } = req.body;
  if (typeof review !== "string" || !review.trim()) {
    return res.status(400).json({ message: "A non-empty review is required" });
  }
  book.reviews[req.username] = review.trim();
  return res.status(200).json({
    message: "Review added or updated successfully",
    reviews: book.reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!Object.prototype.hasOwnProperty.call(book.reviews, req.username)) {
    return res.status(404).json({ message: "Review not found for this user", reviews: book.reviews });
  }
  delete book.reviews[req.username];
  return res.status(200).json({ message: "Review deleted successfully", reviews: book.reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some((user) => user.username === username);
}

const authenticatedUser = (username, password) => {
  return users.some((user) => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string" || !authenticatedUser(username.trim(), password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const token = jwt.sign({ username: username.trim() }, "secretkey", { expiresIn: "1h" });
  return res.status(200).json({ message: "User successfully logged in", token });
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  const { review } = req.body;
  if (typeof review !== "string" || !review.trim()) {
    return res.status(400).json({ message: "A non-empty review is required" });
  }
  book.reviews[req.username] = review.trim();
  return res.status(200).json({
    message: "Review added or updated successfully",
    reviews: book.reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
