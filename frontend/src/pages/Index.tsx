import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Users, Rocket, Github, TrendingUp, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import ProjectCard from "@/components/ProjectCard";
import osClubLogo from "@/assets/os-club-logo.png";

const Index = () => {
  // Mock data - in production, fetch from API
  const upcomingEvents = [
    {
      id: "1",
      title: "Open Source Workshop",
      type: "Workshop",
      date: "2025-11-20",
      time: "10:00 AM - 2:00 PM",
      location: "Seminar Hall, VCE",
      description: "Learn the basics of Git, GitHub, and making your first PR to open source projects.",
      status: "upcoming" as const,
    },
    {
      id: "2",
      title: "PR Sprint Challenge",
      type: "PR Sprint",
      date: "2025-11-28",
      time: "3:00 PM - 6:00 PM",
      location: "Online",
      description: "Join our month-long challenge to contribute to open source. Fix issues, open PRs, and earn badges!",
      status: "ongoing" as const,
    },
    {
      id: "3",
      title: "GSoC Alumni Talk",
      type: "Talk",
      date: "2025-10-15",
      time: "4:00 PM - 5:30 PM",
      location: "Auditorium",
      description: "Hear from our alumni about their Google Summer of Code experience and tips for success.",
      status: "completed" as const,
    },
  ];

  const featuredProjects = [
    {
      name: "VOSC Website",
      description: "Our community website built with React, TypeScript, and modern web technologies. Open for contributions!",
      techStack: ["React", "TypeScript", "Tailwind CSS", "Vite"],
      githubUrl: "https://github.com/vosc-vce/website",
      contributors: 8,
    },
    {
      name: "PR Quality Assistant",
      description: "AI-powered tool to analyze and improve your pull requests before submission. Helps ensure better code quality.",
      techStack: ["Python", "FastAPI", "OpenAI", "Docker"],
      githubUrl: "https://github.com/vosc-vce/pr-assistant",
      contributors: 5,
    },
    {
      name: "Event Tracker",
      description: "Track community events, participation, and contributions. Built for managing hackathons and workshops.",
      techStack: ["Next.js", "PostgreSQL", "Prisma", "tRPC"],
      githubUrl: "https://github.com/vosc-vce/event-tracker",
      contributors: 6,
    },
  ];

  const stats = [
    { icon: Users, label: "Active Members", value: "150+" },
    { icon: Code, label: "PRs Merged", value: "500+" },
    { icon: Rocket, label: "Projects", value: "25+" },
    { icon: Award, label: "Events Hosted", value: "40+" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <img 
                src={osClubLogo} 
                alt="Open Source Community Logo" 
                className="h-32 w-32 md:h-48 md:w-48 animate-pulse"
              />
            </div>
            
            <h1 className="mb-6 font-mono text-4xl font-bold uppercase tracking-tight text-primary md:text-6xl lg:text-7xl">
              Open Source Community
              <span className="block text-foreground">
                @ VCE
              </span>
            </h1>
            <p className="mb-4 font-mono text-xl font-semibold uppercase text-success md:text-2xl">
              Collaborate. Contribute. Grow.
            </p>
            <p className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground md:text-lg" style={{ lineHeight: 1.6 }}>
              Join Vasavi College of Engineering's premier open source community. Learn, build, and contribute to real-world projects while connecting with fellow developers.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link to="/join" className="flex items-center gap-2">
                  Join Community
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/events">View Events</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a
                  href="https://github.com/vosc-vce"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="h-5 w-5" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <div className="mb-2 flex justify-center">
                  <Icon className="h-8 w-8 text-accent" />
                </div>
                <div className="font-mono text-3xl font-bold text-primary">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 font-mono text-3xl font-bold uppercase text-primary md:text-4xl">
              About Our Community
            </h2>
            <p className="mb-8 text-base text-muted-foreground md:text-lg" style={{ lineHeight: 1.6 }}>
              VOSC is a student-driven community passionate about open source software development. We organize workshops, hackathons, and mentorship programs to help students contribute to real-world projects, learn industry-standard tools, and build their portfolios. Whether you're a beginner or an experienced developer, there's a place for you here.
            </p>
            <Button variant="outline" asChild>
              <Link to="/about" className="flex items-center gap-2">
                Read More About Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="border-y border-border py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-mono text-3xl font-bold uppercase text-primary md:text-4xl">
              Upcoming Events
            </h2>
            <p className="text-base text-muted-foreground md:text-lg">
              Join our workshops, talks, and sprints to level up your skills
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild>
              <Link to="/events" className="flex items-center gap-2">
                View All Events
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Project Showcase */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-mono text-3xl font-bold uppercase text-primary md:text-4xl">
              Featured Projects
            </h2>
            <p className="text-base text-muted-foreground md:text-lg">
              Explore projects built by our community members
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.name} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="border-t border-border py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-lg border border-border bg-card p-8 text-center md:p-12">
            <TrendingUp className="mx-auto mb-6 h-12 w-12 text-success" />
            <h2 className="mb-4 font-mono text-3xl font-bold uppercase text-primary md:text-4xl">
              Ready to Contribute?
            </h2>
            <p className="mb-8 text-base text-muted-foreground md:text-lg" style={{ lineHeight: 1.6 }}>
              Join VOSC today and start your open source journey. Connect with mentors, work on real projects, and make an impact in the tech community.
            </p>
            <Button size="lg" asChild>
              <Link to="/join">Join Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
