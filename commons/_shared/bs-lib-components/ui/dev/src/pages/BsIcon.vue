<template>
    <div class="q-pa-md">
        <div class="text-purple q-gutter-md" style="font-size: 2em">
        <BsIcon name="font_download" />
        <BsIcon name="warning" />
        <BsIcon name="format_size" />
        <BsIcon name="print" />
        <BsIcon name="today" />
        <BsIcon name="style" />
        </div>
        <div class="q-mt-md q-gutter-md">
        <BsIcon name="font_download" color="primary" size="32px" />
        <BsIcon name="warning" color="warning" size="4rem" />
        <BsIcon name="format_size" style="color: #ccc; font-size: 1.4em;" />
        <BsIcon name="print" color="teal" size="4.4em" />
        <BsIcon name="today" class="text-orange" size="2em" />
        <BsIcon name="style" size="3em" />
        </div>
    </div>
    </template>
<script>
    import { BsIcon } from 'ui';
    export default {
        components: {
            BsIcon,
        }
    }
</script>