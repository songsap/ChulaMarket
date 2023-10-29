const Prisma = require('@prisma/client');
const prisma = new Prisma.PrismaClient();
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let secretCode = 'cannabisisthebestkey';
let isSignin = require('./auth')
const multer = require('multer');

router.get('/',isSignin, async (req,res) => {
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
        let order = await prisma.order.findMany({
            where : {
                student_id_buyer : student_id
            }
        })
        let message = req.flash('error')
        res.render('your_order_list',{order_data : order,balance : account.balance})
    } catch(err) {
        throw err
    }
})

router.get('/:id',isSignin, async (req,res) => {
    //console.log(req.session)
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
        let order = await prisma.order.findUnique({
            where : {
                id : parseInt(req.params.id)
            }
        })
        console.log(order)
        let shippingCompany = await prisma.groupShippingCompany.findUnique({
            where : {
                id : order.shippingCompany_id
            }
        })
        let product = await prisma.product.findUnique({
            where : {
                id : order.product_id
            }
        })
        //res.send('kuay')
        res.render('your_order_status',{order_data : order,balance :account.balance,shippingCompany_data : shippingCompany,product_data : product})
    } catch(err) {
        console.log(err)
        throw err
    }
})

router.post('/:id',isSignin ,async (req,res) => {
    try{
        let user = jwt.verify(req.session.token,secretCode)
        let student = await prisma.user.findUnique({
            where : {
                id : user.id
            }
        })
        let student_id = student.student_id
        let order = await prisma.order.update({
            where : {
                id : parseInt(req.params.id)
            },
            data : {
                status : "shipped"
            }
        })
        let account = await prisma.account.findFirst({
            where : {
                student_id : order.student_id_seller
            }
        })
        account = await prisma.account.update({
            where : {
                id : account.id
            },
            data : {
                balance : account.balance + order.totalprice
            }
        })
        res.redirect('/yourorder/')
    } catch(err) {
        throw err
    }
})

module.exports = router;