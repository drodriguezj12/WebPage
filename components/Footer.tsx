import { GITHUB_URL, LINKEDIN_URL } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-8 text-sm text-muted">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
        <span>&copy; {new Date().getFullYear()} Daniel Rodriguez. Full-Stack Developer.</span>
        <div className="flex items-center gap-5">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-text hover:text-accent"
          >
            GitHub
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-text hover:text-accent"
          >
            LinkedIn
          </a>
          <a href="#home" className="font-bold text-text hover:text-accent">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
