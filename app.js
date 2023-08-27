const express = require("express");
const { body, validationResult } = require("express-validator");
const cookieParser = require("cookie-parser"); 
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { color: req.query.color || null, mensaje: null, errors: null });
});

app.post(
  "/",
  [
    body("nombre").notEmpty().withMessage("El nombre es requerido"),
    body("color").notEmpty().withMessage("El color es requerido"),
    body("email")
      .notEmpty()
      .withMessage("El email es requerido")
      .isEmail()
      .withMessage("El email no es válido"),
    body("edad").optional().isInt().withMessage("La edad debe ser un número"),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("index", { color: null, mensaje: null, errors: errors.array(), nombre: req.body.nombre });
    }

    const { nombre, color, email, edad } = req.body;
    const mensaje = `Hola ${nombre}, elegiste el color: ${color}, tu email es: ${email}${
      edad ? ` y tu edad es: ${edad}` : ""
    }`;

 

    res.render("index", { color, mensaje, errors: null, nombre });
  }
);
    

app.use(cookieParser());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});