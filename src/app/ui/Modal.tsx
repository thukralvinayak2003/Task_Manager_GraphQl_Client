// components/Modal.tsx

"use client";

import { Dialog } from "@headlessui/react";
import { useRef, ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close"; // Import Material UI Close icon

interface ModalProps {
  onClose?: () => void;
  children: ReactNode;
}

export function Modal({ onClose = () => {}, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog
      open={true}
      onClose={onClose}
      initialFocus={overlayRef}
      className="fixed inset-0 z-10 flex items-center justify-center"
    >
      {/* Background overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-gray-800/60"
        aria-hidden="true"
      />

      {/* Modal content */}
      <div className="relative flex items-center justify-center w-1/2 bg-white p-6 rounded-lg">
        {/* Close Button */}
        <button
          onClick={onClose} // Closes the modal when clicked
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <CloseIcon />
        </button>

        {/* Modal Children (Form or other content) */}
        {children}
      </div>
    </Dialog>
  );
}
