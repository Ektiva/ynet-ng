import {v4 as uuidv4} from 'uuid';

export interface ICart {
    id: string;
    items: ICartItem[];
    clientSecret?: string;
    paymentIntentId?: string;
    deliveryMethodId?: number;
    shippingPrice?: number;
}

export interface ICartItem {
    id: number;
    productName: string;
    price: number;
    quantity: number;
    pictureUrl: string;
    brand: string;
    category: string;
    availibilityCount: number;
    ratingsCount: number;
    ratingsValue: number;
    cartCount: number;
    weight: number;
}

export class Cart implements ICart {
    id = uuidv4();
    items: ICartItem[] = [];
}

export interface ICartTotals {
    shipping: number;
    subtotal: number;
    total: number;
    totalItem: number;
}
