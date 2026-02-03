"use client";

import { useState, useCallback } from "react";
import Modal, { ModalType } from "@/components/Modal";

interface ModalOptions {
  title: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState<ModalOptions>({
    title: "",
    message: "",
    type: "info",
  });

  const showModal = useCallback((options: ModalOptions) => {
    setModalProps(options);
    setIsOpen(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const ModalComponent = useCallback(() => {
    return (
      <Modal
        isOpen={isOpen}
        onClose={hideModal}
        {...modalProps}
      />
    );
  }, [isOpen, hideModal, modalProps]);

  return {
    showModal,
    hideModal,
    ModalComponent,
  };
}
