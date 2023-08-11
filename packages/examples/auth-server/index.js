// Import libraries
const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// Server code
const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.get("/get_token", (req, res) => {
  // endpoint to retrieve JWT

  // read private key
  const privateKey = fs.readFileSync(__dirname + "/private_key.pem");

  // Create payload and JWT
  var access_token = jwt.sign({}, privateKey, {
    algorithm: "RS256", // algo used to create JWT, change to ES256 if necessary
    expiresIn: "2d", // set a 2 day expiration
  });

  return res.json({ access_token }); // return an object containing the signed JWT
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`); // listen to connections on the specified host and port
});
