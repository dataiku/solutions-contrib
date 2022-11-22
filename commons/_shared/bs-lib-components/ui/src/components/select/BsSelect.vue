<template>
    <div>
        <label class="bs-select__label dss-caption-400 q-mb-xs" :for="bsLabelId" v-if="bsLabel">{{ bsLabel }}</label>
        <QSelect
            ref="bsSelect"
            v-bind="$attrs"
            dropdown-icon="r_expand_more"
            class="bs-select"
            popup-content-class="bs-select__popup dds-text-400"
            @popup-show="popupShow"
            @popup-hide="popupHide"
            :popup-content-style="popupStyle"
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
        }
    },
    props: {
        bsLabel: {
            type: String,
        },
        bsLabelId: {
            type: String,
        },
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
        }
    },
    computed: {
        popupStyle() {
            return {
                width : this.width,
                maxWidth : this.width,
                wordBreak : 'break-all'
            }   
        }
    }
    
}
</script>