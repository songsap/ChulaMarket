const Prisma = require('@prisma/client');
const prisma = new Prisma.PrismaClient()
let jwt = require('jsonwebtoken');
let secretCode = 'cannabisisthebestkey';
let session = require('express-session');
var express = require('express');
var router = express.Router();
let flash = require('express-flash');

router.use(flash());

router.get('/signin',  (req,res) => {
  let alertMessage = req.flash('error')
  res.render('sign_in',{alertMessage : alertMessage[0]})
})

router.post('/signin', async (req,res) => {
  let student_id = req.body.student_id
  let password = req.body.password
  try{
    let user = await prisma.user.findUnique({
      where : {
        student_id : student_id,
      }
    })
    if (!user) {
      req.flash('error', 'User not found');
      res.redirect(`/auth/signin`)
      return;
    }
    if(user.password != password){
      //res.status(401).send('Username or password invalid');
      req.flash('error', 'Student id or password invalid');
      res.redirect(`/auth/signin`)
      return;
    }
    let id = user.id
    let name = user.name
    let token = jwt.sign({id : id},secretCode);
    req.session.token = token;
    req.session.name = name;
    res.redirect('/home/')
  } catch(err) {
    throw err
  }
})

router.get('/signup', (req,res) => {
  res.render('sign_up')
})

router.post('/signup', async (req,res) => {
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
    try{
      let address = await prisma.address.create({
        data : {
          student_id : user.student_id,
          address : "your address"
        }
      })
      if (!address) {
        res.status(401).send('Address not created');
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
    res.redirect('/home/')
    //res.send('sign up success')
  } catch(err) {
    throw err
  }
})

const isSignin = (req,res,next) => {
  if(req.session.token != undefined){
    next(); //แปลว่าได้มีการ signin แล้ว
  }
  else{
    res.redirect('/auth/signin');
  }
}

router.get('/logout',isSignin, async(req,res) => {
  req.session.destroy();
  res.redirect('/auth/signin')
})

module.exports = [router,isSignin];
