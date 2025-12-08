// Shared Constants for Grid & Guard
// Centralized constants to avoid duplication across the codebase

// ============================================
// SHIPPING CONFIGURATION
// ============================================
export const SHIPPING = {
    /** Minimum order value for free shipping (in USD) */
    FREE_THRESHOLD: 50,
    /** Standard shipping cost (in USD) */
    COST: 4.99,
    /** Currency code */
    CURRENCY: 'usd',
} as const;

// ============================================
// ORDER STATUS
// ============================================
export const ORDER_STATUS = [
    'pending',
    'paid',
    'ordered_from_temu',
    'shipped',
    'delivered',
] as const;

export type OrderStatus = (typeof ORDER_STATUS)[number];

export const ORDER_STATUS_CONFIG = {
    pending: {
        label: 'Pending',
        color: 'bg-yellow-500/20 text-yellow-400',
    },
    paid: {
        label: 'Paid',
        color: 'bg-blue-500/20 text-blue-400',
    },
    ordered_from_temu: {
        label: 'Ordered from Temu',
        color: 'bg-purple-500/20 text-purple-400',
    },
    shipped: {
        label: 'Shipped',
        color: 'bg-orange-500/20 text-orange-400',
    },
    delivered: {
        label: 'Delivered',
        color: 'bg-green-500/20 text-green-400',
    },
} as const;

// ============================================
// LOCAL STORAGE KEYS
// ============================================
export const STORAGE_KEYS = {
    CART: 'gridGuardCart',
    ORDERS: 'gridGuardOrders',
    ADMIN_AUTH: 'gridGuardAdminAuth',
    USER_PHONE: 'gridGuardPhone',
    USER_EMAIL: 'gridGuardEmail',
} as const;

// ============================================
// API ENDPOINTS
// ============================================
export const API_ENDPOINTS = {
    CREATE_CHECKOUT: '/api/create-checkout-session',
    VERIFY_PAYMENT: '/api/verify-payment',
} as const;

// ============================================
// VALIDATION
// ============================================
export const VALIDATION = {
    PHONE_REGEX: /^\+?1?\s*\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    ZIP_CODE_REGEX: /^\d{5}(-\d{4})?$/,
} as const;
