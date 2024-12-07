const express = require("express");
const app = express();
const router = express.Router()
const User = require('../models/User')
const Post = require('../models/Post')
const Members = require('../models/Members')
const Group = require('../models/Group')
const Friends = require('../models/Friends');
const { where } = require("sequelize");
const { Op } = require('sequelize');

router.get('/:id', async function(req, res){
    id = req.params.id;
    msg = req.query.msg;
    msggpl = req.query.msggp;
    flist = [];
    glist = [];
    users = [];
    gRequests = [];

    admGroups = await Group.findAll({
        where:{admin: id}
    })

    for(i=0;i<admGroups.length;i++)
    {
        gRequestsPartial = await Members.findAll({
            where:{groupID: admGroups[i].id, status: 0}
        })

        gRequests = gRequests.concat(gRequestsPartial)
    }
    

    if(gRequests.length > 0)
    {
        users = await Promise.all(gRequests.map(async request => 
            ({
            gid: request.groupID,
            gname: (await Group.findOne({
            where: {id: request.groupID}})).name,
            id: request.memberID, 
            name: (await User.findOne({
                where: {id: request.memberID}
            })).name
        })))
    }
    else
    {
        msggpl = "Não há solicitações de grupo disponíveis!"
       
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

    groups = await Members.findAll({
        where:{memberID: id, status: 1}
    })

    if(groups.length > 0)
    {
        glist = await Promise.all(groups.map( async group => ({
            id: group.memberID,
            name: (await Group.findOne({
                where: {id: group.groupID}
            })).name
        })))
    }

    res.render('groupreq', {id, users, msg, msggpl, flist, glist});

    
})

router.post('/:id/addGroup', async function(req, res)
{
    id = req.params.id;
    gId = req.query.gId;
    mId = req.query.mId;

    gRequests = await Members.update({status: 1},
        {where:{memberId: mId, groupID: gId, status: 0}
    })
    msggp = "Solicitação aceita com sucesso!"

    res.redirect(`/groupreq/${id}/?msggp=${msggp}`)
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

    res.redirect(`/groupreq/${id}/?msggp=${msggp}`)
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
    res.redirect(`/groupreq/${id}/?msggp=${msggp}`)
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
    res.redirect(`/groupreq/${id}/?msg=${msg}`)
})


module.exports = router;