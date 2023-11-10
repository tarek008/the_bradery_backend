const db = require("../models");
const sequelize = db.sequelize;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createOrder = async (userId, items, transaction) => {
  let totalPrice = 0;
  for (const item of items) {
    const [product] = await sequelize.query(
      "SELECT price, inventory FROM products WHERE id = :productId FOR UPDATE",
      {
        replacements: { productId: item.id },
        type: sequelize.QueryTypes.SELECT,
        transaction,
      }
    );

    if (product.inventory < item.quantity) {
      throw new Error(`Not enough stock for product ID: ${item.id}`);
    }

    totalPrice += product.price * item.quantity;
  }

  const [orderResult] = await sequelize.query(
    `INSERT INTO commandes (user_Id, total_price) VALUES (:userId, :totalPrice)`,
    {
      replacements: { userId, totalPrice },
      transaction,
    }
  );

  const orderId = orderResult;
  return orderId;
};

const createOrderDetailsAndUpdateStock = async (
  orderId,
  items,
  transaction
) => {
  for (const item of items) {
    await sequelize.query(
      `INSERT INTO commande_details (commande_id, product_id, quantity, price) VALUES (:orderId, :productId, :quantity, (SELECT price FROM products WHERE id = :productId))`,
      {
        replacements: {
          orderId,
          productId: item.id,
          quantity: item.quantity,
        },
        transaction,
      }
    );

    // Update stock
    await sequelize.query(
      `UPDATE products SET inventory = inventory - :quantity WHERE id = :productId`,
      {
        replacements: {
          quantity: item.quantity,
          productId: item.id,
        },
        transaction,
      }
    );
  }
};

const passerCommande = async (userId, items) => {
  const transaction = await sequelize.transaction();

  try {
    const orderId = await createOrder(userId, items, transaction);
    await createOrderDetailsAndUpdateStock(orderId, items, transaction);

    await transaction.commit();
    return { orderId, status: "success" };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const createCheckoutSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: req.body.items.map((item) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        };
      }),
      mode: "payment",
      success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getCommandes = async (userId) =>{
  try {
    const results = await sequelize.query(
      `
      SELECT 
        c.commande_id, 
        c.user_id, 
        GROUP_CONCAT(p.name ORDER BY p.id) AS product_names,
        GROUP_CONCAT(cd.quantity ORDER BY p.id) AS product_quantities, 
        GROUP_CONCAT(cd.price ORDER BY p.id) AS product_prices, 
        SUM(cd.price * cd.quantity) AS total_price, 
        SUM(cd.quantity) AS total_quantity
      FROM commandes c
      JOIN commande_details cd ON c.commande_id = cd.commande_id
      JOIN products p ON cd.product_id = p.id
      WHERE c.user_id = :userId
      GROUP BY c.commande_id;
    `,
      {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Refactor to map directly to the desired structure
    return results.map((row) => {
      const products = row.product_names.split(",").map((name, index) => ({
        name,
        quantity: parseInt(row.product_quantities.split(",")[index], 10),
        price: parseFloat(row.product_prices.split(",")[index]).toFixed(2),
      }));

      // Calculate total quantity from the product quantities
      const total_quantity = products.reduce(
        (sum, product) => sum + product.quantity,
        0
      );

      // Return the commande structure
      return {
        commande_id: row.commande_id,
        user_id: row.user_id,
        products,
        total_price: row.total_price,
        total_quantity,
      };
    });
  } catch (error) {
    console.error("Error fetching commandes:", error);
    throw error; 
  }
};

module.exports = {
  passerCommande,
  createCheckoutSession,
  getCommandes,
};
