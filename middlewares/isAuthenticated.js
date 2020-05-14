const apiResponse = require('../utils/apiResponse');
const { createAccessToken, decryptAccessToken } = require('../utils/encryptation');


async function isAuthenticated(req, res, next) {
    const token = req.header('x-auth-token');
    try {
        if (!token) return apiResponse.errorResponse(res, 'Efetue login');

        const decoded = decryptAccessToken(token);

        if (decoded) {
            req.user = decoded;
            next();
        } else {
            return apiResponse.unauthorizedResponse(res, 'Você não está logado');
        }
    } catch (err) {
        return apiResponse.unauthorizedResponse(res, 'Erro ao verificar sua identidade.');
    }
    return 0;
}

module.exports = isAuthenticated;