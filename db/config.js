module.exports = {
  mariaDB: {
    client: "mysql",
    connection: {
      host: "localhost",
      port: "3306",
      user: "root",
      password: "",
      database: "coder_normalizr",
    },
  },
  sqlite3: {
    client: "sqlite3",
    connection: {
      filename: "./db/data.sqlite",
    },
    useNullAsDefault: true,
  },
};
