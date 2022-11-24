/*
 * Export files list for /pages folder
 */
const specialRE = /[\s·/_\\,:;\.\(\)\[\]]+/g
const andRE = /&/g
const nonWordRE = /[^\w-]+/g
const multipleDashRE = /--+/g

const slugify = str => (
  String(str).toLowerCase()
    .replace(specialRE, '-')
    .replace(andRE, '-and-')
    .replace(nonWordRE, '')
    .replace(multipleDashRE, '-')
)


function kebabCase (str) {
  const result = str.replace(
    /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g,
    match => '-' + match.toLowerCase()
  )
  return (str[0] === str[0].toUpperCase())
    ? result.substring(1)
    : result
}

function getName (str) {
  let result = str.replace("-"," ")
  return result.charAt(0).toUpperCase() + result.slice(1);
}


const pages = require.context('../pages', true, /^\.\/.*\.vue$/)
.keys()
.map(page => page.slice(2).replace('.vue', ''))
.filter(page => page !== 'Index' && page !== 'Error404')
.reduce((r, p) => {
  var names = p.split('/');
  names.reduce((q, name) => {
      var temp = q.find(o => o.name === name);
      if (!temp) q.push(temp = { path: slugify(kebabCase(name)), name : name, children: [] });
      return temp.children;
  }, r);
  return r;
}, []);

console.log("DEBUG")
console.log(pages)

export default pages;



// export default require.context('../pages', true, /^\.\/.*\.vue$/)
//   .keys()
//   .map(page => page.slice(2).replace('.vue', ''))
//   .filter(page => page !== 'Index' && page !== 'Error404')
//   .flatMap((page,level) => [page,level])
//   .map(page => ({
//     file: page,
//     title: page,
//     path: slugify(kebabCase(page))
//   }))
