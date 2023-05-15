<template>
    <span v-html="highlightedText"></span>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

// import isNull from 'lodash/isNull';
import { isNull } from 'lodash';
// import isUndefined from 'lodash/isUndefined';
import { isUndefined } from 'lodash';
// import escape from 'lodash/escape';
import { escape } from 'lodash';


import { getIndicesOf } from "../../utils/utils";

export default defineComponent({
    name: "BsTextHighlight",
    components: {

    },
    data() {
        return {};
    },
    props: {
        queries: Array as PropType<(string | undefined)[]>,
        text: [String, Number, Boolean]
    },
    computed: {
        highlightedText(): string {
            let text =  (isUndefined(this.text) || isNull(this.text)) ? "" : escape(`${this.text}`);
            const queries = (this.queries || []).filter(q => !isUndefined(q)) as string[];
            if (!(text && queries.length)) return text;
            let hSections: Map<number, {from: number[], to: number[]}> = new Map([
                    [0, {from: [], to: []}],
                    [text.length, {from: [], to: []}],
                ]);
            
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
            if (!sectionPoints.length) return text;
            const strSplittedLength = sectionPoints.length - 1;
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
    $primary: #3B99FC;
    $accent: #9C27B0;

    .resolved-query-0 {
        color: $accent;
        text-decoration: underline;
    }
    .resolved-query-1 {
        color: $primary;
        text-decoration: underline;
    }
    .resolved-query-1.resolved-query-0 {
        color: mix($primary, $accent, 50%);
        text-decoration: underline;
    }
}

</style>