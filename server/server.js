const app = require('express')();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// work with express
const server = require('http').Server(app);
const io = require('socket.io')(server);
const userRouter = require('./user');
const models = require('./mongo');
const Chat = models.getModel('chat');

io.on('connection', function (socket) {
    socket.on('sendmsg', function (data) {
        const {from, to, msg} = data
        const chatid = [from, to].sort().join('_')
        console.log(data)
        Chat.create({chatid, from, to, content: msg}, function (err, doc) {
            io.emit('recvmsg', Object.assign({}, doc._doc))
        })
    })
})

app.use(cookieParser());
app.use(bodyParser.json());
app.use('/user', userRouter);

server.listen(9093, function () {
    console.log('node app start at port 9093');
});