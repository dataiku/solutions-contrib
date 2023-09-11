import { CustomFilter, RangeFilter, FilterType } from "../../backend_model";

export class CustomFilterBuilder {
    static build(agGridFilterModel: any): CustomFilter {
        if (agGridFilterModel.type === FilterType.InRange) {
            return {
                filterType: FilterType.InRange,
                value: agGridFilterModel.filter.toString(),
                toValue: agGridFilterModel.filterTo?.toString(),
                valueType: agGridFilterModel.filterType
            } as RangeFilter;
        } else {
            return {
                value: agGridFilterModel.filter?.toString() || '',
                filterType: agGridFilterModel.type
            };
        }
    }

    static createFilters(filterModel: Record<string, any>): Record<string, CustomFilter | CustomFilter[]> {
        return Object.entries(filterModel).reduce((acc, [colName, colFilter]) => {
            acc[colName] = colFilter.conditions ? this.createConditionFilters(colFilter) : this.build(colFilter);
            return acc;
        }, {} as Record<string, CustomFilter | CustomFilter[]>);
    }

    private static createConditionFilters(colFilter: any): CustomFilter[] {
        return colFilter.conditions.map((filter: any) => {
            let customFilter: CustomFilter = this.build(filter);
            customFilter.operator = colFilter.operator.toLowerCase();
            return customFilter;
        });
    }
}