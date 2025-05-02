import { LoginResponse } from "../types/login-types";

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

class LoginModel {
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
}

export default new LoginModel(); 