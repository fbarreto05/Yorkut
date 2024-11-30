const express = require("express");
const app = express();
const path = require("path");
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'static')));
const login = require("./routes/login.js")
const home = require("./routes/home.js")
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.use('/', login)

app.use('/home', home)

app.listen(8080, function(){
    console.log('Conectado na porta 8080!');
});