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
      <DialogPrimitive.Trigger className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary">
        {triggerText}
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-surface p-6 rounded shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <DialogPrimitive.Title className="text-lg font-bold">{title}</DialogPrimitive.Title>
            <DialogPrimitive.Close>
              <X className="w-5 h-5" />
            </DialogPrimitive.Close>
          </div>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
