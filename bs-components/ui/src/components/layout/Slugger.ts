export class Slugger {
    private seen: Record<string, number> = {};

    constructor() {
        this.seen = {};
    }
    private serialize(value: string) {
        return value
            .toLowerCase()
            .trim()
            // remove html tags
            .replace(/<[!\/a-z].*?>/ig, '')
            // remove unwanted chars
            .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
            .replace(/\s/g, '-');
    }

    /**
     * Finds the next safe (unique) slug to use
     * @param {string} originalSlug
     * @param {boolean} isDryRun
     */
    public getNextSafeSlug(originalSlug: string, isDryRun: boolean) {
        let slug = originalSlug;
        let occurenceAccumulator = 0;
        if (this.seen.hasOwnProperty(slug)) {
            occurenceAccumulator = this.seen[originalSlug];
            do {
                occurenceAccumulator++;
                slug = originalSlug + '-' + occurenceAccumulator;
            } while (this.seen.hasOwnProperty(slug));
        }
        if (!isDryRun) {
            this.seen[originalSlug] = occurenceAccumulator;
            this.seen[slug] = 0;
        }
        return slug;
    }

    /**
     * Convert string to unique id
     * @param {object} [options]
     * @param {boolean} [options.dryrun] Generates the next unique slug without
     * updating the internal accumulator.
    */
    public slug(value: string, options: {dryrun?: boolean} = {}) {
        const setOptions = {dryrun: !!options.dryrun};
        const slug = this.serialize(value);
        return this.getNextSafeSlug(slug, setOptions.dryrun);
    }
}

export class SluggerSingleton {
    private static instances: Record<string, Slugger>  = {};
    private instance: Slugger;

    constructor(instanceKey = "default") {
        if (typeof instanceKey !== "string") {
            console.error("instanceKey param should be of type string! Using default instance.");
            instanceKey = "default";
        }
        if (!SluggerSingleton.instances.hasOwnProperty(instanceKey)) {
            SluggerSingleton.instances[instanceKey] = new Slugger();
        }
        this.instance = SluggerSingleton.instances[instanceKey];
    }

    public slug(value: string, options: {dryrun?: boolean} = {}) {
        return this.instance.slug(value, options);
    }
}