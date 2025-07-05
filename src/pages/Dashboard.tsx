
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavigationMenu from "@/components/NavigationMenu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, ChevronDown, CheckCircle, AlertTriangle, X } from "lucide-react";
import { ButtonEffect } from "@/components/ui/button-effect";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/App";

// Mock data
const upcomingEvents = [
  {
    id: "1",
    title: "Tech Innovation 2025",
    date: "February 27, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "TechZeon Campus, Building A",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2070",
    status: "confirmed",
    ticketId: "TZ-2025-95843"
  },
  {
    id: "3",
    title: "Mobile App Development Bootcamp",
    date: "October 12-14, 2025",
    time: "9:00 AM - 4:00 PM",
    location: "Innovation Hub",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2070",
    status: "pending",
    ticketId: "TZ-2025-97321"
  }
];

const pastEvents = [
  {
    id: "100",
    title: "Web Development Workshop",
    date: "Feb 28, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Room 402, Computing Building",
    image: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&q=80&w=2074",
    status: "completed",
    ticketId: "TZ-2025-87245"
  },
  {
    id: "101",
    title: "UI/UX Design Principles",
    date: "Feb 27, 2025",
    time: "20:00 PM - 4:00 AM",
    location: "Design Lab",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=2070",
    status: "completed",
    ticketId: "TZ-2025-85632"
  }
];

const Dashboard = () => {
  const { isAuthenticated, login } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Function to toggle ticket expansion
  const toggleTicket = (ticketId: string) => {
    if (expandedTicket === ticketId) {
      setExpandedTicket(null);
    } else {
      setExpandedTicket(ticketId);
    }
  };

  // Function to handle cancel registration
  const handleCancelRegistration = (event: any) => {
    toast({
      title: "Registration Cancelled",
      description: `You have cancelled your registration for "${event.title}".`,
    });
  };

  // For demo purposes
  useEffect(() => {
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationMenu />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <header className="mb-10">
              <h1 className="text-3xl font-bold">Student Dashboard</h1>
              <p className="text-muted-foreground mt-2">Manage your event registrations and tickets</p>
            </header>
            
            <Tabs defaultValue="upcoming" className="mt-6">
              <TabsList className="mb-8">
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
                <TabsTrigger value="saved">Saved Events</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-6">
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-12 glass-card">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <Calendar size={24} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No upcoming events</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't registered for any upcoming events yet.
                    </p>
                    <ButtonEffect>
                      <Link to="/events">Browse Events</Link>
                    </ButtonEffect>
                  </div>
                ) : (
                  upcomingEvents.map((event) => (
                    <div key={event.id} className="glass-card overflow-hidden animate-fade-in">
                      <div className="relative">
                        {/* Status Badge */}
                        <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-medium ${
                          event.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {event.status === 'confirmed' ? (
                            <div className="flex items-center">
                              <CheckCircle size={14} className="mr-1" />
                              Confirmed
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <AlertTriangle size={14} className="mr-1" />
                              Pending
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 h-48 md:h-auto">
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="p-6 flex-1">
                          <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                          
                          <div className="flex flex-wrap gap-4 text-sm mb-4">
                            <div className="flex items-center">
                              <Calendar size={16} className="mr-1.5 text-primary" />
                              <span>{event.date}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <Clock size={16} className="mr-1.5 text-primary" />
                              <span>{event.time}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <MapPin size={16} className="mr-1.5 text-primary" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-3 mt-4">
                            <Link to={`/event/${event.id}`}>
                              <ButtonEffect>View Details</ButtonEffect>
                            </Link>
                            
                            <ButtonEffect 
                              variant="outline"
                              onClick={() => toggleTicket(event.ticketId)}
                            >
                              {expandedTicket === event.ticketId ? "Hide Ticket" : "Show Ticket"}
                              <ChevronDown 
                                size={16} 
                                className={`ml-1 transition-transform duration-200 ${
                                  expandedTicket === event.ticketId ? 'rotate-180' : ''
                                }`} 
                              />
                            </ButtonEffect>
                            
                            <ButtonEffect 
                              variant="outline" 
                              className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20"
                              onClick={() => handleCancelRegistration(event)}
                            >
                              <X size={16} className="mr-1" />
                              Cancel Registration
                            </ButtonEffect>
                          </div>
                        </div>
                      </div>
                      
                      {/* Ticket Information */}
                      {expandedTicket === event.ticketId && (
                        <div className="bg-muted p-6 animate-fade-in">
                          <div className="max-w-md mx-auto">
                            <h4 className="text-lg font-medium mb-4">Ticket Information</h4>
                            
                            <div className="glass-card p-6 text-center">
                              <div className="mb-4">
                                <div className="text-sm text-muted-foreground mb-1">Ticket ID</div>
                                <div className="text-xl font-medium">{event.ticketId}</div>
                              </div>
                              
                              <div className="border-t pt-4 mb-4">
                                <div className="text-sm text-muted-foreground mb-1">Event</div>
                                <div className="font-medium">{event.title}</div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 border-t pt-4">
                                <div>
                                  <div className="text-sm text-muted-foreground mb-1">Date</div>
                                  <div className="text-sm">{event.date}</div>
                                </div>
                                
                                <div>
                                  <div className="text-sm text-muted-foreground mb-1">Time</div>
                                  <div className="text-sm">{event.time}</div>
                                </div>
                                
                                <div>
                                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                                  <div className={`text-sm ${event.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {event.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-6">
                                <ButtonEffect variant="outline" size="sm">
                                  Download Ticket
                                </ButtonEffect>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="past" className="space-y-6">
                {pastEvents.length === 0 ? (
                  <div className="text-center py-12 glass-card">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <Calendar size={24} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No past events</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't attended any events yet.
                    </p>
                    <Link to="/events">
                      <ButtonEffect>Browse Events</ButtonEffect>
                    </Link>
                  </div>
                ) : (
                  pastEvents.map((event) => (
                    <div key={event.id} className="glass-card overflow-hidden animate-fade-in">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 h-48 md:h-auto">
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="w-full h-full object-cover filter grayscale"
                          />
                        </div>
                        
                        <div className="p-6 flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-xl font-semibold">{event.title}</h3>
                            <span className="ml-3 px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                              Completed
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm mb-4">
                            <div className="flex items-center">
                              <Calendar size={16} className="mr-1.5 text-muted-foreground" />
                              <span>{event.date}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <Clock size={16} className="mr-1.5 text-muted-foreground" />
                              <span>{event.time}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <MapPin size={16} className="mr-1.5 text-muted-foreground" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-3 mt-4">
                            <ButtonEffect variant="outline">
                              View Certificate
                            </ButtonEffect>
                            
                            <ButtonEffect variant="outline">
                              Leave Feedback
                            </ButtonEffect>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="saved" className="text-center py-12 glass-card">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Calendar size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No saved events</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't saved any events yet. Click the heart icon on an event to save it for later.
                </p>
                <Link to="/events">
                  <ButtonEffect>Browse Events</ButtonEffect>
                </Link>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-secondary-foreground/80">© 2025 TechZeon. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
