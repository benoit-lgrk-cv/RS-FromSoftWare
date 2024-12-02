module.exports.signUpErrors = (err) => {
  let errors = { pseudo: "", email: "", password: "" };

  if (err.message.includes("pseudo"))
    errors.pseudo = "pseudo incorrect ou déja pris";

  if (err.message.includes("email")) errors.email = "Email incorrect";

  if (err.message.includes("password"))
    errors.password = "Le mot de passe doit faire un minimum de 6 caractères";

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
    errors.pseudo = "Ce pseudo est déjà pris";

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
    errors.email = "Cet email est déjà enregistré";

  return errors;
};


//A REVOIR
// module.exports.signInErrors = (err) => {
//   let errors = { email: '', password: ''}

//   if (err.message.includes("email")) 
//     errors.email = "Email inconnu";
  
//   if (err.message.includes('password'))
//     errors.password = "Le mot de passe ne correspond pas"

//   return errors;
// }

module.exports.uploadErrors = (err) => {
  let errors = { format: '', maxSize: ''};

  if (err.message.includes('max size'))
  errors.maxSize = "Le fichier est trop volumineux (50Mo max)";
  
  if (err.message.includes('invalid file'))
  errors.format = "Format incompatible";
  console.log(errors)
  return errors;
  
};