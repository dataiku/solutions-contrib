<template>
    <section
    @click="onClick"
    @keydown="onKeydown"
    @keyup="onKeyup"
    class="bs-toggle"
    >
        <input 
        type="checkbox"
        :checked="isTrue === true"
        :value="modelIsArray === true ? val : trueValue"
        class="bs-toggle__input"
        />
        <div
            :aria-checked="isTrue === true"
            :aria-disabled="disable"
            :aria-readonly="disable"
            class="bs-toggle__content"
            :class="{'bs-toggle__content--active': isTrue === true}"
            role="checkbox"
            @mouseover="mouseover"
            @mouseleave="mouseleave"
            :tabindex="tabIndex"
        ></div>
       
    </section>
</template>
<script>
    import {useToggleProps, useToggleEmits} from "./use-toggle";
    import {stopAndPrevent} from "../../utils/events";
    export default {
        name: "BsButtonToggleTest",
        data() {
            return {

            }
        },
        props: {
            ...useToggleProps
        },
        emits: useToggleEmits,
        computed: {
            modelIsArray() {
                return this.val !== void 0 && Array.isArray(this.modelValue)
            },
            index() {
                const val = this.val;
                return this.modelIsArray === true
                    ? this.modelValue.findIndex(opt => opt === val)
                    : -1
            },
            isTrue() {
                return this.modelIsArray === true 
                ? this.index > -1
                : this.modelValue === this.trueValue
            },
            isFalse() {
                return this.modelIsArray === true 
                ? this.index === -1
                : this.modelValue === this.falseValue
            },
            tabIndex() {
                return this.disable === true ? -1 : this.tabindex || 0;
            }
        },
        methods: {
            getNextValue() {
                
                if (this.modelIsArray === true) {
                    if (this.isTrue === true) {
                        const val = this.modelValue.slice()
                        val.splice(this.index, 1)
                        return val
                    }

                return this.modelValue.concat([ this.val ])
                }
                
                if (this.isTrue === true) {
                    return this.falseValue;
                }
                if (this.isFalse === true) {
                    return this.trueValue;
                }
                
            },
            onClick(e) {
                if (e !== void 0) {
                    stopAndPrevent(e)
                }
                if (this.disable !== true) {
                    console.log('next value')
                    console.log(this.isTrue)
                    console.log(this.getNextValue())
                    this.$emit('update:modelValue', this.getNextValue(),e)
                }
            },
            onKeydown(e) {
                if (e.keyCode === 13 || e.keyCode === 32) {
                    stopAndPrevent(e)
                }
            },
            onKeyup (e) {
                if (e.keyCode === 13 || e.keyCode === 32) {
                    this.onClick(e)
                }
            },
            mouseover() {
                console.log("IN");
            },
            mouseleave() {
                console.log("OUT")
            }
        }

    }
</script>
<style lang="scss" scoped>
@import "../../css/color-variables.scss";
.bs-toggle {
  $self: &;
  $toggle-spacing: 2px;
  align-items: center;
  display: flex;
  margin: 0 -5px;
  > * {
    cursor: pointer;
    margin: 0 5px;
  }
  &__label {
    user-select: none;
    #{$self}--is-disabled & {
      cursor: not-allowed;
    }
  }
  &__input {
    display: none;
    &:checked {
      & + #{$self}__content {
        &:after {
          left: calc(50% + #{$toggle-spacing});
        }
      }
    }
    &:focus {
      background: black;
    }
  }
  &__content {
    background: $grey-lighten-6;
    border-radius: 50px;
    box-sizing: border-box;
    height: 20px;
    outline: 0;
    overflow: hidden;
    padding: $toggle-spacing;
    transition: background-color .4s ease;
    width: 40px;
    will-change: background-color;
    &--active {
      background-color: v-bind(activeColor);
    }
    &:after {
      background: white;
      border-radius: 50%;
      box-shadow: 0 0 5px 0 rgba(0, 0, 0, .05);
      content: '';
      display: block;
      height: 100%;
      left: 0;
      position: relative;
      transition: left .2s ease;
      width: calc(50% - #{$toggle-spacing});
      will-change: left;

    }
    #{$self}--is-disabled & {
      cursor: not-allowed;
      opacity: 50%;
    }
    &:focus {
        border: 1px solid black;
    }
  }
}

</style>