import ClienteModel from "../models/cliente-model";
import { ClienteType } from "../types/cliente-types";

class ClienteService {
    login = async (username: string, password: string) => {
        try {
            const user = await ClienteModel.getRegisteredUser(username, password)
            return user
        }catch (error) {
            if(error instanceof Error) {
                return {
                    message: "Falha ao executar login", 
                    error: error?.message
                }
            }
        }
    }

    async insertClient(cliente: Omit<ClienteType, "id">) {
        try{
            const newClient: ClienteType = await ClienteModel.insert(cliente);
            return newClient;
        }catch (error) {
            if(error instanceof Error) {
                return {message: "Falha ao cadastrar cliente", error: error.message};
            }
        }
    }

    async updateClient(id: number, updatedData: Partial<Omit<ClienteType, "id">>) {
        try{
            const editedClient = await ClienteModel.update(id, updatedData);
            return editedClient;
        }catch(error) {
            if(error instanceof Error) {
                return {message: "Falha ao editar cliente", error: error.message};
            }
        }   
    }

    async listClient() {
        const clientsList = await ClienteModel.list();
        return clientsList;
    }
}

export default new ClienteService();