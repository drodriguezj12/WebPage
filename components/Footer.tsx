export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-8 text-sm text-muted">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
        <span>&copy; {new Date().getFullYear()} Daniel Rodriguez. Full-Stack Developer.</span>
        <a href="#home" className="font-bold text-text hover:text-accent">
          Back to top
        </a>
      </div>
    </footer>
  );
}
