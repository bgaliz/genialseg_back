import ClienteModel from "../models/cliente-model";
import { ClienteType } from "../types/cliente-types";


class ClienteService {
    insertClient(cliente: Omit<ClienteType, "id">) {
        try{
            const newClient: ClienteType = ClienteModel.insert(cliente);
            return newClient;
        }catch (error) {
            if(error instanceof Error) {
                return {message: "Falha ao cadastrar cliente", error: error.message};
            }
        }
    }

    updateClient(id: number, updatedData: Partial<Omit<ClienteType, "id">>) {
        try{
            const editedClient = ClienteModel.update(id, updatedData);
            return editedClient;
        }catch(error) {
            if(error instanceof Error) {
                return {message: "Falha ao editar cliente", error: error.message};
            }
        }   
    }

    listClient(): ClienteType[] {
        return ClienteModel.list();
    }
}

export default new ClienteService();