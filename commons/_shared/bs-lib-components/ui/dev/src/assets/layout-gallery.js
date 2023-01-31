const list = [
    { name: 'Layout with one tab', path: 'empty-layout'},
    { name: 'Layout with multiple tabs', path: 'layout-with-tabs'}

]

export default list.map(layout => ({
    ...layout,
    screenshot: `/imgs/layouts/${layout.path}.png`,
    demoLink: `/layout/gallery/${layout.path}`,
  }))