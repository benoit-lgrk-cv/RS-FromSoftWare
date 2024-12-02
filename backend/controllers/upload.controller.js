const UserModel = require("../models/user.model");
const { uploadErrors } = require("../utils/errors.utils");


module.exports.uploadProfil = async (req, res) => {
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
};
