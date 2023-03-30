<script lang="ts">
import { defineComponent, computed, ComputedRef } from "vue";

export default defineComponent({
  name: "ProvideMixin",
  methods: {
    providePrefixed(
      keys: string[],
      options?: {
        prefix?: string;
        getter?: Function;
      }
    ) {
      const { prefix, getter } = {
        prefix: "$",
        getter: (key: string) => this[key as keyof typeof this],
        ...options,
      };
      return keys.reduce((provide, key) => {
        const prefixedKey = prefix + key;
        provide[prefixedKey] = getter(key);
        return provide;
      }, {} as Record<string, any>);
    },
    createComputedFromKey(key: string): ComputedRef<any> {
      return computed(() => this[key as keyof typeof this]);
    },
    provideComputed(
      keys: string[],
      options?: {
        prefix?: string;
      }
    ) {
      const optionsProvidePrefixed = {
        ...options,
        getter: (key: string) => this.createComputedFromKey(key),
      };
      return this.providePrefixed(keys, optionsProvidePrefixed);
    },
    provideStatic(
      keys: string[],
      options?: {
        prefix?: string;
      }
    ) {
      const optionsProvidePrefixed = {
        ...options,
        getter: (key: string) => this[key as keyof typeof this],
      };
      return this.providePrefixed(keys, optionsProvidePrefixed);
    },
  },
});
</script>
