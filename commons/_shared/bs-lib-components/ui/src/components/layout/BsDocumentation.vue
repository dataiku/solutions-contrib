<template>
<QBtn unelevated outline no-caps no-wrap class="btn-solution absolute" square @click="toggleDoc">
    <div class="row items-center q-gutter-sm no-wrap">
        <img src="../../assets/images/solutions-icon.svg" width="15" height="16">
        <span class="btn-solution-text">Dataiku Solutions</span>
    </div>
</QBtn>
<QCard
    :style="docContentStyleVariables"
    :class="[
        'doc-content',
        'flex',
        'row',
        docHidden && 'doc-hidden',
        docDisabled && 'doc-disabled'
    ]"
>
    <div class="flex row items-center q-gutter-sm q-mb-lg">
        <img v-if="icon" :src="icon" :width="imageDimensions.width" :height="imageDimensions.height">
        <span class="dku-large-title-sb">
            <slot v-if="$slots.title$" name="title"></slot>
            {{$slots.title ? "" : title}}
        </span>
    </div>
    <div class="doc-body">
        <slot></slot>
    </div>
    <div class="doc-footer flex row items-center">
        <span class="doc-footer__icon"><img src="../../assets/images/solutions-icon.svg" width="14" height="12.5"></span>
        <span class="doc-footer__text dku-tiny-text-sb">Dataiku Solutions</span>
    </div>
</QCard>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QCard, QBtn } from 'quasar';

export default defineComponent({
    name: "BsDocumentation",
    components: {
        QCard,
        QBtn,
    },
    data() {
        return {
            open: false,
            docDisabled: true,
            docHidden: true,
        };
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        docIcon: {
            type: String,
        },
        docTitle: {
            type: String,
        },
        docImageDimensions: {
            type: Object as PropType<{
                width: number,
                height: number,
            }>
        },
    },
    inject: [
            '$docIcon',
            '$docTitle',
            '$docImageDimensions',
    ],
    computed: {
        closed() {
            return !this.open;
        },
        icon() {
            return this.docIcon || this.docIconProvided;
        },
        title() {
            return this.docTitle || this.docTitleProvided;
        },
        imageDimensions() {
            return this.docImageDimensions || this.docImageDimensionsProvided || {
                width: 36,
                height: 40,
            };
        },
        docIconProvided() {
            return (this as any as {$docIcon: string})?.$docIcon;
        },
        docTitleProvided() {
            return (this as any as {$docTitle: string})?.$docTitle;
        },
        docImageDimensionsProvided() {
            return (this as any as {
                $docImageDimensions: {
                    width: number,
                    height: number,
                }
            })?.$docImageDimensions;
        },
        docContentStyleVariables() {
            return {
                '--doc-content-hide-transition-duration': '.345s'
            };
        },
    },
    methods: {
        toggleDoc() {
            this.open = !this.open;
            this.$emit("update:model-value", this.open);
        },
    },
    watch: {
        modelValue() {
            this.open = this.modelValue;
        },
        open() {
            const disableDelay = 500;
            const cssReactionDelay = 50;
            setTimeout(() => {
                this.docDisabled = this.closed;
            }, disableDelay * +this.closed);

            setTimeout(() => {
                this.docHidden = this.closed;
            }, cssReactionDelay * +this.open);
        }
    },
    mounted() {
        this.open = this.modelValue;
    }
});
</script>

<style scoped lang="scss">
.btn-solution-text {
    color: #000000;
    font-family: 'SourceSansPro';
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 12px;
}


.btn-solution {
    color: #C8C8C8;
    top: 16px;
    right: 16px;
    z-index: 99;
    border-radius: 4px;
}

.doc-content {
    position: absolute;
    min-width: 359px;
    max-width: 359px;
    min-height: 515px;
    height: 515px;
    overflow: scroll;
    top: 60px;
    right: 15px;
    border: 1px solid #CCCCCC;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    padding: 26px 23px 0px 22px;
    z-index: 99;
    border-radius: 0px;
}

.doc-footer {
    position: -webkit-sticky;
    position: sticky;
    bottom: 0;
    right: 0;
    margin-left: auto;
    height: 25px;
    z-index: 99;

    &__icon {
        padding-left: 8px;
        padding-right: 4.5px;
        padding-top: 2px;
        border-top: 1px solid #F2F2F2;
        border-left: 1px solid #F2F2F2;
        border-radius: 4px 0px 0px 0px;
    }

    &__text {
        padding: 5px 12px 5px 9px;
        border-top: 1px solid #F2F2F2;
        border-left:1px solid #F2F2F2;
        border-right:1px solid #F2F2F2;
    }
}

@supports (backdrop-filter: none) {
    .doc-footer {
        background-color: white;
        backdrop-filter: blur(7px);
    }  
}

@supports not (backdrop-filter: none) {
    .doc-footer {
        background-color: white;
    }
}

.doc-content {
    transition: transform var(--doc-content-hide-transition-duration),
    opacity var(--doc-content-hide-transition-duration);
    &.doc-hidden {
        transform: translateY(10px);
        opacity: 0;
    }

    &.doc-disabled {
        display: none;
    }
}

</style>