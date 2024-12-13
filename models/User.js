const db = require('./db')
const bcrypt = require('bcryptjs');

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
    }, {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

//User.sync({force: true})

module.exports = User;