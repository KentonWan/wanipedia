const userQueries = require("../db/queries.users.js");
const collaboratorQueries = require("../db/queries.collaborators.js");
const Wiki = require("../db/models").Wiki;




module.exports = {

    index(req,res,next){

        this.wiki;
        Wiki.findOne({where:{id: req.params.id}})
        .then((wiki)=> {
            this.wiki = wiki;

            userQueries.getAllUsers(wiki.userId, (err, users)=> {
                if(err) {
                    console.log(err);
                } else {
                    res.render("collaborators/collaborators", {users})
                }
            })
        })
    },

    create(req, res, next) {

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

    list(req, res, next) {
        collaboratorQueries.getCollaborators(req.params.id, (err, collaborators)=> {
            console.log(req.params.id);
            if(err) {
                console.log(err);
            } else {
                res.render("wikis/show", {collaborators})
            }
        })
    },
}
