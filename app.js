var express = require('express');
var path = require('path');
var ejs = require('ejs');
var session = require('express-session');

var routes = require('./routes');

var app = express();
app.set('port', process.env.PORT || 8888);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/upload', express.static(path.join(__dirname, 'upload')));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));


routes(app);


var server = app.listen(app.get('port'), function() {
    console.log('Server running at ' + server.address().address + ' : ' + server.address().port);
})