import { profile } from "@/content/profile";

/** Footer. The year is computed at build time; rebuild yearly or on deploy. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="no-print border-t border-line">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-3 px-5 py-8 text-sm text-fog-2 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p>
          &copy; {year} {profile.name}
          <span aria-hidden="true" className="mx-2 text-line-2">
            /
          </span>
          {profile.domain}
        </p>
        <p>Designed &amp; built by {profile.name}</p>
      </div>
    </footer>
  );
}
