import { ClienteType } from "../types/cliente-types";
import { LoginResponse } from "../types/login-types";
import pool from "../config/db"

class ClienteModel {
    getRegisteredUser = async (username: string, password: string): Promise<LoginResponse> => {
        const database = await pool.connect();

        try {
            if (!username || !password) {
                throw new Error("Usuário e senha são obrigatórios");
            }
            
            const query = 'SELECT * FROM register WHERE username = $1 AND password = $2';
            const values = [username, password];

            const user = (await database.query(query, values)).rows[0];
        
            if (!user || user.username !== username || user.password !== password) {
                throw new Error("Usuário ou senha inválidos");
            }
        
            return user;
        }catch(error) {
            throw new Error(error instanceof Error ? error.message : String(error))
        }finally {
            database.release();
        }
    }

    async insert(cliente: Omit<ClienteType, "id">): Promise<ClienteType> {
        const database = await pool.connect();

        try {
            const checkQuery = 'SELECT * FROM "users" WHERE email = $1';
            const checkValues = [cliente.email];
            const existingClient = (await database.query(checkQuery, checkValues)).rows[0];

            if (existingClient) {
                throw new Error("Cliente já cadastrado!");
            }
            console.log("chegou aqui?")
            // Inserir o endereço na tabela Address
            const insertAddressQuery = `
                INSERT INTO "address" (street, zipcode, number, neighborhood)
                VALUES ($1, $2, $3, $4)
                RETURNING id
            `;
            const addressValues = [
                cliente.address.street,
                cliente.address.zipcode,
                cliente.address.number,
                cliente.address.neighborhood,
            ];
            const addressResult = await database.query(insertAddressQuery, addressValues);
            const addressId = addressResult.rows[0].id;

            // Inserir o cliente na tabela User com a chave estrangeira do endereço
            const insertUserQuery = `
                INSERT INTO "users" (name, email, phone, address_id)
                VALUES ($1, $2, $3, $4)
                RETURNING id, name, email, phone, address_id
            `;
            const userValues = [
                cliente.name,
                cliente.email,
                cliente.phone,
                addressId,
            ];
            const userResult = await database.query(insertUserQuery, userValues);

            return userResult.rows[0];
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        } finally {
            database.release();
        }
    }

    async update(id: number, updatedData: Partial<Omit<ClienteType, "id">>): Promise<ClienteType> {
        const database = await pool.connect()
        
        try {
            const checkQuery = 'SELECT * FROM "users" WHERE id = $1'
            const userValues = [id]

            const existingClient: ClienteType = (await database.query(checkQuery, userValues)).rows[0];
            
            if (!existingClient) {
                throw new Error("Cliente não encontrado");
            }

            if (updatedData.email && updatedData.email !== existingClient.email) {
                const emailCheckQuery = 'SELECT * FROM "users" WHERE email = $1';
                const emailCheckValues = [updatedData.email];
                const emailExists = (await database.query(emailCheckQuery, emailCheckValues)).rows[0];

                if (emailExists) {
                    throw new Error("E-mail já cadastrado!");
                }
            }

            const updateUserQuery = `
                UPDATE "users"
                SET 
                    name = COALESCE($1, name),
                    email = COALESCE($2, email),
                    phone = COALESCE($3, phone)
                WHERE id = $4
                RETURNING id, name, email, phone, address_id
            `;
            const updateValues = [
                updatedData.name || null,
                updatedData.email || null,
                updatedData.phone || null,
                id,
            ];

            const updatedUserData = (await database.query(updateUserQuery, updateValues)).rows[0];
            
            const updateAddressQuery = `
                UPDATE "address"
                SET
                    street = COALESCE($1, street),
                    zipcode = COALESCE($2, zipcode),
                    number = COALESCE($3, number),
                    neighborhood = COALESCE($4, neighborhood)
                WHERE id = $5
                RETURNING id, street, zipcode, number, neighborhood
            `
            const updateAddressValues = [
                updatedData.address?.street || null,
                updatedData.address?.zipcode || null,
                updatedData.address?.number || null,
                updatedData.address?.neighborhood || null,
                updatedUserData.address_id,
            ];

            const updatedClient = (await database.query(updateAddressQuery, updateAddressValues)).rows[0];

            return updatedClient;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        } finally {
            database.release();
        }
    }
    
    async list(): Promise<ClienteType[]> {
        const database = await pool.connect();
        try {
            const queryClients = `
                SELECT 
                    u.id AS id,
                    u.name AS name,
                    u.email AS email,
                    u.phone AS phone,
                    a.id AS id,
                    a.street AS street,
                    a.zipcode AS zipcode,
                    a.number AS number,
                    a.neighborhood AS neighborhood
                FROM "users" u
                JOIN "address" a ON u.id = a.id
            `;
            const result = (await database.query(queryClients));
            const clientsList: ClienteType[] = result.rows.map(row => ({
                id: row.id,
                name: row.name,
                email: row.email,
                phone: row.phone,
                address: {
                    street: row.street,
                    zipcode: row.zipcode,
                    number: row.number,
                    neighborhood: row.neighborhood,
                },
            }));

            return clientsList;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        } finally {
            database.release();
        }
    }
}

export default new ClienteModel();