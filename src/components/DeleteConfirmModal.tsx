'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

type DeleteConfirmModalProps = {
    isOpen: boolean;
    bookTitle: string;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
};

const TRANSITION_DURATION_MS = 300;

export default function DeleteConfirmModal({
    isOpen,
    bookTitle,
    onClose,
    onConfirm
}: DeleteConfirmModalProps) {
    const [modalRootElement, setModalRootElement] = useState<HTMLElement | null>(null);
    const [isAnimatingIn, setIsAnimatingIn] = useState(false);

    useEffect(() => {
        setModalRootElement(document.getElementById('modal-root'));
    }, []);

    useEffect(() => {
        if (isOpen) {
            const timeoutId = setTimeout(() => setIsAnimatingIn(true), 50);
            return () => clearTimeout(timeoutId);
        }
    }, [isOpen]);

    const handleClose = useCallback(() => {
        setIsAnimatingIn(false);
        setTimeout(onClose, TRANSITION_DURATION_MS);
    }, [onClose]);

    const handleConfirm = useCallback(async () => {
        setIsAnimatingIn(false);
        try {
            await new Promise(resolve => setTimeout(resolve, TRANSITION_DURATION_MS));
            await onConfirm();
            toast.success(`"${bookTitle}" foi excluído com sucesso!`);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao excluir o livro. Tente novamente.");
            setIsAnimatingIn(true);
        }
    }, [bookTitle, onClose, onConfirm]);

    if (!isOpen || !modalRootElement) return null;

    const dialogClasses = isAnimatingIn
        ? 'opacity-100 scale-100'
        : 'opacity-0 scale-95';

    const backdropClasses = isAnimatingIn
        ? 'opacity-100'
        : 'opacity-0';

    const modalContent = (
        <div
            className={`flex items-center justify-center fixed inset-0 z-50 transition-opacity duration-300 ${backdropClasses}`}
            style={{ background: "rgba(0,0,0,0.3)" }}
            onClick={handleClose}
        >
            <div
                className={`bg-white dark:bg-slate-800 dark:shadow-blue-400 dark:shadow-sm rounded-xl shadow-2xl transform transition-all ease-out duration-300 ${dialogClasses}`}
                style={{ padding: "1.5rem", maxWidth: "24rem", width: "100%" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                    <div
                        className="mx-auto flex items-center justify-center rounded-full"
                        style={{
                            height: "3rem",
                            width: "3rem",
                            backgroundColor: "#fee2e2",
                            marginBottom: "1rem"
                        }}
                    >
                        <svg
                            className="h-6 w-6 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-blue-400 mb-2">
                        Excluir Livro
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-blue-200 mb-6">
                        Tem certeza que deseja excluir &quot;{bookTitle}&quot;? Esta ação não pode ser desfeita.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={handleClose}
                            className="flex-1 cursor-pointer bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            style={{ padding: "0.5rem 1rem" }}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            style={{ padding: "0.5rem 1rem" }}
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, modalRootElement);
}
