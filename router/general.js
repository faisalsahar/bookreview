const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const {regUser, regPass} = req.body;
    if (regUser && regPass) {
      users.push({username: regUser, password: regPass});
      res.json({"message": "user has been registered"});
    }
    else 
    {
      res.status(401).json({"message": "require both username and password"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    for (let book in books) {
       if (book === isbn) {
          res.json(books[book]);
       }
    }

    res.json({message: "ISBN not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  for (let book in books) {
    if (books[book].author === author) {
      return res.json(books[book]);
    }
  }
  return res.json({message: "author not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  for (let book in books) {
    if (books[book].title === title) {
      return res.json(books[book]);
    }
  }
  return res.json({message: "title not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
    for (let book in books) {
       if (book === isbn) {
          res.json(books[book].reviews);
       }
    }

    res.json({message: "ISBN not found"});
  
});

module.exports.general = public_users;
