const fs = require('fs');
const path = require('path');

const getFolderContents = (filePath) => {

    if(!pathExists(filePath)){
        console.log('Path Does Not Exist.');
        return;
    }

    var newDir = []

    const baseDir = readDirectory(filePath)

    for(const f of baseDir) {

        var currentPath = path.join(filePath, f)

        const currentPathIsDir = isDirectory(currentPath)
        console.log('YO:', currentPathIsDir)
        if(currentPathIsDir) {
            console.log('folder')
            var tempDir = getFolderContents(currentPath)

            if(tempDir.length > 0)
                newDir.push(tempDir)
        }
        else {
            newDir.push(currentPath)
        }
    }

    return newDir
}

// return true if path is of directory, false if file
const isDirectory = (filePath) => {


    const stats = fs.statSync(filePath)
    return stats.isDirectory()
}


const pathExists = (filePath) => {
    
    return fs.existsSync(filePath)
} 

const readDirectory = (filePath) => {

    const dirFiles = fs.readdirSync(filePath)

    return dirFiles
} 


module.exports = {
    getFolderContents
}