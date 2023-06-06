function PascalToSnakeCase (str: string) {
    return str.replace(/\.?([A-Z]+)/g, (x,y) => "_" + y.toLowerCase()).replace(/^_/, "");
}

/**
 * function for creating a test route
 * add a component to **commons/_shared/bs-lib-components/ui/dev/src/test** and name it in **PascalCase**
 * copy it's name and add it to this function
 * 
 * @param {string} fileName **PascalCase** formatted file name
 * @param {string=} urlPath path to the test route => defaults to snake_cased name of the component
 */

export function createTestRoute(fileName: string, urlPath?: string) {
    const componentName = fileName.slice(0, -4) // .vue;
    const path = `/${urlPath || PascalToSnakeCase(componentName)}`;
    const component =  () => import(`../test/${fileName}`);
    
    return {
        path,
        component,
    };
}

let testViews: string[] = [];
try {
    testViews = (process.env.TEST_VIEWS as any) || [];
} catch(err) {
    console.error(err);
}

export default testViews.map((component: string) => createTestRoute(component));