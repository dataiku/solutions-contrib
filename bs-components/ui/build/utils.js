
import fs from "node:fs";
import path from "node:path";

function getSize(code) {
    return (code.length / 1024).toFixed(2) + 'kb'
}

export function createFolder(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

export function readFolder(dir) {
    return fs.existsSync(dir) ? fs.readdirSync(dir) : []; 
}

export function writeFile(dest, code) {
    return new Promise((resolve, reject) => {
        fs.writeFile(dest, code, (err) => {
            if (err) return reject(err)
            else {
                console.log(`${path.relative(process.cwd(), dest).padEnd(41)} ${getSize(code).padStart(8)}`);
                resolve(code);
            }
        })
    })
}

export function readFile (file) {
    return fs.readFileSync(file, 'utf-8');
}