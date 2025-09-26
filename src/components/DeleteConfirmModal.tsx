'use client';

import { toast } from "sonner";

type DeleteConfirmModalProps = {
    isOpen: boolean;
    bookTitle: string;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
};

export default function DeleteConfirmModal({
    isOpen,
    bookTitle,
    onClose,
    onConfirm
}: DeleteConfirmModalProps) {
    if (!isOpen) return null;

    const handleConfirm = async () => {
        try {
            await onConfirm();
            toast.success(`"${bookTitle}" foi excluído com sucesso!`);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao excluir o livro. Tente novamente.");
        }
    };

    return (
        <div
            className="flex items-center justify-center z-50"
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)" }}
        >
            <div
                className="bg-white rounded-xl shadow-lg"
                style={{ padding: "1.5rem", maxWidth: "24rem", width: "100%" }}
            >
                <div className="text-center">
                    {/* Ícone de alerta */}
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

                    {/* Título */}
                    <h3
                        className="text-lg font-semibold text-gray-900"
                        style={{ marginBottom: "0.5rem" }}
                    >
                        Excluir Livro
                    </h3>

                    {/* Mensagem */}
                    <p
                        className="text-sm text-gray-600"
                        style={{ marginBottom: "1.5rem" }}
                    >
                        Tem certeza que deseja excluir &quot;{bookTitle}&quot;? Esta ação não
                        pode ser desfeita.
                    </p>

                    {/* Botões */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
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
}
