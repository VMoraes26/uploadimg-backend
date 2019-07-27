const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());//Todo mundo pode acessar a aplicação e consumir seus recursos

const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', socket => {//Quando ouver uma conexão
    socket.on('connectRoom', box => {//Recebe a box na qual está presente e se junta a uma sala
        socket.join(box);
    });
});

mongoose.connect("mongodb+srv://root:1234@cluster0-sec11.mongodb.net/omnistack?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
    }
).catch(error => console.log(error));

app.use((req, res, next) => {
    req.io = io;

    return next();
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));
app.use(morgan('dev'));

app.use(require("./routes"));

server.listen(process.env.PORT || 3000);