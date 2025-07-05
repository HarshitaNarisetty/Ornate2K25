
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "@/lib/motion";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import { ButtonEffect } from "./ui/button-effect";
import { useAuth } from "@/App";
import { useToast } from "@/hooks/use-toast";

interface FeaturedEventProps {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  spotsLeft: number;
}

const FeaturedEvent = ({
  id,
  title,
  description,
  date,
  time,
  location,
  image,
  category,
  spotsLeft,
}: FeaturedEventProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle registration button click
  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      // Redirect to the event registration page with a flag to show the auth dialog
      navigate(`/event/register/${id}?showAuth=true`);
    } else {
      // User is authenticated, navigate directly to registration
      navigate(`/event/register/${id}`);
    }
  };

  return (
    <section className="relative w-full overflow-hidden rounded-3xl bg-black text-white">
      {/* Background Image */}
      <div className="absolute inset-0 bg-muted-foreground/20" />
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
      <img
        src={image}
        alt={title}
        className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
      
      <div className="relative grid items-end grid-cols-1 md:grid-cols-12 gap-4 p-8 sm:p-10 md:p-12 min-h-[500px] md:min-h-[600px]">
        <div className="md:col-span-8 space-y-6">
          {/* Category Badge */}
          <span className="inline-block text-xs font-medium bg-white text-secondary px-3 py-1.5 rounded-full">
            {category}
          </span>
          
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {title}
          </motion.h2>
          
          <motion.p 
            className="text-white/80 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {description}
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-6 text-sm text-white/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              <span>{date}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              <span>{time}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-primary" />
              <span>{location}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users size={18} className="text-primary" />
              <span>{spotsLeft} spots left</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap gap-4 pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ButtonEffect 
              variant="primary"
              icon={<ArrowRight size={18} />}
              iconPosition="right"
              onClick={handleRegisterClick}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Register Now"}
            </ButtonEffect>
            
            <Link to={`/event/${id}`}>
              <ButtonEffect variant="outline" className="bg-white/10">
                View Details
              </ButtonEffect>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvent;
