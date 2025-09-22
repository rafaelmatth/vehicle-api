const express = require("express");
const cors = require("cors");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const vehiclesRouter = require("./routes/vehicles");
const ordersRouter = require("./routes/orders");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const sequelize = require("./database");
const Vehicle = require("./models/Vehicle");
const User = require("./models/User");
const Order = require("./models/Order");
const OrderItem = require("./models/OrderItem");

const app = express();
app.use(cors());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API E-commerce de Veículos 🚗",
      version: "1.0.0",
      description: "Documentação da API feita com Express + Sequelize + Swagger",
    },
    // EXTRAIR COMPONENTES PARA UM DIR
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Rafael Matheus",
            },
            email: {
              type: "string",
              example: "rafael@email.com",
            },
            password: {
              type: "string",
              example: "123456",
            },
          },
        },
				Vehicle: {
					type: "object",
					required: ["make", "model", "year", "price"],
					properties: {
						id: { type: "integer", example: 1 },
						make: { type: "string", example: "Toyota" },
						model: { type: "string", example: "Corolla" },
						year: { type: "integer", example: 2021 },
						price: { type: "number", example: 85000 },
						mileage: { type: "integer", example: 35000 },
						description: { type: "string", example: "Carro único dono, revisões em dia" },
						stock: { type: "integer", example: 3 }
					}
				},
        Order: {
          type: "object",
          required: ["userId", "vehicleId", "status"],
          properties: {
            id: {
              type: "integer",
              example: 10,
            },
            userId: {
              type: "integer",
              example: 1,
            },
            vehicleId: {
              type: "integer",
              example: 2,
            },
            status: {
              type: "string",
              enum: ["pending", "completed", "cancelled"],
              example: "pending",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, './routes/*.js')]
};


const specs = swaggerJsdoc(options);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/vehicles", vehiclesRouter);
app.use("/orders", ordersRouter)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
const bcrypt = require('bcrypt');

sequelize.sync({ force: true }).then(async () => {
  console.log("Banco recriado do zero!");

  // Seeds de usuários
  await User.bulkCreate([
    {
      username: "admin",
      email: "admin@auto.com",
      password: bcrypt.hashSync("adminpass", 10)
    }
  ]);

  // Seeds de veículos
  await Vehicle.bulkCreate([
    {
      make: "Toyota",
      model: "Corolla",
      year: 2021,
      price: 85000,
      mileage: 35000,
      description: "Carro único dono, revisões em dia",
      stock: 3,
      image: "https://tse3.mm.bing.net/th/id/OIP.dyas6Rn__lQzOQGTvWZIKgHaEM?rs=1&pid=ImgDetMain&o=7&rm=3"
    },
    {
      make: "BMW",
      model: "X5",
      year: 2022,
      price: 320000,
      mileage: 12000,
      description: "SUV de luxo com pacote M Sport",
      stock: 2,
      image: "https://tse1.mm.bing.net/th/id/OIP.Qc1T32AQPy1Fg_eM-KlkcQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3"
    },
    {
      make: "Tesla",
      model: "Model 3",
      year: 2023,
      price: 280000,
      mileage: 5000,
      description: "Elétrico, piloto automático, zero emissão",
      stock: 5,
      image: "https://tse1.mm.bing.net/th/id/OIF.kfVocUU4uj7nWNL7somgtg?rs=1&pid=ImgDetMain&o=7&rm=3"
    }
  ]);

  console.log("Seeds inseridos com sucesso 🚀");
});



module.exports = app;
