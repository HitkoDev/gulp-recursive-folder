var fs = require("fs");
var pathLibrary = require("path");
var es = require("event-stream");
var foldersFound = [];

var readDirectory = function(dir, eachFile){
    var files = fs.readdirSync(dir);
    files.forEach(eachFile);
};
var recursiveReadFolder = function(dir, fileList){
    if(typeof fileList === "undefined"){
        fileList = [];
    }
    readDirectory(dir, function(fileName){
        var filePath = pathLibrary.join(dir, fileName);
        if(fs.statSync(filePath).isDirectory()){
            foldersFound.push({
                name:fileName,
                path:filePath,
                pathTarget : getPathTarget( filePath )
            });
            fileList = recursiveReadFolder(filePath, fileList);
        } else {
            fileList.push(filePath);
        }
    });
    return fileList;
};
var getPathTarget = function(path){
    var pathToArray = path.split(pathLibrary.sep);
    pathToArray.shift();
    return pathToArray.join(pathLibrary.sep);
};
var getFolderBase = function(baseDir){
    var folder = {name: "", path: ""};
    readDirectory(baseDir, function(fileName){
        var fileTest = pathLibrary.join(baseDir, fileName);
        if(!fs.statSync(fileTest).isDirectory()){
            var pathExample = fileTest.split(pathLibrary.sep);
            folder.name = pathExample[pathExample.length - 2];
            folder.path = pathLibrary.join(baseDir, "");
            folder.pathTarget = getPathTarget(folder.path);
        }
    });
    return folder;
};
var taskSelf = function(dir, tasks){
    return function(done){
        var folderBase = getFolderBase(dir);
        if(folderBase.name){
            foldersFound.push(folderBase);
        }
        recursiveReadFolder(dir);
        var streams = foldersFound.map(tasks);
        if(streams.length === 0){
            done();
        }
        return es.merge.apply(null, streams);
    }
};
module.exports = taskSelf;
