const User = require("./models").User;
const bcrypt = require("bcryptjs");

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

    updateUser(id, updatedRole, callback) {
        return User.findById(id)
        .then((user)=> {
            if(!user){
                return callback("User not found");
            }
            user.update({role: updatedRole},{fields: ['role']})
            })
            .then(() => {
                callback(null, user);
            })
            .catch((err) => {
                callback(err);
            });
    }



}