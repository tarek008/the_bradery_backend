const productServices = require("../services/productService");

const getAllProducts = async (req, res) => {
  try {
    const products = await productServices.getAllProducts();
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred." });
  }
};
module.exports = {
  getAllProducts,
};
