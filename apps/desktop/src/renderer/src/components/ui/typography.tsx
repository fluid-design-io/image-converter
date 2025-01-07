import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import React from 'react';

const textVariantBase = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  gradient:
    'bg-clip-text text-transparent bg-gradient-to-br from-zinc-950/70 to-black/95 dark:from-white dark:to-white/65',
};

const textVariants = cva('', {
  variants: {
    size: {
      default: 'text-base/6 sm:text-sm/6',
      xs: 'text-[0.8rem] sm:text-[0.75rem]',
      sm: 'text-sm',
      lg: 'text-lg',
      xl: 'text-lg lg:text-xl',
      '2xl': 'text-2xl lg:text-3xl',
      '3xl': 'text-2xl lg:text-4xl',
    },
    variant: {
      ...textVariantBase,
      'inline-code':
        'relative rounded px-[0.3rem] py-[0.2rem] font-mono font-semibold',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  asChild?: boolean;
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'p';
    return (
      <Comp
        className={cn(textVariants({ variant, size, className }))}
        ref={ref}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    );
  },
);

export interface TextLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof textVariants> {
  asChild?: boolean;
}

const headingVariants = cva('scroll-m-20', {
  variants: {
    type: {
      h1: 'text-base font-semibold tracking-tight',
      h2: 'border-b pb-2 text-3xl font-medium tracking-tight first:mt-0',
      h3: 'text-2xl font-medium tracking-tight',
      h4: 'text-xl font-medium tracking-tight',
    },
    variant: {
      ...textVariantBase,
    },
  },
  defaultVariants: {
    type: 'h1',
    variant: 'default',
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  asChild?: boolean;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, type, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : type ?? 'h1';
    return (
      <Comp
        className={cn(headingVariants({ variant, type, className }))}
        ref={ref}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    );
  },
);

export { Heading, Text };
