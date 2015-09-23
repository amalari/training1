
var express = require('express'); //load express
var handlebars = require('express-handlebars').create({ 
	extname : '.html',
	defaultLayout:'main',
	helpers: {
		section: function(name, options){
			// console.log(!this._sections);
			// console.log(name);
			// console.log(option);
			// console.log(this);
			if(!this._sections) this._sections = {};
			this._sections[name] = options.fn(this);
			return null;
		}
	}
});

var app = express();

app.engine('.html',handlebars.engine);
app.set('view engine', '.html');

app.use(express.static(__dirname + '/public'));

var fortunes = [
"Conquer your fears or they will conquer you.",
"Rivers need springs.",
"Do not fear what you don't know.",
"You will have a pleasant surprise.",
"Whenever possible, keep it simple.",
];

var getWeatherData = function(){
	return {
		locations: [
		{
			name: 'Portland',
			forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
			iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
			weather: 'Overcast',
			temp: '54.1 F (12.3 C)',
		},
		{
			name: 'Bend',
			forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
			iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
			weather: 'Partly Cloudy',
			temp: '55.0 F (12.8 C)',
		},
		{
			name: 'Manzanita',
			forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
			iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
			weather: 'Light Rain',
			temp: '55.0 F (12.8 C)',
		},
		],
	};
};


//middleware for partials
app.use(function(req, res, next){
	//console.log(!res.locals.partialsData); //true
	if(!res.locals.partialsData) res.locals.partialsData = {}; //make object of res.locals.partials
	res.locals.partialsData.weather = getWeatherData(); //has value an Array
	next(); //next to handler below
});

app.get('/test', function(req, res) {
	res.render('jquery-test');
});
app.get('/', function(req, res) {
	res.render('home');
	// console.log(res.render('home'));
});
app.get('/about', function(req, res){
	var randomFortune =
	fortunes[Math.floor(Math.random() * fortunes.length)];
	res.render('about', { fortune: randomFortune });
});

app.get('/nursery-rhyme', function(req, res){
	res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme', function(req, res){
	res.json({
		animal: 'squirrel',
		bodyPart: 'tail',
		adjective: 'bushy',
		noun: 'heck',
	});
});
// 404 catch-all handler (middleware)
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});
// 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});


app.listen(3002);