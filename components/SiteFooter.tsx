import { profile } from "@/data/profile";
import { GITHUB_URL, LINKEDIN_URL } from "@/lib/site";

const LINK =
  "focus-ring text-[0.8125rem] text-muted transition-colors duration-300 ease-fluid hover:text-fg";

export function SiteFooter() {
  return (
    <footer className="px-5 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4">
        <p className="text-[0.8125rem] text-muted">
          © {new Date().getFullYear()} {profile.name}. {profile.location}.
        </p>
        <div className="flex gap-6">
          <a className={LINK} href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a className={LINK} href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a className={LINK} href="#top">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
