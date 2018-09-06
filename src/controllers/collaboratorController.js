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
                req.flash("notice", "You have successfully added collaborators to your wiki");
                res.redirect(`/wikis/${req.params.id}`)
            }
        })
    },

    destroy(req, res, next) {

        this.collaborator;
        Collaborator.findOne({where:{wikiId: req.params.id, userId: req.body.userId}})
        .then((collaborator)=> {
            this.collaborator = collaborator;

            collaboratorQueries.deleteCollaborator(collaborator.id, (err, deletedRecordsCount) => {
                if(err){
                    res.redirect(500, `/wikis/${req.params.id}/collaborators`);
                } else {
                    res.redirect(303, `/wikis/${req.params.id}`);
                }
            })
            
        })
    },

    list(req, res, next) {
        collaboratorQueries.getCollaborators((err, collaborators)=> {
            if(err) {
                console.log(err);
            } else {
                res.render("/wikis/show", {collaborators})
            }
        })
    },
}
