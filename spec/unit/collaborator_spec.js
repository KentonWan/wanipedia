const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
const Collaborator = require("../../src/db/models").Collaborators;


describe("Collaborator", () => {

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

        it("should create a Collaborator", (done) => {
            Collaborator.create({
                userId: this.user.id,
                wikiId: this.wiki.id
            })
            .then((collaborator) => {
                expect(collaborator.id).toBe(1);
                expect(collaborator.userId).toBe(this.user.id);
                expect(collaborator.wikiId).toBe(this.wiki.id);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should NOT create a Collaborator without a user or wiki id", (done) => {
            Collaborator.create({
                userId: this.user.id
            })
            .then((collaborator) => {

                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Collaborators.wikiId cannot be null");
                done();
            })
        })
    });
})