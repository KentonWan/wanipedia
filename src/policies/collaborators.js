const ApplicationPolicy = require("./application");
const Collaborator = require("../models").Collaborators;

module.exports = class CollaboratorPolicy extends ApplicationPolicy {

    _isCollaborator() {
        return this.record.id == Collaborator.wikiId;
    }

    show() {
        return (this.record.private == false || this._isCollaborator()); 
    }

}