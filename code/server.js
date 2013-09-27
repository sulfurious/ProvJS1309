var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(8888);
app.use(express.static(__dirname +'/'));

var pairs   = {},
    code;

io.sockets.on('connection', function (socket) {

    socket.emit('msg', {message: "SERVER: Connected! " + socket.id});

    socket.on('keep-alive', function () {
        socket.emit('keep-alive', null);
    });
    socket.on('createsession', function(record) {
        var code = [
            Math.floor((Math.random() * 10) + 1),
            Math.floor((Math.random() * 10) + 1),
            Math.floor((Math.random() * 10) + 1)
        ].join('');

        socket.organizer = true;
        socket.code = code;
        socket.username = record.name;

        socket.volatile.emit('get_code', {
            code: code
        });
        console.log('CREATE SESSION');

    });
    socket.on('login', function(data) {
        var socks = io.sockets.sockets,
            code = data.code,
            sockId,
            sock,
            entries = 0,
            failureMessage,
            sockEntry;

        for (sockId in socks) {
            sock = socks[sockId];
            if (sock.code == code)  {
                entries ++;
                sockEntry = sock;
            }
        }

        if (entries === 1) {
            pairs[socket.id] = sockEntry;
            pairs[sockEntry.id] = socket;

            socket.username = data.name;
            socket.code     = data.code;

            socket.emit('login_complete',{
                success  : true,
                name     : data.name,
                socketId : socket.id
            });
            sockEntry.emit('get_peer', {code: code});
            return;
        }


        if (!entries) {
            failureMessage = "There's no session created based on your key.";
        } else {
            failureMessage = "A session pair has already been created based on this code. - " + entries;
        }
        socket.emit('login_complete',{
            success  : false,
            failureMessage: failureMessage
        });
    });

    socket.on('read_users', function() {
        var socks = io.sockets.sockets,
            users = [],
            sockId, sock,
            selectedSockets = [];

        for (sockId in socks) {
            if (socks.hasOwnProperty(sockId)) {
                sock = socks[sockId];

                if (sock.username && sock.code === socket.code) {
                    users.push({
                        name : sock.username,
                        code : sock.code
                    });
                    selectedSockets.push(sock)
                }
            }
        }
        selectedSockets.forEach(function(sock) {
            sock.emit('read_users_complete', {
                success : true,
                data    : users
            });
        });

    });

    socket.on('typingchange', function(data) {
        socket.broadcast.emit('typingchange', data);
    });
    socket.on('rtcmessage', function(data) {
        var pair = pairs[socket.id];
        if(pair) {
            pair.emit('rtcmessage', data);
        }
    });
    var clearListeners = function() {
        socket.removeAllListeners('createsession');
        socket.removeAllListeners('login');
        socket.removeAllListeners('read_user');
        socket.removeAllListeners('logout');
        socket.removeAllListeners('keep-alive');
        socket.removeAllListeners('typingchange');
        socket.removeAllListeners('disconnect_users');
    };
    var logout = function() {
        var pair = pairs[socket.id],
            socks = io.sockets.sockets,
            users = [],
            sockId, sock;

        // for the moment delete pair because only 2 people are allowed in one room
        if(pair) {
            delete pairs[pair.id];
            delete pairs[socket.id];
        }

        for (sockId in socks) {
            if (socks.hasOwnProperty(sockId)) {
                sock = socks[sockId];
                if (sock.username && (sock.id !== socket.id)) {
                    users.push({
                        name : sock.username,
                        code : sock.code
                    });
                }

            }
        }

        socket.broadcast.emit('read_users_complete', {
            success : true,
            data    : users
        });
    };
    /**
     * Disconnects only the users belonging to a certain "code"
     * */
    var disconnectUsers = function() {
        var socks = io.sockets.sockets,
            sockId, sock;
        for (sockId in socks) {
            if (socks.hasOwnProperty(sockId)) {
                sock = socks[sockId];
                if (sock.username && sock.code == socket.code) {
                    sock.emit('disconnect_users', { message: "The organizer has left the room. Your call will be disconnect" });
                }
            }
        }
    }

    socket.on('logout', function() {
        if (socket.organizer) {
            disconnectUsers();
        }
        logout();
    });

    socket.on('disconnect_users', function() {

        //for possible hacks on the client-side
        if (!socket.organizer) {
          return;
        }
        console.log('DISCONNECT All USERS');

        var pair = pairs[socket.id];
        if(pair) {
            delete pairs[pair.id];
            delete pairs[socket.id];
        }


        disconnectUsers();
        clearListeners();
    });

    //this is the special event handler when the user is disconnected
    socket.on('disconnect', function() {
        if (socket.organizer) {
            disconnectUsers();
        }
        clearListeners();
        logout();
    });
});
