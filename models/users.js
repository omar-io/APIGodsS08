const crypto = require('crypto');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const jwt = require('jsonwebtoken'); // ESTA LIBRERIA GENERA LOS JWT
const secret = require('../config/secret');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        unique: true,
        validate: {
            isLowercase: true,
            is: /^[a-zA-Z0-9_-]+$/
        }
    },
    name: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password_hash: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    password_salt: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    tarjeta: {
        type: DataTypes.STRING(64),
        allowNull: true,
        validate: {
            isCreditCard: true
        }
    },
    tipo_tarjeta: {type: DataTypes.STRING(64) }
});

User.createPassword = function(plainText) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
        .pbkdf2Sync(plainText, salt, 10000, 512, "sha512")
        .toString("hex");
    return {salt: salt, hash: hash}
}

User.validatePassword = function(password, user_salt, user_hash) {
    const hash = crypto
        .pbkdf2Sync(password, user_salt, 10000, 512, "sha512")
        .toString("hex");
    return user_hash === hash;
}

User.generateJWT = function(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60); // en dos meses expira
    
    return jwt.sign({
        user: user.username,
        isPremium: user.tarjeta != null ? 1 : 0,
        exp: parseInt(exp.getTime() / 1000) // se entrega en segundos
        
    }, secret);

}

module.exports = User;
