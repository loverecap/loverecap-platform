import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@loverecap/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-[#FF4D6D] text-white shadow-sm hover:bg-[#FF2E63] active:scale-[0.98]',
        secondary:
          'bg-white text-[#1F2937] border border-neutral-200 shadow-sm hover:bg-neutral-50 active:scale-[0.98]',
        ghost: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
        outline:
          'border border-[#FF4D6D] text-[#FF4D6D] bg-transparent hover:bg-[#FFF0F3] active:scale-[0.98]',
        destructive: 'bg-red-500 text-white shadow-sm hover:bg-red-600 active:scale-[0.98]',
        link: 'text-[#FF4D6D] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-md',
        default: 'h-10 px-5',
        lg: 'h-12 px-8 text-base rounded-xl',
        xl: 'h-14 px-10 text-base rounded-xl',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
