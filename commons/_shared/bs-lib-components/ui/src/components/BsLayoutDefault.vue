<template>
    <div class="row bs-layout">
        <div class="bs-left-panel" v-if="!isHidden">
            <div class="full-width column wrap justify-center items-stretch" style="padding : 16px">
                <div class="dku-medium-title" style="margin-bottom: 16px">
                    {{ LeftPanelTitle }}
                </div>
                <slot name="leftpanel"></slot>
            </div>
        </div>
        <div class="col-grow bs-right-panel">
            <div class="full-width column content-stretch">
                <div class="bs-header">
                    <slot name="header"></slot>
                </div>
                <div class="row bs-content">
                    <div class="col-grow bs-toggle-left">
                        <div class="bs-toggle-left-button">
                                <div @click="toggleLeftPanel">
                                    <img :src="btnImg">
                                </div>
                        </div>
                    </div>
                    <div class="col-grow bs-content-main">
                        <slot name="content"></slot>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import btnImg from "../assets/images/BtnImg.svg"
    export default {
        name:"BSLayoutDefault",
        data() {
            return {
                isHidden : false,
                btnImg : btnImg,
            }  
        },
        methods: {
            toggleLeftPanel() {
                this.isHidden = !this.isHidden;
            }
        },
        props: {
            LeftPanelTitle: {
                type: String,
            }
        }
    }
</script>