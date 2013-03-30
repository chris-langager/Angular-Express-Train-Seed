var mongoose = require('mongoose');

module.exports = function (app) {
    //set up mongoose database connection
    if(!mongoose.connection.readyState){
      mongoose.connect(app.config.mongodb.uri);
    }
}