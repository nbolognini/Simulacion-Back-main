const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

// Opción 1: Permitir solicitudes desde cualquier origen
// app.use(cors());

// Opción 2: Permitir solicitudes desde múltiples orígenes específicos
const allowedOrigins = ['http://127.0.0.1:5500', 'http://127.0.0.1:5501'];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir solicitudes sin origen (como las de herramientas y scripts)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'El origen ' + origin + ' no está permitido por la política CORS.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.listen(port, () => {
    console.log(`Server escuchando en el puerto ${port}`);
});

//Ver si el servidor esta funcionando
app.get('/', (req, res) => {
    res.send('Dato enviado desde el servidor');
});
app.get('/ping', (req, res) => {
    res.send('Ping desde el servidor');
});

//Simulo la base de datos, y busco los datos en los archivos JSON
//Busco todos los grupos que estan activos:
app.get('/groups', (req, res) => {
    let groups = require('./db/groups.json');
    let group_status = groups.filter( group => group.group_status == '1' );
    res.json(group_status);
});
//busco en access por el id de grupo:
app.get('/access/:id_group', (req, res) => {
    let access = require('./db/access.json');
    let access_group = access.filter( access => access.fk_group_id == req.params.id_group );
    res.json(access_group);
});

//Todas las simulaciones de las bases de datos
app.get('/users', (req, res) => {
    let users = require('./db/users.json');
    res.json(users);
});
app.get('/channels', (req, res) => {
    let channels = require('./db/channels.json');
    res.json(channels);
});
app.get('/signals', (req, res) => {
    let signals = require('./db/signals.json');
    res.json(signals);
});
app.get('/access', (req, res) => {
    let access = require('./db/access.json');
    res.json(access);
});
app.get('/multiviews', (req, res) => {
    let multiview = require('./db/multiview.json');
    res.json(multiview);
});

//busco los datos de los usuarios por el id
app.get('/users/:id', (req, res) => {
    let users = require('./db/users.json');
    let user = users.find( user => user.user_name_id == req.params.id );
    res.json(user);
});

//busco a que grupo pertenece el usuario
app.get('/usersGroup/:id', (req, res) => {
    let users = require('./db/users.json');
    let user = users.find( user => user.user_name_id == req.params.id );
    res.json(user.fk_group_id);
});

//funcion que paso channel_id y me devuelve el nombre del canal
app.get('/channelName/:id', (req, res) => {
    let channels = require('./db/channels.json');
    let channel = channels.find( channel => channel.channel_id == req.params.id );
    res.json(channel.channel_name);
});