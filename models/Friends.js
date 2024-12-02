const db = require('./db');
const User = require('./User')

const UserFriends = db.sequelize.define('UserFriends', {
    userID: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
    },
    friendID: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
    },
    status: { 
        type: db.Sequelize.BOOLEAN,
        defaultValue: 0
    },
});

//UserFriends.sync({force: true})

module.exports = UserFriends;
