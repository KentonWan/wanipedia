const Collaborator = require("./models").Collaborators;

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
    }
}