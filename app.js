var express = require('express'), load = require('express-load'), bodyParser = require('body-parser'),
session = require('express-session'), cookieParser = require('cookie-parser'), methodOverride = require('method-override')
, error = require('./middleware/error')
, server = require('http').createServer(app)
, io = require('socket.io').listen(server);

var app = express();

app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.use(cookieParser('ntalk'));

app.use(session());

app.use(bodyParser());

//permite usa um mesmo path entre methodos htpp (post,put,delete e get)
app.use(methodOverride(function(req,res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

app.use(express.static(__dirname + '/public'));
//tratando pagina de erros
 // app.use(error.notFound);
 // app.use(error.serverError);

load('models').then('controllers').then('routes').into(app);

io.sockets.on('connection', function(client){
	client.on('send-server', function (data){
		var msg = "<b>"+data.nome+":</b> "+data.msg+"<br>";
		client.emit('send-client',msg);
		client.broadcast.emit('send-client', msg);
	});
});

server.listen(3090, function(){
  console.log("Ntalk no ar.");
});

app.listen(3000, function(){
  console.log("Ntalk no ar.");
});