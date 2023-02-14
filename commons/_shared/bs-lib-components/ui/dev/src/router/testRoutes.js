const testPath = "/test_library"

export default [
    {
        path: testPath,
        component: () => import(`../test/TestView.vue`),
    }
]