<template>
    <QLayout view="lHh LpR lFf" class="bg-white">
        
        <div class="toggle-left-button" :style="{ 'left' : leftDist + 'px'}" v-if="leftpanel">
            <div @click="toggleLeftPanel">
                <img src="../../assets/images/BtnImg.svg">
            </div>
        </div>

        <QHeader bordered class="bg-white bs-header" v-if="header">
            <slot name="header"></slot>
        </QHeader>

        <QDrawer v-model="showLeftPanel" side="left" bordered behavior="desktop" v-if="leftpanel">
            <slot name="leftpanel"></slot>
        </QDrawer>

        <QPageContainer>
            
            <div class="content">
                <QBtn unelevated outline no-caps no-wrap class="btn-solution absolute" square @click="toggleDoc" v-if="doc">
                    <div class="row items-center q-gutter-sm no-wrap">
                        <img src="../../assets/images/solutions-icon.svg" width="15" height="16">
                        <span class="btn-solution-text">Dataiku Solutions</span>
                    </div>
                </QBtn>
                <QCard class="doc-content flex row" v-if="doc && openDoc">
                    <div class="flex row items-center q-gutter-sm q-mb-lg">
                        <img :src="docIcon" :width="docImageDimensions.width" :height="docImageDimensions.height" v-if="docIcon">
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
            
        </QPageContainer>
    </QLayout>
</template>
<script>
    import { QLayout, QHeader, QDrawer, QPageContainer, QBtn, QCard } from 'quasar';
    import btnImg from "../../assets/images/BtnImg.svg"
    export default {
        name:"BsLayoutDefault",
        data() {
            return {
                showLeftPanel : true,
                btnImg : btnImg,
                openDoc: false
            }  
        },
        components: {
            QLayout, 
            QHeader, 
            QDrawer, 
            QPageContainer,
            QBtn,
            QCard
        },
        methods: {
            toggleLeftPanel() {
                this.showLeftPanel = !this.showLeftPanel;
            },
            toggleDoc() {
                this.openDoc = !this.openDoc;
            },
        },
        computed: {
            leftDist() {
                return this.showLeftPanel ? 300 : 0;
            }
        },
        props: {
            header: {
                type: Boolean,
                default: true
            },
            leftpanel: {
                type: Boolean,
                default: true
            },
            docTitle: {
                type: String,
            },
            docIcon: {
                type: String,
            },
            doc: {
                type: Boolean,
                default: true
            },
            docImageDimensions: {
                type: Object,
                default: () => ({
                    width: 36,
                    height: 40,
                })
            }
        }
    }
</script>