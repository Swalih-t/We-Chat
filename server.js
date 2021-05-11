const express = require('express')
const http = require('http')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const socketio = require('socket.io');
const { ExpressPeerServer } = require('peer')


// Main App
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const peerServer = ExpressPeerServer(server, {
    debug: true
})


// Views and Public pages
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))



// page paths
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/enter-name-room', (req, res) => {
    res.render('enter-name-room', { roomId: uuidv4() })
})

app.use('/peerjs', peerServer)

app.get('/createVideo', (req, res) => {
    let userName = req.query.name;
    let roomId = req.query.id;
    res.render('createRoom', { userName, roomId })
})
/*
app.get('/:id', (req, res) => {
    res.render('createRoom', { roomId: req.params.id })
})
*/
app.post('/createRoom', (req, res) => {
    let name = req.body.name
    res.redirect('/createVideo?name=' + name + '&id=' + uuidv4())
})

app.get('/join-name-room', (req, res) => {
    res.render('join-name-room')
})


// Connection with socketio

io.on('connect', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('join-user', userId)
        socket.on('userChats', (message, userName) => {
            io.to(roomId).emit('showChats', message, userName)
        })
        socket.on('offuser', (roomId, userName) => {
            socket.disconnect(roomId)
            io.to(roomId).emit('userDisconnectName', userName)
        })
    })
})


// listner
server.listen(process.env.PORT || 3000)
