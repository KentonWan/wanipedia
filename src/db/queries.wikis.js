const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborators;
const Authorizer = require("../policies/wiki.js");
const sequelize = require("./models/index").sequelize;
const Op = sequelize.Op;



module.exports = {

    getAllWikis(callback) {
        return Wiki.all()

        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) =>{
            callback(err);
        })
    },

    getAllPublicWikis(callback) {
        return Wiki.all({where: {private: false}})

        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            callback(err);
        })
    },

    getAllCollabPublicWikis(id,callback) {
        return Wiki.all({ where: {
            [Op.or]: [{private : false}, {id: id}]}})
        .then((wikis) => {
            callback(null,wikis);
        })
        .catch((err)=> {
            callback(err)
        })
    },

    addWiki(newWiki, callback) {
        return Wiki.create(newWiki)
        .then((wiki) => {
            callback(null, wiki)
        })
        .catch((err) => {
            callback(err);
        })
    }, 

    getWiki(id, callback){
        return Wiki.findById(id, {
            include: [{
                model: Collaborator,
                as: "collaborators",
                attributes: [
                    "userId",
                    "id"
                ]
            }]
        })
        .then((wiki) => {
            callback(null, wiki)
        })
        .catch((err) => {
            callback(err);
        })
    },

    deleteWiki(req,callback){
        return Wiki.findById(req.params.id)
        .then((wiki)=> {
    
          const authorized = new Authorizer(req.user, wiki).destroy();
    
          if(authorized){
            wiki.destroy()
            .then((res)=> {
              callback(null, wiki);
            });
          } else {
            req.flash("notice", "You are not authorized to do that")
          callback(401)
          }
        })
        .catch((err)=>{
          callback(err);
        });
      },

    updateWiki(id, updatedWiki, callback) {
        return Wiki.findById(id)
        .then((wiki)=> {
            if(!wiki){
                return callback("Wiki not found");
            }

            wiki.update(updatedWiki, {
                fields: Object.keys(updatedWiki)
            })
            .then(() => {
                callback(null, wiki);
            })
            .catch((err) => {
                callback(err);
            });
        });
    },

    updateWikiPrivacy(id, updatedPrivacy, callback) {
        return Wiki.findAll({where:{userId:id}})
        .then((wikis)=> {
            for( let i = 0; i < wikis.length; i++){
                wikis[i].update({private: updatedPrivacy}, {fields: ['private']})
            }
            return wikis
            callback(null, wikis)
                })
                .catch((err) => {
                    callback(err);
                });


    }

}