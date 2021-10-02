const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

// fix connection to localdb

const sequelize = new Sequelize('chatroom', 'root', '19seito0721fish', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 300000,
        idle: 30000
    },
    operatorAliases: false
});

const User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

User.beforeCreate((user, options) => {
    const salt = bcrypt.genSaltSync();
    user.email.password = bcrypt.hashSync(user.email.password, salt);
});

User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create all defined tables in the specified databases

sequelize.sync()
    .then(() => console.log('user tables have been successfully created if one does not exist'))
    .catch(error => console.log('This error occurred', error));

    // export module
module.exports = User;