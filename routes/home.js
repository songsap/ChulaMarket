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
    console.log(req.query)
    let search = req.query.search
    let searchGroupProduct = req.query.groupProduct_id
    let searchGroupProduct_name
    if(searchGroupProduct){
        searchGroupProduct_name = await prisma.groupProduct.findFirst({
            where : {
                id : parseInt(searchGroupProduct)
            }
        })
    }
    let product
    if(searchGroupProduct){
        if(search == "" && searchGroupProduct_name.name == "all product"){
            product = await prisma.product.findMany({
                where : {
                    student_id : {
                        not : student_id
                    }
                }
            })
        }   
        else if(search != "" && searchGroupProduct_name.name != "all product"){
            product = await prisma.product.findMany({
                where : {
                    student_id : {
                        not : student_id
                    },
                    name : {
                        contains : search
                    },
                    groupProduct_id : parseInt(searchGroupProduct)
                }
            })
        }
        else if(search == "" && searchGroupProduct_name.name != "all product"){
            product = await prisma.product.findMany({
                where : {
                    student_id : {
                        not : student_id
                    },
                    groupProduct_id : parseInt(searchGroupProduct)
                }
            })
        }
        else{
            product = await prisma.product.findMany({
                where : {
                    student_id : {
                        not : student_id
                    },
                    name : {
                        contains : search
                    },
                }
            })
        }
    }
    else{
        product = await prisma.product.findMany({
            where : {
                student_id : {
                    not : student_id
                }
            }
        })
    }
    let groupProduct = await prisma.groupProduct.findMany()
    res.render('home',{product_data : product,balance : account.balance,groupProduct_data : groupProduct})
})

module.exports = router;
