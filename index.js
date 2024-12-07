const express = require("express");
const app = express();
const path = require("path");
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'static')));
const login = require("./routes/login.js")
const home = require("./routes/home.js")
const friendreq = require("./routes/friendreq.js")
const groupreq = require("./routes/groupreq.js")
const profile = require("./routes/profile.js")
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.use('/', login)

app.use('/home', home)

app.use('/friendreq', friendreq)

app.use('/groupreq', groupreq)

app.use('/profile', profile)

app.listen(8080, function(){
    console.log('Conectado na porta 8080!');
});