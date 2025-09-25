'use client';

type StatusBadgeProps = {
    status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusConfig = (status: string) => {
        const configs = {
            'lido': {
                text: "Lido",
                bgColor: "bg-green-100",
                textColor: "text-green-700",
            },
            'lendo': {
                text: "Lendo",
                bgColor: "bg-blue-100",
                textColor: "text-blue-700",
            },
            'pausado': {
                text: "Pausado",
                bgColor: "bg-yellow-100",
                textColor: "text-yellow-700",
            },
            'quero ler': {
                text: "Quero Ler",
                bgColor: "bg-purple-100",
                textColor: "text-purple-700",
            },
            'abandonado': {
                text: "Abandonado",
                bgColor: "bg-red-100",
                textColor: "text-red-700",
            }
        };

        const normalizedStatus = status.toLowerCase();
        return configs[normalizedStatus as keyof typeof configs] || configs['abandonado'];
    };

    const statusConfig = getStatusConfig(status);

    return (
        <span
            className={`absolute top-2 left-2 ${statusConfig.bgColor} ${statusConfig.textColor} text-[10px] rounded-full shadow-sm font-medium`}
            style={{ padding: '0.3rem' }}
        >
            {statusConfig.text}
        </span>
    );
}