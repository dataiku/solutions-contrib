import pages from './pages'

function createLayoutGallery(...list) {
  return list.map((layout) => ({
  ...layout,
  screenshot: `/imgs/layouts/${layout.path}.png`,
  demoLink: `/layout/gallery/${layout.path}`,
}));
}

export const layoutGallery = createLayoutGallery(
  { name: "Layout with no tabs", path: "empty-layout" },
  { name: "Layout with multiple tabs", path: "layout-with-tabs" }
);

const docsPages = [
  {
    path: '',
    component: () => import('../pages/Index.vue')
  }
]


function parseMenuNode (node, __path, __name) {
  const prefix = __path + (node.path !== void 0 ? '/' + node.path : '')
  const name = __name + (node.name !== void 0 ? '/' + node.name : '')

  if (node.children && node.children.length > 0) {
    docsPages.push({
      path: prefix,
      redirect: "/"
    })

    node.children.forEach(node => parseMenuNode(node, prefix, name))
  }
  else {
    docsPages.push({
      path: prefix,
      component: () => import("../pages" + name + ".vue")
    })
  }
}


pages.forEach(node => {
  parseMenuNode(node, '','')
})

const testRoutes = process.env.DEV ? require("./testRoutes").default : [];

const routes = [
  {
    path: '/',
    component: () => import('layouts/DocLayout.vue'),
    children: docsPages,
  },
  ...layoutGallery.map(layout => ({
    path: layout.demoLink,
    component: () => import(`../gallery/layouts/${layout.path}.vue`),
    children: [
      {
        path: '',
        component: () => import('../components/page-parts/layout/LayoutGalleryPage.vue')
      }
    ]
  })),
  ...testRoutes,
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
