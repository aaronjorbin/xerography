/*!
* Future Settings Parser for xerography
* 
* Reads options from an individual slideshows config and from a template config
* Templates also specify a base.  Only base right now is deck.js
*/
var fs = require('fs.extra')
    , path = require('path')
    , _ = require('lodash');

function loadFiles(type,source,sourceDir){
    var files = [];
    if ( _.isArray( source[type] ) )
    {
        files.push( _.map( source[type] , function(name){
            return sourceDir + '/' + type + '/' + name;
        }));
    }
    return files;
}

module.exports = function(){
    this.projectdir = process.cwd();
    var projectdir = this.projectdir

    this.xerographyConfig = {}; 

    // Attempt to load a config for a specific slideshow
    try{
        console.log ( this.projectdir + '/xerography.js' );
        this.xerographyConfig = require ( this.projectdir + '/xerography.js') ;
    } catch(err) {
        // If the file doesn't exist, we will just use defaults
        this.xerographyConfig = {}; 
    }

    // Load the Template 
    this.template     =  this.xerographyConfig.template || 'xerography-peppercorn-saison';
    this.templateConfig = new require(this.template);
    this.templatedir  = path.dirname( require.resolve(this.template) ); 
    this.header       = this.templatedir + '/header.html';
    this.footer       = this.templatedir + '/footer.html';

    
    // Load some options based on the config or our defaults
    this.title        = this.xerographyConfig.title || 'xerography.js';
    this.source       = this.xerographyConfig.source || ['readme.md'];
    this.port         = this.xerographyConfig.port || 4242;
    this.publicDir    = ( this.xerographyConfig.publicDir ) ? this.projectdir +  this.xerographyConfig.publicDir : this.projectdir + '/public';

console.log(  this.templateConfig.css );
    this.cssfiles = _.flatten( loadFiles('css', this.templateConfig, this.templatedir) ); 
    this.jsfiles = _.flatten( loadFiles('js', this.templateConfig, this.templatedir) ); 
    this.headerjsfiles = _.flatten( loadFiles('headerjs', this.templateConfig, this.templatedir) ); 

};

