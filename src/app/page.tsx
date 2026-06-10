import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-primary">GameHive</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Discover, track, and manage your games across IGDB, Steam, and IsThereAnyDeal
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-16">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for games..."
              className="pl-12 pr-4 py-6 text-lg"
            />
            <Button className="absolute right-2 top-1/2 -translate-y-1/2" variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Button asChild variant="outline" size="lg">
              <Link href="/search">Search Games</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/deals">Current Deals</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/free">Free Games</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/upcoming">Upcoming</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Popular Games */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Popular Games</CardTitle>
              <CardDescription>Top rated games across all platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Discover the most popular games based on ratings and reviews
              </p>
              <Button asChild variant="link" className="mt-4">
                <Link href="/games/popular">View All</Link>
              </Button>
            </CardContent>
          </Card>

          {/* New Releases */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>New Releases</CardTitle>
              <CardDescription>Recently released games</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Check out the latest game releases from the past 30 days
              </p>
              <Button asChild variant="link" className="mt-4">
                <Link href="/games/new">View All</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Games */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Upcoming Games</CardTitle>
              <CardDescription>Games coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                See what games are scheduled for release soon
              </p>
              <Button asChild variant="link" className="mt-4">
                <Link href="/upcoming">View All</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Free Games */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Free Games</CardTitle>
              <CardDescription>Free to play games</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Browse games that are free to play right now
              </p>
              <Button asChild variant="link" className="mt-4">
                <Link href="/free">View All</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* API Status Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">API Integration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>IGDB</CardTitle>
              <CardDescription>Internet Game Database</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Comprehensive game metadata, covers, screenshots, and more
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>IsThereAnyDeal</CardTitle>
              <CardDescription>Price Tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Real-time price tracking, historical data, and deal notifications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Steam</CardTitle>
              <CardDescription>Steam Web API</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Game details, player counts, reviews, and achievements
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} GameHive. All rights reserved.</p>
          <p className="mt-2">
            Built with Next.js 16, Tailwind CSS v4, Supabase, and ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
