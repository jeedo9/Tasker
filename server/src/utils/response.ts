import { Code, type CRUD, type CRUDAccess } from "../types/index.d.js"


export const success = <T extends number, K extends Record<string, unknown>>(status: T, data: K) => ({
    status,
    success: true as const,
    data
})

type ErrorSuccess = {
     success: false
}

export type Error400ReturnType = {status: Code.BadRequest, errors: Record<string, string>} & ErrorSuccess
export type SuccessReturnType = ReturnType<typeof success>

export type ErrorType<T extends CRUD> = ((Code.BadRequest extends CRUDAccess<T, 'error'> ? Error400ReturnType : never) | {status: Exclude<CRUDAccess<T, 'error'>, Code.BadRequest>, message: string}) & ErrorSuccess

export type CodeResponse<T extends CRUD> = CRUDAccess<T, 'error'> | CRUDAccess<T, 'success'>

type AllErrorCodes = CRUDAccess<CRUD, 'error'>


export function error(status: Code.BadRequest, errors: Record<string, string>): Error400ReturnType
export function error<K extends CRUD>(status: Exclude<CRUDAccess<K, 'error'>, Code.BadRequest>, message: string): ErrorType<K>

export function error(status: AllErrorCodes, errorsOrMessage: Record<string, string> | string) {
    return {
    status,
    [status === Code.BadRequest ? 'errors' : 'message']:  errorsOrMessage,
    success: false
}
}

export type SuccessOrError<T extends SuccessReturnType, K extends CRUD> = T | ErrorType<K>
export type Success<T extends SuccessReturnType['status'], K extends SuccessReturnType['data']> = {
    status: T,
    data: K,
    success: true
}