var fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	Url = require('url'),
	format = require('util').format,
	exec = require('child_process').exec;

var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var prefPath = path.join(home, '.node-boilerplate.json');

function getPrefs(){	
	if(!fs.existsSync(prefPath)){
		setPrefs({});
	}
	return require(prefPath);
}

function setPrefs(obj){
	fs.writeFileSync(prefPath, JSON.stringify(obj)); 
	console.log('Your boilerplate preferences file was written to',prefPath);
}

function logit(data){
	console.log(data.toString());
}

function clone(source,to,cb){
	var git = exec(format('git clone',source,to), function(err, stdout){
        if(err) return cb(err);
        var git = path.join(to, '.git');
        try {
            rmdir(git);
        } catch (e) {
            return cb(e)
        }
        return cb(null, stdout);
    });
}

function copy(source,to,cb){
	fs.stat(source, function(err,stats){
        if(err) return cb(err);
		if(stats.isDirectory()){
			wrench.copyDirRecursive(source,to,cb);
		}else if (stats.isFile()){
			fs.createReadStream(source).pipe(fs.createWriteStream(to)).on('end', cb);
		}else{
			cb(new Error('Boilerplate can only copy files or directories'));
		}
	});	
}

//todo: explode from a manifest
function explode(source,to,cb){

}

function rmdir(dir) {
    var list = fs.readdirSync(dir);
    for(var i = 0; i < list.length; i++) {
        var filename = path.join(dir, list[i]);
        var stat = fs.statSync(filename);

        if(filename == "." || filename == "..") {
            // pass these files
        } else if(stat.isDirectory()) {
            // rmdir recursively
            rmdir(filename);
        } else {
            // rm fiilename
            fs.unlinkSync(filename);
        }
    }
    fs.rmdirSync(dir);
};

var prefs = getPrefs();

//allows aliases to reference one another
function resolve(source){
    //Todo: 2 sources referencing each other makes an infinite loop!

    var aliased = prefs[source];
    if(aliased) {
        return resolve(aliased);
    }
    else {
        return source;
    }
}

module.exports = {
	generate : function(source,to,cb){
		source = resolve(source);
		
		var url = Url.parse(source);
        if(~['http:','https:','git:'].indexOf(url.protocol)){
			clone(source,to,cb);
		}else{
			copy(source,to,cb);			
		}	
	},

	register : function(alias, source){
		prefs[alias] = source;
		setPrefs(prefs);
	},

	unregister : function(alias){
		delete prefs[alias];
		setPrefs(prefs);
    },

    template : require('./templating'),

    view: function(alias) {
        if(prefs[alias]){
            return resolve(alias);
        }
        else {
            return undefined;
        }
    }

}