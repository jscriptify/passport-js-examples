const express = require('express');
const session = require("express-session");
const bodyParser = require("body-parser");
const connectFlash = require("connect-flash");
const connectEnsureLogin = require('connect-ensure-login');
const passport = require('passport');
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(session({ secret: "javascriptifySecret", resave: true, saveUninitialized: false }));
app.use(connectFlash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// Local strategy
const localStrategy = require('./local-strategy');
localStrategy(passport);

// Local strategy routing
app.get('/login', (req, res) => {
    res.sendFile('public/login.html', {root: __dirname });
});
app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);

app.get('/', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    console.log(req.user); // { id: 1, username: 'umutcakir', password: 'salt:test', salt: 'salt' }
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});