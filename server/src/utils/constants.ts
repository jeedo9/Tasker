export const PORT = process.env.PORT ?? '8080';

export const errorMessages = {
    notFound: 'That ressource does not exist, sorry.. :/',
    conflict: 'That ressource already exist..'
} as const;