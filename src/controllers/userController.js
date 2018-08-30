const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    signUp (req, res, next){
        res.render("users/signup");
    },

    payment(req, res, next) {
        res.render("users/payment");
    },

    create(req, res, next){
        let newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        passwordConfirmation: req.body.passwordConfirmation,
        role: req.body.role

        };

        userQueries.createUser(newUser, (err, user) => {
        if(err){
            req.flash("error", err);
            res.redirect("/users/signup");
        } else {

            passport.authenticate("local")(req, res, () => {
                req.flash("notice", "You've successfully signed in!");
                res.redirect("/");
                
                const msg = {
                    to: newUser.email,
                    from: 'blocipedia@blocipedia.com',
                    subject: 'Welcome to Blocipedia!',
                    text: 'We are so glad you joined!',
                    html: '<strong>We are so glad you joined!</strong'
                };
                sgMail.send(msg);
    
                })
    
        
            }
        });
    }, 

    signInForm(req, res, body) {
        res.render("users/sign_in");
    },

    signIn(req, res, next){
        passport.authenticate("local")(req, res, function () {
          if(!req.user){
            req.flash("notice", "Sign in failed. Please try again.")
            res.redirect("/users/sign_in");
          } else {
            req.flash("notice", "You've successfully signed in!");
            res.redirect("/");
          }
        })
      },

    signOut(req, res, body) {
        req.logout();
        req.flash("notice", "You've successfully signed out!");
        res.redirect("/");
    }, 

    show(req, res, next){

        userQueries.getUser(req.params.id, (err, user) => {

            if(err || user === null){
                req.flash("notice", "No user found with that ID");
                res.redirect("/")
            } else {
                res.render("users/show", {user})
            }
        });
    },

    updatePremium(req, res, next) {
        userQueries.updateUser(req.params.id, 1, (err, user) => {
            if(err || user == null) {
                console.log(err);
                res.redirect(404, `/users/${req.params.id}`)
            } else {
                res.redirect(`/users/${req.params.id}`)
            }
        });
    }, 

    updateStandard(req, res, next) {
        userQueries.updateUser(req.params.id, 0, (err, user) => {
            if(err || user == null) {
                console.log(err);
                res.redirect(404, `/users/${req.params.id}`)
            } else {
                res.redirect(`/users/${req.params.id}`)
            }
        });
    }, 

}