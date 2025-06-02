export type CRUDCode = {
    create: {
        success: Code.Created,
        error: Code.BadRequest | Code.Failure | Code.Conflict,
    },
    read: {
       success: Code.OK,
       error:  Code.Failure | Code.NotFound,
    },
    update: {
        success: Code.OK,
        error: Code.BadRequest | Code.NotFound | Code.Failure | Code.Conflict,
    },
    delete: {
        success: Code.NoContent,
        error: Code.NotFound | Code.Failure,
    }
}
export type CRUD = keyof CRUDCode
export type CRUDAccess<T extends CRUD, K extends keyof CRUDCode[T]> = CRUDCode[T][K]

export enum Code {
    OK = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    NotFound = 404,
    Conflict = 409,
    Failure = 500
}
