import { GITHUB_URL, LINKEDIN_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6">
        <p className="label">© {new Date().getFullYear()} Daniel Rodriguez</p>
        <div className="flex gap-5">
          <a className="label hover:text-steel focus-visible:text-steel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-steel" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a className="label hover:text-steel focus-visible:text-steel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-steel" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a className="label hover:text-steel focus-visible:text-steel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-steel" href="#home">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
