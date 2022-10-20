<template>
    
</template>
<script>
    export default {
        name: "BsButton",
        props: {
            variant: {
                type: String,
                validator: (value) => {
                    return [
                        "primary",
                        "secondary",
                        "link"
                    ].indexOf(value) >= 0
                }
            },
            label: {
                type: String
            }
        }
    }
</script>