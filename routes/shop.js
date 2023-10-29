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
        let shop
        let search = req.query.search
        console.log(req.query)
        if(search != undefined){
            shop = await prisma.shop.findMany({
                where : {
                    student_id : {
                        not : student_id
                    },
                    OR: [
                        {
                          name: {
                            contains: search
                          }
                        },
                        {
                          description: {
                            contains: search
                          }
                        }
                    ]
                }
            })
        }
        else{
            shop = await prisma.shop.findMany({
                where : {
                    student_id : {
                        not : student_id
                    }
                }
            })
        }
        res.render('shop',{shop_data : shop,balance : account.balance})
    } catch(err) {
        throw(err)
    }
})

router.get('/:id',isSignin, async (req,res) =>{
    
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
        let shop = await prisma.shop.findUnique({
            where : {
                id : parseInt(req.params.id)
            }
        })
        let product = await prisma.product.findMany({
            where : {
                shop_id : parseInt(req.params.id)
            }
        })
        res.render('shop_product',{product_data : product,shop_data : shop,balance : account.balance})
        //res.send(product)
    } catch(err) {
        throw err
    }
})


module.exports = router;