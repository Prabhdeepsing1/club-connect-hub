import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const Join = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you soon.",
      });
    }, 1000);
  };

  const benefits = [
    "Access to mentorship from experienced developers",
    "Hands-on experience with real open source projects",
    "Networking opportunities with industry professionals",
    "Participation in workshops and hackathons",
    "Certificate of participation and contribution badges",
    "Priority access to community resources and events",
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[80vh] items-center justify-center py-12">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
              <CardTitle>Application Submitted!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                Thank you for your interest in joining VOSC! We've received your application and
                will review it shortly.
              </p>
              <p className="text-sm text-muted-foreground">
                You should receive a confirmation email at the address you provided. We'll get back
                to you within 3-5 business days.
              </p>
              <div className="pt-4">
                <Button onClick={() => (window.location.href = "/")} className="w-full">
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Join Our Community
            </h1>
            <p className="text-lg text-muted-foreground">
              Start your open source journey with VOSC today
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-5">
            {/* Benefits Sidebar */}
            <div className="lg:col-span-2">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Membership Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                        <span className="text-sm text-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Application Form</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" placeholder="John" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" placeholder="Doe" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@vce.ac.in"
                        required
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch *</Label>
                        <Input id="branch" placeholder="Computer Science" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">Year of Study *</Label>
                        <Input id="year" placeholder="2nd Year" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub Username</Label>
                      <Input id="github" placeholder="johndoe" />
                      <p className="text-xs text-muted-foreground">
                        Optional, but recommended for tracking contributions
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">
                        Programming Experience & Skills *
                      </Label>
                      <Textarea
                        id="experience"
                        rows={4}
                        placeholder="Tell us about your programming experience, languages you know, projects you've worked on, etc."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interests">Areas of Interest *</Label>
                      <Textarea
                        id="interests"
                        rows={3}
                        placeholder="Web development, mobile apps, DevOps, machine learning, etc."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="motivation">Why do you want to join VOSC? *</Label>
                      <Textarea
                        id="motivation"
                        rows={4}
                        placeholder="Share your motivation for joining our community and what you hope to achieve..."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contribution">
                        Have you contributed to open source before?
                      </Label>
                      <Textarea
                        id="contribution"
                        rows={3}
                        placeholder="If yes, tell us about your contributions. If no, that's perfectly fine!"
                      />
                    </div>

                    <div className="rounded-lg border border-border bg-muted/50 p-4">
                      <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> After submitting, you'll receive a confirmation
                        email. Our team will review your application and contact you within 3-5
                        business days. We welcome students of all experience levels!
                      </p>
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Submit Application
                    </Button>
                  </form>
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

export default Join;
