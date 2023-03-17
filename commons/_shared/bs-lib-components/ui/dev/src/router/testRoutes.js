import { createTestRoute } from "./testRoutesUtils";

export default [
    ...[
        "TestLibrary",
        "TestTableGeneric",
        "TestLayout",
        "TestRouteExample",
    ].map(component => createTestRoute(component)),
];
