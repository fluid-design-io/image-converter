import React, { useEffect, useRef } from 'react';
import { Card, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';

function ScrollCard({
  title,
  children,
  footer,
  className,
  scrollAreaClassName,
  footerClassName,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  scrollAreaClassName?: string;
  footerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  // add `border-b` to the card-header class when scrolled
  useEffect(() => {
    const scrollArea = ref.current;
    const header = headerRef.current;
    if (!scrollArea || !header) return;
    const onScroll = () => {
      if (scrollArea.scrollTop > 0) {
        header?.classList.add('border-border');
        header?.classList.remove('border-transparent');
      } else {
        header?.classList.add('border-transparent');
        header?.classList.remove('border-border');
      }
    };
    scrollArea.addEventListener('scroll', onScroll);
    // eslint-disable-next-line consistent-return
    return () => {
      scrollArea.removeEventListener('scroll', onScroll);
    };
  }, []);
  return (
    <Card className={className}>
      <CardHeader
        className="border-b border-transparent transition-colors text-sm"
        ref={headerRef}
      >
        <CardTitle className="text-foreground/75">{title}</CardTitle>
      </CardHeader>
      <ScrollArea className={scrollAreaClassName} ref={ref}>
        {children}
      </ScrollArea>
      {footer && <CardFooter className={footerClassName}>{footer}</CardFooter>}
    </Card>
  );
}

export default ScrollCard;
