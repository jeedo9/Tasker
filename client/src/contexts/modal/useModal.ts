import { use } from "react"
import { createContext } from "react"
import type { ModalsName } from "./ModalProvider"

type ModalContextType = {
    setModal: (modalName: ModalsName, open: boolean) => void,
    isModalOpen: (modalName: ModalsName) => boolean
} | null
export const ModalContext = createContext<ModalContextType>(null)

const useModal = () => {
    const modalContext = use(ModalContext)
    if (!modalContext) throw new Error('Accessing the values of the modal context requires being a consumer..')
    return modalContext
}
export default useModal