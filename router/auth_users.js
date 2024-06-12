const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const secretPhrase   = "myOwnSecretPhrase"; // supposedly secure somewhere. 

let users = [
  { username: "john", password: "john123"},
  { username: "jacob", password: "jacob123"},
  { username: "smith", password: "smith123"},
  { username: "shankar", password: "shankar123"},
  { username: "rabail", password: "rabail123"}
]; 


const  getToken = (username, secretPhrase) => {
    return jwt.sign(username, secretPhrase);
} 

const isValid = (username, wholeRecord = false)=>{ //returns boolean
    
    let toReturn = false;
    users.forEach((element)=>{
      if (element.username === username) {
        if (wholeRecord) {
            toReturn = element;
        }
        else 
        {
          toReturn = false;
        }
      }
    });
    return toReturn;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const user = isValid(username, true);
    if (user) {
      if (user.password === password) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password } = req.body;
    if (username && password) {
      if (authenticatedUser(username, password)) {
        return res.json({"message" : "Your credentials have been accepted please use the token to authorize your requests", "token": getToken(username, secretPhrase)});   
      }
      else 
      {
        return res.status(401).json({"message": "Invalid credentials"});
      }
      
    }
    else {
      return res.status(401).json({"message": "Please enter username and password!"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
  const review = req.body;
  if (review) {
    books[req.params.isbn].reviews = { ...books[req.params.isbn].reviews, review };
    return res.json({"message" : "Review added successfully"});
  }
  else {
    return res.status(300).json({message: "Please put review"});
  }
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.secretPhrase = secretPhrase;