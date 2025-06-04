import { useState, type PropsWithChildren, type ReactElement } from "react";
import { ModalContext } from "./useModal";


type ModalContextProviderProps = PropsWithChildren 
const ModalProvider = ({children}: ModalContextProviderProps) => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const isModalOpen = modal !== null

    const value = {
        isModalOpen,
        setModal
    }
    return <ModalContext.Provider value={value}>
        {children}
        {modal}
    </ModalContext.Provider>
}

export default ModalProvider;