export type ZoneCategory = 'CATEGORY_GENERAL' | 'CATEGORY_SMOKING_STORE';

export type ZoneFeature =
    | 'OPEN'
    | 'CLOSED'
    | 'CLEAN'
    | 'GOOD_VENTILATION'
    | 'HAS_ROOF'
    | 'HAS_SEATING'
    | 'HAS_AIR_CONDITIONING'
    | 'HAS_SPACE'
    | 'EASY_TO_FIND';

export interface ReportFormData {
    name: string;
    description: string;
    category: ZoneCategory;
    features: ZoneFeature[];
}
