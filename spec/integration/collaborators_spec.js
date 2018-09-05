const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;
const Collaborator = require("../../src/db/models").Collaborators;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : collaborators", () => {

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

    describe("GET /wikis/:wikiId/collaborators", () => {

        it("should render a view with a list of possible collaborators", (done)=> {
            request.get(`${base}${this.wiki.id}/collaborators`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Add Collaborators");
                done();
            });
        });
    });

    describe("POST /wikis/:wikiId/collaborators/add", () => {

        // beforeEach((done)=> {
        //     this.user;
        //     User.create({
        //         username: "jackie",
        //         email: "jackie@email.com",
        //         password: "password"
        //     })
        //     .then((user) => {
        //         this.user = user;
        //         done();
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //         done();
        //     })
        // })
        it("should create a new collaborator will valid values and redirect", (done)=> {

            const options = {
                url: `${base}${this.wiki.id}/collaborators/add`,
                form: {
                    userId: this.user.id,
                    wikiId: this.wiki.id
                }
            }

            request.post(options, (err, res, body) => {
                Collaborator.findOne({where:{userId: this.user.id}})
                .then((collaborator) => {
                    expect(collaborator).not.toBeNull();
                    expect(collaborator.wikiId).toBe(this.wiki.id);
                    done();
                })
                .catch((err)=> {
                    console.log(err);
                    done();
                });
            })
        })
    })


}) // end