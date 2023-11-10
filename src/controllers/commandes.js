const commandesService = require("../services/commandesService");

const passerCommande = async (req, res) => {
  try {
    const userId = req.body.user_id;
    const items = req.body.items;

    const result = await commandesService.passerCommande(userId, items);

    res.status(201).send({
      message: "Order placed successfully",
      orderId: result.orderId,
    });
  } catch (error) {
    res
      .status(500)
      .send({ error: error.message || "Could not process the order" });
  }
};

const createCheckoutSession = async (req, res) => {
  try {
    const result = await commandesService.createCheckoutSession(req, res);
    res.status(200).send(result);
  } catch (error) {
    res
      .status(500)
      .send({ error: error.message || "Could not process the order" });
  }
};

const getCommandes = async (req, res) => {
  try {
    const userId = req.query.user_id;
    const result = await commandesService.getCommandes(userId);
    res.status(200).send(result);
  } catch (error) {
    res
      .status(500)
      .send({ error: error.message || "Could not get the commandes " });
  }
};

module.exports = {
  passerCommande,
  createCheckoutSession,
  getCommandes,
};
