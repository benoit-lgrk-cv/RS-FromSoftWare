const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const { uploadErrors } = require("../utils/errors.utils");
const ObjectId = require("mongoose").Types.ObjectId;
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

//Obtenir tout les posts
module.exports.getPosts = (req, res) => {
  PostModel.find((err, posts) => {
    if (!err) res.send(posts);
    else console.log("Impossible de récupérer les posts : " + err);
  }).sort({ createdAt: -1 });
};

//Créer un nouveau post
module.exports.setPosts = async (req, res) => {
  let fileName;

  if (req.file != null) {
    const MIME_TYPES = {
      "image/jpg": "jpg",
      "image/jpeg": "jpg",
      "image/png": "jpg",
    };
    try {
      if (!MIME_TYPES) throw Error("invalid file");

      if (MIME_TYPES > 1) throw Error("max size");
    } catch (err) {
      const errors = uploadErrors(err);
      return res.status(201).json({ errors });
    }
    fileName = req.body.posterId + Date.now() + ".jpg";
  }
  await pipeline(
    req.file.stream,
    fs.createWriteStream(
      `${__dirname}/../client/public/uploads/profil/${fileName}`
    )
  );

  if (!req.body.message) {
    res.status(400).json({ message: "Merci d'ajouter un message" });
  }

  const post = await PostModel.create({
    posterId: req.body.posterId,
    message: req.body.message,
    picture: req.file != null ? "./uploads/posts/" + fileName : "",
    video: req.body.video,
    likers: [],
    comments: [],
  });
  res.status(200).json(post);
};
//Modifier un post
module.exports.editPost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updatedRecord = {
    message: req.body.message,
  };

  PostModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Update error : " + err);
    }
  );
};
//supprimer un post
module.exports.deletePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  PostModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("Delete error : " + err);
  });
};

//like post
module.exports.likePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Identifiant inconnu : " + req.params.id);
  try {
    //ajoute l'utilisateur aux likers
    await PostModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likers: req.body.id } },
      { new: true }
    ).then((data) => res.status(200).send(data)),
      //ajoute à l'utilisateur les likes
      await UserModel.findByIdAndUpdate(
        req.body.id,
        { $addToSet: { likes: req.params.id } },
        { new: true }
      );
  } catch (err) {
    res.status(400).json(err);
  }
};

//dislike post
module.exports.dislikePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Identifiant inconnu : " + req.params.id);
  try {
    //retire l'utilisateur aux likers
    await PostModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { likers: req.body.id } },
      { new: true }
    ).then((data) => res.status(200).send(data)),
      //retire à l'utilisateur les likes
      await UserModel.findByIdAndUpdate(
        req.body.id,
        { $pull: { likes: req.params.id } },
        { new: true }
      );
  } catch (err) {
    res.status(400).json(err);
  }
};
// les commentaires
module.exports.commentPost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Identifiant inconnu : " + req.params.id);
  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true }
    ).then((data) => res.status(200).send(data)),
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400);
      };
  } catch (err) {
    return res.status(400).send(err);
  }
};
//Edition du commentaire
module.exports.editComment = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updatedRecord = {
    comments: {
      commentId: req.body.commentId,
      commenterPseudo: req.body.commenterPseudo,
      text: req.body.text,
      timestamp: new Date().getTime(),
    },
  };

  PostModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Update error : " + err);
    }
  );
};

module.exports.deleteComment = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Identifiant inconnu : " + req.params.id);
  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            commenterId: req.body.commenterId,
          },
        },
      },
      { new: true }
    ).then((data) => res.status(200).send(data)),
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400);
      };
  } catch (err) {
    return res.status(400).send(err);
  }
};
