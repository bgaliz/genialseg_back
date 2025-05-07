import jwt from 'jsonwebtoken';
import clienteServices from '../services/cliente-services';

const JWT_SECRET = process.env.JWT_SECRET;

export const loginController = async (req: any, res: any) => {
    const { username, password } = req.body;

    const user = await clienteServices.login(username, password);

    if (user && 'message' in user) {
        return res.status(401).json({
            message: user?.message,
            error: user?.error
        })
    }

    if (!JWT_SECRET) {
        return res.status(500).json({ message: 'JWT secret is not defined' });
    }

    const token = jwt.sign({ username, password }, JWT_SECRET, {
        expiresIn: "10m"
    });

    return res.status(200).json({ message: 'Login efetuado com sucesso!', token });
}