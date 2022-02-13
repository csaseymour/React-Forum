const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const threadSchema = new Schema({
    title: String,
    content: String,
    comments: [{
        message: String,
        postedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        createdAt: Date
    }],
    tag: {type: mongoose.Schema.Types.ObjectId, ref: 'Tag'},
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    points: {type: Number, default: 0}
}, {timestamps: true});

const thread = mongoose.model('Thread', threadSchema);
module.exports = thread;