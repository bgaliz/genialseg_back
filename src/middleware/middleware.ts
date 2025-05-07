import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: "Token não fornecido" });
        return;
    }
  
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        if (!decoded) {
            res.status(401).json({ message: "Token inválido" });
            return;
        }
        
        if(req.body) {
            req.body.role = decoded;
        }
        
        next();
    } catch (error) {
        console.error("Erro ao verificar o token:", (error as Error).message);
        res.status(401).json({ message: "Token inválido", error: (error as Error).message });
    }
};