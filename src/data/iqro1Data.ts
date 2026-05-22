export interface IqroLetterInfo {
    id: string;
    arabic: string;
    latin: string;
}

export const IQRO_LETTERS_MAP: Record<string, IqroLetterInfo> = {
    alif: { id: 'alif', arabic: 'اَ', latin: 'A' },
    ba: { id: 'ba', arabic: 'بَ', latin: 'Ba' },
    ta: { id: 'ta', arabic: 'تَ', latin: 'Ta' },
    tsa: { id: 'tsa', arabic: 'ثَ', latin: 'Tsa' },
    jim: { id: 'jim', arabic: 'جَ', latin: 'Ja' },
    ha: { id: 'ha', arabic: 'حَ', latin: 'Ha' },
    kha: { id: 'kha', arabic: 'خَ', latin: 'Kho' },
    dal: { id: 'dal', arabic: 'دَ', latin: 'Da' },
    dzal: { id: 'dzal', arabic: 'ذَ', latin: 'Dza' },
    ra: { id: 'ra', arabic: 'رَ', latin: 'Ro' },
    zai: { id: 'zai', arabic: 'زَ', latin: 'Za' },
    sin: { id: 'sin', arabic: 'سَ', latin: 'Sa' },
    syin: { id: 'syin', arabic: 'شَ', latin: 'Sya' },
    shad: { id: 'shad', arabic: 'صَ', latin: 'Sho' },
    dhad: { id: 'dhad', arabic: 'ضَ', latin: 'Dho' },
    tha: { id: 'tha', arabic: 'طَ', latin: 'Tho' },
    zha: { id: 'zha', arabic: 'ظَ', latin: 'Zho' },
    ain: { id: 'ain', arabic: 'عَ', latin: "'A" },
    ghain: { id: 'ghain', arabic: 'غَ', latin: 'Gho' },
    fa: { id: 'fa', arabic: 'فَ', latin: 'Fa' },
    qaf: { id: 'qaf', arabic: 'قَ', latin: 'Qo' },
    kaf: { id: 'kaf', arabic: 'كَ', latin: 'Ka' },
    lam: { id: 'lam', arabic: 'لَ', latin: 'La' },
    mim: { id: 'mim', arabic: 'مَ', latin: 'Ma' },
    nun: { id: 'nun', arabic: 'نَ', latin: 'Na' },
    wawu: { id: 'wawu', arabic: 'وَ', latin: 'Wa' },
    ha_besar: { id: 'ha_besar', arabic: 'هَ', latin: 'Ha' },
    lam_alif: { id: 'lam_alif', arabic: 'لَا', latin: 'La' },
    hamzah: { id: 'hamzah', arabic: 'ءَ', latin: 'A' },
    ya: { id: 'ya', arabic: 'يَ', latin: 'Ya' }
};

export interface IqroPageData {
    pageNumber: number;
    title: string;
    description: string;
    newLetters: string[]; 
    lines: string[][]; 
}

export const IQRO_PAGES: IqroPageData[] = [
    {
        pageNumber: 1,
        title: "اَ dan بَ",
        description: "Mari mengenal huruf A dan Ba",
        newLetters: ['alif', 'ba'],
        lines: [
            ['ba', 'alif', 'ba'],
            ['alif', 'ba', 'alif'],
            ['ba', 'alif', 'alif'],
            ['alif', 'alif', 'ba'],
            ['ba', 'ba', 'alif']
        ]
    },
    {
        pageNumber: 2,
        title: "تَ",
        description: "Mari mengenal huruf Ta",
        newLetters: ['ta'],
        lines: [
            ['ta', 'alif', 'ba'],
            ['alif', 'ta', 'ba'],
            ['ba', 'ta', 'alif'],
            ['alif', 'ta', 'ta'],
            ['ba', 'alif', 'ta']
        ]
    },
    {
        pageNumber: 3,
        title: "ثَ",
        description: "Mari mengenal huruf Tsa",
        newLetters: ['tsa'],
        lines: [
            ['tsa', 'alif', 'ba'],
            ['ta', 'tsa', 'ba'],
            ['ba', 'ta', 'tsa'],
            ['alif', 'ba', 'tsa']
        ]
    },
    {
        pageNumber: 4,
        title: "جَ",
        description: "Mari mengenal huruf Ja",
        newLetters: ['jim'],
        lines: [
            ['jim', 'alif', 'ba'],
            ['jim', 'ta', 'tsa'],
            ['tsa', 'jim', 'ba'],
            ['ba', 'jim', 'ta']
        ]
    },
    {
        pageNumber: 5,
        title: "حَ",
        description: "Mari mengenal huruf Ha",
        newLetters: ['ha'],
        lines: [
            ['ha', 'alif', 'jim'],
            ['ba', 'ha', 'ta'],
            ['tsa', 'jim', 'ha'],
            ['jim', 'ha', 'jim']
        ]
    },
    {
        pageNumber: 6,
        title: "خَ",
        description: "Mari mengenal huruf Kho",
        newLetters: ['kha'],
        lines: [
            ['kha', 'alif', 'ha'],
            ['jim', 'kha', 'ta'],
            ['ba', 'ha', 'kha'],
            ['kha', 'tsa', 'jim']
        ]
    },
    {
        pageNumber: 7,
        title: "دَ",
        description: "Mari mengenal huruf Da",
        newLetters: ['dal'],
        lines: [
            ['dal', 'kha', 'dal'],
            ['ha', 'dal', 'jim'],
            ['dal', 'ba', 'kha'],
            ['ta', 'dal', 'ha']
        ]
    },
    {
        pageNumber: 8,
        title: "ذَ",
        description: "Mari mengenal huruf Dza",
        newLetters: ['dzal'],
        lines: [
            ['dzal', 'dal', 'dzal'],
            ['kha', 'dzal', 'dal'],
            ['dzal', 'ha', 'jim'],
            ['tsa', 'dzal', 'dal']
        ]
    },
    {
        pageNumber: 9,
        title: "رَ",
        description: "Mari mengenal huruf Ro",
        newLetters: ['ra'],
        lines: [
            ['ra', 'dzal', 'ra'],
            ['dal', 'ra', 'dzal'],
            ['kha', 'ra', 'ha'],
            ['ra', 'jim', 'dzal']
        ]
    },
    {
        pageNumber: 10,
        title: "زَ",
        description: "Mari mengenal huruf Za",
        newLetters: ['zai'],
        lines: [
            ['zai', 'ra', 'zai'],
            ['dzal', 'zai', 'ra'],
            ['zai', 'dal', 'kha'],
            ['ha', 'zai', 'ra']
        ]
    },
    {
        pageNumber: 11,
        title: "سَ",
        description: "Mari mengenal huruf Sa",
        newLetters: ['sin'],
        lines: [
            ['sin', 'zai', 'sin'],
            ['ra', 'sin', 'zai'],
            ['dzal', 'sin', 'dal'],
            ['sin', 'kha', 'zai']
        ]
    },
    {
        pageNumber: 12,
        title: "شَ",
        description: "Mari mengenal huruf Sya",
        newLetters: ['syin'],
        lines: [
            ['syin', 'sin', 'syin'],
            ['zai', 'syin', 'sin'],
            ['ra', 'syin', 'dzal'],
            ['syin', 'dal', 'sin']
        ]
    },
    {
        pageNumber: 13,
        title: "صَ",
        description: "Mari mengenal huruf Sho",
        newLetters: ['shad'],
        lines: [
            ['shad', 'syin', 'shad'],
            ['sin', 'shad', 'syin'],
            ['zai', 'shad', 'ra'],
            ['shad', 'dzal', 'syin']
        ]
    },
    {
        pageNumber: 14,
        title: "ضَ",
        description: "Mari mengenal huruf Dho",
        newLetters: ['dhad'],
        lines: [
            ['dhad', 'shad', 'dhad'],
            ['syin', 'dhad', 'shad'],
            ['sin', 'dhad', 'zai'],
            ['dhad', 'ra', 'shad']
        ]
    },
    {
        pageNumber: 15,
        title: "طَ",
        description: "Mari mengenal huruf Tho",
        newLetters: ['tha'],
        lines: [
            ['tha', 'dhad', 'tha'],
            ['shad', 'tha', 'dhad'],
            ['syin', 'tha', 'sin'],
            ['tha', 'zai', 'dhad']
        ]
    },
    {
        pageNumber: 16,
        title: "ظَ",
        description: "Mari mengenal huruf Zho",
        newLetters: ['zha'],
        lines: [
            ['zha', 'tha', 'zha'],
            ['dhad', 'zha', 'tha'],
            ['shad', 'zha', 'syin'],
            ['zha', 'sin', 'tha']
        ]
    },
    {
        pageNumber: 17,
        title: "عَ",
        description: "Mari mengenal huruf 'A",
        newLetters: ['ain'],
        lines: [
            ['ain', 'zha', 'ain'],
            ['tha', 'ain', 'zha'],
            ['dhad', 'ain', 'shad'],
            ['ain', 'syin', 'zha']
        ]
    },
    {
        pageNumber: 18,
        title: "غَ",
        description: "Mari mengenal huruf Gho",
        newLetters: ['ghain'],
        lines: [
            ['ghain', 'ain', 'ghain'],
            ['zha', 'ghain', 'ain'],
            ['tha', 'ghain', 'dhad'],
            ['ghain', 'shad', 'ain']
        ]
    },
    {
        pageNumber: 19,
        title: "فَ",
        description: "Mari mengenal huruf Fa",
        newLetters: ['fa'],
        lines: [
            ['fa', 'ghain', 'fa'],
            ['ain', 'fa', 'ghain'],
            ['zha', 'fa', 'tha'],
            ['fa', 'dhad', 'ghain']
        ]
    },
    {
        pageNumber: 20,
        title: "قَ",
        description: "Mari mengenal huruf Qo",
        newLetters: ['qaf'],
        lines: [
            ['qaf', 'fa', 'qaf'],
            ['ghain', 'qaf', 'fa'],
            ['ain', 'qaf', 'zha'],
            ['qaf', 'tha', 'fa']
        ]
    },
    {
        pageNumber: 21,
        title: "كَ",
        description: "Mari mengenal huruf Ka",
        newLetters: ['kaf'],
        lines: [
            ['kaf', 'qaf', 'kaf'],
            ['fa', 'kaf', 'qaf'],
            ['ghain', 'kaf', 'ain'],
            ['kaf', 'zha', 'qaf']
        ]
    },
    {
        pageNumber: 22,
        title: "لَ",
        description: "Mari mengenal huruf La",
        newLetters: ['lam'],
        lines: [
            ['lam', 'kaf', 'lam'],
            ['qaf', 'lam', 'kaf'],
            ['fa', 'lam', 'ghain'],
            ['lam', 'ain', 'kaf']
        ]
    },
    {
        pageNumber: 23,
        title: "مَ",
        description: "Mari mengenal huruf Ma",
        newLetters: ['mim'],
        lines: [
            ['mim', 'lam', 'mim'],
            ['kaf', 'mim', 'lam'],
            ['qaf', 'mim', 'fa'],
            ['mim', 'ghain', 'lam']
        ]
    },
    {
        pageNumber: 24,
        title: "نَ",
        description: "Mari mengenal huruf Na",
        newLetters: ['nun'],
        lines: [
            ['nun', 'mim', 'nun'],
            ['lam', 'nun', 'mim'],
            ['kaf', 'nun', 'qaf'],
            ['nun', 'fa', 'mim']
        ]
    },
    {
        pageNumber: 25,
        title: "وَ",
        description: "Mari mengenal huruf Wa",
        newLetters: ['wawu'],
        lines: [
            ['wawu', 'nun', 'wawu'],
            ['mim', 'wawu', 'nun'],
            ['lam', 'wawu', 'kaf'],
            ['wawu', 'qaf', 'nun']
        ]
    },
    {
        pageNumber: 26,
        title: "هَ",
        description: "Mari mengenal huruf Ha",
        newLetters: ['ha_besar'],
        lines: [
            ['ha_besar', 'wawu', 'ha_besar'],
            ['nun', 'ha_besar', 'wawu'],
            ['mim', 'ha_besar', 'lam'],
            ['ha_besar', 'kaf', 'wawu']
        ]
    },
    {
        pageNumber: 27,
        title: "ءَ",
        description: "Mari mengenal huruf Hamzah (A)",
        newLetters: ['hamzah'],
        lines: [
            ['hamzah', 'ha_besar', 'hamzah'],
            ['wawu', 'hamzah', 'ha_besar'],
            ['nun', 'hamzah', 'mim'],
            ['hamzah', 'lam', 'ha_besar']
        ]
    },
    {
        pageNumber: 28,
        title: "يَ",
        description: "Mari mengenal huruf Ya",
        newLetters: ['ya'],
        lines: [
            ['ya', 'hamzah', 'ya'],
            ['ha_besar', 'ya', 'hamzah'],
            ['wawu', 'ya', 'nun'],
            ['ya', 'mim', 'hamzah'],
            ['ya', 'ya', 'ya'] // The finale!
        ]
    }
];
