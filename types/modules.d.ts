// Type declarations for modules without TypeScript support

declare module 'jcof' {
  export function parse(data: string): unknown
  export function stringify(data: unknown): string
}

declare module 'toastify-js' {
  interface ToastifyOptions {
    text?: string
    duration?: number
    destination?: string
    newWindow?: boolean
    close?: boolean
    gravity?: 'top' | 'bottom'
    position?: 'left' | 'center' | 'right'
    backgroundColor?: string
    stopOnFocus?: boolean
    className?: string
    onClick?: () => void
    style?: {
      background?: string
      color?: string
      borderRadius?: string
      [key: string]: string | undefined
    }
  }

  interface Toastify {
    showToast(): void
  }

  function Toastify(options: ToastifyOptions): Toastify
  export default Toastify
}

declare module '@react-input/mask' {
  import { ComponentProps } from 'react'

  interface MaskInputProps extends ComponentProps<'input'> {
    mask?: string
    replacement?: { [key: string]: RegExp }
    showMask?: boolean
    separate?: boolean
  }

  export function InputMask(props: MaskInputProps): JSX.Element
  export function Mask(props: MaskInputProps): JSX.Element
  export function useMask(): {
    value: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  }
  export function format(value: string, mask: string): string
  export function formatToParts(value: string, mask: string): string[]
  export function generatePattern(mask: string): RegExp
  export function unformat(value: string, mask: string): string
}
