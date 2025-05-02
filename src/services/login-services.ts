import LoginModel from "../models/login-model"

class LoginService {
    login = async (username: string, password: string) => {
        try {
            const user = await LoginModel.getRegisteredUser(username, password)
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
}

export default new LoginService();