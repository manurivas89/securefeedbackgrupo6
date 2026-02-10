const express = require('express');
const app = express();
const usuariosRouter = require('./routes/usuarios');
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use('/api', usuariosRouter);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/form.html');
});

app.get('/usuarios', (req, res) => {
  res.sendFile(__dirname + '/views/usuarios.html');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`App corriendo en puerto ${process.env.PORT || 3000}`);
});
