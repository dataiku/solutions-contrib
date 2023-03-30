const PascalToSnakeCase = str => str.replace(/\.?([A-Z]+)/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "");


/**
 * function for creating a test route
 * add a component to **commons/_shared/bs-lib-components/ui/dev/src/test** and name it in **PascalCase**
 * copy it's name and add it to this function
 * 
 * @param {string} componentName **PascalCase** formatted component name
 * @param {string=} urlPath path to the test route => defaults to snake_cased name of the component
 */
export function createTestRoute(componentName, urlPath) {
    const path = `/${urlPath || PascalToSnakeCase(componentName)}`;
    const component =  () => import(`../test/${componentName}.vue`);
    
    return {
        path,
        component,
    };
}