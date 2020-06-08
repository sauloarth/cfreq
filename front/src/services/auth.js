export const TOKEN_KEY = 'x-auth-token';
export const NOME_AUTH_INFO = 'cfreq-nome';
export const MATRICULA_AUTH_INFO = 'cfreq-matricula';
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getNome = () => localStorage.getItem(NOME_AUTH_INFO);
export const getMatricula = () => localStorage.getItem(MATRICULA_AUTH_INFO);
export const login = (token, nome, matricula) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(NOME_AUTH_INFO, nome);
    localStorage.setItem(MATRICULA_AUTH_INFO, matricula);

};
export const logout = async () => {
    //I know, i know. Shit could happen!
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(NOME_AUTH_INFO);
    localStorage.removeItem(MATRICULA_AUTH_INFO);
};
