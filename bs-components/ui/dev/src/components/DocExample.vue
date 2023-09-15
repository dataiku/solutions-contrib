<template>
    <q-card class="doc-example q-my-lg" :class="classes" :style="style" flat bordered>
        <q-toolbar class="doc-example__toolbar">
            <card-title :title="title" :slugifiedTitle="slugifiedTitle"></card-title>
            <q-space></q-space>
            <div class="col-auto">
                <q-btn dense flat round :icon="fabGithub" @click="openGitHub">
                    <q-tooltip>View on GitHub</q-tooltip>
                </q-btn>
                <q-btn class="q-ml-sm" dense flat round icon="code" @click="expanded = !expanded" :disable="loadingSource">
                    <q-tooltip>View Source</q-tooltip>
                </q-btn>
            </div>
        </q-toolbar>
        <q-separator class="doc-example__separator"></q-separator>
        <q-slide-transition>
            <div v-show="expanded">
                <q-tabs class="doc-example__tabs" v-model="currentTab" align="left" no-caps :active-color="dark ? 'amber' : void 0" :indicator-color="dark ? 'amber' : 'primary'" dense :breakpoint="0">
                    <q-tab v-for="tab in def.tabs" :key="`tab-${tab}`" :name="tab" :label="tab"></q-tab>
                </q-tabs>
                <q-separator></q-separator>
                <q-tab-panels class="text-grey-3 bg-grey-2 text-weight-regular" v-model="currentTab" animated>
                    <q-tab-panel class="q-pa-none" v-for="tab in def.tabs" :key="`pane-${tab}`" :name="tab">
                        <doc-code lang="markup" :code="def.parts[tab]" max-height="70vh"></doc-code>
                    </q-tab-panel>
                </q-tab-panels>
                <q-separator class="doc-example__separator"></q-separator>
            </div>
        </q-slide-transition>
        <div class="row">
            <q-linear-progress v-if="loadingComponent || loadingSource" color="brand-primary" indeterminate></q-linear-progress>
            <component :is="component" class="col doc-example__content" v-if="!loadingComponent" :class="componentClass"></component>
        </div>
    </q-card>
</template>

<script lang="ts">
import { markRaw, onMounted, defineComponent, ComponentOptions, PropType } from 'vue';
import { openURL } from 'quasar';
import { ref, reactive, computed } from 'vue';

import {
    fabGithub
} from '@quasar/extras/fontawesome-v6';

import { slugify } from 'assets/page-utils';

import DocCode from './DocCode.vue';
import CardTitle from './CardTitle.vue';

interface ComponentParts {
    Template: string,
    Script: string,
    Style: string,
    All?: string
}

type ComponentPartsKey = keyof ComponentParts;

export default defineComponent({
    name: 'DocExample',
    
    components: {
        DocCode,
        CardTitle
    },
    
    props: {
        title: String,
        file: String,
        dark: Boolean,
        scrollable: Boolean,
        overflow: Boolean,
        class: [String, Array] as PropType<string | string[]>,
        style: [String, Object],
    },
    
    setup (props) {
        
        
        const loadingSource = ref(true)
        const loadingComponent = ref(true)
        
        const component = ref(null as unknown as ComponentOptions)
        const def = reactive({
            tabs: [] as ComponentPartsKey[],
            parts: {} as ComponentParts
        })
        const currentTab = ref('Template')
        const expanded = ref(false)
        
        const classes = computed(() => {
            let htmlClass = props.class || [];
            if (typeof htmlClass === "string") {
                htmlClass = htmlClass.split(" ");
            }
            return [
            props.dark && 'doc-example--dark',
            ...htmlClass
            ];
        });
        
        const componentClass = computed(() => {
            return props.scrollable === true
            ? 'doc-example__content--scrollable scroll-y'
            : (props.overflow === true ? 'overflow-auto' : '')
        })
        
        const slugifiedTitle = computed(() => {
            return 'example--' + slugify(props.title)
        })
        
        function parseTemplate (target: string, template: string) {
            const
            string = `(<${target}(.*)?>[\\w\\W]*<\\/${target}>)`,
            regex = new RegExp(string, 'g'),
            parsed = regex.exec(template) || []
            
            return parsed[ 1 ] || ''
        }
        
        function parseComponent (comp: string) {
            def.parts = {
                Template: parseTemplate('template', comp),
                Script: parseTemplate('script', comp),
                Style: parseTemplate('style', comp)
            }
            
            const tabs = (Object.keys(def.parts) as ComponentPartsKey[]).filter(type => def.parts[ type ])
            
            if (tabs.length > 1) {
                def.parts.All = comp;
                tabs.push('All');
            }
            
            def.tabs = tabs;
        }
        
        onMounted(() => {
            import(`/public/examples/${props.file}.vue`).then((module) => {
                component.value = markRaw(module.default);
                loadingComponent.value = false;
            });
            
            fetch(`/examples/${props.file}.vue`)
            .then(response => response.text())
            .then(content => {
                parseComponent(content);
                loadingSource.value = false;
            })
        })
        
        return {
            fabGithub,
            
            
            loadingSource,
            loadingComponent,
            component,
            currentTab,
            expanded,
            def,
            
            classes,
            componentClass,
            slugifiedTitle,
            
            openGitHub () {
                const githubSolutionsBaseURL = `https://github.com/dataiku/solutions-contrib/blob/main/commons/_shared//bs-lib-components/ui/dev/public/examples`;
                openURL(`${githubSolutionsBaseURL}/${props.file}.vue`);
            },
            
        }
    }
});
</script>

<style lang="sass">
.doc-example
    &__toolbar
        color: $grey-8
        > .q-btn
            color: $grey-7

    &__tabs
        background: $grey-3
        color: $grey-7

    &--dark
        .doc-example__toolbar
            background: $grey-10
            color: #fff
        > .q-btn
            color: $grey-3
        .doc-example__separator
            background-color: $grey-8
        .doc-example__tabs
            background: $grey-9
            color: $grey-5

    &__content
        position: relative

    &--scrollable
        height: 500px
</style>
