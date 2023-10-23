const Prisma = require('@prisma/client');
const prisma = new Prisma.PrismaClient()
let jwt = require('jsonwebtoken');
let secretCode = 'cannabisisthebestkey';
let session = require('express-session');
var express = require('express');
var router = express.Router();

router.use(session({
  secret: 'cannabisisthebestsession',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge : 30 * 24 * 60 * 60 * 1000
  }
}))

router.use((req,res,next) => {
  res.locals.session = req.session;
  next()
})

router.get('/signin',  (req,res) => {
  res.render('sign_in')
})

router.post('/signin', async (req,res) => {
  let student_id = req.body.student_id
  let password = req.body.password
  console.log(student_id)
  try{
    let user = await prisma.user.findUnique({
      where : {
        student_id : student_id,
      }
    })
    if (!user) {
      res.status(401).send('User not found');
      return;
    }

    if(user.password != password){
      //res.status(401).send('Username or password invalid');
      res.redirect('/auth/signin')
      return;
    }
    let id = user.id
    let name = user.name
    let token = jwt.sign({id : id},secretCode);
    req.session.token = token;
    req.session.name = name;
    //console.log(req.session)
    res.send('sign in success')
    //res.redirect('/user/createuser')
  } catch(err) {
    throw err
  }
})

router.get('/signup', (req,res) => {
  res.render('sign_up')
})

router.post('/signup', async (req,res) => {
  //let data = req.body
  let student_id = req.body.student_id
  let password = req.body.password
  let user_name = req.body.name
  let telephone = req.body.telephone
  let email = req.body.email
  try{
    let user = await prisma.user.create({
      data : {
        name : user_name,
        student_id : student_id,
        password : password,
        telephone : telephone,
        email : email
      }
    })
    if (!user) {
      res.status(401).send('User not created');
      return;
    }
    try{
      let account = await prisma.account.create({
        data : {
          balance : 10000,
          student_id : user.student_id,
        }
      })
      if (!account) {
        res.status(401).send('Account not created');
        return;
      }
    } catch(err) {
      throw err
    }
    let id = user.id
    let name = user.name
    let token = jwt.sign({id : id},secretCode);
    req.session.token = token;
    req.session.name = name;
    res.send('sign up success')
  } catch(err) {
    throw err
  }
})


module.exports = router;
