const express = require("express");
const app = express();
const User = require('../models/User')
const Post = require('../models/Post')
const router = express.Router()
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

router.get('/', function(req, res){
    msg = req.query;
    res.render('login', msg);
})

router.post('/cadastroelogin', async function(req, res){
    action = req.body.action
    username = req.body.username;
    userpassword = req.body.senha;
    
    if(username.trim() == "" || userpassword.trim() == "")
    {
        msg = "Preencha todos os campos antes de continuar!"
        res.redirect(`/?msg=${msg}`)
    }
    else if(action == "cadastro")
    {
        user = await User.findOne({
            where: {name: username}
        })
        
        if(user != null)
        {
            msg = "Nome de usuário já existente, não foi possível concluir o cadastro."
        }
        else
        {
            User.create({
                name: username,
                password: userpassword
            })
    
            msg = "Usuário cadastrado com sucesso!"
        }
        res.redirect(`/?msg=${msg}`)
    }
    else if(action == "login")
    {
        username = req.body.username;
        userpassword = req.body.senha;

        user = await User.findOne({
            where: {name: username}
        })

        if(user != null)
            {
                if(userpassword == user.password)
                {
                    res.redirect('/home')
                }
                else
                {
                    msg = "Senha incorreta!"
                    res.redirect(`/?msg=${msg}`)
                }
            }
        else
        {
            msg = "Usuário não encontrado!"
            res.redirect(`/?msg=${msg}`)
        }
    }
})

module.exports = router;