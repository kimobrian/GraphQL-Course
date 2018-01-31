const express = require('express');
 
const PORT = 3500;
 
const app = express();
 
app.use('/posts', (req, res)=> {
  res.send("Welcome to Our Author/Posts App");
});
 
app.listen(PORT, ()=> {
  console.log("Server Running on Port:", PORT);
});