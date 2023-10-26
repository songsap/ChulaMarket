const Prisma = require('@prisma/client');
const prisma = new Prisma.PrismaClient()
var express = require('express');
var router = express.Router();
let isSignin = require('./auth')
let jwt = require('jsonwebtoken');
let secretCode = 'cannabisisthebestkey';
/* GET home page. */

router.get('/',isSignin, async (req,res) => {
    let user = jwt.verify(req.session.token,secretCode)
    let student = await prisma.user.findUnique({
        where : {
            id : user.id
        },
    })
    let student_id = student.student_id
    let account = await prisma.account.findFirst({
        where : {
            student_id : student_id
        }
    })
    let product = await prisma.product.findMany()
    res.render('home',{product_data : product,balance : account.balance})
})

module.exports = router;
