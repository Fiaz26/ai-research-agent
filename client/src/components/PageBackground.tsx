export function PageBackground() {
  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/10 pointer-events-none" />
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px] pointer-events-none" />
    </>
  );
}
