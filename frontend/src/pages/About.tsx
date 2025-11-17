import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Eye, Heart, Users, BookOpen, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamCard from "@/components/TeamCard";

const About = () => {
  const coreValues = [
    {
      icon: BookOpen,
      title: "Learning First",
      description: "We prioritize continuous learning and knowledge sharing within our community.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Working together to build amazing projects and support each other's growth.",
    },
    {
      icon: Heart,
      title: "Open Source Spirit",
      description: "Embracing the values of transparency, contribution, and giving back to the community.",
    },
  ];

  const activities = [
    {
      icon: BookOpen,
      title: "Open Source Advocacy",
      description: "Promoting open source culture and helping students understand its impact and opportunities.",
    },
    {
      icon: Users,
      title: "Mentorship Programs",
      description: "Connecting beginners with experienced developers for guided learning and project contributions.",
    },
    {
      icon: Calendar,
      title: "Event Organization",
      description: "Hosting workshops, hackathons, and talks to enhance technical skills and community engagement.",
    },
  ];

  const teamMembers = [
    {
      name: "Rahul Sharma",
      role: "President",
      github: "rahulsharma",
      bio: "Full-stack developer passionate about building tools that help others contribute to open source.",
      expertise: ["React", "Node.js", "Python"],
    },
    {
      name: "Priya Patel",
      role: "Vice President",
      github: "priyapatel",
      bio: "Open source enthusiast with multiple GSoC contributions. Loves mentoring new contributors.",
      expertise: ["Java", "Kubernetes", "DevOps"],
    },
    {
      name: "Arjun Kumar",
      role: "Technical Lead",
      github: "arjunkumar",
      bio: "Systems programmer focused on low-level optimization and cloud infrastructure.",
      expertise: ["Rust", "Go", "AWS"],
    },
    {
      name: "Sneha Reddy",
      role: "Event Coordinator",
      github: "snehareddy",
      bio: "Community builder who loves organizing events and bringing developers together.",
      expertise: ["JavaScript", "React", "UI/UX"],
    },
  ];

  const facultyMentors = [
    {
      name: "Dr. Suresh Kumar",
      role: "Faculty Advisor",
      bio: "Professor, Department of Computer Science & Engineering",
    },
    {
      name: "Dr. Lakshmi Narayanan",
      role: "Faculty Mentor",
      bio: "Associate Professor, Department of Information Technology",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
              About Our Community
            </h1>
            <p className="text-xl text-muted-foreground">
              Building the next generation of open source contributors at VCE
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Who We Are</h2>
            </div>

            <div className="mb-12 space-y-8">
              <div className="rounded-lg border border-border bg-card p-8">
                <div className="mb-4 flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold text-foreground">Our Mission</h3>
                </div>
                <p className="text-muted-foreground">
                  To empower students at Vasavi College of Engineering to become active contributors to the global open source community by providing mentorship, resources, and hands-on experience with real-world projects.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-8">
                <div className="mb-4 flex items-center gap-3">
                  <Eye className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold text-foreground">Our Vision</h3>
                </div>
                <p className="text-muted-foreground">
                  To create a thriving ecosystem where every student has the opportunity to learn, contribute, and grow in the open source world, ultimately becoming leaders who give back to the community.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-8">
                <h3 className="mb-4 text-xl font-semibold text-foreground">Our Story</h3>
                <p className="text-muted-foreground">
                  Founded in 2020 by a group of passionate students, VOSC started as a small study group focused on learning Git and GitHub. Today, we've grown into a vibrant community of 150+ members who have contributed to hundreds of open source projects, participated in major programs like Google Summer of Code, and organized numerous workshops and hackathons.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {coreValues.map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-lg border border-border bg-card p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <Icon className="h-10 w-10 text-primary" />
                  </div>
                  <h4 className="mb-2 font-semibold text-foreground">{title}</h4>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="border-y border-border bg-muted/20 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">What We Do</h2>
              <p className="text-lg text-muted-foreground">
                Our activities and initiatives to support open source learning
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {activities.map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-lg border border-border bg-card p-6">
                  <Icon className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">How We Work</h2>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-8">
                <h3 className="mb-4 text-xl font-semibold text-foreground">Membership Process</h3>
                <ol className="space-y-3 text-muted-foreground">
                  <li>1. Fill out the application form with your interests and experience level</li>
                  <li>2. Attend an orientation session to learn about the community</li>
                  <li>3. Complete a small onboarding task to get familiar with our workflow</li>
                  <li>4. Join our communication channels and start participating!</li>
                </ol>
              </div>

              <div className="rounded-lg border border-border bg-card p-8">
                <h3 className="mb-4 text-xl font-semibold text-foreground">Contribution Tracking</h3>
                <p className="text-muted-foreground">
                  We track all member contributions through our dashboard, including pull requests, event participation, and mentorship activities. This helps us recognize outstanding contributors and provides valuable data for your resume and portfolio.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-8">
                <h3 className="mb-4 text-xl font-semibold text-foreground">Code of Conduct</h3>
                <p className="text-muted-foreground">
                  We maintain a respectful, inclusive environment where everyone can learn and grow. Harassment, discrimination, or any form of disrespectful behavior is not tolerated. We follow industry-standard guidelines for professional conduct and expect all members to do the same.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="border-t border-border bg-muted/20 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground">
              The passionate individuals leading our community
            </p>
          </div>

          <div className="mb-16">
            <h3 className="mb-6 text-center text-xl font-semibold text-foreground">Core Team</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member) => (
                <TeamCard key={member.name} {...member} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-center text-xl font-semibold text-foreground">Faculty Mentors</h3>
            <div className="mx-auto grid max-w-2xl gap-6 md:grid-cols-2">
              {facultyMentors.map((mentor) => (
                <TeamCard key={mentor.name} {...mentor} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Join Our Community
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Become part of a thriving community of developers and start your open source journey today.
            </p>
            <Button size="lg" asChild>
              <Link to="/join" className="flex items-center gap-2">
                Apply Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
