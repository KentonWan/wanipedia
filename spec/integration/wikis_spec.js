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
        })
    })

    describe("admin user performing CRUD actions for Wiki", () => {

        beforeEach((done) => {
            User.create({
              username: "kenton",
              email: "email@email.com",
              password: "password",
              role: 2 // admin
            })
            .then((user)=> {
              request.get({         
                url: "http://localhost:3000/auth/fake",
                form: {
                  username: user.username,
                  userId: user.id,
                  email: user.email,
                  role: user.role    
                }
              },
                (err, res, body) => {
                  done();
            });
          });
        });

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
                        expect(wiki).not.toBeNull();
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
        });
    
        describe("POST /wikis/:id/destroy", () => {
    
            it("should deleted the wiki with the associated ID", (done) => {
    
                expect(this.wiki.id).toBe(1);
    
                request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
    
                    Wiki.findById(1)
                    .then((wiki) => {
                        expect(err).toBeNull();
                        expect(wiki).toBeNull();
                        done();
                    })
                })
            })
        });
    
        describe("GET /wikis/:id/edit", () => {
    
            it("should render a view with an edit wiki form", (done) => {
              request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Wiki");
                expect(body).toContain("Blocipedia Rules");
                done();
              });
            });
       
          });
    
          describe("POST /wikis/:id/update", () => {
    
            it("should return a status code of 302", (done) => {
                request.post({
                    url: `${base}${this.wiki.id}/update`,
                    form: {
                        title: "Bloccit Rules",
                        body: "The Bloc is Hot"
                    }
                }, (err, res, body) => {
                    expect(res.statusCode).toBe(302);
                    done();
                })
            });
    
            it('should update the wiki with the given values', (done) => {
                const options = {
                    url: `${base}${this.wiki.id}/update`,
                    form: {
                        title: "Bloccit Rules"
                    }
                };
    
                request.post(options, (err, res, body) => {
    
                    expect(err).toBeNull();
    
                    Wiki.findOne({
                        where: {id: this.wiki.id}
                    })
                    .then((wiki) => {
                        expect(wiki.title).toBe("Bloccit Rules");
                        done();
                    });
                });
            });
          });
    

    }); // end of admin tests

    describe("STANDARD member performing CRUD actions for Wiki", () => {

        beforeEach((done) => {
              request.get({         
                url: "http://localhost:3000/auth/fake",
                form: {
                  role: 0 //standard user  
                }
              },
                (err, res, body) => {
                  done();
            });
          });

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
            beforeEach((done) => {
                User.create({
                  username: "kenton",
                  email: "email@email.com",
                  password: "password"
                })
                .then((user)=> {
                  request.get({         
                    url: "http://localhost:3000/auth/fake",
                    form: {
                      username: user.username,
                      userId: user.id,
                      email: user.email    
                    }
                  },
                    (err, res, body) => {
                      done();
                });
              });
            });
            
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
                        expect(wiki).not.toBeNull();
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
        });
    
        describe("POST /wikis/:id/destroy", () => {
    
            it("should  NOT deletee the wiki with the associated ID", (done) => {
    
                Wiki.all()
                .then((wikis) => {
                    const wikiCountBeforeDelete = wikis.length;

                    expect(wikiCountBeforeDelete).toBe(1);

                    request.post(`${base}${this.wiki.id}/destory`, (err, res, body) => {
                        Wiki.all()
                        .then((wikis) => {
                            expect(wikis.length).toBe(wikiCountBeforeDelete);
                            done();
                        })
                    });
                })
            })
        });
    
        describe("GET /wikis/:id/edit", () => {
    
            it("should render a view with an edit wiki form", (done) => {
              request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Wiki");
                expect(body).toContain("Blocipedia Rules");
                done();
              });
            });
       
          });
    
          describe("POST /wikis/:id/update", () => {
    
            it("should return a status code of 302", (done) => {
                request.post({
                    url: `${base}${this.wiki.id}/update`,
                    form: {
                        title: "Bloccit Rules",
                        body: "The Bloc is Hot"
                    }
                }, (err, res, body) => {
                    expect(res.statusCode).toBe(302);
                    done();
                })
            });
    
            it('should update the wiki with the given values', (done) => {
                const options = {
                    url: `${base}${this.wiki.id}/update`,
                    form: {
                        title: "Bloccit Rules"
                    }
                };
    
                request.post(options, (err, res, body) => {
    
                    expect(err).toBeNull();
    
                    Wiki.findOne({
                        where: {id: this.wiki.id}
                    })
                    .then((wiki) => {
                        expect(wiki.title).toBe("Bloccit Rules");
                        done();
                    });
                });
            });
          });



    }) // end of STANDARD member
    
    describe("PREMIUM member performing CRUD actions on Wiki", () => {

        beforeEach((done) => {
            request.get({         
              url: "http://localhost:3000/auth/fake",
              form: {
                role: 1 //premium  
              }
            },
              (err, res, body) => {
                done();
          });
        });
    
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
            beforeEach((done) => {
                User.create({
                username: "kenton",
                email: "email@email.com",
                password: "password"
                })
                .then((user)=> {
                request.get({         
                    url: "http://localhost:3000/auth/fake",
                    form: {
                    username: user.username,
                    userId: user.id,
                    email: user.email    
                    }
                },
                    (err, res, body) => {
                    done();
                });
            });
            });
            
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
                        expect(wiki).not.toBeNull();
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
        });

        describe("POST /wikis/:id/destroy", () => {
    
            it("should  NOT deletee the wiki with the associated ID", (done) => {
    
                Wiki.all()
                .then((wikis) => {
                    const wikiCountBeforeDelete = wikis.length;

                    expect(wikiCountBeforeDelete).toBe(1);

                    request.post(`${base}${this.wiki.id}/destory`, (err, res, body) => {
                        Wiki.all()
                        .then((wikis) => {
                            expect(wikis.length).toBe(wikiCountBeforeDelete);
                            done();
                        })
                    });
                })
            })
        });

        describe("GET /wikis/:id/edit", () => {

            it("should render a view with an edit wiki form", (done) => {
            request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Wiki");
                expect(body).toContain("Blocipedia Rules");
                done();
            });
            });
    
        });

        describe("POST /wikis/:id/update", () => {

            it("should return a status code of 302", (done) => {
                request.post({
                    url: `${base}${this.wiki.id}/update`,
                    form: {
                        title: "Bloccit Rules",
                        body: "The Bloc is Hot"
                    }
                }, (err, res, body) => {
                    expect(res.statusCode).toBe(302);
                    done();
                })
            });

            it('should update the wiki with the given values', (done) => {
                const options = {
                    url: `${base}${this.wiki.id}/update`,
                    form: {
                        title: "Bloccit Rules"
                    }
                };

                request.post(options, (err, res, body) => {

                    expect(err).toBeNull();

                    Wiki.findOne({
                        where: {id: this.wiki.id}
                    })
                    .then((wiki) => {
                        expect(wiki.title).toBe("Bloccit Rules");
                        done();
                    });
                });
            });
        });
    }); // end of premium member

});