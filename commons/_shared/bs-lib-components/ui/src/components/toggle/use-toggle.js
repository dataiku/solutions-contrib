import { h, toRaw } from "vue";
import { stopAndPrevent,} from "../../utils/events"


export const useSizeDefaults = {
    xs: 18,
    sm: 24,
    md: 32,
    lg: 38,
    xl: 46
}

export const useSizeProps = {
    size: String
}
  
export  const fontSize = function (props, sizes = useSizeDefaults) {
  // return sizeStyle
  return computed(() => (
    props.size !== void 0
      ? { fontSize: props.size in sizes ? `${ sizes[ props.size ] }px` : props.size }
      : null
  ))
}

export const useToggleProps = {
    size: String,
    modelValue: {
        required: true,
        default: null
    },
    val: {},
    trueValue: { default: true },
    falseValue: { default: false },
    leftLabel: String,
    rightLabel: String,
    color: String,
    disable: Boolean,
    tabindex: [ String, Number ]
}

export const useToggleEmits = [ 'update:modelValue' ]


