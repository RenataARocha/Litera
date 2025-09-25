'use client';

type DeleteConfirmModalProps = {
    isOpen: boolean;
    bookTitle: string;
    onClose: () => void;
    onConfirm: () => void;
};

export default function DeleteConfirmModal({
    isOpen,
    bookTitle,
    onClose,
    onConfirm
}: DeleteConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="flex items-center justify-center z-50"
            style={{ position: 'fixed', inset: 0 }}
        >
            <div
                className="bg-white rounded-xl shadow-lg"
                style={{ padding: '1.5rem', maxWidth: '24rem', width: '100%' }}
            >
                <div className="text-center">
                    <div
                        className="mx-auto flex items-center justify-center rounded-full"
                        style={{
                            height: '3rem',
                            width: '3rem',
                            backgroundColor: '#fee2e2',
                            marginBottom: '1rem'
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
                    <h3
                        className="text-lg font-semibold text-gray-900"
                        style={{ marginBottom: '0.5rem' }}
                    >
                        Excluir Livro
                    </h3>
                    <p
                        className="text-sm text-gray-600"
                        style={{ marginBottom: '1.5rem' }}
                    >
                        Tem certeza que deseja excluir &quot;{bookTitle}&quot;? Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 cursor-pointer bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            style={{ padding: '0.5rem 1rem' }}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            style={{ padding: '0.5rem 1rem' }}
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}