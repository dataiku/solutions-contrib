// Copy contents of this file to testRoutes.js in this folder

import { createTestRoute } from "./testRoutesUtils";

export default [
    ...[
        "TestRouteExample",
    ].map(component => createTestRoute(component)),
];