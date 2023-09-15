import { createFolder, readFolder, writeFile } from './utils.js';
import path from "node:path";

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const precompiledBasePath = 'dev/src/precompiled';


const VarDeclareType = {
	Const: 'const',
	Let: 'let',
}

function varToVarString(
    variable,
    variableName,
    declareType = VarDeclareType.Let,
) {
    return `export ${declareType} ${variableName} = ${JSON.stringify(variable)};\n`;
}

function createStringVarsFromObject(records) {
    const entries = Object.entries(records);
    const stringOfVars = entries.reduce((contents, [name, {data, declareType}]) => {
        return contents + varToVarString(data, name, declareType);
    }, "");
    return stringOfVars;
};

function writeFileResolved(path, contents) {
	return writeFile(resolveUIFolderPath(path), contents);
}

function createPrecompiledFile(
	contents,
	fileName,
	basePath = precompiledBasePath
) {
	writeFileResolved(`${basePath}/${fileName}`, contents);
}

function updatePrecompileFiles() {
    const folderPath = resolveUIFolderPath(precompiledBasePath);
    createFolder(folderPath);
    
	// createPrecompiledFile(
	// 	createStringVarsFromObject({
	// 		baseComponents: {
	// 			data: your_data,
	// 			declareType: VarDeclareType.Const || VarDeclareType.Let,
	// 		},
	// 	}),
	// 	'yourFileName.ts'
	// );
}