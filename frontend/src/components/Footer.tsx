import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <span className="text-xl font-bold text-primary-foreground">OS</span>
              </div>
              <span className="font-semibold text-foreground">VOSC</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Building the next generation of open source contributors at VCE.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">
                About Us
              </Link>
              <Link to="/events" className="text-sm text-muted-foreground hover:text-primary">
                Events
              </Link>
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary">
                Dashboard
              </Link>
              <Link to="/pr-assistant" className="text-sm text-muted-foreground hover:text-primary">
                PR Assistant
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Resources</h3>
            <nav className="flex flex-col space-y-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                GitHub Guide
              </a>
              <a
                href="https://opensource.guide"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Open Source Guide
              </a>
              <Link to="/join" className="text-sm text-muted-foreground hover:text-primary">
                Join Community
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:vosc@vce.ac.in" className="hover:text-primary">
                  vosc@vce.ac.in
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Vasavi College of Engineering</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <a
                href="https://github.com/vosc-vce"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} VOSC - VCE Open Source Community. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
