//Connection à la BDD
const connectDB = require("../backend/config/db");
require("dotenv").config({ path: "../backend/config/.env" });
connectDB();
//Appel de la methode assert(affirmer) et du model utilisateur
const assert = require("assert");
//Appel du model utilisateur
const User = require("../backend/models/user.model");
//Test de création de l'utilisateur
describe("Crud signUp", () => {
  it("Création du nouvel utilisateur", (done) => {
    const newUser = new User({
      pseudo: "TEST",
      email: "test@gmail.com",
      password: "azerty",
    });
    newUser
      .save()
      .then(() => {
        assert(!newUser.isNew);
        done();
      });
  });
});
//Test de lecture de la BDD
describe("Crud userInfo", () => {
  it("Trouver un utilisateur par le pseudo", (done) => {
    User.findOne({ pseudo: "TEST" }).then((user) => {
      assert(user.pseudo === "TEST");
      done();
    });
  });
});
//Test de suppression d'utilisateur
describe("Crud deleteUser", () => {
  it("Suppression d'un utilisateur", (done) => {
    User.findOneAndRemove({ pseudo: "TEST" })
      .then(() => User.findOne({ pseudo: "TEST" }))
      .then((user) => {
        assert(user === null);
        done();
      });
  });
});
