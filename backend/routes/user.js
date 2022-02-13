const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Thread = require('../models/thread')
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
        if (!user) res.send(false);
        else {
            req.logIn(user, err => {
                if (err) throw err;
                res.send(req.user);
            })
        }
    })(req, res, next);
})

router.get('/logout', (req, res) => {
    if (req.user) {
        req.logOut();
        res.send(true);
    } else {
        res.send(false);
    }
})

router.post('/register', async (req, res) => {
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

router.get('/getUser', (req, res) => {
    if (req.user) {
        res.send(req.user);
    } else {
        res.send(false);
    }
})

router.post('/getUserByUsername', (req, res) =>{
    const {username} = req.body;
    if(username){
        User.findOne({username: username}).then((data) => {
            if(data){
                res.send({_id: data._id, username: data.username, bio: data.bio, avata: data.avata});
            }else{
                res.send(false);
            }
        }).catch(err => console.log(err))
    }
})

router.post('/getUserById', (req, res) =>{
    const {id} = req.body;
    if(id){
        User.findOne({_id: id}).then((data) =>{
            if(data){
                res.send({_id: data._id, username: data.username, bio: data.bio, avata: data.avata})
            }else{
                res.send(false)
            }
        }).catch((error) => console.log(error));
    }
})

router.post('/uploadAvata', upload.single('avata'), (req, res) => {
    if (req.user) {
        User.findOne({ _id: req.user._id }).then((usr) => {
            if(usr.avata){
                res.send(true)
            }else{
                usr.avata = true
                usr.save().then(res.send(true))
            }
        })
    }else{
        res.send(false)
    }
})

router.post('/updateBio', (req, res) =>{
    const {bio} = req.body;
    if(req.user){
        User.findById({_id: req.user._id}).then((usr) => {
            usr.bio = bio;
            usr.save().then(()=> res.send(true));
        });
    }else{
        res.send(false)
    }
})

router.post('/vote', async (req, res) => {
    const {thread, vote} = req.body;
    if(req.user){
        var thread2update = await Thread.findById({_id: thread});
        let usr = await User.findById({_id: req.user._id})
        let usrVote = usr.votes.find((el) => el.thread == thread)
        if(usrVote){
            if(usrVote.vote != vote){
                //flip vote
                voteIndex = usr.votes.findIndex((el) => el.thread == thread)
                usr.votes[voteIndex].vote = vote
                await usr.save()
                vote ? thread2update.points += 2 : thread2update.points += -2
                thread2update.save()
            }
        }else{
            //no vote found, lets add one.
            const newVote = {
                thread: thread,
                vote:  vote
            }
            usr.votes.push(newVote);
            await usr.save()
            vote ? thread2update.points += 1 : thread2update.points += -1
            thread2update.save()
        }
    }
})

module.exports = router