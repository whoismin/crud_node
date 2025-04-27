const {Sequelize} = require('sequelize')
const sequelize = new Sequelize('projetoweb', 'root', '',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}

