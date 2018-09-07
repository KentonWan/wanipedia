const Collaborator = require("./models").Collaborators;
const sequelize = require("./models/index").sequelize;
const Op = sequelize.Op;


module.exports = {

    createCollaborator(newCollaborator, callback) {

        return Collaborator.create({
            userId: newCollaborator.userId,
            wikiId: newCollaborator.wikiId
        })
        .then((collaborator) => {
            callback(null, collaborator);
        })
        .catch((err) => {
            callback(err);
        })
    }, 

    deleteCollaborator(id, callback){
       return Collaborator.destroy({where: {id: id}})
       .then((collaborator) => {
           callback(null, collaborator);
       })
       .catch((err)=> {
           callback(err);
       })
    },

    getCollaborators(wikiId, callback) {
        return Collaborator.findAll({where:{wikiId: wikiId}})
        .then((collaborators) => {
            callback(null, collaborators);
        })
        .catch((err) => {
            callback(err);
        })
    },
}