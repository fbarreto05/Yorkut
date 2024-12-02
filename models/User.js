const db = require('./db')

const User = db.sequelize.define("Users",{
        name: {
            type: db.Sequelize.STRING,
            autoIncrement: false,
            allowNull: false,
        },
        password: {
            type: db.Sequelize.STRING,
            allowNull: false,
        },
    }
)

//User.sync({force: true})

module.exports = User;