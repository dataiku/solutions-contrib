
export function isObject (v) {
    return v !== null && typeof v === 'object' && Array.isArray(v) !== true
}

export default function installApp(app, uiOpts) {
    uiOpts.components !== void 0 && Object.values(uiOpts.components).forEach(c => {
        if (isObject(c) === true && c.name !== void 0) {
          app.component(c.name, c)
        }
    })
}