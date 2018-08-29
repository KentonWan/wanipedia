const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;


describe("Wiki", () => {

    beforeEach((done) => {

        this.wiki;
        this.user;
        sequelize.sync({force:true}).then((res) => {

            User.create({
                username: "kenton",
                email: "email@email.com",
                password: "password"
            })
            .then((user) => {
                this.user = user;
                
                Wiki.create({
                    title: "Blocipedia Rules",
                    body: "Well sort of",
                    private: false,
                    userId: this.user.id
                })
                .then((wiki) => {
                    this.wiki = wiki;
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });

    describe("#create()", () => {

        it("should create a wiki object with a title, body and privacy setting", (done) => {

            Wiki.create({
                title: "Bloccit came first",
                body: "I'm thankful it did",
                private: false,
                userId: this.user.id
            })
            .then((wiki) => {

                expect(wiki.title).toBe("Bloccit came first");
                expect(wiki.body).toBe("I'm thankful it did");
                expect(wiki.userId).toBe(this.user.id);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a wiki object with a missing title, body or privacy setting", (done) => {

            Wiki.create({
                title: "This will throw an error",
                userId: this.user.id
            })
            .then((wiki) => {

                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Wiki.body cannot be null");
                done();
            })
        });

    });

    describe("#setUser()", () => {

        it("should associate a user and a wiki together", (done) => {

            User.create({
                username: "Jackie",
                email: "example@example.com",
                password: "1234567890"
            })
            .then((newUser) => {

                expect(this.wiki.userId).toBe(this.user.id);

                this.wiki.setUser(newUser)
                .then((wiki) => {

                    expect(this.wiki.userId).toBe(newUser.id);
                    done();
                });
            })
        });
    });

    describe("#getUser()", () => {

        it("should return the associated user", (done) => {

            this.wiki.getUser()
            .then((associatedUser) => {
                expect(associatedUser.username).toBe("kenton");
                done();
            });
        });
    });
});