<template>
    <q-page padding>
        <div class="q-gutter-sm">
            <BsButton class="bs-btn dku-text" unelevated>
                Tooltip Bottom
                <BsTooltip anchor="bottom middle" self="top middle" class="bs-tooltip">
                    Chart Name
                </BsTooltip>
            </BsButton>
            <BsButton class="bs-btn dku-text" unelevated>
                Tooltip Up
                <BsTooltip anchor="top middle" self="bottom middle" class="bs-tooltip">
                    Chart Name
                </BsTooltip>
            </BsButton>
            <BsButton class="bs-btn dku-text" unelevated>
                Tooltip Left
                <BsTooltip anchor="center left" self="center right" class="bs-tooltip">
                    Chart Name
                </BsTooltip>
            </BsButton>
            <BsButton class="bs-btn dku-text" unelevated>
                Tooltip Right
                <BsTooltip anchor="center right" self="center left" class="bs-tooltip">
                    Chart Name
                </BsTooltip>
            </BsButton>

        </div>
    </q-page>
</template>
<script>
    import { BsTooltip } from 'ui';
    import { BsButton } from 'ui';

    export default {
        components: {
            BsTooltip,
            BsButton,
        }
    }
</script>