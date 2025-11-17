import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, ArrowLeft, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const EventDetail = () => {
  const { id } = useParams();

  // Mock data - in production, fetch from API based on id
  const event = {
    id: id || "1",
    title: "Open Source Workshop",
    type: "Workshop",
    date: "2025-11-20",
    time: "10:00 AM - 2:00 PM",
    location: "Seminar Hall, VCE",
    status: "upcoming" as const,
    description: "Learn the basics of Git, GitHub, and making your first PR to open source projects. Perfect for beginners!",
    fullDescription: `This comprehensive workshop is designed for students who want to get started with open source contributions. 
    
We'll cover everything from setting up Git on your machine to making your first pull request to a real open source project. 

**What You'll Learn:**
- Understanding version control with Git
- Creating and managing GitHub repositories
- Forking projects and cloning repositories
- Making changes and committing code
- Creating and submitting pull requests
- Understanding open source etiquette and best practices
- Finding beginner-friendly projects to contribute to

**Who Should Attend:**
This workshop is perfect for beginners with basic programming knowledge. No prior experience with Git or GitHub is required.

**What to Bring:**
- Laptop with internet connection
- GitHub account (create one beforehand at github.com)
- Your favorite code editor installed`,
    speakers: [
      { name: "Rahul Sharma", role: "President, VOSC" },
      { name: "Priya Patel", role: "Vice President, VOSC" },
    ],
    capacity: 50,
    registered: 32,
    registrationLink: "https://forms.google.com/register",
  };

  const statusColors = {
    upcoming: "bg-primary/10 text-primary",
    ongoing: "bg-accent/10 text-accent",
    completed: "bg-muted text-muted-foreground",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link to="/events" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Link>
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <Badge variant="secondary">{event.type}</Badge>
                <Badge className={statusColors[event.status]}>{event.status}</Badge>
              </div>
              <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                {event.title}
              </h1>
              <p className="text-lg text-muted-foreground">{event.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-8 rounded-lg border border-border bg-card p-8">
                <h2 className="mb-4 text-2xl font-bold text-foreground">About This Event</h2>
                <div className="prose prose-slate max-w-none whitespace-pre-line text-muted-foreground">
                  {event.fullDescription}
                </div>
              </div>

              {/* Speakers */}
              <div className="rounded-lg border border-border bg-card p-8">
                <h2 className="mb-4 text-2xl font-bold text-foreground">Speakers</h2>
                <div className="space-y-4">
                  {event.speakers.map((speaker) => (
                    <div key={speaker.name} className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-lg font-semibold text-primary-foreground">
                        {speaker.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{speaker.name}</div>
                        <div className="text-sm text-muted-foreground">{speaker.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event Info Card */}
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold text-foreground">Event Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm font-medium text-foreground">Date</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(event.date), "PPPP")}
                      </div>
                    </div>
                  </div>

                  {event.time && (
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm font-medium text-foreground">Time</div>
                        <div className="text-sm text-muted-foreground">{event.time}</div>
                      </div>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm font-medium text-foreground">Location</div>
                        <div className="text-sm text-muted-foreground">{event.location}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Users className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm font-medium text-foreground">Capacity</div>
                      <div className="text-sm text-muted-foreground">
                        {event.registered} / {event.capacity} registered
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration CTA */}
              {event.status === "upcoming" && (
                <div className="rounded-lg border border-border bg-card p-6">
                  <h3 className="mb-4 font-semibold text-foreground">Register Now</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Don't miss this opportunity to learn and grow with the community!
                  </p>
                  <Button className="w-full" asChild>
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      Register for Event
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <p className="mt-3 text-xs text-center text-muted-foreground">
                    {event.capacity - event.registered} spots remaining
                  </p>
                </div>
              )}

              {/* Share */}
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold text-foreground">Share This Event</h3>
                <p className="text-sm text-muted-foreground">
                  Invite your friends and classmates to join this event!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventDetail;
