<template>
    <!-- <div class="toggle-left-button" :style="{ 'left' : leftDist + 'px'}" v-if="leftpanel">
        <div @click="toggleLeftPanel">
            <img src="../../assets/images/BtnImg.svg">
        </div>
    </div>

    <QHeader bordered class="bg-white bs-header" v-if="header">
        <slot name="header"></slot>
    </QHeader>

    <QPageContainer>
        <QPage>
            <div class="content">
                <QBtn unelevated outline no-caps no-wrap class="btn-solution absolute" square @click="toggleDoc" v-if="doc">
                    <div class="row items-center q-gutter-sm no-wrap">
                        <img src="../../assets/images/solutions-icon.svg" width="15" height="16">
                        <span class="btn-solution-text">Dataiku Solutions</span>
                    </div>
                </QBtn>
                <QCard class="doc-content flex row" v-if="doc && openDoc">
                    <div class="flex row items-center q-gutter-sm q-mb-lg">
                        <img :src="docIcon" :width="docImageDimensions.width" :height="docImageDimensions.height"   v-if="docIcon">
                        <span class="dku-large-title-sb">{{ docTitle }}</span>
                    </div>
                    <div class="doc-body">
                        <slot name="documentation"></slot>
                    </div>
                    <div class="doc-footer flex row items-center">
                        <span class="doc-footer__icon"><img src="../../assets/images/solutions-icon.svg" width="14" height="12.5"></span>
                        <span class="doc-footer__text dku-tiny-text-sb">Dataiku Solutions</span>
                    </div>
                </QCard>
                <slot name="content"></slot>    
            </div>
            <div>
            </div>
        </QPage>
    </QPageContainer> -->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BsDrawer from './BsDrawer.vue';

export default defineComponent({
    name: "BsTab",
    components: {
        BsDrawer
    },
    props: {
        name: {
            type: String,
            default: "tab-name-not-set"
        },
        icon: {
            type: String,
            default: "help"
        },
    },
    data() {
        return {
            index: 0,
            isActive: false,
        };
    },
});
</script>