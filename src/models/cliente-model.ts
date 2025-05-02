import { ClienteType } from "../types/cliente-types";

const clientes: ClienteType[] = [];

class ClienteModel {
    insert(cliente: Omit<ClienteType, "id">): ClienteType {
        const existingClient = clientes.find((c) => c.email === cliente.email);
        if (existingClient) {
            throw new Error("Cliente já cadastrado!");
        }
        const newClient: ClienteType = {
            id: Math.floor(Math.random() * 1000),
            ...cliente,
        };
        clientes.push(newClient);
        return newClient;
    }

    update(id: number, updatedData: Partial<Omit<ClienteType, "id">>): ClienteType | null {
        const clienteIndex = clientes.findIndex((cliente) => String(cliente.id) === String(id));
        if (clienteIndex === -1) {
            throw new Error("Cliente não encontrado");
        }
        clientes[clienteIndex] = {
            ...clientes[clienteIndex],
            ...updatedData,
        };
        return clientes[clienteIndex];
    }
    
    list(): ClienteType[] {
        return clientes;
    }
}

export default new ClienteModel();