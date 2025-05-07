import { ClienteType } from "../types/cliente-types";
import { LoginResponse } from "../types/login-types";

const clientes: ClienteType[] = [];

const fakeDatabaseCall = (username: string): Promise<LoginResponse> => {
    return new Promise((resolve, reject) => {
        const user: LoginResponse = {
            username: "admin",
            password: "admin"
        }
        // Chamada para banco de dados fake
        setTimeout(() => {
            if (username === user.username) {
                resolve(user);
            } else {
                reject(new Error("Usuário não está registrado na base de dados"));
            }
        }, 1000);
    });
}

class ClienteModel {
    getRegisteredUser = async (username: string, password: string): Promise<LoginResponse> => {
        if (!username || !password) {
            throw new Error("Usuário e senha são obrigatórios");
        }
        
        const user = await fakeDatabaseCall(username)
    
        if (!user || user.username !== username || user.password !== password) {
            throw new Error("Usuário ou senha inválidos");
        }
    
        return user;
    }

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
        const existingClient = clientes.find((c) => c.email === updatedData.email);
        if (existingClient) {
            throw new Error("E-mail já cadastrado!");
        }
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