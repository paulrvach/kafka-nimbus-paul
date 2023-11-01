"use client";
import {
  useState,
  createContext,
  type HTMLAttributes,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

interface ContextProps {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

const ModalContext = createContext<ContextProps>({
  openModal: false,
  setOpenModal: () => false,
});

const ModalContextProvider = ({
  children,
}: HTMLAttributes<HTMLDivElement>) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <ModalContext.Provider value={{ openModal, setOpenModal }}>
      {children}
    </ModalContext.Provider>
  );
};

const useModalContext = () => useContext(ModalContext);

export { ModalContextProvider, useModalContext };