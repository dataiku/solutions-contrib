export declare class Slugger {
    private seen;
    constructor();
    private serialize;
    /**
     * Finds the next safe (unique) slug to use
     * @param {string} originalSlug
     * @param {boolean} isDryRun
     */
    getNextSafeSlug(originalSlug: string, isDryRun: boolean): string;
    /**
     * Convert string to unique id
     * @param {object} [options]
     * @param {boolean} [options.dryrun] Generates the next unique slug without
     * updating the internal accumulator.
    */
    slug(value: string, options?: {
        dryrun?: boolean;
    }): string;
}
export declare class SluggerSingleton {
    private static instances;
    private instance;
    constructor(instanceKey?: string);
    slug(value: string, options?: {
        dryrun?: boolean;
    }): string;
}
