import {type CRUD, type CRUDAccess } from "@typings/index.d.js"
import { Code, type ErrorMessage } from "@shared/types/types.js"


export const success = <T extends number, K extends Record<string, unknown>>(status: T, data: K) => ({
    status,
    success: true as const,
    data
})

export type ErrorSuccess = {
     success: false
}

export type Error400 = {status: Code.BadRequest, errors: Record<string, string>} & ErrorSuccess

export type SuccessReturnType = ReturnType<typeof success>

export type ErrorType<T extends CRUD> = ((Code.BadRequest extends CRUDAccess<T, 'error'> ? Error400 : never) | ErrorMessage<T>) & ErrorSuccess

export type CodeResponse<T extends CRUD> = CRUDAccess<T, 'error'> | CRUDAccess<T, 'success'>

type AllErrorCodes = CRUDAccess<CRUD, 'error'>


export function error(status: Code.BadRequest, errors: Record<string, string>): Error400
export function error<K extends CRUD>(status: Exclude<CRUDAccess<K, 'error'>, Code.BadRequest>, message: string): ErrorType<K>

export function error(status: AllErrorCodes, errorsOrMessage: Record<string, string> | string) {
    return {
    status,
    [status === Code.BadRequest ? 'errors' : 'message']:  errorsOrMessage,
    success: false
}
}

export type SuccessOrError<T extends SuccessReturnType, K extends CRUD> = T | ErrorType<K>
