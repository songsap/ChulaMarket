const Prisma = require('@prisma/client');
const prisma = new Prisma.PrismaClient();
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let secretCode = 'cannabisisthebestkey';
let isSignin = require('./auth')

router.get('/profile',isSignin, async (req,res) => {
    let token = req.session.token
    let id = (jwt.verify(token,secretCode)).id
    let user,address,account
    try{
        user = await prisma.user.findUnique({
            where : {
                id : id
            }
        })
    } catch(err) {
        throw err
    }
    try{
        address = await prisma.address.findFirst({
            where : {
                student_id : user.student_id,
            }
        })
    } catch(err) {
        throw err
    }
    try{
        account = await prisma.account.findFirst({
            where : {
                student_id : user.student_id
            }
        })
    } catch(err) {
        throw err
    }
    //console.log(address)
    res.render('profile',{user_data : user,address : address.address,balance : account.balance})
    //console.log(req.session.balance)
    //res.send('kuay')
})

router.post('/profile',isSignin, async (req,res) => {
    try{
        user = await prisma.user.findUnique({where : {student_id:req.body.student_id}})
        let user_id = user.id
        await prisma.user.update({
            where : {
                id : user_id
            },
            data : {
                student_id : req.body.student_id,
                password : req.body.password,
                name : req.body.name,
                telephone : req.body.telephone,
                email : req.body.email
            }
        })
        let address = await prisma.address.findFirst({where : {student_id : user.student_id}})
        await prisma.address.update({
            where : {
                id : address.id
            },
            data : {
                address : req.body.address
            }
        })
        res.redirect('/user/profile')
    } catch(err) {
        throw err
    }
})
module.exports = router;