const Sequelize = require('sequelize');
 
module.exports = (sequelize) => {
 
    class User extends Sequelize.Model {}
    User.init({

        id:{
            type: Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },

        firstName:{
            type:Sequelize.STRING,
        },

        lastName:{
            type:Sequelize.STRING,
        },

        emailAdress:{
            type:Sequelize.STRING,
        },

        password:{
            type:Sequelize.STRING,
        }



    }, {sequelize});


    User.associate = (models) => {

        User.belongsTo(models.course);
    };
 
    return User;
 
};