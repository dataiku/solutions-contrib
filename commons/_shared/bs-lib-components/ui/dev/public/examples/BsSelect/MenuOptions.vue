<template>
    <div class="q-pa-sm" :style="{ 'max-width' : '300px'}">
        <BsSelect v-model="model" :options="optionsSlot" bsLabel="Company">
            <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                        <q-icon :name="scope.opt.icon" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                        <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                    </q-item-section>
                </q-item>
            </template>
        </BsSelect>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                model: null,
                optionsSlot: [
                    {
                        label: 'Dataiku',
                        value: 'Dataiku',
                        description: 'Just awesome',
                        icon: 'analytics'  
                    },
                    {
                    label: 'Google',
                    value: 'Google',
                    description: 'Search engine',
                    icon: 'mail'
                    },
                    {
                    label: 'Facebook',
                    value: 'Facebook',
                    description: 'Social media',
                    icon: 'bluetooth'
                    },
                    {
                    label: 'Twitter',
                    value: 'Twitter',
                    description: 'Quick updates',
                    icon: 'map'
                    },
                    {
                    label: 'Apple',
                    value: 'Apple',
                    description: 'iStuff',
                    icon: 'golf_course'
                    },
                    {
                    label: 'Oracle',
                    value: 'Oracle',
                    disable: true,
                    description: 'Databases',
                    icon: 'casino'
                    }
                ]
            }
        }
    }
</script>