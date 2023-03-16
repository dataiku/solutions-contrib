const path = require("path");

const { createFolder, readFolder, writeFile, resolve } = require('./utils');

const precompiledBasePath = 'dev/src/precompiled';

function bsLayoutDefaultBaseComponents() {
    const vueFileName = (fileName) => fileName.slice(0, -4); // name.vue
    const baseComponentsFiles = readFolder('src/components/layout/base-subcomponents');
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
	return writeFile(resolve(path), contents);
}

function createPrecompiledFile(
	contents,
	fileName,
	basePath = precompiledBasePath
) {
	writeFileResolved(`${basePath}/${fileName}`, contents);
}

function updatePrecompileFiles() {
    createFolder(precompiledBasePath);

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