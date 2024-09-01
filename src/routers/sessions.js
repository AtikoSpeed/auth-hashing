const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma.js");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  // Get the username and password from the request body

  const foundUser = await prisma.user.findUnique({
    where: { username: username },
  });
  // Check that a user with that username exists in the database
  if (foundUser) {
    const passwordIsCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );
    // Use bcrypt to check that the provided password matches the hashed password on the user
    if (passwordIsCorrect) {
      const token = jwt.sign(username, process.env.JWT_SECRET);
      // If the user exists and the passwords match, create a JWT containing the username in the payload
      // Use the JWT_SECRET environment variable for the secret key
      res.json({ token });
      // Send a JSON object with a "token" key back to the client, the value is the JWT created
    } else {
      res.status(401).json({ error: "Invalid password" });
      // If either of these checks fail, respond with a 401 "Invalid username or password" error
    }
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

module.exports = router;
