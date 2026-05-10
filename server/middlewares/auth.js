//Auth.js
// middlewares/auth.js — Pas d'authentification, utilisateur fixe
function authMiddleware(req, res, next) {
  req.user = {
    id: "dev-user-id",
    email: "candide@bepcmath.bf",
    nom: "Sawadogo",
    prenom: "Candide",
  };
  next();
}

module.exports = authMiddleware;