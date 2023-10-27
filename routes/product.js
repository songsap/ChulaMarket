const Prisma = require('@prisma/client');
const prisma = new Prisma.PrismaClient();
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let secretCode = 'cannabisisthebestkey';
let isSignin = require('./auth')
const multer = require('multer');

router.get('/productdetail/:id',isSignin, async (req,res) =>{
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
        let product = await prisma.product.findUnique({
            where : {
                id : parseInt(req.params.id)
            }
        })
        let shop = await prisma.shop.findUnique({
            where : {
                id : product.shop_id
            }
        })
        console.log(shop)
        console.log(product)
        res.render('product_detail',{product_data : product,shop_data : shop,balance : account.balance})
        //res.render('test')
    } catch(err) {
        throw err
    }
})

router.get('/kuay/:id',isSignin, async (req,res) => {
    res.render('test')
    /*
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
        let product = await prisma.product.findUnique({
            where : {
                id : parseInt(req.params.id)
            }
        })
        let shop = await prisma.shop.findUnique({
            where : {
                id : product.shop_id
            }
        })
        console.log(shop)
        console.log(product)
        res.render('test',{product_data : product,shop_data : shop,balance : account.balance})
        //res.render('test')
    } catch(err) {
        throw err
    }
    */
})

module.exports = router;