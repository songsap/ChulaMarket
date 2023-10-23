const Prisma = require('@prisma/client');
const prisma = new Prisma.PrismaClient();
let express = require('express');
let router = express.Router();

router.get('/createuser',async (req,res) => {
    //let data = req.body
    //console.log(req.session)
    res.render('index', { title: 'Express' });
    let x = await prisma.user.findUnique({
        where : {
            student_id : "6632089021"
        }
    })
    console.log(x)
})

module.exports = router;