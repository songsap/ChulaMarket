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

router.get('/yourShop',isSignin,isRegisterShop, async (req,res) => {
    //res.render('your_shop')
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
    let product = await prisma.product.findMany({
        where : {
            student_id : student_id
        }
    })
    let shop = await prisma.shop.findFirst({
        where : {
            student_id : student_id
        }
    })
    //res.send('yourShop')
    res.render('yourshop',{balance : account.balance,product_data : product,shop_data : shop})
})

router.get('/registerShop',isSignin, async (req,res) => {
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
    res.render('register_shop',{shop_data : {},balance : account.balance})
})

let shopImageStorage = multer.diskStorage({
    destination: 'C://Users/USER/Desktop/10dayproject/cu_market/app/public/images/shopImage/',
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
});
console.log
let uploadShopImage = multer({ storage : shopImageStorage });
  
router.post('/registerShop', isSignin, uploadShopImage.single('img'), async (req, res) => {
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
    let account = await prisma.account.findFirst({
        where : {
            student_id : student_id
        }
    })
    res.render('register_shop',{shop_data : shop,balance : account.balance})
})

router.post('/editShop',isSignin, uploadShopImage.single('img'),async (req,res) => {
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
        let shop
        if(req.file == undefined){
            shop = await prisma.shop.update({
                where : {
                    id : shop_.id
                },
                data: {
                    name: req.body.name,
                    description: req.body.description,
                    student_id: student_id,
                    account_id: account.id,
                },
            })
        }
        else{
            shop = await prisma.shop.update({
                where : {
                    id : shop_.id
                },
                data: {
                    name: req.body.name,
                    description: req.body.description,
                    imageUrl: req.file.filename, // Multer จัดการรายละเอียดไฟล์
                    student_id: student_id,
                    account_id: account.id,
                },
            })
        }
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

router.get('/addproduct',isSignin, async (req,res) => {
    let user = jwt.verify(req.session.token,secretCode)
    try{
        let student = await prisma.user.findUnique({
            where : {
                id : user.id
            }
        })
        let student_id = student.student_id
        let shop = await prisma.shop.findFirst({
            where : {
                student_id : student_id
            }
        })
        let account = await prisma.account.findFirst({
            where : {
                student_id : student_id
            }
        })
        let groupProduct = await prisma.groupProduct.findMany({
            where : {
                name : {
                    not : "all product"
                }
            }
        })
        res.render('add_product',{product_data : {},groupProduct_data : groupProduct,balance : account.balance})
    } catch(err){
        throw err
    }
})

let productImageStorage = multer.diskStorage({
    destination: 'C://Users/USER/Desktop/10dayproject/cu_market/app/public/images/productImage/',
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
});
  
let uploadProduct = multer({ storage : productImageStorage });

router.post('/addproduct',isSignin,uploadProduct.single('img'), async (req,res) => {
    try{
        let user = jwt.verify(req.session.token, secretCode);
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
        console.log(req.file)
        let product = await prisma.product.create({
            data : {
                shop_id : shop.id,
                student_id : student_id,
                name : req.body.name,
                groupProduct_id : parseInt(req.body.groupProduct_id),
                price : req.body.price,
                amount : req.body.amount,
                description : req.body.description,
                imageUrl : req.file.originalname
            }
        })
        console.log(product)
        if(!product){
            res.status(401).send('product not created');
            return;
        }
        res.redirect('/yourshop/yourShop');
    } catch(err) {
        console.log(err)
        throw err
    }
})

router.get('/editProduct/:id',isSignin, async (req,res) => {
    let user = jwt.verify(req.session.token,secretCode)
    try{
        let student = await prisma.user.findUnique({
            where : {
                id : user.id
            }
        })
        let student_id = student.student_id
        let product = await prisma.product.findUnique({
            where : {
                id : parseInt(req.params.id)
            }
        })
        let account = await prisma.account.findFirst({
            where : {
                student_id : student_id
            }
        })
        let groupProduct = await prisma.groupProduct.findMany()
        //console.log(product)
        res.render('add_product',{product_data : product,groupProduct_data : groupProduct,balance : account.balance})
    } catch(err){
        throw err
    }
})

router.post('/editProduct/:id',isSignin,uploadProduct.single('img'), async (req,res) => {
    try{
        let user = jwt.verify(req.session.token, secretCode);
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
        if(req.file == undefined){
            product = await prisma.product.update({
                where : {
                    id : parseInt(req.params.id)
                },
                data : {
                    shop_id : shop.id,
                    student_id : student_id,
                    name : req.body.name,
                    groupProduct_id : parseInt(req.body.groupProduct_id),
                    price : req.body.price,
                    amount : req.body.amount,
                    description : req.body.description,
                }
            })
        }
        else{
            product = await prisma.product.update({
                where : {
                    id : parseInt(req.params.id)
                },
                data : {
                    shop_id : shop.id,
                    student_id : student_id,
                    name : req.body.name,
                    groupProduct_id : parseInt(req.body.groupProduct_id),
                    price : req.body.price,
                    amount : req.body.amount,
                    description : req.body.description,
                    imageUrl : req.file.filename
                }
            })
        }
        if(!product){
            res.status(401).send('product Error Edit');
            return;
        }
        res.redirect('/yourshop/yourShop');
    } catch(err) {
        console.log(err)
        throw err
    }
})

router.get('/deleteProduct/:id',isSignin, async (req,res) => {
    console.log(parseInt(req.params.id))
    try{
        let product = await prisma.product.findUnique({
            where : {
                id : parseInt(req.params.id)
            }
        })
        let path = 'C://Users/USER/Desktop/10dayproject/cu_market/app/public/images/productImage/' + product.imageUrl;
        fs.unlink(path,(err) => {
            if(err){
                throw err
            }
        })
        let deleteProduct = await prisma.product.delete({
            where : {
                id : parseInt(req.params.id)
            }
        })
        res.redirect('/yourshop/yourShop')
    } catch(err) {
        throw err
    }
})

router.get('/shopOrder',isSignin, async(req,res) => {
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
                student_id_seller : student_id
            }
        })
        res.render('shop_order_list',{order_data : order,balance : account.balance})
    } catch(err) {
        throw err
    }
})

router.get('/shopOrder/:id',isSignin, async(req,res) => {
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
        let shippingCompany = await prisma.groupShippingCompany.findMany()
        let shippingCompanySelectedName = await prisma.groupShippingCompany.findUnique({
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
        res.render('shop_order_status',{order_data : order,balance :account.balance,shippingCompany_data : shippingCompany,product_data : product,shippingCompanySelectedName : shippingCompanySelectedName.name})
    } catch(err) {
        console.log(err)
        throw err
    }
})

router.post('/shopOrder/:id',isSignin, async (req,res) => {
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
        let shippingCompany = req.body.shipping
        let track = req.body.track
        order = await prisma.order.update({
            where : {
                id : parseInt(req.params.id)
            },
            data : {
                status : "Delivering",
                track : track,
                shippingCompany_id : parseInt(shippingCompany)
            }
        })
        res.redirect('/yourshop/shopOrder')
    } catch(err) {
        throw err
    }
}) 

module.exports = router;