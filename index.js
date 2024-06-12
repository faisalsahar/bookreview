const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const secretPhrase = require('./router/auth_users.js').secretPhrase;
const genl_routes = require('./router/general.js').general;
const isValid = require('./router/auth_users.js').isValid;

const app = express();
app.use(express.json());
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))
app.use("/customer/auth/*", function auth(req,res,next){
    token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({"message": "please send bearer token"});
    }
    else {
        token = token.slice(7, token.length).trim();
        user = jwt.verify(token, secretPhrase);
        if (isValid) {
            next();
        }
        else {
            console.log("User is not valid!");
        }
    }
    //Write the authenication mechanism here
    
});
const PORT =5000;
app.use("/customer", customer_routes);
app.use("/", genl_routes);
app.listen(PORT,()=>console.log("Server is running"));
