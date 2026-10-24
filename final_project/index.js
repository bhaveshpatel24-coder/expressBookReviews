const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
  const authorization = req.headers.authorization;
  if (typeof authorization !== "string" || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }
  try {
    const payload = jwt.verify(authorization.slice(7), "secretkey");
    if (typeof payload !== "object" || typeof payload.username !== "string") {
      return res.status(401).json({ message: "Invalid authentication token" });
    }
    req.username = payload.username;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired authentication token" });
  }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
