const express = require("express");
const app = express();
const router = express.Router()
const User = require('../models/User')
const Post = require('../models/Post')
const Friends = require('../models/Friends');
const { where } = require("sequelize");

router.get('/:id', async function(req, res){
    id = req.params.id;
    msg = req.query;
    console.log(msg)

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
        users = []
        msg = "Não há solicitações de amizade disponíveis!"
    }
    res.render('friendreq', {id, users, msg});
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

module.exports = router;