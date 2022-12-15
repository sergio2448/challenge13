const { mariaDB } = require("../db/config");
const knex = require("knex")(mariaDB);

class Products {
  constructor() {}

  save = async (product) => {
    try {
      await knex("products").insert(product);
    } catch (error) {
      console.log(error.message);
    }
  };

  updateById = async (product) => {
    try {
      const { id, title, price, thumbnail } = product;
      const productToUpdate = await knex("products").where({ id }).first();

      if (!productToUpdate) {
        return -1;
      }

      await knex("products").where({ id }).update({ title, price, thumbnail });
    } catch (error) {
      console.log(error.message);
    }
  };

  getById = async (productId) => {
    try {
      const product = await knex("products").where({ id }).first();

      if (product) {
        return product;
      }
      return null;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  };

  getAll = async () => {
    try {
      const products = await knex("products");
      if (products.length > 0) {
        return products;
      }

      return [];
    } catch (error) {
      console.log(error.message);
      return [];
    }
  };

  deleteById = async (productId) => {
    try {
      const productToDelete = await knex("products")
        .where({ id: productId })
        .first();

      if (!productToDelete) {
        return -1;
      }

      await knex("products").where({ id: productId }).del();
    } catch (error) {
      console.log(error.message);
    }
  };

  deleteAll = async () => {
    try {
      await knex("products").del();
    } catch (error) {
      console.log(error.message);
    }
  };
}

module.exports = Products;
