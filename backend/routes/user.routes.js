const express = require("express");
const { signUp, signIn, logout } = require("../controllers/auth.controller");
const {
  getUsers,
  userInfo,
  updateUser,
  deleteUser,
  follow,
  unfollow,
} = require("../controllers/user.controller");
const uploadController = require('../controllers/upload.controller');
//**********************MULTER*********************** */
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req,file, cb) => {
      cb(null, './client/public/uploads/profil')//lieu ou on stocke les images
  },
  filename: (req, file, cb) => {
      const name = file.originalname.split(' ').join('_')
      cb(null, Date.now() + name)
  }
})

const upload = multer({ storage: storage})
//******************************************************** */
const router = express.Router();

//s'enregistrer
router.post("/register",upload.single("imageProfil"), signUp);
router.post("/login", signIn);
router.get("/logout", logout);

//Voir les utilisateurs
router.get("/", getUsers);
//Voir un utilisateur
router.get("/:id", userInfo);
//Mise à jour d'un utilisateur
router.put("/:id", updateUser);
//Suppression d'un utilisateur
router.delete("/:id", deleteUser);
//follow unfollow un utilisateur
router.patch("/follow/:id", follow);
router.patch("/unfollow/:id", unfollow);
//upload de fichier
// router.post("/upload", upload.single("imageProfil"), uploadController.uploadProfil);
module.exports = router;
