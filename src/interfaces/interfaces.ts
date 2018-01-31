export interface Tag {
    key?: string,
    name: string,
    icon: string
}

export interface Expense {
    key?: string,
    name: string,
    date: string,
    amount: number,
    tag: string,
    currency: string
}
