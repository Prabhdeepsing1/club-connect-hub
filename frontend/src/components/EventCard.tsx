import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

interface EventCardProps {
  id: string;
  title: string;
  type: string;
  date: string;
  time?: string;
  location?: string;
  description: string;
  status?: "upcoming" | "ongoing" | "completed";
}

const EventCard = ({
  id,
  title,
  type,
  date,
  time,
  location,
  description,
  status = "upcoming",
}: EventCardProps) => {
  const statusColors = {
    upcoming: "bg-success/20 text-success border-success/30",
    ongoing: "bg-accent/20 text-accent border-accent/30",
    completed: "bg-muted/20 text-muted-foreground border-border",
  };

  return (
    <Card className="group h-full border-l-4 border-l-primary transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <Badge variant="secondary" className="mb-2">
            {type}
          </Badge>
          <Badge className={statusColors[status]}>{status}</Badge>
        </div>
        <CardTitle className="line-clamp-2 font-mono text-lg uppercase group-hover:text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
        <div className="space-y-2">
          {date && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              {format(new Date(date), "PPP")}
            </div>
          )}
          {time && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              {time}
            </div>
          )}
          {location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4" />
              {location}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild className="w-full">
          <Link to={`/events/${id}`}>Learn More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
