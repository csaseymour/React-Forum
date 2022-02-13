const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    bio: String,
    authority: {type: Number, default: 0},
    avata: {type: Boolean, default: false},
    votes: [{
        thread: {type: mongoose.Schema.Types.ObjectId, ref: 'Thread'},
        vote: Boolean
    }]
}, {timestamps: true});

const user = mongoose.model('User', userSchema);
module.exports = user;