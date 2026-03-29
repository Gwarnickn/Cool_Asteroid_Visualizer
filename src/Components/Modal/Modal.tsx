import React, { type FunctionComponent } from "react";
import { createPortal } from "react-dom"; // <-- Use React's built-in portal!
import "./modal.scss";

type ModalProps = {
    isOpen: boolean,
    children: React.ReactNode,
    handleClose: () => void,
}

const Modal: FunctionComponent<ModalProps> = ({ isOpen, children, handleClose }) => {
    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div className="modal-background" onClick={handleClose}>
            <div className="modal blur-background" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.body 
    );
}

export default Modal;