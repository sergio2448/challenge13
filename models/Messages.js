const { sqlite } = require("../db/config");
const knex = require("knex")(sqlite);

class Messages {
  constructor(fileName) {
    this.fileName = fileName;
  }

  save = async (message) => {
    try {
      await knex("messages").insert(message);
    } catch (error) {
      console.log(error.message);
    }
  };

  getAll = async () => {
    try {
      const messages = await knex("messages");

      if (messages.length > 0) {
        return messages;
      }
      return [];
    } catch (error) {
      console.log(error.message);
      return message;
    }
  };
}

module.exports = Messages;
