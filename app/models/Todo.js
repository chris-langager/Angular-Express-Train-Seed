var mongoose = require('mongoose');

module.exports = function (app) {

    var TodoSchema = new mongoose.Schema({
        text: {type:String},
        complete: {type:Boolean},
        userId: {type:mongoose.Schema.Types.ObjectId}
    });

    return mongoose.model('Todo', TodoSchema);
}
