import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Github } from "lucide-react";

interface TeamCardProps {
  name: string;
  role: string;
  github?: string;
  photo?: string;
  bio?: string;
  expertise?: string[];
}

const TeamCard = ({ name, role, github, photo, bio, expertise }: TeamCardProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="group h-full transition-all hover:shadow-md">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="mb-4 h-24 w-24">
            <AvatarImage src={photo} alt={name} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-success text-lg font-semibold text-background">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-mono font-semibold uppercase text-primary">{name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{role}</p>
          {github && (
            <a
              href={`https://github.com/${github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-1 text-sm text-success hover:underline"
            >
              <Github className="h-4 w-4" />
              @{github}
            </a>
          )}
          {bio && <p className="mt-3 text-sm text-muted-foreground">{bio}</p>}
          {expertise && expertise.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {expertise.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
