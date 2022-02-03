const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config()

mongoose.connect(process.env.MONGODBURL)
    .then((Response) => console.log('connected to database.'));

const app = express();

//Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.ORIGIN }));
app.use(session({
    secret: process.env.SESSIONSECRET,
    store: MongoStore.create({ mongoUrl: process.env.MONGODBURL }),
    resave: true,
    saveUninitialized: true,
    cookie: {
        sameSite: 'lax', 
    }
}));
app.use(passport.initialize());
app.use(passport.session());
require('./strategies/local')(passport);

const user = require('./routes/user')
const thread = require('./routes/thread')
const tag = require('./routes/tag')
app.use('/user', user)
app.use('/thread', thread)
app.use('/tag', tag)

app.listen(process.env.PORT, () => {
    console.log(`server has started`);
})