const { sqlite } = require("../config");
const knex = require("knex")(sqlite);

const messages = [
  {
    email: "sergio@gmail.com",
    date: "12/13/2022, 11:56:45 AM",
    text: "Hello, How are you?",
  },
];

const fillMessageTable = async () => {
  try {
    const exists = await knex.schema.hasTable("messages");
    if (exists) {
      await knex("messages").insert(messages);
    }
  } catch (error) {
    console.log(error.messages);
  } finally {
    knex.destroy();
  }
};

fillMessageTable();
