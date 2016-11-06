'use strict'

var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    mongoose = require('mongoose'),
	apiRoute = require('./routes/api'),
	statesRoute = require('./routes/states'),
	actionsRoute = require('./routes/actions'),
	dynamicIndex = require('./routes/end-points/actions/dynamic-index'),
	Namespace = require('./routes/interceptors/namespace');

//MONGOOSE CONNECTION
var options = { /*user: 'root', pass: 'root'*/};
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/cems', options);

//BUILD THE APP
var app = express();

//BODY REQUEST
app.use(bodyParser.urlencoded({extended: false, limit:'50mb'}));
app.use(bodyParser.json({strict:true, limit:'50mb'}));


//ROUTES HERE
app.use('/api', apiRoute);
app.use('/states', statesRoute);
app.use('/action', actionsRoute);

//STATIC FILES
var url = path.join(__dirname, '/../public');
app.use(express.static(url));

// MANAGE ALL OTHER URL
app.use('/', Namespace.create, dynamicIndex().init);

//JWT & ANGULAR
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

//APP LAUNCHER
var PORT = process.env.PORT || 5555;
app.listen(PORT, function(){
    console.log('Server is listening on port : ', PORT);
});