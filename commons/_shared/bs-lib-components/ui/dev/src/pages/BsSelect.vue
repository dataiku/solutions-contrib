<template>
    <div class="q-pa-md q-gutter-lg" style="max-width: 300px">
        <BsSelect v-model="model" :options="options" outlined bsLabel="Font Size" bsLabelId="test"></BsSelect>
        <BsSelect v-model="model" :options="options" borderless bsLabel="Font Size" bsLabelId="test_2"></BsSelect>
        <BsSelect v-model="model" :options="options" outlined bsLabel="Font Size" bsLabelId="test">
            <template v-slot:prepend>
                <q-icon name="event" color="#6F7D89"/>
            </template>
        </BsSelect>
        <BsSelect v-model="model" :options="options" borderless bsLabel="Font Size" bsLabelId="test_2">
            <template v-slot:prepend>
                <q-icon name="event" color="#6F7D89"/>
            </template>
        </BsSelect>
        <BsSelect v-model="model" :options="options" outlined clearable clear-icon="clear"></BsSelect>
        <BsSelect v-model="modelSlot" :options="optionsSlot" outlined bsLabel="Font Size" bsLabelId="test">
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
import { BsSelect } from 'ui';
import { ref } from 'vue'

export default {
    setup() {
        return {
            model: ref(null),
            modelSlot: ref(null),
            options: [
                "Extra small Extra small Extra small Extra small Extra small Extra small",
                "Small",
                "Medium",
                "Large",
                "Extra large",
                "Custom"
            ],
            optionsSlot: [
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
        };
    },
    components: { BsSelect }
}
</script>
