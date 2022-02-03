const express = require('express')
const router = express.Router()
const Thread = require('../models/thread')
const Tag = require('../models/tag')

router.post('/newThread', async (req, res) => {
    const { title, content, tag } = req.body;
    if (req.user) {
        Tag.findOne({ name: tag }).then((data) => {
            if (data) {
                const thread = new Thread({
                    title: title,
                    content: content,
                    tag: data._id,
                    postedBy: req.user.id
                });
                thread.save().then((response) => {
                    res.send(response);
                    data.posts ? data.posts += 1 : data.posts = 1;
                    data.save();
                }).catch((err) => console.log(err));
            } else {
                var newTag = new Tag({
                    name: tag,
                    createdBy: req.user._id
                });
                newTag.save().then((data) => {
                    const thread = new Thread({
                        title: title,
                        content: content,
                        tag: data._id,
                        postedBy: req.user.id
                    });
                    thread.save().then((response) => {
                        res.send(response);
                    }).catch((err) => console.log(err));
                });
            }
        })
    } else {
        res.send(false);
    }
})

router.post('/comment', (req, res) =>{
    const {post_id, message} = req.body;
    const comment = {
        message: message,
        postedBy: req.user._id,
        createdAt: Date.now()
    }
    Thread.updateOne({_id: post_id}, {
        $push: {comments: comment}
    }).then((data) => {
        if(data){
            res.send(true)
        }else{
            res.send(false)
        }
    })
})

router.post('/getThreads', (req, res) => {
    const { tag, tagName, title } = req.body;
    if (tag) {
        Thread.find({ tag: tag }).populate("postedBy", "username").populate("tag", "name").then((data) => {
            res.send(data);
        }).catch((err) => console.log(err));
    } else if (tagName && title) {
        Tag.findOne({ name: tagName }).then((data) => {
            if (data) {
                Thread.find({ tag: data._id }).populate("postedBy", "username").populate("tag", "name").then((data) => {
                    if (data) {
                        var filteredList = [];
                        data.forEach(thread => {
                            if (thread.title.includes(title)) {
                                filteredList.push(thread);
                            }
                        })
                        res.send(filteredList);
                    } else {
                        res.send(null);
                    }
                })
            } else {
                res.send(null);
            }
        });
    } else if (tagName) {
        Tag.findOne({ name: tagName }).then((data) => {
            if (data) {
                Thread.find({ tag: data._id }).populate("postedBy", "username").populate("tag", "name").then((data) => res.send(data));
            } else {
                res.send(null)
            }
        })
    } else if (title) {
        Thread.find({ title: title }).populate("postedBy", "username").populate("tag", "name").then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.send(null)
            }
        })

    } else {
        Thread.find().populate("postedBy", "username").populate("tag", "name").then((data) => res.send(data)).catch((err) => console.log(err))
    }
})

router.post('/getThreadById', (req, res, next) => {
    const { _id } = req.body;
    _id ? Thread.findOne({ _id: _id }).populate("postedBy", "username").populate("tag", "name").populate("comments.postedBy", "username").then((data) => res.send(data)).catch((err) => {res.send({error: true})})
        : res.send(false);
})

router.post('/deleteThread', (req, res) =>{
    const {id} = req.body;
    if(req.user){
        console.log(req.user.authority);
        if(req.user.authority == 69){
            //user is admin, allow deletion.
            Thread.deleteOne({_id:id}).then((data) => res.send(true));
        }else{
            Thread.findOne({_id: id}).then((data) => {
                if(data){
                    console.log(String(data.postedBy), String(req.user._id));
                    if(String(data.postedBy) == String(req.user._id)){
                        res.send(true);
                        data.remove();
                    }else{
                        res.send({error: true});
                    }
                }
            })
        }
    }else{
        res.send({error: true});
    }
})

module.exports = router