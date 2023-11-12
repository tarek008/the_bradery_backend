const { getAllProducts } = require("../services/productService");
const request = require("supertest");
const app = require("../app");

jest.mock("../services/productService", () => ({
  getAllProducts: jest.fn(),
}));

describe("GET /allProducts", () => {
  it("returns a list of products", async () => {
    getAllProducts.mockResolvedValue([
      { id: 1, name: "Product 1" },
      { id: 2, name: "Product 2" },
    ]);
    const response = await request(app).get("/products/allProducts");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: "Product 1" },
      { id: 2, name: "Product 2" },
    ]);
  });
  it("returns an error if the service fails", async () => {
    getAllProducts.mockRejectedValue(new Error("Service failed"));
    const response = await request(app).get("/products/allProducts");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Service failed" });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});