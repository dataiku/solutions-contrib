<template>
    <span v-html="highlightedText"></span>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { escape } from 'lodash';
import { getIndicesOf } from "../../utils/utils";

export default defineComponent({
    name: "default",
    components: {

    },
    data() {
        return {};
    },
    props: {
        queries: Array as PropType<string[]>,
        text: String
    },
    computed: {
        highlightedText(): string {
            const text = escape(this.text || "");
            const queries = this.queries || [];
            let hSections: Map<number, {from: number[], to: number[]}> = new Map();
            
            queries.forEach((query, qIndex) =>
                getIndicesOf(query, text).forEach((foundIndex) => {
                    const from = foundIndex;
                    const to = foundIndex + query.length;

                    if (!hSections.has(from)) hSections.set(from, {from: [], to: []});
                    if (!hSections.has(to)) hSections.set(to, {from: [], to: []});

                    const fromSection = hSections.get(from)!;
                    const toSection = hSections.get(to)!;

                    fromSection.from.push(qIndex);
                    toSection.to.push(qIndex);
                })
            );
            const sectionPoints = Array.from(hSections.keys()).sort((a, b) => a - b);
            const strSplittedLength = sectionPoints.length - 1;
            console.log(sectionPoints);
            console.log(Object.fromEntries(hSections.entries()));
            const unresolvedQueries: number[] = [];
            const strSplitted: string[] = new Array(strSplittedLength)
                .fill("")
                .map((_, index) => text.substring(sectionPoints[index], sectionPoints[index + 1]));
            
            let i = 0;
            while (i < strSplittedLength) {
                const {from: fromQueries, to: toQueries} = hSections.get(sectionPoints[i])!;
                fromQueries.forEach(q => {
                    if (!unresolvedQueries.includes(q)) unresolvedQueries.push(q);
                    const toIndex = toQueries.indexOf(q);
                    if (toIndex !== -1) unresolvedQueries.splice(toIndex, 1);
                });
                toQueries.forEach(q => {
                    const toIndex = unresolvedQueries.indexOf(q);
                    if (toIndex !== -1) unresolvedQueries.splice(toIndex, 1);
                })
                const classes = this.createClassesFromQueries(unresolvedQueries);
                strSplitted[i] = `<span class="text-underline ${classes}">${strSplitted[i]}</span>`;

                i++;
            }
            const formattedString = strSplitted.join("");

            return formattedString;
        },
    },
    methods: {
        createClassesFromQueries(queries: number[]) {
            return queries.map(q => `resolved-query-${q}`).join(" ");
        }
    }
});
</script>

<style lang="scss">

span {
    .resolved-query-0 {
        color: red;
    }
    .resolved-query-1 {
        color: blue;
    }
    .resolved-query-1.resolved-query-0 {
        color: green;
    }
}

</style>