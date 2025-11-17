import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";

const Events = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  // Mock data - in production, fetch from API
  const allEvents = [
    {
      id: "1",
      title: "Open Source Workshop",
      type: "Workshop",
      date: "2025-11-20",
      time: "10:00 AM - 2:00 PM",
      location: "Seminar Hall, VCE",
      description: "Learn the basics of Git, GitHub, and making your first PR to open source projects. Perfect for beginners!",
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
      title: "Hacktoberfest Kickoff",
      type: "Hackathon",
      date: "2025-12-01",
      time: "9:00 AM - 9:00 PM",
      location: "Computer Lab 1 & 2",
      description: "Annual Hacktoberfest event where you contribute to projects and compete for prizes!",
      status: "upcoming" as const,
    },
    {
      id: "4",
      title: "GSoC Preparation Workshop",
      type: "Workshop",
      date: "2025-12-10",
      time: "2:00 PM - 5:00 PM",
      location: "Online",
      description: "Everything you need to know about applying to Google Summer of Code, from proposal writing to organization selection.",
      status: "upcoming" as const,
    },
    {
      id: "5",
      title: "Docker & DevOps Basics",
      type: "Workshop",
      date: "2025-12-15",
      time: "4:00 PM - 6:00 PM",
      location: "Seminar Hall, VCE",
      description: "Introduction to containerization with Docker and basic DevOps practices for modern development.",
      status: "upcoming" as const,
    },
    {
      id: "6",
      title: "GSoC Alumni Talk",
      type: "Talk",
      date: "2025-10-15",
      time: "4:00 PM - 5:30 PM",
      location: "Auditorium",
      description: "Hear from our alumni about their Google Summer of Code experience and tips for success.",
      status: "completed" as const,
    },
    {
      id: "7",
      title: "Introduction to Open Source",
      type: "Workshop",
      date: "2025-09-20",
      time: "10:00 AM - 1:00 PM",
      location: "Computer Lab 3",
      description: "First workshop of the semester covering Git basics, GitHub workflow, and open source etiquette.",
      status: "completed" as const,
    },
  ];

  const upcomingEvents = allEvents.filter((e) => e.status === "upcoming");
  const ongoingEvents = allEvents.filter((e) => e.status === "ongoing");
  const pastEvents = allEvents.filter((e) => e.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">Events</h1>
            <p className="text-xl text-muted-foreground">
              Join our workshops, talks, and sprints to enhance your skills
            </p>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="mb-8 flex justify-center">
              <TabsList>
                <TabsTrigger value="upcoming">
                  Upcoming ({upcomingEvents.length})
                </TabsTrigger>
                <TabsTrigger value="ongoing">
                  Ongoing ({ongoingEvents.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past ({pastEvents.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="upcoming" className="mt-0">
              {upcomingEvents.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} {...event} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="ongoing" className="mt-0">
              {ongoingEvents.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {ongoingEvents.map((event) => (
                    <EventCard key={event.id} {...event} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No ongoing events right now.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-0">
              {pastEvents.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {pastEvents.map((event) => (
                    <EventCard key={event.id} {...event} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No past events to display.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
