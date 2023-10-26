const Prisma = require('@prisma/client');
const prisma = new Prisma.PrismaClient();
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let secretCode = 'cannabisisthebestkey';
let isSignin = require('./auth')
let formidable = require('formidable');
let fs = require('fs')
const multer = require('multer');

router.get('/',isSignin ,async (req,res) => {
    try{
        let user = jwt.verify(req.session.token,secretCode)
        let student = await prisma.user.findUnique({
            where : {
                id : user.id
            }
        })
        let student_id = student.student_id
        let account = await prisma.account.findFirst({
            where : {
                student_id : student_id
            }
        })
        let shop = await prisma.shop.findMany()
        res.render('shop',{shop_data : shop,balance : account.balance})
    } catch(err) {
        throw(err)
    }
})



module.exports = router;