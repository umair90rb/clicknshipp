export const getEnvs = () => process.env;

export const isDev = () => getEnvs().NODE_ENV === 'development';
