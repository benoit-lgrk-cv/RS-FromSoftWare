const express = require("express");
const { setPosts, getPosts, editPost, dislikePost, likePost, deletePost, commentPost, editComment, deleteComment } = require("../controllers/post.controller");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req,file, cb) => {
        cb(null, './public/uploads')//lieu ou on stocke les images
    },
    filename: (req, file, cb) => {
        const name = file.originalname.split(' ').join('_')
        cb(null, Date.now() + name)
    }
})

const upload = multer({ storage: storage});

//CRUD
router.get("/", getPosts);
router.post("/", upload.single("file"), setPosts);
router.put("/:id", editPost);
router.delete("/:id", deletePost);
//like/dislike
router.patch("/like-post/:id", likePost);
router.patch("/dislike-post/:id", dislikePost);
//commentaires
router.patch("/comment-post/:id", commentPost);
router.patch("/edit-comment/:id", editComment);
router.patch("/delete-comment/:id", deleteComment);


module.exports = router