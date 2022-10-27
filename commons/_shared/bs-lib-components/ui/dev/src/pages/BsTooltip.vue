<template>
    <q-page padding>
        <div class="q-gutter-sm">
            <q-btn class="bs-btn dku-text" unelevated>
                Tooltip Bottom
                <q-tooltip anchor="bottom middle" self="top middle" class="bs-tooltip">
                    Chart Name
                </q-tooltip>
            </q-btn>
            <q-btn class="bs-btn dku-text" unelevated>
                Tooltip Up
                <q-tooltip anchor="top middle" self="bottom middle" class="bs-tooltip">
                    Chart Name
                </q-tooltip>
            </q-btn>
            <q-btn class="bs-btn dku-text" unelevated>
                Tooltip Left
                <q-tooltip anchor="center left" self="center right" class="bs-tooltip">
                    Chart Name
                </q-tooltip>
            </q-btn>
            <q-btn class="bs-btn dku-text" unelevated>
                Tooltip Right
                <q-tooltip anchor="center right" self="center left" class="bs-tooltip">
                    Chart Name
                </q-tooltip>
            </q-btn>

        </div>
    </q-page>
</template>
<script>
</script>