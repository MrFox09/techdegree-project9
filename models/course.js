const Sequelize = require('sequelize');
 
module.exports = (sequelize) => {
 
    class Course extends Sequelize.Model {}
    Course.init({

 

        id:{
            type: Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },


        title:{
            type:Sequelize.STRING,
            allowNull:false,
            validate: {notEmpty:true}
        },

        description:{
            type:Sequelize.TEXT,
            allowNull:false,
            validate: {notEmpty:true}
        },

        estimatedTime:{
            type:Sequelize.STRING,
            allowNull:true,
            validate: {notEmpty:true}
            
        },

        materialsNeeded:{
            type:Sequelize.STRING,
            allowNull:true,
            validate: {notEmpty:true}
        },



    }, {sequelize});


    //Define the asscociation with the User model

    Course.associate = (models) => {

        Course.belongsTo(models.User,
            {
                as: 'owner', 
                foreignKey: {
                    fieldName: 'userId',  
                    allowNull: false                  
                }     
                    
        
            });
    };
 
    return Course;
 
};
