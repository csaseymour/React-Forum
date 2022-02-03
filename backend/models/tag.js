const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    name: String,
    posts: Number,
    latest: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: true});

const tag = mongoose.model('Tag', tagSchema);
module.exports = tag;