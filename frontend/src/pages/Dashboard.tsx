import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitPullRequest, GitMerge, GitBranch, AlertCircle, TrendingUp, Award, Lock, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Check localStorage for authentication state on mount
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "alex@vce.ac.in",
    github: "alexjohnson",
    branch: "Computer Science",
    year: "3rd Year",
    interests: ["React", "Python", "DevOps"],
  };

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    // Basic validation
    if (!email || !password) {
      setLoginError("Please enter both email and password");
      return;
    }

    // Basic email validation
    if (!email.includes("@")) {
      setLoginError("Please enter a valid email address");
      return;
    }

    // For demo purposes, accept any email/password combination
    // In production, this would make an API call
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    setIsLoginDialogOpen(false);
    setEmail("");
    setPassword("");
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  // Mock stats data - calculated from PRs
  const allPRs = [
    {
      id: 1,
      title: "Add dark mode support",
      repo: "vosc-vce/website",
      status: "merged",
      createdAt: "2025-11-10",
      reviews: 2,
    },
    {
      id: 2,
      title: "Fix responsive layout on mobile",
      repo: "vosc-vce/event-tracker",
      status: "open",
      createdAt: "2025-11-12",
      reviews: 1,
    },
    {
      id: 3,
      title: "Update documentation",
      repo: "vosc-vce/pr-assistant",
      status: "merged",
      createdAt: "2025-11-08",
      reviews: 3,
    },
    {
      id: 4,
      title: "Implement user authentication",
      repo: "vosc-vce/website",
      status: "merged",
      createdAt: "2025-11-05",
      reviews: 4,
    },
    {
      id: 5,
      title: "Add unit tests for API endpoints",
      repo: "vosc-vce/backend",
      status: "open",
      createdAt: "2025-11-15",
      reviews: 0,
    },
    {
      id: 6,
      title: "Refactor component structure",
      repo: "vosc-vce/website",
      status: "closed",
      createdAt: "2025-10-28",
      reviews: 2,
    },
    {
      id: 7,
      title: "Fix bug in event registration",
      repo: "vosc-vce/event-tracker",
      status: "merged",
      createdAt: "2025-11-01",
      reviews: 1,
    },
    {
      id: 8,
      title: "Update dependencies",
      repo: "vosc-vce/pr-assistant",
      status: "closed",
      createdAt: "2025-10-20",
      reviews: 1,
    },
    {
      id: 9,
      title: "Add error handling",
      repo: "vosc-vce/backend",
      status: "open",
      createdAt: "2025-11-14",
      reviews: 1,
    },
    {
      id: 10,
      title: "Improve accessibility",
      repo: "vosc-vce/website",
      status: "merged",
      createdAt: "2025-11-03",
      reviews: 3,
    },
  ];

  const mergedPRs = allPRs.filter(pr => pr.status === "merged");
  const openPRs = allPRs.filter(pr => pr.status === "open");
  const closedPRs = allPRs.filter(pr => pr.status === "closed");

  const stats = {
    totalPRs: allPRs.length,
    mergedPRs: mergedPRs.length,
    openPRs: openPRs.length,
    closedPRs: closedPRs.length,
    issuesOpened: 15,
    thisMonth: 12,
    lastMonth: 8,
    trend: "+50%",
  };

  // Mock contributions data - use allPRs for the dashboard
  const recentContributions = allPRs;

  // Mock events data
  const activeEvents = [
    {
      id: 1,
      name: "PR Sprint Challenge",
      score: 15,
      rank: 12,
      endDate: "2025-11-30",
    },
  ];

  const announcements = [
    {
      id: 1,
      title: "New Workshop: Docker & DevOps",
      date: "2025-11-14",
      priority: "high",
      excerpt: "Join us for an intro to containerization this Friday...",
    },
    {
      id: 2,
      title: "Monthly Leaderboard Updated",
      date: "2025-11-12",
      priority: "normal",
      excerpt: "Check out the top contributors for this month!",
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[80vh] items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center">
                <Lock className="h-12 w-12 text-muted-foreground" />
              </div>
              <CardTitle>Member Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                This page is only accessible to registered VOSC members.
              </p>
              <p className="text-sm text-muted-foreground">
                Please log in with your member credentials to access your dashboard.
              </p>
              <div className="pt-4">
                <Button className="w-full" onClick={() => setIsLoginDialogOpen(true)}>Login</Button>
                <p className="mt-3 text-sm text-muted-foreground">
                  Not a member yet?{" "}
                  <Link to="/join" className="text-primary hover:underline">
                    Join our community
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />

        {/* Login Dialog */}
        <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Login to Dashboard</DialogTitle>
              <DialogDescription>
                Enter your email and password to access your member dashboard.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@vce.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {loginError && (
                <p className="text-sm text-destructive">{loginError}</p>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsLoginDialogOpen(false);
                    setEmail("");
                    setPassword("");
                    setLoginError("");
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Login</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Welcome Header */}
      <section className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-foreground">
                Welcome back, {user.name}!
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your contributions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`https://github.com/${user.github}.png`} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-lg font-semibold text-primary-foreground">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total PRs</CardTitle>
                <GitPullRequest className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPRs}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-accent">+{stats.thisMonth}</span> this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Merged PRs</CardTitle>
                <GitMerge className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.mergedPRs}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.mergedPRs / stats.totalPRs) * 100)}% success rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open PRs</CardTitle>
                <GitBranch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.openPRs}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Closed PRs</CardTitle>
                <X className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.closedPRs}</div>
                <p className="text-xs text-muted-foreground">Not merged</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Pull Requests */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Pull Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentContributions.map((pr) => (
                      <div
                        key={pr.id}
                        className="flex flex-col gap-2 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{pr.title}</h4>
                          <div className="mt-1 flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">Repository:</p>
                            <Badge variant="outline" className="text-xs">
                              {pr.repo}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              pr.status === "merged"
                                ? "default"
                                : pr.status === "open"
                                ? "secondary"
                                : "destructive"
                            }
                            className="capitalize"
                          >
                            {pr.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {pr.reviews} reviews
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-4 w-full">
                    View All Contributions
                  </Button>
                </CardContent>
              </Card>

              {/* Announcements */}
              <Card>
                <CardHeader>
                  <CardTitle>Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-foreground">{announcement.title}</h4>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {announcement.excerpt}
                            </p>
                          </div>
                          {announcement.priority === "high" && (
                            <Badge variant="destructive">High</Badge>
                          )}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{announcement.date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">GitHub</p>
                    <p className="font-medium text-foreground">@{user.github}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Branch & Year</p>
                    <p className="font-medium text-foreground">
                      {user.branch}, {user.year}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {user.interests.map((interest) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Active Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Active Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeEvents.map((event) => (
                    <div key={event.id} className="rounded-lg border border-border p-4">
                      <h4 className="mb-2 font-medium text-foreground">{event.name}</h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">
                          Score: <span className="font-semibold text-foreground">{event.score}</span>
                        </p>
                        <p className="text-muted-foreground">
                          Rank: <span className="font-semibold text-foreground">#{event.rank}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">Ends: {event.endDate}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="mt-4 w-full" asChild>
                    <Link to="/events">View All Events</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/pr-assistant">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      PR Quality Assistant
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/events">
                      <Award className="mr-2 h-4 w-4" />
                      Join Next Event
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
