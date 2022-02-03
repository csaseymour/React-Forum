const express = require('express')
const router = express.Router()
const Tag = require('../models/tag')

router.get('/tag', (req, res, next) => {
    Tag.find()
        .then((data) => res.send(data))
        .catch((err) => console.log(err));
})

router.post('/newTag', (req, res, next) => {
    const { name } = req.body;
    if (name) {
        var tag = new Tag({
            name: name,
            posts: 0,
            latest: Date.now(),
            createdBy: req.user._id
        });
        tag.save().then((data) => res.send(data)).catch((error) => console.log(error));
    } else {
        res.send(false);
    }
})

module.exports = router