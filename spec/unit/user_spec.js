const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {

    beforeEach((done) => {

        sequelize.sync({force: true})
        .then(() => {
            done();
        })
        .catch((err) => {
            console.log(err);
            done();
        })
    });

    describe("#create()", () => {

        it("should create a User object with a valid email and password", (done) => {

            User.create({
                username: "kenton",
                email: "user@email.com",
                password: "password"
            })
            .then((user) => {
                expect(user.username).toBe("kenton");
                expect(user.email).toBe("user@email.com");
                expect(user.id).toBe(1);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a User object with an invalid email or password", (done) => {

            User.create({
                username: "kenton",
                email: "thisdoes no work",
                password: "password"
            })
            .then((user) => {

                done();
            })
            .catch((err) => {

                expect(err.message).toContain("Validation error: must be a valid email")
                done();
            });
        });

        it("should not crete a user with an email already taken", (done) => {

            User.create({
                username: "kenton",
                email: "user@email.com",
                password: "password"
            })
            .then((user) => {

                User.create({
                    username: "johnny",
                    email: "user@email.com",
                    password: "1234567890"
                })
                .then((user) => {

                    done();
                })
                .catch((err) => {

                    expect(err.message).toContain("Validation error");
                    done();
                });

                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not crete a user with a username already taken", (done) => {

            User.create({
                username: "kenton",
                email: "user@email.com",
                password: "password"
            })
            .then((user) => {

                User.create({
                    username: "kenton",
                    email: "email@email.com",
                    password: "1234567890"
                })
                .then((user) => {

                    done();
                })
                .catch((err) => {

                    expect(err.message).toContain("Validation error");
                    done();
                });

                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

})