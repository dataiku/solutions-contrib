import { createTestRoute } from "./testRoutesUtils";

export default [
    ...[
        "TestLibrary",
        "TestTableGeneric",
        "TestLayout",
        "TestRouteExample",
        "TestReactivity",
    ].map(component => createTestRoute(component)),
];