
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import NavigationMenu from "@/components/NavigationMenu";
import { ButtonEffect } from "@/components/ui/button-effect";
import { Calendar, Clock, MapPin, Users, Share2, Heart, ChevronLeft, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthDialog } from "@/components/AuthDialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/App";

// Mock event data
const eventDetails = {
  id: "1",
  title: "Tech Innovation 2025",
  description: `
    <p>Join us for the most anticipated tech event of the year, where innovation meets opportunity. The Tech Innovation Summit brings together industry leaders, experts, and enthusiasts for a day full of insights, networking, and learning.</p>
    <p>Throughout the day, you'll have the chance to:</p>
    <ul>
      <li>Attend keynote speeches from tech industry leaders</li>
      <li>Participate in hands-on workshops on cutting-edge technologies</li>
      <li>Network with peers and potential collaborators</li>
      <li>Explore the latest products and services in our exhibition area</li>
    </ul>
    <p>Whether you're a seasoned professional, a tech entrepreneur, or simply curious about the future of technology, this event offers valuable insights and connections for everyone.</p>
  `,
  date: "February 27, 2025",
  time: "9:00 AM - 6:00 PM",
  location: "TechZeon Campus, Building A",
  address: "123 Innovation Street, Silicon Valley, CA 94043",
  image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2070",
  category: "Conference",
  spotsLeft: 45,
  price: "Free",
  organizer: "TechZeon Inc.",
  speakers: [
    {
      name: "Jane Smith",
      role: "CTO, Future Technologies",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1887",
      topic: "The Future of AI in Everyday Technology"
    },
    {
      name: "Michael Chen",
      role: "Founder, InnovateTech",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1887",
      topic: "Building Sustainable Tech Ecosystems"
    },
    {
      name: "Sarah Johnson",
      role: "Lead Researcher, Tech Research Institute",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=1961",
      topic: "Emerging Trends in Quantum Computing"
    }
  ],
  schedule: [
    { time: "9:00 AM - 9:30 AM", title: "Registration & Breakfast" },
    { time: "9:30 AM - 10:30 AM", title: "Opening Keynote: The Future of Technology", speaker: "Jane Smith" },
    { time: "10:45 AM - 11:45 AM", title: "Panel Discussion: Sustainable Tech", speaker: "Michael Chen & Guests" },
    { time: "12:00 PM - 1:00 PM", title: "Lunch Break & Networking" },
    { time: "1:15 PM - 2:15 PM", title: "Workshop: Hands-on AI Applications", speaker: "Sarah Johnson" },
    { time: "2:30 PM - 3:30 PM", title: "Quantum Computing: Practical Applications", speaker: "Sarah Johnson" },
    { time: "3:45 PM - 4:45 PM", title: "Startup Showcase & Pitches" },
    { time: "5:00 PM - 6:00 PM", title: "Closing Keynote & Awards Ceremony", speaker: "Michael Chen" }
  ]
};

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState<typeof eventDetails | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to fetch event details
    setIsLoading(true);
    setTimeout(() => {
      // For demo, always return eventDetails but with the id from the URL
      const mockEvent = { ...eventDetails, id: id || "1" };
      setEvent(mockEvent);
      setIsLoading(false);
    }, 500);

    // Scroll to top when navigating to this page
    window.scrollTo(0, 0);
  }, [id]);

  const handleRegister = () => {
    if (isAuthenticated) {
      navigate(`/event/register/${id}`);
    } else {
      setAuthOpen(true);
    }
  };

  const handleShare = () => {
    // In a real app, would use the Web Share API if available
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this event with others."
    });
  };

  const handleFavorite = () => {
    toast({
      title: "Added to favorites",
      description: "This event has been added to your favorites."
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavigationMenu />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse space-y-8 w-full max-w-4xl">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-80 bg-muted rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavigationMenu />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Event not found</h2>
            <p className="text-muted-foreground mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Link to="/">
              <ButtonEffect>Back to Home</ButtonEffect>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationMenu />
      
      <main className="pt-20 flex-1">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Link to="/events" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={16} className="mr-1" />
            Back to Events
          </Link>
        </div>
        
        {/* Event Header */}
        <div className="container mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <div className="flex-1">
              <div className="inline-block text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full mb-3">
                {event.category}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{event.title}</h1>
              
              <div className="flex flex-wrap items-center gap-6 md:gap-8 mt-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  <span>{event.date}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-primary" />
                  <span>{event.time}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-primary" />
                  <span>{event.location}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  <span>{event.spotsLeft} spots left</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 md:flex-col mt-4 md:mt-0">
              <ButtonEffect 
                variant="primary" 
                className="flex-1"
                onClick={handleRegister}
              >
                Register Now
              </ButtonEffect>
              
              <div className="flex gap-2">
                <ButtonEffect 
                  variant="outline" 
                  className="p-2 h-10 w-10" 
                  onClick={handleFavorite}
                  aria-label="Add to favorites"
                >
                  <Heart size={18} />
                </ButtonEffect>
                
                <ButtonEffect 
                  variant="outline" 
                  className="p-2 h-10 w-10"
                  onClick={handleShare}
                  aria-label="Share event"
                >
                  <Share2 size={18} />
                </ButtonEffect>
              </div>
            </div>
          </div>
        </div>
        
        {/* Event Image */}
        <div className="container mx-auto px-4 mb-8">
          <div className="rounded-xl overflow-hidden h-[300px] md:h-[400px] lg:h-[500px] bg-muted">
            <div className={`absolute inset-0 bg-muted transition-opacity duration-700 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`} />
            <img
              src={event.image}
              alt={event.title}
              className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>
        
        {/* Event Details */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="about">
                <TabsList className="mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="speakers">Speakers</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="space-y-6">
                  <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: event.description }} />
                  
                  {/* Organizer */}
                  <div className="mt-8 pt-8 border-t">
                    <h3 className="text-xl font-semibold mb-3">Organizer</h3>
                    <div className="flex items-center gap-4">
                      <div className="bg-muted h-12 w-12 rounded-full flex items-center justify-center">
                        <User size={24} className="text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">{event.organizer}</h4>
                        <Link to="#" className="text-sm text-primary hover:underline">
                          View Organizer Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="schedule">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Event Schedule</h3>
                    <div className="space-y-4">
                      {event.schedule.map((item, index) => (
                        <div key={index} className="glass-card p-4">
                          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                            <div className="md:w-48 font-medium text-primary">{item.time}</div>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.title}</h4>
                              {item.speaker && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Speaker: {item.speaker}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="speakers">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Featured Speakers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {event.speakers.map((speaker, index) => (
                        <div key={index} className="glass-card p-6 hover-scale">
                          <div className="flex gap-4 items-start">
                            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                              <img
                                src={speaker.image}
                                alt={speaker.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{speaker.name}</h4>
                              <p className="text-sm text-muted-foreground">{speaker.role}</p>
                              <p className="text-sm mt-2">
                                <span className="font-medium">Speaking on:</span> {speaker.topic}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <div className="glass-card p-6 sticky top-24">
                <h3 className="text-xl font-semibold mb-4">Event Information</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Date & Time</h4>
                    <p className="mt-1">{event.date}, {event.time}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                    <p className="mt-1">{event.location}</p>
                    <p className="text-sm text-muted-foreground">{event.address}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Price</h4>
                    <p className="mt-1">{event.price}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Availability</h4>
                    <p className="mt-1">{event.spotsLeft} spots left</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <ButtonEffect className="w-full mb-3" onClick={handleRegister}>
                    Register Now
                  </ButtonEffect>
                  <ButtonEffect variant="outline" className="w-full" onClick={handleShare}>
                    Share Event
                  </ButtonEffect>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-secondary-foreground/80">© 2025 TechZeon. All rights reserved.</p>
        </div>
      </footer>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} redirectPath={`/event/register/${id}`} />
    </div>
  );
};

export default EventDetails;
