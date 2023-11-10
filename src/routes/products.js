const express = require("express");
const router = new express.Router();
const Products = require("../controllers/products");
const auth = require("../middleware/auth");

router.get("/allProducts", Products.getAllProducts);

module.exports = router;
