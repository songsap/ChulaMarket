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
        let alertMessage = req.flash('error')
        let warningMessage = req.flash('waring')
        let successMessage = req.flash('success')
        res.render('product_detail',{product_data : product,shop_data : shop,balance : account.balance,alertMessage : alertMessage[0],warningMessage : warningMessage[0],successMessage : successMessage[0]})
        //res.render('test')
    } catch(err) {
        throw err
    }
})

router.post('/productdetail/:id',isSignin ,async (req,res) => {
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
        let address = await prisma.address.findFirst({
            where : {
                student_id : student_id
            }
        })
        let stockAmount = parseInt(product.amount)
        let buyAmount = parseInt(req.body.buyAmount)
        let productPrice = parseInt(product.price)
        let totalprice = buyAmount * productPrice
        let balance = account.balance
        let buyerAddress = address.address
        if(buyAmount > stockAmount){
            //กรณีที่ซื้อมากกว่าที่มีใน stock
            req.flash('error', 'Not enough product to sell');
            res.redirect(`/product/productdetail/${req.params.id}`);
            return
        }
        else if(totalprice > balance){
            //กรณีที่ราคารวมสินค้ามากกว่าเงินในบัญชีลูกค้า
            req.flash('error', 'Not eough money to buy!!!');
            res.redirect(`/product/productdetail/${req.params.id}`);
            return
        }
        else if(buyerAddress == "your address"){
            //กรณีที่ยังไม่อัพเดทที่อยู่จัดส่ง
            req.flash('waring', 'Please update your address');
            res.redirect(`/product/productdetail/${req.params.id}`);
            return
        }
        account = await prisma.account.update({
            where : {
                id : account.id
            },
            data : {
                balance : balance - totalprice
            }
        })
        product = await prisma.product.update({
            where : {
                id : parseInt(req.params.id)
            },
            data : {
                amount : String(stockAmount - buyAmount)
            }
        })
        console.log(product)
        let order = await prisma.order.create({
            data : {
                student_id_seller : shop.student_id,
                shop_id : shop.id,
                shop_name : shop.name,
                product_id : product.id,
                product_name : product.name,
                productImage : product.imageUrl,
                student_id_buyer : student_id,
                address_buyer : buyerAddress,
                amount : buyAmount,
                product_price : productPrice,
                totalprice : totalprice,
                status : "Order Confirmed",
                track : "",
                shippingCompany_id : 1
            }
        })
        console.log(order)
        //res.send('kuay')
        req.flash('success', 'buying success');
        //res.redirect(`/order/`)
        //res.redirect(`/product/productdetail/2`)
        res.redirect(`/product/productdetail/${req.params.id}`);
    } catch(err) {
        console.error(err);
        throw err
    }
})



module.exports = router;