const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
//Obtenir tout les utilisateurs
module.exports.getUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};
//Obtenir un utilisateur
module.exports.userInfo = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Identifiant inconnu : " + req.params.id);
  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("identifiant inconnu : " + err);
  }).select("-password");
};
//Mise à jour d'un utilisateur
module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Identifiant inconnu : " + req.params.id);

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
// Supprimer un utilisateur
module.exports.deleteUser = async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Identifiant inconnu : " + req.params.id);
  await user.remove();
  res.status(200).json("Utilisateur supprimé " + req.params.id);
};

//fonction follow
module.exports.follow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  )
    return res.status(400).send("Identifiant inconnu : " + req.params.id);
  try {
    //ajoute l'utilisateur aux followers
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { followings: req.body.idToFollow } },
      { new: true }
    ).then((data) => res.status(200).send(data)),
      //ajoute l'utilisateur aux followings
      await UserModel.findByIdAndUpdate(
        req.body.idToFollow,
        { $addToSet: { followers: req.params.id } },
        { new: true }
      );
  } catch (err) {
    res.status(400).json(err);
  }
};
module.exports.unfollow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnfollow)
  )
    return res.status(400).send("Identifiant inconnu : " + req.params.id);
  try {
    //retire l'utilisateur aux followers
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { followings: req.body.idToUnfollow } },
      { new: true }
    ).then((data) => res.status(200).send(data)),
      //retire l'utilisateur aux followings
      await UserModel.findByIdAndUpdate(
        req.body.idToUnfollow,
        { $pull: { followers: req.params.id } },
        { new: true }
      );
  } catch (err) {
    res.status(400).json(err);
  }
};
