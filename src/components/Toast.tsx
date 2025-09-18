"use client"

import * as ToastPrimitive from "@radix-ui/react-toast"
import { useState } from "react"
import { X } from "lucide-react"

export function ToastDemo() {
    const [open, setOpen] = useState(false)

    return (
        <ToastPrimitive.Provider>
            <button
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-success text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg"
            >
                Mostrar Toast
            </button>

            <ToastPrimitive.Root
                open={open}
                onOpenChange={setOpen}
                className="fixed bottom-4 right-4 bg-surface border border-gray-200 shadow-xl rounded-xl p-4 animate-fade-in"
            >
                <div className="flex justify-between items-center gap-4">
                    <div className="flex-1">
                        <ToastPrimitive.Title className="font-bold text-lg text-gray-800">Sucesso!</ToastPrimitive.Title>
                        <ToastPrimitive.Description className="text-sm text-gray-600">
                            O livro foi adicionado à biblioteca.
                        </ToastPrimitive.Description>
                    </div>
                    <ToastPrimitive.Close>
                        <X className="w-5 h-5 text-gray-500" />
                    </ToastPrimitive.Close>
                </div>
            </ToastPrimitive.Root>

            <ToastPrimitive.Viewport className="fixed bottom-0 right-0 p-4" />
        </ToastPrimitive.Provider>
    )
}