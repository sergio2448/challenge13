const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const Products = require("./models/Products");
const { formatMessage } = require("./utils/utils");
const { faker } = require("@faker-js/faker");

const { Server: HttpServer } = require("http");
const { Server: SocketServer } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 8080;
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

const products = new Products("products.json");
const { items } = products;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine(
  "hbs",
  engine({
    extname: "hbs",
    defaultLayout: "main.hbs",
    layoutsDir: path.resolve(__dirname, "./views/layouts"),
    partialsDir: path.resolve(__dirname, "./views/partials"),
  })
);

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.get("/api/productos", (req, res) => {
  res.json(items);
});

app.get("/test", (req, res) => {
  try {
    const products = [];
    for (let i = 0; i < 5; i++) {
      products.push({
        title: faker.commerce.product(),
        price: faker.commerce.price(1, 1000, 2),
        thumbnail: faker.image.imageUrl(64, 64, "product", true),
      });
    }
    res.json({ success: true, result: products });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "An error has ocurred getting the products",
    });
  }
});

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  const data = req.body;
  const { title, price, thumbnail } = req.body;
  if (!title || !price || !thumbnail) {
    return;
  }
  products.save(data);
  res.redirect("/");
});

app.get("*", (req, res) => {
  res.status(404).send(`<h1>Path not found</h1>`);
});

const messages = [];
const users = [];

io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado");

  io.emit("messages", [...messages]);

  socket.on("new-user", (email) => {
    const newUser = {
      id: socket.id,
      email: email,
    };
    users.push(newUser);
  });

  socket.on("new-message", async (msg) => {
    const user = users.find((user) => user.id === socket.id);
    const newMessage = formatMessage(socket.id, user.email, msg);
    messages.push(newMessage);
    products.save(user.email, msg, newMessage.time);

    io.emit("chat-message", newMessage);
  });

  const id = socket.id;
  socket.on("disconnect", () => {
    io.emit("disc", `${id}`);
    console.log(`Disconnect ${id}`);
  });
});

const connectedServer = httpServer.listen(PORT, () => {
  console.log(`🚀Server active and listening on the port: ${PORT}`);
});

connectedServer.on("error", () => {
  console.log("error: ", error.message);
});
