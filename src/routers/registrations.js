const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const prisma = require("../utils/prisma.js");

router.post("/", async (req, res) => {
  // Get the username and password from request body
  const username = req.body.username;
  const password = req.body.password;

  // Hash the password: https://github.com/kelektiv/node.bcrypt.js#with-promises
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save the user using the prisma user model, setting their password to the hashed version
  const createdUser = await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
    },
  });

  // Respond back to the client with the created users username and id
  res.status(201).json({ user: createdUser });
});

module.exports = router;
