/* eslint-disable react/jsx-props-no-spreading */
import { LayoutProps } from '@/types/layout';
import { useEffect, useRef } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import Header from './header';

function Layout({ children, ...headerProps }: LayoutProps) {
  // toogle `bg-muted` on `.header` when ref scrolled
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const { scrollTop } = ref.current;
        const header = document.querySelector('.header');
        if (header) {
          header.classList.toggle('bg-muted', scrollTop > 10);
        }
      }
    };
    const currentRef = ref.current;
    currentRef?.addEventListener('scroll', handleScroll);
    return () => {
      currentRef?.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <>
      <Header {...headerProps} />
      <ScrollArea className="flex flex-col h-full max-h-screen" ref={ref}>
        <main className="flex flex-col flex-1 p-5 mt-[56px]">{children}</main>
      </ScrollArea>
    </>
  );
}

export default Layout;
