import { Code } from "@shared/types/types.ts"
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