
export default [
    ...[
        "TestLibrary",
        "TestTableGeneric",
        "TestLayout",
        "TestRouteExample",
    ].map(component => createTestRoute(component)),
];
