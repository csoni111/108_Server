// set variables for environment
var express = require('express');
var app = express();


// set routes
app.get('/', function (req, res) {
  res.send('Index Page')
})

// instruct express to server up static assets
app.use(express.static('public'));
// Set server port
app.listen(3000, function() {
	console.log('server is running');	
});