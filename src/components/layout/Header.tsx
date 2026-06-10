import Link from "next/link";
import { SearchBar } from "@/components/search/SearchBar";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-secondary/20 bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          Game<span className="text-secondary">Hive</span>
        </Link>

        <div className="flex-1 max-w-xl mx-4">
          <SearchBar />
        </div>

        <nav className="flex items-center gap-4">
          <Link
            href="/profile"
            className="text-sm font-medium text-foreground hover:text-secondary transition-colors"
          >
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
}
