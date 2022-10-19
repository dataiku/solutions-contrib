<template>
    <div class="row bs-layout">
        <div class="bs-left-panel" v-if="!isHidden">
            
        </div>
        <div class="col-grow bs-right-panel">
            <div class="full-width column content-stretch">
                <div class="bs-header">
                    <!-- Header Slot -->
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
                        <!-- Content Slot -->
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import btnImg from "../assets/images/BtnImg.svg"
    export default {
        name:"BsDefaultLayout",
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
        }
    }
</script>