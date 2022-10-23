<template>
    <section
      :class="{
        'bs-toggle--is-disabled': disabled,
      }"
      class="bs-toggle"
    >
      <label
        :id="`${id}-label-right`"
        :for="id"
        class="bs-toggle__label"
        :class="[labelClass]"
        v-if="labelRight && !labelLeft"
      >
        {{ labelRight }}
      </label>
      <input
        :id="id"
        v-model="toggleState"
        :disabled="disabled"
        :name="name"
        class="bs-toggle__input"
        type="checkbox"
        @focus="onFocusEvent"
        ref="bstoggle"
      />
      <span
        :aria-checked="toggleState"
        :aria-disabled="disabled"
        :aria-labelledby="`${id}-label`"
        :aria-readonly="disabled"
        class="bs-toggle__content"
        :class="{'bs-toggle__content--active': toggleState}"
        role="checkbox"
        @click="toggle"
       
      />
      <label
        :id="`${id}-label-left`"
        :for="id"
        class="bs-toggle__label"
        :class="[labelClass]"
        v-if="labelLeft"
      >
        {{ labelLeft }}
      </label>
    </section>
  </template>
  
  <script>
  export default {
    name: 'BsButtonToggle',
    props: {
      activeColor: { type: String, default: 'rgba(111, 125, 137, 0.8)' },
      darkTheme:   { type: Boolean, default: false },
      disabled:    { type: Boolean, default: false },
      name:        { type: String, required: true },
      toggled:     { type: Boolean, default: false },
      labelClass: { type: String, default: "dku-text"},
      labelRight: { type: String, default: ''},
      labelLeft: { type: String, default: ''},
    },
    data() {
      return { 
        toggleState: this.toggled,

    };
    },
    methods: {
      toggle() {
        if (this.disabled) return;
        this.toggleState = !this.toggleState;
        this.$emit('toggle', this.toggleState);
      },
      onFocusEvent() {
        this.$refs.bstoggle.focus()
      }
    },
    computed: {
      id() {
        return this.name.replace(/ /g, '').toLowerCase();
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
    @import "../css/color-variables.scss";
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
    }
  }
  </style>