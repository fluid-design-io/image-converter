function KBD({ children }: { children: string }) {
  return (
    <kbd className="pointer-events-none bg-muted/5 rounded justify-center flex select-none items-center px-1.5 font-mono font-bold opacity-100">
      {children}
    </kbd>
  );
}

export default KBD;
