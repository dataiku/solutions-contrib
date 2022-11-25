const list = [
    { name: 'Empty Layout', path: 'empty-layout'}
]

export default list.map(layout => ({
    ...layout,
    screenshot: `/imgs/${layout.path}.png`,
    demoLink: `/layout/gallery/${layout.path}`,
    
  }))