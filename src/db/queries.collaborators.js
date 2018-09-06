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
        return Collaborator.destroy({
            where: {id: id}
        })
        .then((deletedRecordsCount) => {
            callback(null, deletedRecordsCount);
        })
        .catch((err) => {
            callback(err);
        })
    },

    getCollaborators(callback) {
        return Collaborator.findAll({where: {wikiId: 5}})

        .then((collaborators) => {
            console.log(collaborators);
            callback(null, collaborators);
        })
        .catch((err) => {
            callback(err);
        })
    },
}