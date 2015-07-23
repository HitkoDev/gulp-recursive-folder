# gulp-recursive-folder
Gulp plugin that work with folders treat them recursively

# Inspired of Amazing packages:
- [gulp-folders](https://www.npmjs.com/package/gulp-folders) - Work folders like a packages
- [gulp-recursive-concat](https://www.npmjs.com/package/gulp-recursive-concat) -  Concat files recursively

# Example

Given the follow tree:

```
src
    modules
        submodules
            submodules1.js
            submodules2.js
        modules1.js
        modules2.js
            subsubmodules
                subsubmodules1.js
                subsubmodules2.js
    src1.js
    src2.js
```

generates:

```
src
    modules
        submodules
            submodules.js
            subsubmodules
                subsubmodules.js
        modules.js
    src.js
```

or

```
src
    modules.js
    submodules.js
    subsubmodules.js
    src.js
```

Depends the usage, You can use the output object *folderFound* like the usage section below

## Usage

```javascript
var gulp = require('gulp'),
	path = require('path'),
	recursiveFolder = require('gulp-recursive-folder'),
	options = {
	    readFolder: 'path/to/folder',
	    target: 'path/to/generate'
	}

gulp.task('generateTree', recursivefolder(options.readFolder, function(folderFound){
	//This will loop over all folders inside pathToFolder main and recursively on the children folders, secondary
    //With folderFound.name gets the folderName
    //With folderFound.path gets all folder path found
    //With folderFound.pathTarget gets the relative path beginning from options.pathFolder
    return gulp.src(folderFound.path + "/*.js")
        .pipe(concat(folderFound.name + ".js"))
        .pipe(gulp.dest(options.target + "/" + folderFound.pathTarget));
}));

//or
gulp.task('generateConcatOfFolders', recursivefolder(options.readFolder, function(folderFound){
	return gulp.src(folderFound.path + "/*.js")
        .pipe(concat(folderFound.name + ".js"))
        .pipe(gulp.dest(options.target));
}));
```
