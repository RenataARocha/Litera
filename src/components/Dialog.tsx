"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

export function Dialog({ triggerText, title, children }: {
    triggerText: string,
    title: string,
    children: React.ReactNode
}) {
    return (
        <DialogPrimitive.Root>
            {/* Botão que abre o Dialog */}
            <DialogPrimitive.Trigger
                className="
                    px-4 py-2 bg-primary-500 text-white rounded-xl 
                    hover:bg-primary-600 transition-colors shadow-lg
                    dark:bg-blue-500 dark:hover:bg-blue-600
                    wood:bg-[var(--color-accent-600)] wood:hover:bg-[var(--color-accent-700)]
                "
            >
                {triggerText}
            </DialogPrimitive.Trigger>

            <DialogPrimitive.Portal>
                {/* Overlay */}
                <DialogPrimitive.Overlay
                    className="fixed inset-0 bg-black/40 animate-fade-in"
                />

                {/* Conteúdo do Dialog */}
                <DialogPrimitive.Content
                    className="
                        fixed top-1/2 left-1/2 w-[90%] max-w-md 
                        -translate-x-1/2 -translate-y-1/2 
                        bg-surface p-6 rounded-2xl shadow-2xl animate-scale-in

                        dark:bg-blue-200/10 dark:backdrop-blur-md
                        wood:bg-[var(--color-primary-900)] wood:border wood:border-[var(--color-accent-700)]
                    "
                >
                    {/* Cabeçalho do Dialog */}
                    <div className="flex justify-between items-center mb-4">
                        <DialogPrimitive.Title
                            className="
                                text-lg font-bold text-gray-800 
                                dark:text-blue-300 
                                wood:text-[var(--color-primary-100)]
                            "
                        >
                            {title}
                        </DialogPrimitive.Title>

                        <DialogPrimitive.Close
                            className="
                                p-1 rounded-full hover:bg-gray-200 transition-colors
                                dark:hover:bg-blue-200/20
                                wood:hover:bg-[var(--color-primary-800)]
                            "
                        >
                            <X
                                className="
                                    w-5 h-5 text-gray-500
                                    dark:text-blue-300
                                    wood:text-[var(--color-accent-400)]
                                "
                            />
                        </DialogPrimitive.Close>
                    </div>

                    {/* Conteúdo interno */}
                    {children}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    )
}
