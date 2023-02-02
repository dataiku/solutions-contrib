<template>
<BsTabPageChildWrapper>
    <QBtn unelevated outline no-caps no-wrap class="btn-solution absolute" square @click="toggleDoc()">
        <div class="row items-center q-gutter-sm no-wrap">
            <img src="../../../assets/images/solutions-icon.svg" width="15" height="16">
            <span class="btn-solution-text">Dataiku Solutions</span>
        </div>
    </QBtn>
    <QCard
        :style="docContentStyleVariables"
        :class="[
            'doc-content',
            'flex',
            'row',
            docHide && 'doc-hide',
            docHidden && 'doc-hidden'
        ]"
    >
        <div
            class="flex row items-center q-gutter-sm q-mb-lg"
        >
            <img v-if="mDocsProps.docIcon" :src="mDocsProps.docIcon" :width="mDocsProps.docImageDimensions.width" :height="mDocsProps.docImageDimensions.height">
            <span class="dku-large-title-sb">
                <slot v-if="$slots.title" name="title"></slot>
                {{$slots.title ? "" : mDocsProps.docTitle}}
            </span>
        </div>
        <div class="doc-body">
            <slot></slot>
        </div>
        <div class="doc-footer flex row items-center">
            <span class="doc-footer__icon"><img src="../../../assets/images/solutions-icon.svg" width="14" height="12.5"></span>
            <span class="doc-footer__text dku-tiny-text-sb">Dataiku Solutions</span>
        </div>
    </QCard>
</BsTabPageChildWrapper>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QCard, QBtn } from 'quasar';
import BsTabPageChildWrapper from '../BsTabPageChildWrapper.vue'
import { ImageDimensions, DocsProps } from "../bsLayoutTypes";
import { transitionHideToHiddenClasses } from "../bsLayoutHelper";
export default defineComponent({
    name: "BsDocumentation",
    components: {
        QCard,
        QBtn,
        BsTabPageChildWrapper,
    },
    data() {
        return {
            open: false,
            docHidden: true,
            docHide: true,
            defaultDocsPropValues: {
                docIcon: "help",
                docTitle: "Documentation",
                docImageDimensions: {
                    width: 36,
                    height: 40,
                }
            }
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
            type: Object as PropType<ImageDimensions>
        },
    },
    inject: [    
        // docs props
            '$tabDocsProps',
            '$layoutDocsProps',
    ],
    computed: {
        closed() {
            return !this.open;
        },
        mDocsProps(): DocsProps {
            return {
                ...this.defaultDocsPropValues,
                ...this.layoutDocsProps,
                ...this.tabDocsProps,
                ...this.docsProps,
            };
        },
        docsProps(): Partial<DocsProps> {
            return this.clearObjectFromUndefined({
                docImageDimensions: this.docImageDimensions,
                docTitle: this.docTitle,
                docIcon: this.docIcon,
            });
        },
        tabDocsProps() {
            const props = (this as any as {$tabDocsProps: Partial<DocsProps>})?.$tabDocsProps || {};
            return this.clearObjectFromUndefined(props);
        },
        layoutDocsProps() {
            const props = (this as any as {$layoutDocsProps: Partial<DocsProps>})?.$layoutDocsProps || {};
            return this.clearObjectFromUndefined(props);
        },
        docContentStyleVariables() {
            return {
                '--doc-content-hide-transition-duration': '.345s'
            };
        },
    },
    methods: {
        toggleDoc(active?: boolean) {
            if (active === undefined) active = !this.open;
            this.open = active;
            this.$emit("update:model-value", active);
        },
        clearObjectFromUndefined<T extends Object>(obj: T) {
            const entries = Object.entries(obj);
            return entries.reduce((clear: Record<string, any>, [key, value]) => {
                if (value !== undefined) {
                    clear[key] = value;
                };
                return clear;
            }, {}) as Partial<T>;

        },
    },
    watch: {
        modelValue() {
            this.open = this.modelValue;
        },
        open() {
            const disableDelay = 500;
            
            const toggleHide = () => this.docHide = this.closed;
            const toggleHidden = () => this.docHidden = this.closed;

            transitionHideToHiddenClasses(
                toggleHide,
                toggleHidden,
                this.closed,
                disableDelay
            );
        },
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
    &.doc-hide {
        transform: translateY(10px);
        opacity: 0;
    }

    &.doc-hidden {
        display: none;
    }
}

</style>