const db = require('./db')
const User = require('./User')

const Post = db.sequelize.define('Posts', {
    content: {
        type: db.Sequelize.STRING,
        allowNull: false,
    },
    author: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
    },
    destination:{
        type: db.Sequelize.INTEGER,
        allowNull: false,
    },
    destinationtp:{
        type: db.Sequelize.BOOLEAN,
        allowNull: false,
    }
})

//Post.sync({force: true})

module.exports = Post;