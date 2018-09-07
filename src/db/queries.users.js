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
    
    // getAllUsers(id, callback) {
    //     return User.all({ where: {
    //         [Op.not]: {id: id}}})
    //     .then((users) => {
    //         callback(null, users);
    //     })
    //     .catch((err) =>{
    //         callback(err);
    //     })
    // // },

        
    // getAllUsers(id, wikiId, callback) {
    //     return User.all({
    //         include: [{
    //             model: Collaborator,
    //             as: "collaborators",
    //             attributes: [
    //                 "wikiId",
    //                 "userId"
    //             ],
    //             where: {
    //                 [Op.not]: {wikiId: wikiId}
    //             }
    //         }]
    //          }, {
    //             where: {
    //                 [Op.not]: [{id: id},{wikiId: wikiId}]
    //             }
    //     })
    //     .then((users) => {
    //         callback(null, users);
    //     })
    //     .catch((err) =>{
    //         callback(err);
    //     })
    // },

    getAllUsers(id, wikiId, callback) {
        return User.all({
            where: {
                id: {[Op.not]: id}
            },
            include: [{
                model: Collaborator,
                as: "collaborators",
                attributes: [
                    "wikiId",
                    "userId",
                    "id"
                ],
                where: {
                    wikiId: {[Op.not]: wikiId}
                },
            }]
        })
        .then((users) => {
            callback(null, users);
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