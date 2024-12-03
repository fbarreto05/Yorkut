const express = require("express");
const app = express();
const router = express.Router()
const User = require('../models/User')
const Post = require('../models/Post')
const Friends = require('../models/Friends');
const { where } = require("sequelize");
const { Op } = require('sequelize');

router.get('/:id', async function(req, res){
    id = req.params.id;
    fid = req.query.friend;
    gid = req.query.group;
    msg = req.query.msg
    plist = []
    flist = []
    destinationtp = {destination: fid, tp: 0}

    if(fid)
    {
        console.log(fid, id)
        posts = await Post.findAll({
            where:{ [Op.or]: [
                { author: id, destination: fid }, 
                { author: fid, destination: id }], destinationtp: 0} 
        })

        if(posts.length > 0)
            {
                plist = await Promise.all(posts.map( async post => ({
                    content: post.content,
                    author: (await User.findOne({
                        where: {id: post.author}
                    })).name,
                    authorid: (await User.findOne({
                        where: {id: post.author}
                    })).id
                })))
            }
    }   
    friends = await Friends.findAll({
        where:{ [Op.or]: [{userID: id}, {friendID: id}], status: 1}
    })

    if(friends.length > 0)
    {
        flist = await Promise.all(friends.map( async friend => ({
            id: friend.userID == id ? friend.friendID : friend.userID,
            name: (await User.findOne({
                where: {id: friend.userID == id ? friend.friendID : friend.userID}
            })).name
        })))
    }

    res.render('home', {id, flist, plist, destinationtp});
})

router.post('/:id/searchfriend', async function(req, res){
    id = req.params.id;
    username = req.body.username;

    if(username.trim() == "")
        {
            msg = "Informe o nome do usuário antes de continuar!"
        }
    else
    {
        user = await User.findOne({
            where: {name: username}
        })
    
        if(user == null)
            {
                msg = "Usuário não encontrado."
            }
        else
        {
            exist = await Friends.findOne({
                where: {userID: id,
                        friendID: user.id
                }
            })
    
            if (exist != null)
            {
                msg = "O usuário já é seu amigo."
            }
            else
            {
                Friends.create({
                    userID: id,
                    friendID: user.id
                })
                msg = "Usuário adicionado com sucesso! Aguardando aceitação da solicitação."
            }
        }
    }

    res.redirect(`/home/${id}/?msg=${msg}`)
})

router.post('/:id/addpost', async function(req, res){
    id = req.params.id;
    destination = req.query.destination;
    tp = req.query.tp;
    content = req.body.mensagem;

    if(content.trim() == "")
    {
        msg = "Insira uma mensagem antes de continuar!"
    }
    else if(!fid && !gid)
    {
        msg = "Selecione um amigo ou grupo antes de continuar!"
    }
    else
    {
        Post.create({
                content: content,
                author: id,
                destination: destination,
                destinationtp: tp
        })

        msg = "Postagem realizada com sucesso!"
    }

    if(tp == 0){tpurl="friend"}
    else{tpurl="group"}
    res.redirect(`/home/${id}/?${tpurl}=${destination}&msg=${msg}`)
})

router.post('/:id/removeFriend', async function(req, res){
    id = req.params.id;
    fId = req.query.friend;

    friends = await Friends.findOne({
        where:{ [Op.or]: 
            [{userID: fId, friendID: id}, {friendID: fId, userID: id}], status: 1}
    })

    console.log("aqui: ", friends[0])

    if(friends.length == 0)
    {
        msg = "A amizade não foi encontrada"
    }
    else
    {
        Friends.destroy(
            {where: {id: friends.id}}
        )
        msg = "Amizade removida com sucesso!"
    }
    res.redirect(`/home/${id}/?msg=${msg}`)
})

module.exports = router;

