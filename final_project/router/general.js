const express = require('express');
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const booksApiUrl = process.env.BOOKS_API_URL || "http://127.0.0.1:5000/";

async function fetchBooks() {
  const response = await axios.get(booksApiUrl);
  if (!response.data || typeof response.data !== "object" || Array.isArray(response.data)) {
    throw new Error("Books API returned an invalid response");
  }
  return response.data;
}

function handleBooksApiError(res, error) {
  console.error("Books API request failed:", error.message);
  return res.status(502).json({ message: "Unable to retrieve books" });
}

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || !username.trim() || typeof password !== "string" || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username.trim())) {
    return res.status(409).json({ message: "User already exists" });
  }
  users.push({ username: username.trim(), password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

public_users.get('/', function (req, res) {
  return res.status(200).json(require("./booksdb.js"));
});

public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const books = await fetchBooks();
    const book = books[req.params.isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json(book);
  } catch (error) {
    return handleBooksApiError(res, error);
  }
});

public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author.trim().toLocaleLowerCase();
    const books = await fetchBooks();
    const matchingBooks = Object.entries(books)
      .filter(([, book]) => typeof book.author === "string" && book.author.trim().toLocaleLowerCase() === author)
      .map(([isbn, book]) => ({ isbn, ...book }));
    if (matchingBooks.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }
    return res.status(200).json(matchingBooks);
  } catch (error) {
    return handleBooksApiError(res, error);
  }
});

public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title.trim().toLocaleLowerCase();
    const books = await fetchBooks();
    const matchingBooks = Object.entries(books)
      .filter(([, book]) => typeof book.title === "string" && book.title.trim().toLocaleLowerCase() === title)
      .map(([isbn, book]) => ({ isbn, ...book }));
    if (matchingBooks.length === 0) {
      return res.status(404).json({ message: "No books found with this title" });
    }
    return res.status(200).json(matchingBooks);
  } catch (error) {
    return handleBooksApiError(res, error);
  }
});

public_users.get('/review/:isbn', function (req, res) {
  const books = require("./booksdb.js");
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || !username.trim() || typeof password !== "string" || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username.trim())) {
    return res.status(409).json({ message: "User already exists" });
  }
  users.push({ username: username.trim(), password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book);
});

public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();
  const matchingBooks = Object.entries(books)
    .filter(([, book]) => book.author.toLowerCase() === author)
    .map(([isbn, book]) => ({ isbn, ...book }));
  return res.status(200).json(matchingBooks);
});

public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  const matchingBooks = Object.entries(books)
    .filter(([, book]) => book.title.toLowerCase() === title)
    .map(([isbn, book]) => ({ isbn, ...book }));
  return res.status(200).json(matchingBooks);
});

public_users.get('/review/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || !username.trim() || typeof password !== "string" || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username.trim())) {
    return res.status(409).json({ message: "User already exists" });
  }
  users.push({ username: username.trim(), password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book);
});

public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();
  const matchingBooks = Object.entries(books)
    .filter(([, book]) => book.author.toLowerCase() === author)
    .map(([isbn, book]) => ({ isbn, ...book }));
  return res.status(200).json(matchingBooks);
});

public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  const matchingBooks = Object.entries(books)
    .filter(([, book]) => book.title.toLowerCase() === title)
    .map(([isbn, book]) => ({ isbn, ...book }));
  return res.status(200).json(matchingBooks);
});

public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || !username.trim() || typeof password !== "string" || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username.trim())) {
    return res.status(409).json({ message: "User already exists" });
  }
  users.push({ username: username.trim(), password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();
  const matchingBooks = Object.entries(books)
    .filter(([, book]) => book.author.toLowerCase() === author)
    .map(([isbn, book]) => ({ isbn, ...book }));
  return res.status(200).json(matchingBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || !username.trim() || typeof password !== "string" || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username.trim())) {
    return res.status(409).json({ message: "User already exists" });
  }
  users.push({ username: username.trim(), password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || !username.trim() || typeof password !== "string" || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username.trim())) {
    return res.status(409).json({ message: "User already exists" });
  }
  users.push({ username: username.trim(), password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || !username.trim() || typeof password !== "string" || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username.trim())) {
    return res.status(409).json({ message: "User already exists" });
  }
  users.push({ username: username.trim(), password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
