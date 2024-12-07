const db = require('./db');
const User = require('./User')

const Group = db.sequelize.define('Group', {
    name: {
        type: db.Sequelize.STRING,
        allowNull: false,
    },
    admin: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
    }
});

//Group.sync({force: true})

module.exports = Group;
