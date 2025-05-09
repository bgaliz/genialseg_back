type Address = {
    street: string;
    number: string;
    neighborhood: string;
    zipcode: string;
};

export type ClienteType = {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: Address;
};