
import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonEffect } from "./ui/button-effect";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  spotsLeft: number;
  isFeatured?: boolean;
  className?: string;
}

const EventCard = ({
  id,
  title,
  date,
  time,
  location,
  image,
  category,
  spotsLeft,
  isFeatured = false,
  className,
}: EventCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <article
      className={cn(
        "group relative glass-card overflow-hidden animate-fade-in",
        isFeatured ? "md:col-span-2 md:row-span-2" : "",
        className
      )}
    >
      <Link to={`/event/${id}`} className="block h-full">
        <div className="relative aspect-[16/10] overflow-hidden">
          {/* Category Badge */}
          <span className="absolute z-10 top-4 left-4 text-xs font-medium bg-white/80 text-secondary px-2.5 py-1 rounded-full backdrop-blur-sm">
            {category}
          </span>
          
          {/* Image */}
          <div className={cn(
            "absolute inset-0 bg-muted transition-opacity duration-700",
            isLoaded ? "opacity-0" : "opacity-100"
          )} />
          <img
            src={image}
            alt={title}
            className={cn(
              "h-full w-full object-cover transition-all duration-500",
              isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
              "group-hover:scale-110 transition-transform duration-700"
            )}
            onLoad={() => setIsLoaded(true)}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-5 space-y-3">
          <h3 className="font-medium text-xl leading-tight">{title}</h3>
          
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar size={16} />
              <span>{date}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Clock size={16} />
              <span>{time}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <MapPin size={16} />
              <span>{location}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <Users size={16} className="text-primary" />
              <span>{spotsLeft} spots left</span>
            </div>
            
            <ButtonEffect
              variant="outline"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              View Details
            </ButtonEffect>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default EventCard;
