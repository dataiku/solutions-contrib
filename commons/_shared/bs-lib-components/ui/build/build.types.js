const fs = require('fs')
const path = require('path')


const { writeFile, logError  } = require('./utils.js')
const distRoot = path.resolve(__dirname, '../dist/types')
const typeRoot = path.resolve(__dirname, '../types')
const resolvePath = file => path.resolve(distRoot, file)



function copyPredefinedTypes (dir, parentDir) {
    fs.readdirSync(dir)
      .filter(file => path.basename(file).startsWith('.') !== true)
      .forEach(file => {
        const fullPath = path.resolve(dir, file)
        const stats = fs.lstatSync(fullPath)
        if (stats.isFile()) {
          writeFile(
            resolvePath(parentDir ? parentDir + file : file),
            fs.readFileSync(fullPath)
          )
        }
        else if (stats.isDirectory()) {
          const p = resolvePath(parentDir ? parentDir + file : file)
          if (!fs.existsSync(p)) {
            fs.mkdirSync(p)
          }
          copyPredefinedTypes(fullPath, parentDir ? parentDir + file : file + '/')
        }
      })
}

module.exports.generate = function () {
    
    try {
      copyPredefinedTypes(typeRoot)
    }
    catch (err) {
      logError('build.types.js: something went wrong...')
      console.log()
      console.error(err)
      console.log()
      process.exit(1)
    }
}