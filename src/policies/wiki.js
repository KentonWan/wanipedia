const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

    create() {
        return (this._isAdmin() || this._isPremium());
    }

}