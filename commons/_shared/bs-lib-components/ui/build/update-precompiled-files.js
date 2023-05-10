import { createFolder, readFolder, writeFile } from './utils.js';
import path from "node:path";

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const precompiledBasePath = 'dev/src/precompiled';

function resolveUIFolderPath(relPath) {
    return path.resolve(__dirname, "..", relPath);
}

function bsLayoutDefaultBaseComponents() {
    const vueFileName = (fileName) => fileName.slice(0, -4); // name.vue
    const baseComponentsFolder = resolveUIFolderPath("src/components/layout/base-subcomponents");
    const baseComponentsFiles = readFolder(baseComponentsFolder);
    const baseComponentsNames = baseComponentsFiles.map((fileName) =>
        vueFileName(fileName)
    );
    return baseComponentsNames;
}

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

	createPrecompiledFile(
		createStringVarsFromObject({
			baseComponents: {
				data: bsLayoutDefaultBaseComponents(),
				declareType: VarDeclareType.Const,
			},
		}),
		'precompiledData.ts'
	);
}

updatePrecompileFiles();