const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors')
const connectDB = require("./config/db");
require("dotenv").config({path: './backend/config/.env'});

// connexion à la DB
connectDB();


const {checkUser, requireAuth} = require('../middleware/auth.middleware');
const app = express();
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  'allowHeaders': ['sessionId', 'Content-Type'],
  'exposecHeaders': ['sessionId'],
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}

app.use(cors({corsOptions}));
// Middleware qui permet de traiter les données de la Request

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());
app.use(cors());

//jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id)
});
//Le seveur utilise les routes pour les utilisateurs
app.use("/user", require("./routes/user.routes"));

//Le serveur utilise les routes pour les posts
app.use("/post", require("./routes/post.routes"));

// Lancer le serveur
app.listen(process.env.PORT, () => console.log(`Le serveur a démarré au port ${process.env.PORT}`));
