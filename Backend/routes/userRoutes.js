const express = require('express');
const router = express.Router();
const prisma = require('../config/prismaClient');

// GET all users
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

module.exports = router;
