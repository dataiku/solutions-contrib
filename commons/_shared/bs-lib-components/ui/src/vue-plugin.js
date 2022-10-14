import BsButton from './components/BsButton.vue'


const version = __UI_VERSION__

function install (app) {
  app.component(BsButton.name, BsButton)

}

export {
  version,
  BsButton,

  install
}
