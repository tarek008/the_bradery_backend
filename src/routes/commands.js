const express = require("express");
const router = new express.Router();
const Commandes = require("../controllers/commandes");
const auth = require("../middleware/auth");

router.post("/passerCommande", Commandes.passerCommande);
router.post("/createCheckoutSession", Commandes.createCheckoutSession);
router.get("/getCommandes", auth, Commandes.getCommandes);

module.exports = router;
