import { useState, type PropsWithChildren } from "react";
import { ModalContext } from "./useModal";


type ModalContextProviderProps = PropsWithChildren 
export type ModalsName = 'taskUpdate' | 'taskCreate'

const ModalProvider = ({children}: ModalContextProviderProps) => {
    const [modals, setModals] = useState<Record<ModalsName, boolean>>({
        taskUpdate: false,
        taskCreate: false
    })

    const setModal = (modalName: ModalsName, open: boolean) => {
        setModals({...modals, [modalName]: open})
    }

    const isModalOpen = (modalName: ModalsName) => modals[modalName]

    const value = {
        isModalOpen,
        setModal
    }
    return <ModalContext.Provider value={value}>
        {children}
    </ModalContext.Provider>
}

export default ModalProvider;