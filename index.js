/*

This file contains the main logging logic.

API logging structure :
trace : 1,
error : 2,
query : 3
req   : 4,
res   : 5

The desired logging level is called from within the function which get logged onto the console if its
logging is enabled.

 */

var fs              = require('fs');

var chokidar        = require('chokidar');

_logFile            = "";

exports.trace       = trace;

exports.error       = error;

exports.request     = request;

exports.response    = response;

exports.query       = query;

exports.setPath     = setPath;


function log(level, parameters){

    var _loggerObject    =  parameters[0];

    var _moduleInfo      =  _loggerObject.moduleInfo;

    var _apiInfo         =  _loggerObject.apiInfo;

    var _logParams       =  parameters;

    if(!_logFile[_moduleInfo]){

        console.error("Module Info not defined.");

        return;

    }else if(!_logFile[_moduleInfo][_apiInfo]){

        console.error("Api Info not defined.");

        return;

    }

    var _logObject       = _logFile[_moduleInfo][_apiInfo];

    var stream = process.stdout;

    if(parseInt(_logObject[level])){

        printer(stream, _moduleInfo, _apiInfo, _logParams);

    }
}

function trace(/* arguments */){

    log('trace', arguments);

}

function error(/* arguments */){

    log('error', arguments);

}

function request(/* arguments */){

    log('request', arguments);

}

function response(/* arguments */){

    log('response', arguments);

}

function query(/* arguments */){

    log('query', arguments);

}

function setPath(_path){

    /*
        SET GLOBAL PATH VARIABLE AND REQUIRE LOG FILE
    */

    _createOutputFile(_path);

    _logFile        = require(_path);

    var _watcher    = chokidar.watch(_path);

    _watcher.on('change', function(){

        delete require.cache[require.resolve(_path)];

        _logFile         =  require(_path);

    });

}

function printer(stream, _moduleInfo, _apiInfo, _logParams){

    for(var i = 0; i < _logParams.length; i++){

        stream.write(_moduleInfo + ' | ' + _apiInfo + ' | ' + JSON.stringify(_logParams[i]) + '\n');

    }

}

function createFile(){
    var _counter = 0;

    return function(_path){
        if(_counter <= 1){
            _counter++;
            fs.open(_path, 'wx', (err, fd) => {
                if(err){
                    if(err.code == "EEXIST"){
                        return;
                    }
                    console.error(err.message);
                }

                fs.close(fd, (err) => {
                    if(err){
                        console.error(err.message);
                    }
                });
            });
        }
    }
}

var _createOutputFile = createFile();