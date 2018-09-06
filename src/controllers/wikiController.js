const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/wiki");
const passport = require("passport");
const markdown = require("markdown").markdown;
const Collaborator = require("../db/models").Collaborators;



module.exports = {

    index(req,res,next){

        console.log(req.user.id);

        this.collaborator;
        Collaborator.find({where: {userId: req.user.id}})
        .then((collaborator) => {
            this.collaborator = collaborator;
            console.log(this.collaborator);

            if(req.user.role === 1){ // premium member
                wikiQueries.getAllWikis((err, wikis) => {
                    if(err) {
                        console.log(err);
                    } else {
                        res.render("wikis/index", {wikis})
                    }
                })
            } else if(req.user.id == this.collaborator.userId) {
    
                wikiQueries.getAllCollabPublicWikis(this.collaborator.wikiId, (err, wikis) => {
                    if(err) {
                        console.log(err);
                    } else {
                        res.render("wikis/index", {wikis})
                    }
                });
    
            } else { // standard member
                wikiQueries.getAllPublicWikis((err, wikis) => {
                    if(err) {
                        console.log(err);
                    } else {
                        res.render("wikis/index", {wikis})
                    }
                })
            }
        });


    },

    new(req, res, next) {
        res.render("wikis/new");
    },

    create(req, res, next) {

        let newWiki = {
            title: req.body.title,
            body: req.body.body,
            private: req.body.private,
            userId: req.user.id
        }; 
        wikiQueries.addWiki(newWiki, (err, wiki) => {
            console.log(err);
            if(err){
                res.redirect(500, "/wikis/new");
            } else {
                res.redirect(303, `/wikis/${wiki.id}`)
            }
        });
    }, 

    show(req, res, next) {

        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            let markdownWiki = {
                title: markdown.toHTML(wiki.title),
                body: markdown.toHTML(wiki.body),
                private: wiki.private,
                userId: wiki.userId,
                id: wiki.id
            };
            if(err || wiki == null) {
                res.redirect(404, "/")
            } else {
                res.render("wikis/show", {markdownWiki});
            }
        });
    },

    destroy(req, res, next) {

        wikiQueries.deleteWiki(req, (err, wiki) => {
            if(err) {
                res.redirect(500, `/wikis/${req.params.id}`)
            } else {
                res.redirect(303, `/wikis`)
            }
        })
    },

    edit(req, res, next){
        wikiQueries.getWiki(req.params.id, (err, wiki) =>{

            if(err || wiki == null) {
                res.redirect(404, "/")
            } else {
                res.render("wikis/edit", {wiki})
            }
        });
    },

    update(req, res, next) {
        wikiQueries.updateWiki(req.params.id, req.body, (err, wiki) => {
            if(err || wiki == null) {
                res.redirect(404, `/wikis/${req.params.id}/edit`)
            } else {
                res.redirect(`/wikis/${req.params.id}`)
            }
        });
    },

}