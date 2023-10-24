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

const isRegisterShop = async (req,res,next) => {
    let user = jwt.verify(req.session.token,secretCode)
    let student = await prisma.user.findUnique({
        where : {
            id : user.id
        }
    })
    let student_id = student.student_id
    try{
        let shop = await prisma.shop.findFirst({
            where : {
                student_id : student_id
            }
        })
        console.log(shop)
        if(shop != undefined){
            next(); //มี shop แล้ว
        }
        else{
            res.redirect('/yourshop/registerShop')
        }
    } catch(err) {
        throw err
    }
}

router.get('/yourShop',isSignin,isRegisterShop, (req,res) => {
    //res.render('your_shop')
    res.send('yourShop')
})

router.get('/registerShop',isSignin, (req,res) => {
    res.render('register_shop',{shop_data : {}})
})

let shopImageStorage = multer.diskStorage({
    destination: 'C://Users/USER/Desktop/10dayproject/cu_market/app/public/images/shopImage/',
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
});
  
let upload = multer({ storage : shopImageStorage });
  
router.post('/registerShop', isSignin, upload.single('img'), async (req, res) => {
    try {
        let user = jwt.verify(req.session.token, secretCode);
        let student = await prisma.user.findUnique({
            where : {
                id : user.id
            },
        })
        let student_id = student.student_id
        let account = await prisma.account.findFirst({
            where: {
                student_id: student_id,
            },
        });
        let shop = await prisma.shop.create({
            data: {
                name: req.body.name,
                description: req.body.description,
                imageUrl: req.file.originalname, // Multer จัดการรายละเอียดไฟล์
                student_id: student_id,
                account_id: account.id,
            },
        });
        if (!shop) {
            res.status(401).send('Shop not created');
            return;
        }
        res.redirect('/yourshop/yourShop');
    } catch (err) {
        console.log(err)
        res.status(500).send('Create shop Error');
    }
});

router.get('/editShop',isSignin, async (req,res) => {
    let user = jwt.verify(req.session.token,secretCode)
    let student = await prisma.user.findUnique({
        where : {
            id : user.id
        },
    })
    let student_id = student.student_id
    let shop = await prisma.shop.findFirst({
        where : {
            student_id : student_id
        }
    })
    res.render('register_shop',{shop_data : shop})
})

router.post('/editShop',isSignin, upload.single('img'),async (req,res) => {
    try {
        let user = jwt.verify(req.session.token, secretCode);
        let student = await prisma.user.findUnique({
            where : {
                id : user.id
            },
        })
        let student_id = student.student_id
        let account = await prisma.account.findFirst({
            where: {
                student_id: student_id,
            },
        });
        let shop_ = await prisma.shop.findFirst({
            where : {
                student_id : student_id
            }
        })
        let shop = await prisma.shop.update({
            where : {
                id : shop_.id
            },
            data: {
                name: req.body.name,
                description: req.body.description,
                imageUrl: req.file, // Multer จัดการรายละเอียดไฟล์
                student_id: student_id,
                account_id: account.id,
            },
        })
        if (!shop) {
            res.status(401).send('Shop not created');
            return;
        }
        res.redirect('/yourshop/yourShop');
    } catch (err) {
        console.log(err)
        res.status(500).send('Create shop Error');
    }
})
module.exports = router;