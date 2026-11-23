import { AppError } from "../errors/AppError.js";

export function autorizar(...papeisPermitidos){
    return (req, res, next) => {
        if (!papeisPermitidos.includes(req.usuario.papel)) {
            throw new AppError(403, 'Voce não tem permissão para esta ação')
        }
        next()
    }
}