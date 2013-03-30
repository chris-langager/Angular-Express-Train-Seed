var mongoose = require('mongoose'),
    crypto = require('crypto');


module.exports = function (app) {

    var UserSchema = new mongoose.Schema({
        username: { type:String, required:true , unique:true},
        hashed_password: {type:String, required:true},
        salt: {type:String, required:true}
    });

    UserSchema.virtual('password')
        .set(function(password) {
            this._password = password;
            this.salt = this.makeSalt();
            this.hashed_password = this.encryptPassword(password);
        })
        .get(function() { return this._password; });

    UserSchema.method('authenticate', function(plainText) {
        console.log('authenticate called:')
        console.log('plain text = ' + plainText)
        console.log('hashed = ' + this.encryptPassword(plainText))
        console.log('db password= ' + this.hashed_password)
        return this.encryptPassword(plainText) === this.hashed_password;
    });

    UserSchema.method('makeSalt', function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    });

    UserSchema.method('encryptPassword', function(password) {
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    });

    UserSchema.method('generateToken', function() {
        return crypto.createHash('md5').update(this.username + Date().toString()).digest("hex");
    });

    UserSchema.pre('save', function(next) {

        this.token = this.generateToken();

        if (!validatePresenceOf(this.password || this.hashed_password)) {
            next(new Error('Invalid password'));
        } else {
            next();
        }
    });

    return mongoose.model('User', UserSchema);
}

function validatePresenceOf(value) {
    return value && value.length;
}