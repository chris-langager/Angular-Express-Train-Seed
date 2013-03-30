Boilerplate
=====

Fast, generic, highly customizeable application generator using node.js.

## Installation

	$ npm install -g boilerplate

## Quick start

The current version of boilerplate just recursively copies a directory or git repo to the location of your choosing.  We intend to add file templating in the next release update.  Using the command line, the format is: 

    $ boilerplate <src> <dst>

Generating based on a local template would therefore look like:

    $ boilerplate ~/templates/some-app ~/workspace/my-new-app

And generating based on a git URL would be similar:

    $ boilerplate git://github.com/myname/myrepo ~/workspace/my-new-app

The latter would work with http:// or https:// as well as git://.

A boilerplate folder can also include files that are setup to act as templates, with data injected in to customize the file for the particular deployment that you're working on.  Any file with the extension .template is assumed to be a handlebars-formatted file ripe for replacement.  Let's say you have the following file:

/Users/me/mydata.json.template
```js
{ "name" : "{{name}}"}
```

Running the following command 

	$ boilerplate /Users/me /Users/other name:Howie

Would result in the /Users/me directory being copied to /Users/other and the creation of /Users/other/mydata.json with the following content:
```js
{ "name" : "Howie"}
```

## Using Boilerplate Programmatically

Boilerplate can be used programmatically as well.  An app can simply require the module and use its api:

```js
var boilerplate = require('boilerplate');

boilerplate.generate('git://github.com/myname/myrepo', '~/workspace/my-new-app', function(err){  console.log(err); });

boilerplate.template('~/workspace/my-new-app', templateData); // where templateData is a JS object to be passed into the handlebars template

```

## Preferences

While not exposed to the cli yet, the api offers the ability to add and remove aliases for sources as well.  This information is stored in a file in your home directory called .node-boilerplate.json.  Setting it programmatically is as simple as:

```js
boilerplate.register('default', 'git://github.com/myname/myrepo');
```

After that, using the term 'default' as the source in either the cli or programmatically will resolve to the git URL listed above.  