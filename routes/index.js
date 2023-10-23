const Prisma = require('@prisma/client');
const prisma = new Prisma.PrismaClient()
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
