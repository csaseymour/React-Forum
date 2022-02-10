const express = require('express')
const router = express.Router()
const User = require('../models/user')
const multer = require('multer')
const bcrypt = require('bcryptjs')
const passport = require('passport')

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/avata')
    },
    filename: (req, file, cb) => {
        cb(null, req.user._id + '.png')
    }
});

var upload = multer({ storage: storage })

router.post('/login', (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) throw err;
        if (!user) res.send({ errors: ["incorrect credentials!"] });
        else {
            req.logIn(user, err => {
                if (err) throw err;
                res.send(req.user);
                console.log(req.user.username + " Has Logged In!");
            })
        }
    })(req, res, next);
})

router.get('/logout', (req, res, next) => {
    if (req.user) {
        console.log(`${req.user.username} Has Logged out!`);
        req.logOut();
        res.send('logged out');
    } else {
        res.send("logout requested without user");
    }
})

router.post('/register', async (req, res, next) => {
    console.log(req.body);
    const { username, password, email } = req.body;
    const errors = [];
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        errors.push("username can only contain letters and numbers");
    }
    var check = await User.findOne({ username: username });
    if (check != null) {
        errors.push("username already taken!");
    }
    if (username == null || username.length == 0) {
        errors.push("username must contain a character");
    }
    if (errors.length > 0) {
        res.send({ errors: errors });
    } else {
        //create user
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) throw (err);
                const user = new User({
                    username: username,
                    password: hash,
                    email: email
                })
                user.save().then((data) => res.send(data));
            });
        });
    }
})

router.get('/getUser', (req, res, next) => {
    if (req.user) {
        console.log(req.user.username + " has connected");
        res.send(req.user);
    } else {
        console.log("annon");
        res.send(false);
    }
})

router.post('/getUserByUsername', (req, res) =>{
    const {username} = req.body;
    if(username){
        User.findOne({username: username}).then((data) => {
            if(data){
                res.send(data);
            }else{
                res.send({error: true});
            }
        }).catch(err => console.log(err))
    }
})

router.post('/getUserById', (req, res) =>{
    const {id} = req.body;
    if(id){
        User.findOne({_id: id}).then((data) =>{
            if(data){
                res.send(data)
            }else{
                res.send(false)
            }
        }).catch((error) => console.log(error));
    }
})

router.post('/uploadAvata', upload.single('avata'), (req, res, next) => {
    if (req.user) {
        console.log(req.user.username);
        User.findOne({ _id: req.user._id }).then((usr) => {
            if(usr.avata){
                res.send(true)
            }else{
                usr.avata = true
                usr.save().then(res.send(true))
            }
        })
    }
})

router.post('/updateBio', (req, res) =>{
    const {bio} = req.body;
    if(req.user){
        //we have a user
        User.findById({_id: req.user._id}).then((usr) => {
            usr.bio = bio;
            usr.save().then(()=> res.send(true));
        });
    }
})

module.exports = router