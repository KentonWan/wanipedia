const userQueries = require("../db/queries.users.js");
const passport = require("passport");

module.exports = {
    signUp (req, res, next){
        res.render("users/signup");
    },

    create(req, res, next){
        let newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        passwordConfirmation: req.body.passwordConfirmation
        };

        userQueries.createUser(newUser, (err, user) => {
        if(err){
            req.flash("error", err);
            res.redirect("/users/sign_up");
        } else {

            passport.authenticate("local")(req, res, () => {
            req.flash("notice", "You've successfully signed in!");
            res.redirect("/");
            })
        }
        });
    }, 

    signInForm(req, res, body) {
        res.render("users/sign_in");
    },

    signIn(req, res, next) {
        passport.authenticate("local")(req, res, function () {
            if(!req.user){
                req.flash("notice", "Signed in failed. Please try again.")
                res.redirct("/users/sign_in");
            } else {
                req.flash("notice", "You've successfullly signed in!");
                res.redirect("/");
            }
        })
    }
}