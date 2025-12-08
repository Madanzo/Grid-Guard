import { CaseProduct, iPhoneModel, ScreenProtector } from '@/types/store';

// Firebase Storage base URL
const STORAGE_BASE = 'https://firebasestorage.googleapis.com/v0/b/nimble-climber-454903-d3.firebasestorage.app/o/cases%2F';
const STORAGE_SUFFIX = '?alt=media';

// Helper to build Firebase Storage URL
const getImageUrl = (filename: string) => `${STORAGE_BASE}${encodeURIComponent(filename)}${STORAGE_SUFFIX}`;

// Color variant type
export interface ColorVariant {
    id: string;
    name: string;
    colorHex: string;
    image: string;
}

// Extended case product with color variants
export interface CaseProductWithVariants extends Omit<CaseProduct, 'image'> {
    variants: ColorVariant[];
    defaultVariant: string;
}

// 8 Case Designs with Color Variants (+ 1 Test Case)
export const caseProducts: CaseProductWithVariants[] = [
    // TEST PRODUCT - Remove after testing!
    {
        id: 'test-case',
        name: '🧪 TEST CASE ($1)',
        description: 'Test product for checkout testing - DELETE AFTER TESTING',
        price: 1.00,
        variants: [
            { id: 'test-black', name: 'Black', colorHex: '#1a1a1a', image: getImageUrl('Apertura_Black.png') },
        ],
        defaultVariant: 'test-black',
        temuUrl: '',
    },
    {
        id: 'apertura',
        name: 'Apertura',
        description: 'Sleek minimalist design with premium matte finish and camera cutout detail',
        price: 40.40,
        variants: [
            { id: 'apertura-black', name: 'Black', colorHex: '#1a1a1a', image: getImageUrl('Apertura_Black.png') },
            { id: 'apertura-blue', name: 'Blue', colorHex: '#2563eb', image: getImageUrl('Apertura_Blue.png') },
            { id: 'apertura-grey', name: 'Light Grey', colorHex: '#9ca3af', image: getImageUrl('Apertura_Light_Grey.png') },
            { id: 'apertura-orange', name: 'Orange', colorHex: '#f97316', image: getImageUrl('Apertura_Orange.png') },
            { id: 'apertura-purple', name: 'Purple', colorHex: '#9333ea', image: getImageUrl('Apertura_Purple.png') },
        ],
        defaultVariant: 'apertura-black',
        temuUrl: 'https://www.temu.com/apertura-case',
    },
    {
        id: 'atlas',
        name: 'Atlas',
        description: 'Rugged protection meets elegant style with textured grip sides',
        price: 40.04,
        variants: [
            { id: 'atlas-black', name: 'Black', colorHex: '#1a1a1a', image: getImageUrl('Atlas_Black.png') },
            { id: 'atlas-brown', name: 'Light Brown', colorHex: '#a3836d', image: getImageUrl('Atlas_Light_Brown.png') },
            { id: 'atlas-orange', name: 'Orange', colorHex: '#f97316', image: getImageUrl('Atlas_Orange.png') },
            { id: 'atlas-pink', name: 'Pink', colorHex: '#ec4899', image: getImageUrl('Atlas_Pink.png') },
            { id: 'atlas-red', name: 'Red', colorHex: '#dc2626', image: getImageUrl('Atlas_Red.png') },
            { id: 'atlas-silver', name: 'Silver', colorHex: '#c0c0c0', image: getImageUrl('Atlas_Silver.png') },
            { id: 'atlas-white', name: 'White', colorHex: '#f5f5f5', image: getImageUrl('Atlas_White.png') },
        ],
        defaultVariant: 'atlas-black',
        temuUrl: 'https://www.temu.com/atlas-case',
    },
    {
        id: 'aurora-luxe',
        name: 'Aurora Luxe',
        description: 'Premium luxury case with iridescent finish and soft-touch coating',
        price: 40.31,
        variants: [
            { id: 'aurora-orange', name: 'Orange', colorHex: '#f97316', image: getImageUrl('Aurora Luxe_orange.png') },
        ],
        defaultVariant: 'aurora-orange',
        temuUrl: 'https://www.temu.com/aurora-luxe-case',
    },
    {
        id: 'lumina',
        name: 'Lumina',
        description: 'Crystal clear protection with vibrant color accents and anti-yellowing tech',
        price: 40.13,
        variants: [
            { id: 'lumina-black', name: 'Black', colorHex: '#1a1a1a', image: getImageUrl('Lumina_Black.png') },
            { id: 'lumina-blue', name: 'Blue', colorHex: '#2563eb', image: getImageUrl('Lumina_Blue.png') },
            { id: 'lumina-green', name: 'Green', colorHex: '#22c55e', image: getImageUrl('Lumina_Green.png') },
            { id: 'lumina-orange', name: 'Orange', colorHex: '#f97316', image: getImageUrl('Lumina_Orange.png') },
            { id: 'lumina-white', name: 'White', colorHex: '#f5f5f5', image: getImageUrl('Lumina_White.png') },
        ],
        defaultVariant: 'lumina-black',
        temuUrl: 'https://www.temu.com/lumina-case',
    },
    {
        id: 'mirage',
        name: 'Mirage',
        description: 'Stunning gradient design with military-grade drop protection',
        price: 40.22,
        variants: [
            { id: 'mirage-black', name: 'Black', colorHex: '#1a1a1a', image: getImageUrl('Mirage_Black.png') },
            { id: 'mirage-blue', name: 'Blue', colorHex: '#2563eb', image: getImageUrl('Mirage_Blue.png') },
            { id: 'mirage-lightpink', name: 'Light Pink', colorHex: '#fbb6ce', image: getImageUrl('Mirage_Light_Pink.png') },
            { id: 'mirage-orange', name: 'Orange', colorHex: '#f97316', image: getImageUrl('Mirage_Orange.png') },
            { id: 'mirage-pink', name: 'Pink', colorHex: '#ec4899', image: getImageUrl('Mirage_Pink.png') },
            { id: 'mirage-silver', name: 'Silver', colorHex: '#c0c0c0', image: getImageUrl('Mirage_Silver.png') },
            { id: 'mirage-purple', name: 'Purple', colorHex: '#9333ea', image: getImageUrl('Mirage_purple.png') },
        ],
        defaultVariant: 'mirage-black',
        temuUrl: 'https://www.temu.com/mirage-case',
    },
    {
        id: 'prism',
        name: 'Prism',
        description: 'Eye-catching holographic effect with scratch-resistant surface',
        price: 41.30,
        variants: [
            { id: 'prism-black', name: 'Black', colorHex: '#1a1a1a', image: getImageUrl('Prism_Black.png') },
            { id: 'prism-blue', name: 'Blue', colorHex: '#2563eb', image: getImageUrl('Prism_Blue.png') },
            { id: 'prism-green', name: 'Green', colorHex: '#22c55e', image: getImageUrl('Prism_Green.png') },
            { id: 'prism-orange', name: 'Orange', colorHex: '#f97316', image: getImageUrl('Prism_Orange.png') },
            { id: 'prism-pink', name: 'Pink', colorHex: '#ec4899', image: getImageUrl('Prism_Pink.png') },
            { id: 'prism-purple', name: 'Purple', colorHex: '#9333ea', image: getImageUrl('Prism_Purple.png') },
            { id: 'prism-white', name: 'White', colorHex: '#f5f5f5', image: getImageUrl('Prism_White.png') },
        ],
        defaultVariant: 'prism-black',
        temuUrl: 'https://www.temu.com/prism-case',
    },
    {
        id: 'spectra',
        name: 'Spectra',
        description: 'Ultra-slim profile with wireless charging support and raised bezels',
        price: 41.03,
        variants: [
            { id: 'spectra-black', name: 'Black', colorHex: '#1a1a1a', image: getImageUrl('Spectra_Black.jpeg') },
            { id: 'spectra-blue', name: 'Blue', colorHex: '#2563eb', image: getImageUrl('Spectra_Blue.jpeg') },
            { id: 'spectra-brown', name: 'Brown', colorHex: '#78350f', image: getImageUrl('Spectra_Brown.jpeg') },
            { id: 'spectra-grey', name: 'Grey', colorHex: '#6b7280', image: getImageUrl('Spectra_Grey.jpeg') },
            { id: 'spectra-orange', name: 'Orange', colorHex: '#f97316', image: getImageUrl('Spectra_Orange.jpeg') },
        ],
        defaultVariant: 'spectra-black',
        temuUrl: 'https://www.temu.com/spectra-case',
    },
    {
        id: 'vault',
        name: 'Vault',
        description: 'Maximum protection leather-look case with card slot functionality',
        price: 41.21,
        variants: [
            { id: 'vault-black', name: 'Black', colorHex: '#1a1a1a', image: getImageUrl('Vault_Black.png') },
            { id: 'vault-darkbrown', name: 'Dark Brown', colorHex: '#5c4033', image: getImageUrl('Vault_Dark_Brown.png') },
            { id: 'vault-green', name: 'Green', colorHex: '#22c55e', image: getImageUrl('Vault_Green.png') },
            { id: 'vault-lightbrown', name: 'Light Brown', colorHex: '#a3836d', image: getImageUrl('Vault_Light_Brown.png') },
            { id: 'vault-purple', name: 'Purple', colorHex: '#9333ea', image: getImageUrl('Vault_Purple.png') },
        ],
        defaultVariant: 'vault-black',
        temuUrl: 'https://www.temu.com/vault-case',
    },
];

// Legacy export for backwards compatibility
export const caseProductsSimple: CaseProduct[] = caseProducts.map(product => {
    const defaultVariant = product.variants.find(v => v.id === product.defaultVariant) || product.variants[0];
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: defaultVariant.image,
        temuUrl: product.temuUrl,
    };
});

// Supported iPhone Models
export const iPhoneModels: iPhoneModel[] = [
    { id: 'iphone-17-pro-max', name: 'iPhone 17 Pro Max' },
    { id: 'iphone-17-pro', name: 'iPhone 17 Pro' },
    { id: 'iphone-17-air', name: 'iPhone 17 Air' },
    { id: 'iphone-17', name: 'iPhone 17' },
    { id: 'iphone-16-pro-max', name: 'iPhone 16 Pro Max' },
    { id: 'iphone-16-pro', name: 'iPhone 16 Pro' },
    { id: 'iphone-16-plus', name: 'iPhone 16 Plus' },
    { id: 'iphone-16', name: 'iPhone 16' },
    { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max' },
    { id: 'iphone-15-pro', name: 'iPhone 15 Pro' },
    { id: 'iphone-15-plus', name: 'iPhone 15 Plus' },
    { id: 'iphone-15', name: 'iPhone 15' },
    { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max' },
    { id: 'iphone-14-pro', name: 'iPhone 14 Pro' },
    { id: 'iphone-14-plus', name: 'iPhone 14 Plus' },
    { id: 'iphone-14', name: 'iPhone 14' },
    { id: 'iphone-13-pro-max', name: 'iPhone 13 Pro Max' },
    { id: 'iphone-13-pro', name: 'iPhone 13 Pro' },
    { id: 'iphone-13', name: 'iPhone 13' },
    { id: 'iphone-13-mini', name: 'iPhone 13 Mini' },
];

// Screen Protector Options (included with each case)
export const screenProtectors: ScreenProtector[] = [
    {
        id: 'sp-clear',
        name: 'Crystal Clear',
        description: 'Ultra-transparent HD clarity with 9H hardness',
        price: 0, // Included in bundle
        temuUrl: 'https://www.temu.com/screen-protector-clear',
    },
    {
        id: 'sp-matte',
        name: 'Anti-Glare Matte',
        description: 'Reduces fingerprints and glare, smooth gaming experience',
        price: 0, // Included in bundle
        temuUrl: 'https://www.temu.com/screen-protector-matte',
    },
    {
        id: 'sp-privacy',
        name: 'Privacy Shield',
        description: 'Blocks side-angle viewing, protects your screen from prying eyes',
        price: 4.99, // Premium upgrade
        temuUrl: 'https://www.temu.com/screen-protector-privacy',
    },
];

// Re-export shipping constants from centralized location for backwards compatibility
export { SHIPPING } from '@/lib/constants';

// For backwards compatibility with existing imports
export const SHIPPING_COST = 4.99;
export const FREE_SHIPPING_THRESHOLD = 50;
