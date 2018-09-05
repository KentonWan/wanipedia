const userQueries = require("../db/queries.users.js");
const collaboratorQueries = require("../db/queries.collaborators.js");



module.exports = {

    index(req,res,next){

            userQueries.getAllUsers((err, users) => {
                if(err) {
                    console.log(err);
                } else {
                    res.render("collaborators/collaborators", {users})
                }
            })
        },

    create(req, res, next) {

        console.log("Creating collaborator with userId=" + req.body.userId + "and wikiId" + req.params.id);

        let newCollaborator = {
            userId: req.body.userId,
            wikiId: req.params.id
        };

        collaboratorQueries.createCollaborator(newCollaborator, (err, collaborator) => {
            if(err) {
                console.log(err);
                req.flash("error", err);
                res.redirect(`/`)
            } else {
                req.flash("notice", "You've successful added collaborators!");
                res.redirect(`/wikis/${req.params.id}`)
            }
        })
    },
}
