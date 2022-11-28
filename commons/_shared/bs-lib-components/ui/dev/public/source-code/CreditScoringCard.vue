<template>
    <div>
        <q-card class="score-card" :style="cardStyle">
            <q-card-section>
                <div class="column items-center q-gutter-xs">
                    <div class="dku-small-title-sb">{{ title }}</div>
                    <div class="dku-text">{{ subtitle }}</div>
                    <div class="dku-extralarge-title-sb">{{ score }}</div>
                </div>
            </q-card-section>
            <q-separator inset/>
            <q-card-section>
                <div class="column">
                    <div v-for="row in options" class="row justify-between score-text" :class="[row.highlight ? 'active' : '']" :style="activeStyle">
                        <div>{{ row.label}}</div> 
                        <div>{{ row.value}}</div>
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </div>
    
</template>

<script>
    export default {
        
        name: "scoreCard",
        data() {
            return {
                scoreColors: {
                    "bad" : {
                        border : "#E9412B",
                        highlight: "rgba(233, 65, 43, 0.1)"
                    },
                    "neutral": {
                        border : "#E99D2B",
                        highlight: "rgba(233, 157, 43, 0.1)"
                    },
                    "good": {
                        border : "#61B658",
                        highlight: "rgba(97, 182, 88, 0.1)"
                    }
                },
            }
        },
        props: {
            rating: {
                type: String,
            },
            linearPercent: {
                type: String,
            },
            title: {
                type: String,
            },
            subtitle: {
                type: String,
            },
            score: {
                type: String
            },
            options: {
                type: Array
            }
        },
        computed: {
            cardStyle() {
                return {
                    '--border-color': this.scoreColors[this.rating].border,
                    '--linear-percent': this.linearPercent,
                }
            },
            activeStyle() {
                return {
                    '--highlight-color': this.scoreColors[this.rating].highlight
                } 
            }
        }
    }

</script>

<style scoped>
.score-card {
    height: 233px;
    width: 210px;
    border-top: 4px solid var(--border-color);
    position: relative;
    border-radius: 2px 2px 0px 0px;

}

.score-card:after {
    position: absolute;
    left: var(--linear-percent);
    right: 0;
    top: -4px;
    border-top: 4px solid #CCCCCC;
    content: '';
}

.score-text {
    color: #666666;
    font-family: 'SourceSansPro';
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    line-height: 16px;
}

.active {
    background-color: var(--highlight-color);
}


</style>