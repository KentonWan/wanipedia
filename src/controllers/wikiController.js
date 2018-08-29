const wikiQueries = require("../db/queries.wikis.js");

module.exports = {

    index(req,res,next){
        wikiQueries.getAllWikis((err, wikis) => {
          if(err){
              console.log(err);
            res.redirect(500, "static/index");
          } else {
            res.render("wikis/index", {wikis});
          }
        })
      },

    new(req, res, next) {
        res.render("wikis/new");
    },

    create(req, res, next) {
        let newWiki = {
            title: req.body.title,
            body: req.body.body,
            private: req.body.private,
            userId: req.params.userId
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

            if(err || wiki == null) {
                res.redirect(404, "/")
            } else {
                res.render("wikis/show", {wiki});
            }
        });
    }
}