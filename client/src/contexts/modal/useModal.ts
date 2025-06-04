import { use, type Dispatch, type ReactElement, type SetStateAction } from "react"
import { createContext } from "react"

type ModalContextType = {
    setModal: Dispatch<SetStateAction<ReactElement | null>>,
    isModalOpen: boolean
} | null
export const ModalContext = createContext<ModalContextType>(null)

const useModal = () => {
    const modalContext = use(ModalContext)
    if (!modalContext) throw new Error('Accessing the values of the modal context requires being a consumer..')
    return modalContext
}
export default useModal