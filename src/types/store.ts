// Product Types for Grid & Guard Store

export interface CaseProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    temuUrl?: string;
}

export interface iPhoneModel {
    id: string;
    name: string;
    temuSuffix?: string; // Used for Temu URL building
}

export interface ScreenProtector {
    id: string;
    name: string;
    description: string;
    price: number;
    temuUrl?: string;
}

export interface CartItem {
    caseProduct: CaseProduct;
    iPhoneModel: iPhoneModel;
    screenProtector: ScreenProtector;
    quantity: number;
}

export interface CustomerInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
        street: string;
        apartment?: string;
        city: string;
        state: string;
        zipCode: string;
    };
}

export interface Order {
    id: string;
    createdAt: string;
    status: 'pending' | 'paid' | 'ordered_from_temu' | 'shipped' | 'delivered';
    customer: CustomerInfo;
    items: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
    stripePaymentId?: string;
    temuOrderId?: string;
}
