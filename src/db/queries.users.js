const User = require("./models").User;
const Collaborator = require("./models").Collaborators;
const bcrypt = require("bcryptjs");
const sequelize = require("./models/index").sequelize;
const Op = sequelize.Op;


module.exports = {

    createUser(newUser, callback){

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
        username: newUser.username,
        email: newUser.email,
        password: hashedPassword,
        role: newUser.role
    })
    .then((user) => {
        callback(null, user);
    })
    .catch((err) => {
        callback(err);
    })
    }, 

    getUser(id, callback) {
        User.findById(id)
        .then((user) => {
            callback(null, user);
        })
        .catch((err)=> {
            callback(err);
        })
    },

    getAllUsers(id, wikiId, callback) {

    return User.all({
                where: {
                        id: {
                            [Op.ne]: id
                        },
                },
            include: [{
                model: Collaborator,
                as: "collaborators",
            }]
        })
        .then((users) => {
            let possibleCollabs = users;
            for(let i = 0; i < possibleCollabs.length; i++){
                for(let j = 0; j < possibleCollabs[i].collaborators.length; j++ ){
                    if(possibleCollabs[i].collaborators[j].wikiId == wikiId){
                        possibleCollabs.splice(i,1);
                        i--
                    }
                }
            }

            callback(null, possibleCollabs);
        })
        .catch((err) =>{
            callback(err);
        })
    },

    updateUser(id, updatedRole, callback) {
        return User.findById(id)
        .then((user)=> { 
            return user.update({role: updatedRole},{fields: ['role']})
            .then(() => {
                callback(null, user)
            })
            .catch((err) => {
                callback(err);
            });
        });
    }



}