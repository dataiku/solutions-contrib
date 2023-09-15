<template>
    <div class="bs-search-grid-col-search-box">
        <QInput
            class="bs-search-grid-col-input"
            :model-value="currentValue"
            @update:model-value="onInputBoxChanged"
            clearable
            clear-icon="close"
            borderless
            dense
            format-input
            autofocus
        >
            <template v-slot:prepend>
                <q-icon name="search" size="1rem"></q-icon>
            </template>
        </QInput>
        <div>
            <q-icon
                :name="mdiTrashCanOutline"
                @click="clearField"
                size="1rem"
                class="cursor-pointer"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mdiTrashCanOutline } from "@quasar/extras/mdi-v6";
import { QIcon, QInput } from "quasar";
export default defineComponent({
    components: { QInput, QIcon },
    props: {
        params: { required: true, type: Object },
    },
    data() {
        return {
            currentValue: null as string | null | number,
            mdiTrashCanOutline,
        };
    },
    methods: {
        onInputBoxChanged(newVal: string | number | null) {
            this.currentValue = newVal;
            if (this.currentValue === "") {
                // clear the filter
                this.params.parentFilterInstance((instance: any) => {
                    instance.onFloatingFilterChanged(null, null);
                });
                return;
            }

            this.params.parentFilterInstance((instance: any) => {
                instance.onFloatingFilterChanged("contains", this.currentValue);
            });
        },
        onParentModelChanged(parentModel: any) {
            // When the filter is empty we will receive a null value here
            if (!parentModel) {
                this.currentValue = "";
            } else {
                this.currentValue = parentModel.filter;
            }
        },
        clearField() {
            this.onInputBoxChanged("");
            this.params.column.colDef.floatingFilter = false;
            setTimeout(() => {
                // refresh header after value of floating filter has changed
                this.params.columnApi.resetColumnState();
            }, 0);
            console.log(this.params.column);
        },
    },
});
</script>
<style lang="scss">
.bs-search-grid-col-search-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
}
.bs-search-grid-col-input {
    border: 1px solid #cccccc;
    border-radius: 2px;
    padding: 0px 8px;
    height: 26px;
    width: 102px;
    .q-field--dense {
        height: 100%;
        max-height: 100%;
    }
    .q-field__label {
        top: 3px;
        font-size: 11px;
    }
    .q-field__control-container,
    .q-placeholder {
        padding-top: 4px;
    }
    .q-field__marginal,
    .q-field__native {
        font-size: 0.8rem;
    }
    .q-field__control,
    .q-field__prepend,
    .q-field__marginal {
        height: 100%;
        max-height: 100%;
    }
    .q-field__append .q-icon {
        top: 1px;
    }
}
</style>
