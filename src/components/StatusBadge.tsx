'use client';

type StatusBadgeProps = {
    status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusConfig = (status: string) => {
        const configs = {
            'lido': {
                text: "Lido",
                bgColor: "bg-green-100 dark:bg-green-600 wood:bg-green-700",
                textColor: "text-green-700 dark:text-green-100 wood:text-green-100",
            },
            'lendo': {
                text: "Lendo",
                bgColor: "bg-blue-100 dark:bg-blue-600 wood:bg-blue-700",
                textColor: "text-blue-700 dark:text-blue-100 wood:text-blue-100",
            },
            'pausado': {
                text: "Pausado",
                bgColor: "bg-yellow-100 dark:bg-yellow-600 wood:bg-yellow-700",
                textColor: "text-yellow-700 dark:text-yellow-100 wood:text-yellow-100",
            },
            'quero ler': {
                text: "Quero Ler",
                bgColor: "bg-purple-100 dark:bg-purple-600 wood:bg-purple-700",
                textColor: "text-purple-700 dark:text-purple-100 wood:text-purple-100",
            },
            'abandonado': {
                text: "Abandonado",
                bgColor: "bg-red-100 dark:bg-red-600 wood:bg-red-700",
                textColor: "text-red-700 dark:text-red-100 wood:text-red-100",
            }
        };

        const normalizedStatus = status.toLowerCase();
        return configs[normalizedStatus as keyof typeof configs] || configs['abandonado'];
    };

    const statusConfig = getStatusConfig(status);

    return (
        <span
            className={`absolute top-2 left-2 ${statusConfig.bgColor} ${statusConfig.textColor} text-[10px] rounded-lg shadow-sm font-medium`}
            style={{ padding: '0.2rem 1rem' }}
        >
            {statusConfig.text}
        </span>
    );
}
