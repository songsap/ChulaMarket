const Prisma = require('@prisma/client');
const prisma = new Prisma.PrismaClient()
var express = require('express');
var router = express.Router();
let isSignin = require('./auth')
/* GET home page. */

router.get('/', (req,res) => {

})

module.exports = router;
