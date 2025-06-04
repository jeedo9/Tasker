export const PORT = process.env.PORT ?? '8080';

export const CLIENT_URL = JSON.parse(process.env.CLIENT_URL ?? `["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"]`) as string[]

export const errorMessages = {
    notFound: 'That ressource does not exist, sorry.. :/',
    conflict: 'That ressource already exist..'
} as const;