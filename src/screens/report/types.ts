export type ZoneCategory = 'CATEGORY_GENERAL' | 'CATEGORY_SMOKING_STORE';

export interface ReportFormData {
    name: string;
    description: string;
    category: ZoneCategory;
}
