const testPath = "/test_library";
const testTableGenericPath = "/test_table_generic";

export default [
    {
        path: testPath,
        component: () => import(`../test/TestView.vue`),
    },
    {
        path: testTableGenericPath,
        component: () => import(`../test/BsTableGenericView.vue`),
    },
]