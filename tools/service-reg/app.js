var express = require('express');
var app = express();
var jsonfile = require('jsonfile')
var config = {};


//Initialize the storage path
var dir = process.env.SERVICE_REG_STORAGE;


//Initialize the config file
function init() {

	if ( typeof dir !== 'undefined') {
	
		console.log("Reading config " + dir + "/config.json");
	
		//Read the config.json, if not existent then create it
        	try {
			config = jsonfile.readFileSync(dir + "/config.json");
		
        	} catch (err) {

			jsonfile.writeFileSync(dir + "/config.json", config);
		}
	}
}

//Refresh the config
function refresh() {
  
   //If the storage path is set
   if ( typeof dir !== 'undefined') {

      config = jsonfile.readFileSync(dir + "/config.json");

   }

}


//Store a new config
app.post('/config/:id/:value', function(req, res) {
  
   var id = req.params.id;
   var value = req.params.value;

   //If the storage path is set
   if ( typeof dir !== 'undefined') {

	//Read the config.json
	config = jsonfile.readFileSync(dir + "/config.json");

	//Set the value
	config[id] = value;

	//Write the config.json
	jsonfile.writeFileSync(dir + "/config.json", config);

   } else {

    //Use in memory storage
    config[id] = value;

   }

   res.json(config);


});

//Get the config
app.get('/config/:id', function(req, res) {

   var id = req.params.id;

   refresh();

   res.json(config[id]);

});

//Get all configs
app.get('/config/', function(req, res) {

   var id = req.params.id;

   refresh();

   res.json(config);

});


console.log("Starting service registry ...");

app.listen(3000, function () {
  console.log("Listening on http://<host>:3000");
  init();
});

