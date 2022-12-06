<template>
    <div>
        <label class="bs-select__label dss-caption-400 q-mb-xs" v-if="bsLabel">{{ bsLabel }}</label>
        <QSelect
            ref="bsSelect"
            v-bind="$attrs"
            :options="bsOptions"
            dropdown-icon="r_expand_more"
            class="bs-select"
            outlined
            dense
            :use-input="filter"
            input-debounce="0"
            popup-content-class="bs-select__popup dds-text-400"
            @popup-show="popupShow"
            @popup-hide="popupHide"
            :popup-content-style="popupStyle"
            :label="computedLabel"
            label-color="#CCCCCC"
            @filter="filterFn"
        >   
            
            <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
                <slot :name="slot" v-bind="scope || {}" />
            </template>
        </QSelect>
    </div>
</template>
<script>
    import { QSelect } from 'quasar';
    export default {
    name: "BsSelect",
    data() {
        return {
            width: 0,
            // TODO : optimize this behaviour of copying options in future releases
            allOptions: JSON.parse(JSON.stringify(this.$attrs.options)),
            bsOptions: JSON.parse(JSON.stringify(this.$attrs.options)),
        }
    },
    props: {
        bsLabel: {
            type: String,
        }, 
        placeHolder: {
            type: String,
        },
        filter: {
            type: Boolean,
            default: true,
        }
    },
    components: {
        QSelect,
    },
    methods: {
        popupShow() {
            this.width = this.$refs.bsSelect.$el.offsetWidth;
        },
        popupHide() {
            this.width = 0;
        },
        filterFn: function(val, update, abort) {
            update(() => {
                if (val === '') {
                    this.bsOptions = this.allOptions;
                } else {
                    const needle = val.toLowerCase();
                    if (this.allOptions.some((element) => {
                        return typeof element === 'object' 
                            && !Array.isArray(element)
                            && element !== null
                    })) {
                        // Case where it is an object
                        this.bsOptions = this.allOptions.filter(v => (v.label || "").toLowerCase().indexOf(needle) > -1);
                    } else {
                        // Case primitive types (string)
                        this.bsOptions = this.allOptions.filter(v => v.toLowerCase().indexOf(needle) > -1);
                    }    
                } 
            });
        }
    },
    computed: {
        popupStyle() {
            return {
                width : this.width,
                maxWidth : this.width,
                wordBreak : 'break-all'
            }   
        },
        computedLabel() {
            if (this.placeHolder && !this.$attrs.modelValue) {
                return this.placeHolder;
            }
            return undefined;
        }
    }
    
}
</script>