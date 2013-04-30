var mongoose = require('mongoose');

module.exports = function (app) {

    var TodoSchema = new mongoose.Schema({
        text: {type: String},                            //text of the todo
        complete: {type: Boolean},                       //whether the todo is complete or not
        userId: {type: mongoose.Schema.Types.ObjectId}   //the user this todo belongs to
    });

    return mongoose.model('Todo', TodoSchema);
    //work around - for some reason this is getting called twice, and throws an error the second time around
//    try {
//        mongoose.model('Todo', TodoSchema);
//    } catch (error) {}
//
//    return mongoose.model('Todo');
}
