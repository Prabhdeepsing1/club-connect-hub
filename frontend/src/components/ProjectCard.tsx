import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

interface ProjectCardProps {
  name: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  contributors?: number;
}

const ProjectCard = ({
  name,
  description,
  techStack,
  githubUrl,
  contributors,
}: ProjectCardProps) => {
  return (
    <Card className="group h-full border-l-4 border-l-primary transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="line-clamp-1 font-mono text-lg uppercase group-hover:text-primary">{name}</span>
          <Github className="h-5 w-5 text-success" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="line-clamp-3 text-sm text-muted-foreground">{description}</p>
        <div className="flex flex-wrap gap-2">
          {techStack.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {techStack.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{techStack.length - 4}
            </Badge>
          )}
        </div>
        {contributors && (
          <p className="text-xs text-muted-foreground">
            {contributors} {contributors === 1 ? "contributor" : "contributors"}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild className="w-full">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            View Project
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
