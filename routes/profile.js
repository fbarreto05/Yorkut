const express = require("express");
const app = express();
const router = express.Router()
const User = require('../models/User')
const Post = require('../models/Post')
const Group = require('../models/Group');
const Members = require('../models/Members');
const Friends = require('../models/Friends');
const { where } = require("sequelize");
const { Op } = require('sequelize');

router.get('/:id', async function(req, res){
    id = req.params.id;
    flist = [];
    glist = [];
    
    user = await User.findOne({
        where: {id: id}
    })

    name = user.name;
    password = user.password
    
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

    groups = await Members.findAll({
        where:{memberID: id, status: 1}
    })

    if(groups.length > 0)
    {
        glist = await Promise.all(groups.map( async group => ({
            id: group.memberID,
            gid: group.groupID,
            name: (await Group.findOne({
                where: {id: group.groupID}
            })).name
        })))
    }

    res.render('profile', {id, name, password, flist, glist});
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

    res.redirect(`/profile/${id}/?msg=${msg}`)
})

router.post('/:id/removeFriend', async function(req, res){
    id = req.params.id;
    fId = req.query.friend;

    friends = await Friends.findOne({
        where:{ [Op.or]: 
            [{userID: fId, friendID: id}, {friendID: fId, userID: id}], status: 1}
    })

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
    res.redirect(`/profile/${id}/?msg=${msg}`)
})

router.post('/:id/searchGroup', async function(req, res){
    id = req.params.id;
    groupname = req.body.groupname;

    if(groupname.trim() == "")
        {
            msggp = "Informe o nome do grupo antes de continuar!"
        }
    else
    {
        group = await Group.findOne({
            where: {name: groupname}
        })
    
        if(group == null)
            {
                msggp = "Grupo não encontrado."
            }
        else
        {
            exist = await Members.findOne({
                where: {memberID: id,
                        groupID: group.id
                }
            })
    
            if (exist != null)
            {
                msggp = "Você já é membro deste grupo."
            }
            else
            {
                Members.create({
                    memberID: id,
                    groupID: group.id
                })
                msggp = "Grupo adicionado com sucesso! Aguardando aceitação da solicitação."
            }
        }
    }

    res.redirect(`/profile/${id}/?msggp=${msggp}`)
})

router.post('/:id/addgroup', async function(req, res)
{
    id = req.params.id;
    groupname = req.body.groupname;

    group = await Group.findOne({
        where: {name: groupname}
    })
    
    if(group != null)
    {
        msggp = "Nome de grupo já existente, não foi possível concluir o cadastro."
    }
    else
    {
        group = await Group.create({
            name: groupname,
            admin: id
        })

        Members.create({
            groupID: group.id,
            memberID: id,
            status: true
        })

        msggp = "Grupo cadastrado com sucesso!"
    }
    res.redirect(`/profile/${id}/?msggp=${msggp}`)
})

router.post('/:id/removeGroup', async function(req, res){
    id = req.params.id;
    gId = req.query.group;

    members = await Members.findOne({
        where:{ memberID: id, groupID: gId, status: 1}
    })

    group = await Group.findOne({
        where:{ id: gId}
    })

    if(!members)
    {
        msg = "O grupo não foi encontrado"
    }
    else
    {
        Members.destroy(
            {where: {id: members.id}}
        )

        if(group)
        {
            if(group.admin == id)
            {
                Group.destroy(
                    {where: {id: gId}}
                )

                Members.destroy(
                    {where: {groupID: gId}}
                )
            }
        }

        msg = "Grupo removido com sucesso!"
    }
    res.redirect(`/profile/${id}/?msg=${msg}`)
})

module.exports = router;

