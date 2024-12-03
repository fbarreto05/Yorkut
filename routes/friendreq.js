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
    msg = req.query;
    flist = [];
    users = [];
    msgfr = "";

    fRequests = await Friends.findAll({
        where:{friendID: id, status: 0}
    })

    if(fRequests.length > 0)
    {
        users = await Promise.all(fRequests.map(async request => ({id: request.userID, 
            name: (await User.findOne({
                where: {id: request.userID}
            })).name
        })))
    }
    else
    {
        msgfr = "Não há solicitações de amizade disponíveis!"
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

    res.render('friendreq', {id, users, msg, msgfr, flist});
})

router.post('/:id/add', async function(req, res)
{
    id = req.params.id;
    fId = req.query.fId;

    fRequests = await Friends.update({status: 1},
        {where:{userID: fId, friendID: id, status: 0}
    })
    msg = "Solicitação aceita com sucesso!"

    res.redirect(`/friendreq/${id}/?msg=${msg}`)
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

    res.redirect(`/friendreq/${id}/?msg=${msg}`)
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
    res.redirect(`/friendreq/${id}/?msg=${msg}`)
})

module.exports = router;