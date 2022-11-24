import {
    QExpansionItem,
    QList,
    QItem,
    QItemSection,
    QIcon,
    QBadge,
    Ripple
  } from 'quasar'
  
  import { mdiArrowDownThinCircleOutline } from '@quasar/extras/mdi-v6'
  import { h, ref, watch, onBeforeUpdate, withDirectives } from 'vue'
  import { useRoute } from 'vue-router'
  
  import pages from '../router/pages'
  import './AppMenu.sass'
  
  function getParentProxy (proxy) {
    if (Object(proxy.$parent) === proxy.$parent) {
      return proxy.$parent
    }
  
    let { parent } = proxy.$
  
    while (Object(parent) === parent) {
      if (Object(parent.proxy) === parent.proxy) {
        return parent.proxy
      }
  
      parent = parent.parent
    }
  }
  
  export default {
    name: 'AppMenu',
  
    setup () {
      const $route = useRoute()
      const routePath = $route.path
  
      const rootRef = ref(null)
  
      watch(() => $route.path, val => {
        showMenu(childRefs[ val ])
      })
  
      let childRefs = []
  
      onBeforeUpdate(() => {
        childRefs = []
      })
  
      function showMenu (proxy) {
        if (proxy !== void 0 && proxy !== rootRef.value) {
          proxy.show !== void 0 && proxy.show()
          const parent = getParentProxy(proxy)
          if (parent !== void 0) {
            showMenu(parent)
          }
        }
      }
  
      function getDrawerMenu (menu, path, level) {
        if (menu.children && menu.children.length > 0) {
          return h(
            QExpansionItem,
            {
              class: 'non-selectable',
              ref: vm => { if (vm) { childRefs[ path ] = vm } },
              key: `${menu.name}-${path}`,
              label: menu.name,
              dense: true,
              icon: menu.icon,
              expandIcon: mdiArrowDownThinCircleOutline,
              defaultOpened: menu.opened || routePath.startsWith(path),
              expandSeparator: true,
              switchToggleSide: level > 0,
              denseToggle: level > 0
            },
            () => menu.children.map(item => getDrawerMenu(
              item,
              path + (item.path !== void 0 ? '/' + item.path : ''),
              level + 1
            ))
          )
        }
  
        const props = {
          ref: vm => { if (vm) { childRefs[ path ] = vm } },
          key: path,
          class: 'app-menu-entry non-selectable',
          to: path,
          dense: level > 0,
          insetLevel: level > 1 ? 1.2 : level
        }
  
        menu.external === true && Object.assign(props, {
          to: void 0,
          clickable: true,
          tag: 'a',
          href: menu.path,
          target: '_blank'
        })
  
        const child = []
  
        menu.icon !== void 0 && child.push(
          h(QItemSection, {
            avatar: true
          }, () => h(QIcon, { name: menu.icon }))
        )
  
        child.push(
          h(QItemSection, () => menu.name)
        )
  
        menu.badge !== void 0 && child.push(
          h(QItemSection, {
            side: true
          }, () => h(QBadge, { label: menu.badge, color: 'brand-primary' }))
        )
  
        return withDirectives(
          h(QItem, props, () => child),
          [[Ripple]]
        )
      }
  
      return () => h(QList, { ref: rootRef, class: 'app-menu', dense: true }, () => pages.map(
        item => getDrawerMenu(item, '/' + item.path, 0)
      ))
    }
  }
  