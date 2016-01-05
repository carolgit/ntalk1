var express = require('express'), load = require('express-load'), bodyParser = require('body-parser'),
session = require('express-session'), cookieParser = require('cookie-parser'), methodOverride = require('method-override')
, error = require('./middleware/error')
, app = express()
, server = require('http').createServer(app)
, io = require('socket.io').listen(server);

const KEY = 'ntalk.sid', SECRET = 'ntalk';
var cookie = cookieParser(SECRET)
, store = new session.MemoryStore()
, sessOpts = {secret: SECRET, key: KEY, store: store}
, session2 = session(sessOpts);


app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.use(cookie);

// app.use(session());

app.use(session2);

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

io.set('authorization', function(data, accept){
  cookie(data, {}, function(err){  
    var sessionID = data.signedCookies[KEY];
    console.log(sessionID);
    store.get(sessionID, function(err, session){
      if(err || !session){
        //FIXME sempre caindo aqui
        console.log('error session');
        accept(null||false);
      }else{
        console.log('accept session');
        data.session = session;
        console.log(data.session);
        accept(null, true);
      }
    });
  });
});
// io.use(function(socket, next) {
//   var data = socket.request;
//   cookie(data, {}, function(err) {
//     var sessionID = data.signedCookies[KEY];
//     store.get(sessionID, function(err, session) {
//       if (err || !session) {
//         return next(new Error('Acesso negado!'));
//       } else {
//         socket.handshake.session = session;
//         return next();
//       }
//     });
//   });
// });



load('models').then('controllers').then('routes').into(app);
load('sockets').into(io);

// server.listen(3090, function(){
//   console.log("Ntalk no ar.");
// });

server.listen(3000, function(){
  console.log("Ntalk no ar.");
});