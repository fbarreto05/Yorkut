const db = require('./db')

const User = db.sequelize.define("Users",{
        name: {
            type: db.Sequelize.STRING,
            primaryKey: true,
            autoIncrement: false,
            allowNull: false,
        },
        password: {
            type: db.Sequelize.STRING,
            allowNull: false,
        },
        friends: {
            type: db.Sequelize.STRING,
            allowNull: true,
            defaultValue: '',
        },
    }
)

User.hasMany(User, {
    as: 'Friends',
    foreignKey: 'friendID',
});

User.belongsTo(User, {
    as: 'Owner',            
    foreignKey: 'friendID',
});

//User.sync({force: true})

module.exports = User;