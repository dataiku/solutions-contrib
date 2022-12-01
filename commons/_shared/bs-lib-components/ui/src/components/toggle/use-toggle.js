export const useSizeDefaults = {
    xs: 18,
    sm: 22,
    md: 26,
    lg: 30,
    xl: 34
}

  
export const fontSize = function (size, sizes = useSizeDefaults) {
  // return sizeStyle
  return size !== void 0
      ? size in sizes ? `${ sizes[ size ] }px` : size 
      : null
  
}

export const useToggleProps = {
    size: {
        type: String,
        default: "sm",
    },
    modelValue: {
        required: true,
        default: null
    },
    val: {},
    trueValue: { default: true },
    falseValue: { default: false },
    labelLeft: String,
    labelRight: String,
    labelClass: { type: String, default: "dku-text"},
    color : { type: String, default: 'rgba(111, 125, 137, 0.8)' },
    disable: Boolean,
    tabindex: [ String, Number ]
}

export const useToggleEmits = [ 'update:modelValue' ]


