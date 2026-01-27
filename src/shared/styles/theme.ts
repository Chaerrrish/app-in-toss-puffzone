export const palette = {
    primary: {
        10: '#0b4220',
        20: '#0e582a',
        30: '#168741',
        40: '#26bf5b',
        50: '#32d66b',
        60: '#57db84',
        70: '#83e2a4',
        80: '#adebc3',
        90: '#def8e6',
        95: '#eafbef',
    },
    gray: {
        10: '#191A19',
        20: '#313533',
        30: '#4C514E',
        40: '#6A716D',
        50: '#808883',
        60: '#969C98',
        70: '#B0B5B2',
        80: '#CACECC',
        90: '#EAEBEA',
        95: '#F4F5F5',
        98: '#FAFAFA',
    },
    red: {
        10: '#570905',
        20: '#810A03',
        30: '#AE0D04',
        40: '#D41B11',
        50: '#EE342B',
        60: '#F2645A',
        70: '#F58780',
        80: '#F9BDB8',
        90: '#FBD3D0',
        95: '#FDEEEC',
    },
    orange: {
        10: '#491B04',
        20: '#792D06',
        30: '#AA3E09',
        40: '#D54F0B',
        50: '#F3631A',
        60: '#f58b55',
        70: '#f9af8b',
        80: '#fbd1bb',
        90: '#fcdecf',
        95: '#fef2ec',
    },
    yellow: {
        10: '#412f10',
        20: '#664a1a',
        30: '#8f6824',
        40: '#daad0b',
        50: '#ffdb0e',
        60: '#ffeb33',
        70: '#fff066',
        80: '#fff599',
        90: '#fffacc',
        95: '#fffce0',
    },
    blue: {
        10: '#002342',
        20: '#004480',
        30: '#0062b8',
        40: '#0078e0',
        50: '#0e8fff',
        60: '#4dacff',
        70: '#80c3ff',
        80: '#b8deff',
        90: '#dbeeff',
        95: '#ebf5ff',
    },
    purple: {
        10: '#271339',
        20: '#391c54',
        30: '#53297a',
        40: '#6d36a1',
        50: '#8e53c6',
        60: '#a779d2',
        70: '#c5a7e2',
        80: '#dcc9ed',
        90: '#ebe0f5',
        95: '#f5f0fa',
    },
    pink: {
        10: '#410b17',
        20: '#6c1326',
        30: '#8f1933',
        40: '#b62041',
        50: '#db3257',
        60: '#e67089',
        70: '#eea0b1',
        80: '#f6cbd4',
        90: '#fae1e6',
        95: '#fdf2f4',
    },
};

const fontBase = {
    fontFamily: 'Pretendard',
};

export const text = {
    // 4XL
    '4xl': {
        b: { ...fontBase, fontWeight: '700' as const, fontSize: 28, lineHeight: 36 },
        sb: { ...fontBase, fontWeight: '600' as const, fontSize: 28, lineHeight: 36 },
        m: { ...fontBase, fontWeight: '500' as const, fontSize: 28, lineHeight: 36 },
        r: { ...fontBase, fontWeight: '400' as const, fontSize: 28, lineHeight: 36 },
    },
    // 3XL
    '3xl': {
        b: { ...fontBase, fontWeight: '700' as const, fontSize: 24, lineHeight: 32 },
        sb: { ...fontBase, fontWeight: '600' as const, fontSize: 24, lineHeight: 32 },
        m: { ...fontBase, fontWeight: '500' as const, fontSize: 24, lineHeight: 32 },
        r: { ...fontBase, fontWeight: '300' as const, fontSize: 24, lineHeight: 32 },
    },
    // 2XL
    '2xl': {
        b: { ...fontBase, fontWeight: '700' as const, fontSize: 22, lineHeight: 30 },
        sb: { ...fontBase, fontWeight: '600' as const, fontSize: 22, lineHeight: 30 },
        m: { ...fontBase, fontWeight: '500' as const, fontSize: 22, lineHeight: 30 },
        r: { ...fontBase, fontWeight: '400' as const, fontSize: 22, lineHeight: 30 },
    },
    // XL
    'xl': {
        b: { ...fontBase, fontWeight: '700' as const, fontSize: 20, lineHeight: 28 },
        sb: { ...fontBase, fontWeight: '600' as const, fontSize: 20, lineHeight: 28 },
        m: { ...fontBase, fontWeight: '500' as const, fontSize: 20, lineHeight: 28 },
        r: { ...fontBase, fontWeight: '500' as const, fontSize: 20, lineHeight: 28 }, // Note: provided r is 500
    },
    // L
    'l': {
        b: { ...fontBase, fontWeight: '700' as const, fontSize: 18, lineHeight: 26 },
        sb: { ...fontBase, fontWeight: '600' as const, fontSize: 18, lineHeight: 26 },
        m: { ...fontBase, fontWeight: '500' as const, fontSize: 18, lineHeight: 26 },
        r: { ...fontBase, fontWeight: '400' as const, fontSize: 18, lineHeight: 26 },
    },
    // B
    'b': {
        b: { ...fontBase, fontWeight: '700' as const, fontSize: 16, lineHeight: 24 },
        sb: { ...fontBase, fontWeight: '600' as const, fontSize: 16, lineHeight: 24 },
        m: { ...fontBase, fontWeight: '500' as const, fontSize: 16, lineHeight: 24 },
        r: { ...fontBase, fontWeight: '400' as const, fontSize: 16, lineHeight: 24 },
    },
    // M
    'm': {
        b: { ...fontBase, fontWeight: '700' as const, fontSize: 14, lineHeight: 20 },
        sb: { ...fontBase, fontWeight: '600' as const, fontSize: 14, lineHeight: 20 },
        m: { ...fontBase, fontWeight: '500' as const, fontSize: 14, lineHeight: 20 },
        r: { ...fontBase, fontWeight: '400' as const, fontSize: 14, lineHeight: 20 },
    },
    // S
    's': {
        b: { ...fontBase, fontWeight: '700' as const, fontSize: 12, lineHeight: 18 },
        sb: { ...fontBase, fontWeight: '600' as const, fontSize: 12, lineHeight: 18 },
        m: { ...fontBase, fontWeight: '500' as const, fontSize: 12, lineHeight: 18 },
        r: { ...fontBase, fontWeight: '400' as const, fontSize: 12, lineHeight: 18 },
    },
    // XS
    'xs': {
        sb: { ...fontBase, fontWeight: '600' as const, fontSize: 10, lineHeight: 16 },
        xb: { ...fontBase, fontWeight: '800' as const, fontSize: 10, lineHeight: 16 },
    },
    // 2XS
    '2xs': {
        xb: { ...fontBase, fontWeight: '800' as const, fontSize: 8, lineHeight: 14 },
    },

    // Legacy support mapping
    size: {
        s: 12,
        m: 14,
        l: 18, // Updated to match 'l' spec
        xl: 20,
        xxl: 24, // Matches 3xl roughly
    },
};

export const theme = {
    colors: {
        ...palette,
        // Semantic Aliases for backward compatibility
        white: '#ffffff',
        black: '#000000',
        text: {
            primary: palette.gray[10], // #191A19
            secondary: palette.gray[30], // #4C514E
            tertiary: palette.gray[50], // #808883
            white: '#ffffff',
        },
        background: {
            primary: '#ffffff',
            secondary: palette.gray[95], // #F4F5F5
            tertiary: palette.gray[90], // #EAEBEA
            overlay: 'rgba(0, 0, 0, 0.6)',
        },
        brand: {
            primary: palette.blue[40],
            green: palette.primary[40],
        }
    },
    text,
};
