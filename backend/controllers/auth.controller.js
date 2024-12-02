const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { signUpErrors } = require("../utils/errors.utils");

//constante qui détermine la durée de vie du cookie
const maxAge = 3 * 24 * 60 * 60 * 1000;
//création du secret token qui serviras pour la connection d'un utilisateur en rapport avec ma clé secrete
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

//enregistrer un nouvel utilisateur
module.exports.signUp = async (req, res) => {
  const { pseudo, email, password } = req.body;

  try {
    const user = await UserModel.create({
      pseudo,
      email,
      password,
      imageProfil: "/client/public/uploads/profil/" + req.file.filename,
    });
 
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = signUpErrors(err);
    res.status(200).send({ errors });
  }
};

//connecter/authentifier un utilisateur
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge });
    res.status(201).json({ user: user._id });
  } catch (err) {
    //ne récopère pas l'erreur
    // const errors = signInErrors(err)
    res.status(200).json({ errors });
  }
};

//déconnecter un utilisateur
module.exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
