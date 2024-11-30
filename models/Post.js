const db = require('./db')
const User = require('./User')

const Post = db.sequelize.define('Posts', {
    id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    title: {
        type: db.Sequelize.STRING,
        allowNull: false,
    },
    content: {
        type: db.Sequelize.STRING,
        allowNull: false,
    },
    author: {
        type: db.Sequelize.STRING,
        allowNull: false,
    }
})

User.hasMany(Post, {
    foreignKey: 'author',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

Post.belongsTo(User, {
    foreignKey: 'author',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

//Post.sync({force: true})

module.exports = Post;