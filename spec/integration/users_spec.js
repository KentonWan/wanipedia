const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {

  beforeEach((done) => {

    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

  });

  describe("GET /users/signup", () => {

    it("should render a view with a sign-up form", (done) => {
        request.get(`${base}signup`, (err, res, body) => {
            expect(err).toBeNull();
            expect( body).toContain("Sign Up");
            done();
        });
    });
  });

  describe("GET /users/payment", () => {

    it("should render a view with a payment form", (done) => {
      request.get(`${base}payment`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Payment");
        done();
      })
    })
  });

  describe("POST /users", () => {

    it("should create a new user with valid values and redirect", (done) => {

        const options = {
          url: base,
          form: {
            username: "kenton",
            email: "user@example.com",
            password: "123456789",
          }
        };
  
        request.post(options,
          (err, res, body) => {
  
            User.findOne({where: {email: "user@example.com"}})
            .then((user) => {
              expect(user).not.toBeNull();
              expect(user.email).toBe("user@example.com");
              expect(user.id).toBe(1);
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          }
        );
      });
    
    it("should not create a new user with invalid attributes and redirect", (done) => {
        request.post(
          {
            url: base,
            form: {
              username: "john",
              email: "no",
              password: "123456789"
            }
          },
          (err, res, body) => {
            User.findOne({where: {email: "no"}})
            .then((user) => {
              expect(user).toBeNull();
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          }
        );
      });

  });

  describe("GET /users/sign_in", () => {

    it("should render a view with a sign in form", (done) => {
        request.get(`${base}sign_in`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Sign in");
          done();
        });
      });
  });

  describe("GET /users/:id", () => {

    beforeEach((done) => {

      this.user;

      User.create({
        username: "jackie",
        email: "jackie@email.com",
        password: "password"
      })
      .then((res) => {
        this.user = res;
        done()
      });

    });

    it("should present a profile page of logged in user", (done) => {

      request.get(`${base}${this.user.id}`, (err, res, body) => {
        expect(body).toContain("profile");
        done();
      });
    });
  });

  describe("POST /users/:id/updatepremium", () => {

    beforeEach((done) => {

      this.user;

      User.create({
        username: "kevin",
        email: "kevin@email.com",
        password: "password",
      })
      .then((res) => {
        this.user = res;
        done()
      });

    });

    it("should update the role to 1 when person pays to upgrade to premium membership", (done) => {


    request.post(`${base}${this.user.id}/updatepremium`, (err,res, body) => {

      expect(err).toBeNull();

      User.findOne({ where: {id: this.user.id}})
      .then((user)=> {
        expect(user.role).toBe(1)
        done();
      });
    });

    })
  });

  describe("POST /users/:id/updatestandard", () => {

    beforeEach((done) => {

      this.user;

      User.create({
        username: "kevin",
        email: "kevin@email.com",
        password: "password",
        role: 1
      })
      .then((res) => {
        this.user = res;
        done()
      });

    });

    it("should update the role to 0 when person downgrades to standard membership", (done) => {


    request.post(`${base}${this.user.id}/updatestandard`, (err,res, body) => {

      expect(err).toBeNull();

      User.findOne({ where: {id: this.user.id}})
      .then((user)=> {
        expect(user.role).toBe(0)
        done();
      });
    });

    })
  });

});