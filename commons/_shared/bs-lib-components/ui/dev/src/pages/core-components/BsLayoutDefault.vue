<template>
  <doc-page-core title="BsLayoutDefault">
    <template #description>
      The BsLayoutDefault is the default layout for business solutions webapps.<br><br>
      It is highly customizable, the layout provides 4 child components:<br>
      <b>{{ BsLayoutComponentListed }}</b> that can be populated with custom vue components.<br>
      Instead of these components you can use template sections:<br>
      <code-prism lang="html" :code="componentTemplateAccordancy"></code-prism><br>
      See the examples in the usage section for more details.
    </template>
    <LayoutGalleryGrid class="q-mt-sm"/>
  </doc-page-core>
</template>
<script lang="ts">
import DocExample from '../../components/DocExample.vue';
import DocPageCore from '../../components/DocPageCore.vue';
import LayoutGalleryGrid from "../../components/LayoutGalleryGrid.vue";

import CodePrism from 'src/components/CodePrism';
import BsLayoutDefault from 'app/../src/components/layout/BsLayoutDefault.vue';
import { baseComponents } from "src/precompiled/precompiledData"
import { defineComponent } from 'vue';


  export default defineComponent({
      components: {
          DocExample, 
          DocPageCore,
          LayoutGalleryGrid,
          CodePrism,
      },
      computed: {

        componentToTemplateMapping(): Record<string, any>{
          const mapping = {} as Record<string, any>;
          function addBsComponentEntry(name: string) {
            if (!name) return;
            const templateName = name.slice(2).toLowerCase(); //Bs[TemplateName]
            mapping[name] = templateName;
          }

          baseComponents.forEach(name => addBsComponentEntry(name));
          return mapping;
        },
        BsLayoutComponentListed(): string {
          const namesWithoutLast = baseComponents.slice(0, -1);
          const lastName = baseComponents[baseComponents.length - 1];

          return `${namesWithoutLast.join(', ')} and ${lastName}`;
        },
        componentTemplateAccordancy(): string {
          const CTAccordancy = Object.entries(this.componentToTemplateMapping).reduce((sum, [component, template]) => {
            return sum + `\t<${component}></${component}> == <template #${template}></template>\n`;
          }, "\n");
          return `<${BsLayoutDefault.name}>${CTAccordancy}</${BsLayoutDefault.name}>`;
        }
      },
  });
</script>