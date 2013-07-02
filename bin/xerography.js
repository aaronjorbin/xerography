#! /usr/bin/env node
/*!
* Xerography 
* Copyright (c) 2013 Aaron Jorbin 
* licensed under the MIT license and GPL license.
* https://github.com/aaronjorbin/beergen/blob/master/MIT-license.txt
*/

/**
* Module dependencies.
*/
var fs = require('fs.extra')
    , path = require('path')
    , _ = require('lodash')
    , static = require('node-static') 
    , settings = require( __dirname + '/../src/settings.js') 
    , templateTags = require( __dirname + '/../src/templateTags.js')
    , program = require('commander');


program.version('0.2.0.alpha')
    .option('-b, --build', "Don't start the server, just build")
    .parse(process.argv);


var xerography  = function(){
    var header = footer = source = '';
    var pages = {};

    var config = new settings;
    // Add the file that converts our UL to slides last
    console.log(config);

    var sourceFilenames = config.source; 
    
    // If public doesn't exist as a sibling to sourceFilenam, try to create it,
    if (! fs.existsSync( config.publicDir ) )
        fs.mkdirSync(config.publicDir, '0775');
    if (! fs.existsSync( config.publicDir + '/css' ) )
        fs.mkdirSync(config.publicDir + '/css', '0775');
    if (! fs.existsSync( config.publicDir + '/js' ) )
        fs.mkdirSync(config.publicDir + '/js', '0775');

    function loadFile(which) {
        console.log(which + ' loaded');
        return templateTags(  fs.readFileSync(config[which] , 'ascii'),config , true );
    }

    function loadHeader(){
        header = loadFile('header');
    }

    function loadFooter(){
        footer = loadFile('footer');
    }
    function loadHTML(){
        _.each(sourceFilenames, function(file, i){
                pages[i + file] = fs.readFileSync(file, 'ascii');
        });
    }


    // Watch our HTML files
    _.each(sourceFilenames, function(file, i){
        fs.watchFile( file, function(curr,prev){
            if ( Date.parse( curr.mtime  )!= Date.parse( prev.mtime )  )
            {
                pages[i + file] = fs.readFileSync(file, 'ascii');
                console.log( file + 'source reloaded');
                writeFile('html');
            }
        });
    });

    fs.watchFile(config.header, function(curr, prev){
        if ( Date.parse( curr.mtime  )!= Date.parse( prev.mtime )  )
        {
            loadHeader();
            writeFile('html');
        }
    });

    fs.watchFile(config.footer, function(curr,prev){
        if ( Date.parse( curr.mtime  )!= Date.parse( prev.mtime )  )
        {
            loadFooter();
            writeFile('html');
        }
    });


    // Watch our CSS Files
    _.each(config.cssfiles, function(css){
        fs.watchFile(css, function(curr,prev){
            if ( Date.parse( curr.mtime  )!= Date.parse( prev.mtime )  )
            {
                console.log('css file reloaded: ' + css);
                writeFile( 'css' );
            }
        });
    });

    // Watch our JS files
    _.each(config.jsfiles, function(js){
        fs.watchFile(js, function(curr,prev){
            if ( Date.parse( curr.mtime  )!= Date.parse( prev.mtime )  )
            {
                console.log('js file reloaded: ' + js );;
                writeFile( 'js' );
            }
        });
    });


    // Used to concat our js and css files
    function concatFiles(type, files){
        return _.reduce(files, function(memo, file){
            var comment = '\n /* ' + file + ' */ \n';
            return memo + comment + fs.readFileSync(file, 'ascii');
        },'');
    }

    // The second arg is the output file
    function writeFile( type ){
        var content;
        var filename;
        if (type =='html' )
        {
            var innerHtml =  '';
            _.each(pages, function(source,i){
                innerHtml = innerHtml + templateTags( source , config );
            });
            content = header + innerHtml + footer;
            filename = 'index.html';
            fs.writeFileSync( config.publicDir +  '/' + filename, content, 'ascii');
            console.log( filename + ' written');
        }
        else if(type == 'headerjs')
        {
            content = concatFiles('js', config.headerjsfiles);
            filename = 'js/header.js';
        }
        else if(type == 'js')
        {
            content = concatFiles('js', config.jsfiles);
            filename = 'js/script.js';
        }
        else if(type == 'css')
        {
            content = concatFiles('css', config.cssfiles);
            filename = 'css/style.css';
        }
        else if(type == "img")
        {
            fs.copyRecursive( config.templatedir + '/img'  , config.publicDir + '/img' , function(err){
                console.log('imgs written'); 
            });
            return
        }

        fs.writeFileSync( config.publicDir +  '/' + filename, content, 'ascii');
        console.log( filename + ' written');

    }


    // Everything is ready to go, let's do our first build
    loadHeader();
    loadFooter();
    loadHTML();
    console.log('source: ' + sourceFilenames.join(', ') +' loaded');
    writeFile('html');
    writeFile('css');
    writeFile('img');
    writeFile('headerjs');


    // Setup our Server
    if (! program.build ) 
    {
        var fileRequest = new static.Server( config.publicDir );
        require('http').createServer(function (request, response) {
            request.addListener('end', function () {
                fileRequest.serve(request, response);
            }).resume();
        }).listen(config.port);
        console.log('displaying on http://localhost:' + config.port );
    } else {
        process.exit(0);
    }

}
xerography();
