import { createTestRoute } from "./testRoutesUtils";
let testViews: string[] = [];
try {
    testViews = require("../precompiled/localPrecompiledData").testViews;
} catch(err) {
    
    console.error("Please, run node update-precompiled-files.js in commons/_shared/bs-lib-components/ui/build folder");
    console.error(err);
}

export default testViews.map((component: string) => createTestRoute(component));