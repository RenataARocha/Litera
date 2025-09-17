"use client"

import * as ToastPrimitive from "@radix-ui/react-toast"
import { useState } from "react"

export function ToastDemo() {
  const [open, setOpen] = useState(false)

  return (
    <ToastPrimitive.Provider>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-success text-white rounded hover:bg-green-600"
      >
        Mostrar Toast
      </button>

      <ToastPrimitive.Root
        open={open}
        onOpenChange={setOpen}
        className="fixed bottom-4 right-4 bg-surface border border-gray-200 shadow-lg rounded p-4"
      >
        <ToastPrimitive.Title className="font-bold">Sucesso!</ToastPrimitive.Title>
        <ToastPrimitive.Description>
          O livro foi adicionado à biblioteca.
        </ToastPrimitive.Description>
      </ToastPrimitive.Root>

      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  )
}
