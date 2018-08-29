const request = require("request");
const server = require("../../src/server");
const sequelize = require("../../src/db/models/index").sequelize;
const base = "http://localhost:3000/wikis/";

const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {

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
                    userId: user.id
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
        })
    })

    describe("GET /wikis", () => {

        it("should return a status code 200 and all wikis", (done) => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(err).toBeNull();
                expect(body).toContain("Blocipedia Rules");
                expect(body).toContain("My wikis")
                done();
            });
        });
    });

    describe("GET /topics/new", () => {
        
        it("should render a new wiki form", (done) => {
            request.get(`${base}new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Wiki");
                done();
         })
        });
    });

    describe("POST /wikis/create", () => {
        const options = {
            url: `${base}create`,
            form: {
                title: "Mason's Madness",
                body: "I become really crazy when I eat sugar",
                private: false,
            }
        };
        
        it("should create a new wiki and redirect", (done) => {

            request.post(options, (err, res, body) => {

                Wiki.findOne({where: {title: "Mason's Madness"}})
                .then((wiki) => {
                    expect(res.statusCode).toBe(303);
                    expect(wiki.title).toBe("Mason's Madness");
                    expect(wiki.body).toBe("I become really crazy when I eat sugar");
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });

    describe("GET /wikis/:id", () => {
        
        it("should render a view with the selected wiki", (done) => {
            request.get(`${base}${this.wiki.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Blocipedia Rules")
                done();
            });
        });
    })
});