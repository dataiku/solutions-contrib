import { CustomFilter } from "../../backend_model";
export declare class CustomFilterBuilder {
    static build(agGridFilterModel: any): CustomFilter;
    static createFilters(filterModel: Record<string, any>): Record<string, CustomFilter | CustomFilter[]>;
    private static createConditionFilters;
}
