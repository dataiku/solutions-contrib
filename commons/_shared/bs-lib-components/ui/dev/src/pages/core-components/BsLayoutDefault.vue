<template>
  <doc-page-core title="BsLayoutDefault">
    <template #description>
      The BsLayoutDefault is the default layout for business solutions webapps.<br><br>
      It is highly customizable, the layout provides 4 child components:<br>
      <b>{{ BsLayoutComponentListed }}</b> that can be populated with custom vue components.<br>
      Instead of these components you can use template sections:<br>
      <code-prism lang="html" :code="componentTemplateAccordancy"></code-prism>
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

import BsHeader from 'app/../src/components/layout/base-subcomponents/BsHeader.vue';
import BsLayoutDefault from 'app/../src/components/layout/BsLayoutDefault.vue';
import BsDocumentation from 'app/../src/components/layout/base-subcomponents/BsDocumentation.vue';
import BsDrawer from 'app/../src/components/layout/base-subcomponents/BsDrawer.vue';
import BsContent from 'app/../src/components/layout/base-subcomponents/BsContent.vue';

import { defineComponent } from 'vue';


  export default defineComponent({
      components: {
          DocExample, 
          DocPageCore,
          LayoutGalleryGrid,
          CodePrism,
      },
      computed: {
        BsLayoutComponentNames(): string[] {
          return [
            BsHeader,
            BsDocumentation,
            BsDrawer,
            BsContent,
          ].map(({ name }) => name);
        },
        componentToTemplateMapping(): Record<string, any>{
          const mapping = {} as Record<string, any>;
          function addBsComponentEntry(name: string) {
            if (!name) return;
            const templateName = name.slice(2).toLowerCase(); //Bs[TemplateName]
            mapping[name] = templateName;
          }

          this.BsLayoutComponentNames.forEach(name => addBsComponentEntry(name));
          return mapping;
        },
        BsLayoutComponentListed(): string {
          const [lastName, ...namesWithoutLast] = this.BsLayoutComponentNames;
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