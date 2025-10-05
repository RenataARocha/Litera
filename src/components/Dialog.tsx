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
            <DialogPrimitive.Trigger className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-lg">
                {triggerText}
            </DialogPrimitive.Trigger>

            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 animate-fade-in" />
                <DialogPrimitive.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-surface p-6 rounded-2xl shadow-2xl animate-scale-in">
                    <div className="flex justify-between items-center mb-4">
                        <DialogPrimitive.Title className="text-lg font-bold text-gray-800 dark:text-blue-600">{title}</DialogPrimitive.Title>
                        <DialogPrimitive.Close className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                            <X className="w-5 h-5 text-gray-500 dark:text-blue-300" />
                        </DialogPrimitive.Close>
                    </div>
                    {children}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    )
}