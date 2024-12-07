const db = require('./db');
const User = require('./User')

const MembersList = db.sequelize.define('MembersList', {
    groupID: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
    },
    memberID: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
    },
    status: { 
        type: db.Sequelize.BOOLEAN,
        defaultValue: 0
    },
});

//MembersList.sync({force: true})

module.exports = MembersList;
