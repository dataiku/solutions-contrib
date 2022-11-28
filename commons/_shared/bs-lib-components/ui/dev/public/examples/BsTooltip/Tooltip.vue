<template>
    <div class="q-gutter-sm q-pa-sm">
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
</template>