export interface CartAction{
    item: string,
    quantity: number
}

export interface CartItem{
    item: string,
    quantity: number
}

export interface Customer{
    name: string
    email: string
    dob: Date
    address: string

    payment: PrimaryPayment
    otherPaymentMethods: Payment[]
}

export interface PrimaryPayment{
    provider: string
    cardNumber: string
}

export interface Payment{
    nums: string
    altProvider: string
}

export interface Order{
    customer: Customer
    cartItem: CartItem[]
}


