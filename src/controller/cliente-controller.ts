import ClientServices from "../services/cliente-services";
import { ClienteType } from "../types/cliente-types";

function verifyMissingFields({ name, email, phone, address }: ClienteType): string[] {
    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!email) missingFields.push("email");
    if (!phone) missingFields.push("phone");
    if (!address) missingFields.push("address");
    return missingFields;
}

export const insertClientController = async (req: any, res: any) => {
    const payload: ClienteType = req.body;
    const fields = verifyMissingFields(payload);

    if (fields.length > 0) {
        return res.status(400).json({
            message: "Todos os campos são obrigatórios",
            fields
        });
    }

    try {
        const registeredClients = await ClientServices.insertClient(payload)

        if (typeof registeredClients === 'object' 
            && registeredClients 
            && 'message' in registeredClients
        ) {
            return res.status(500).json({
                message: "Falha ao cadastrar cliente",
                error: registeredClients.error
            });
        }

        res.status(201).json({message: "Cliente cadastrado com sucesso"});
        
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: "Falha ao cadastrar cliente",
                error: error.message
            });
        }
    }
}

export const updateClientController = async (req: any, res: any) => {
    const payload: ClienteType = req.body;
    const { id } = req.query;

    const fields = verifyMissingFields(payload);

    if (fields.length > 0) {
        return res.status(400).json({
            message: "Todos os campos são obrigatórios",
            fields
        });
    }

    try {
        const updatedClient = await ClientServices.updateClient(id, payload);

        if (typeof updatedClient === 'object' 
            && updatedClient 
            && 'message' in updatedClient
        ) {
            return res.status(500).json({
                message: "Falha ao editar cliente",
                error: updatedClient.error
            });
        }

        res.status(200).json({message: "Cliente editado com sucesso"});
        
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: "Falha ao editar cliente",
                error: error.message
            });
        }
    }
}

export const listClientController = async (req: any, res: any) => {
    try {
        const clients = await ClientServices.listClient();
        console.log(clients)
        res.status(200).json(clients);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: "Falha ao listar clientes",
                error: error.message
            });
        }
    }
}