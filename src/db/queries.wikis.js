const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborators;
const User = require("./models").User;

const Authorizer = require("../policies/wiki.js");
const sequelize = require("./models/index").sequelize;
const Op = sequelize.Op;



module.exports = {

    getAllWikis(user, callback) {
        return Wiki.all({
            include: [{
                model: Collaborator,
                as: "collaborators",
                attributes: [
                    "userId",
                    "wikiId"
                ]
                }]
            },
        )
        .then((wikis) => {
            console.log(wikis);

            if(user.role === 2){ // admin

                callback(null, wikis);

            } else if (user.role === 1){ // premium
                const premiumWikis = [];
                for(let i = 0; i < wikis.length; i++){

                    if(wikis[i].dataValues.userId === user.id || (wikis[i].dataValues.private == false && wikis[i].collaborators.length === 0)) {

                        premiumWikis.push(wikis[i]);

                    } else {

                        for(let j=0; j < wikis[i].collaborators.length; j++) {
                                                    
                            if(wikis[i].dataValues.private == false) {
                                premiumWikis.push(wikis[i])
                            } else if(wikis[i].collaborators[j].userId === user.id) {
                                premiumWikis.push(wikis[i])
                            }

                        }
  
                    }
                    
                }
                callback(null, premiumWikis);

            } else {
                console.log("returning all wikis from standard");

                for(let i = 0; i < wikis.length; i++){
                    for(let j = 0; j < wikis[i].collaborators.length; j++){
                        console.log(wikis[i].collaborators[j]);


                        if(wikis[i].private === "true"  && wikis[i].collaborators[j].userId !== user.id){
                            wikis.splice(i,1);
                            i--
                        }
                    }
                }

                callback(null, wikis);

            }
        })
        .catch((err) =>{
            callback(err);
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