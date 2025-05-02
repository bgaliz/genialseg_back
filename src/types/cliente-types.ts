type Address = {
    street: string;
    city: string;
    state: string;
    zip: string;
};

export type ClienteType = {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: Address;
};