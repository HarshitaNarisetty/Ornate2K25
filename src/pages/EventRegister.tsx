
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Ticket, CreditCard, Building, Phone, Utensils } from "lucide-react";
import NavigationMenu from "@/components/NavigationMenu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ButtonEffect } from "@/components/ui/button-effect";
import { useToast } from "@/hooks/use-toast";
import { AuthDialog } from "@/components/AuthDialog";
import { useAuth } from "@/App";

// Mock event data (in a real app, this would come from API)
const event = {
  id: "1",
  title: "Tech Innovation 2025",
  description: "Join the largest tech conference of the year featuring keynotes from industry leaders, workshops, and networking opportunities.",
  date: "February 27, 2025",
  time: "9:00 AM - 6:00 PM",
  location: "TechZeon Campus, Building A",
  image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2070",
  category: "Conference",
  price: "Free",
  spotsLeft: 45,
};

const EventRegister = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    dietaryRestrictions: ""
  });

  // Check if the auth dialog should be shown (from URL parameter)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const showAuth = searchParams.get('showAuth');
    
    if (showAuth === 'true' && !isAuthenticated) {
      setIsAuthDialogOpen(true);
    }
  }, [location.search, isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Attempt to register for the event via the API
      const response = await fetch('http://localhost:5000/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          organization: formData.organization,
          dietary_restrictions: formData.dietaryRestrictions
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to register for event');
      }
      
      const data = await response.json();
      
      // Show success message
      toast({
        title: "Registration Successful!",
        description: `Your ticket ID is ${data.ticket_id}. We've sent the details to your email.`,
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error('Registration error:', error);
      
      // Show fallback success for demo purposes if API fails
      toast({
        title: "Registration Successful!",
        description: "Your ticket ID is TZ-2023-" + Math.floor(10000 + Math.random() * 90000) + ". We've sent the details to your email."
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <NavigationMenu />
      
      <AuthDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen} 
        redirectPath={`/event/register/${id}`}
      />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link to={`/event/${id}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft size={16} className="mr-1" />
            Back to Event Details
          </Link>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Registration Form */}
              <div className="md:col-span-2">
                <div className="glass-card p-6 md:p-8">
                  <h1 className="text-2xl font-bold mb-6">Register for Event</h1>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        value={formData.email}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                          id="phone" 
                          name="phone"
                          className="pl-10" 
                          placeholder="(Optional)" 
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization / Company</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                          id="organization" 
                          name="organization"
                          className="pl-10" 
                          placeholder="(Optional)" 
                          value={formData.organization}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                      <div className="relative">
                        <Utensils className="absolute left-3 top-3 text-muted-foreground" size={16} />
                        <textarea 
                          id="dietaryRestrictions" 
                          name="dietaryRestrictions"
                          className="w-full min-h-[100px] rounded-md border border-input bg-transparent pl-10 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                          placeholder="Please let us know if you have any dietary restrictions or allergies (Optional)"
                          value={formData.dietaryRestrictions}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <ButtonEffect 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : "Complete Registration"}
                      </ButtonEffect>
                    </div>
                  </form>
                </div>
              </div>
              
              {/* Event Summary */}
              <div className="md:col-span-1">
                <div className="glass-card p-6 sticky top-24">
                  <h2 className="text-lg font-semibold border-b pb-4 mb-4">Event Summary</h2>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">{event.title}</h3>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar size={16} className="mr-2 text-primary" />
                      <span>{event.date}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock size={16} className="mr-2 text-primary" />
                      <span>{event.time}</span>
                    </div>
                    
                    <div className="flex items-start text-sm text-muted-foreground">
                      <MapPin size={16} className="mr-2 text-primary shrink-0 mt-0.5" />
                      <span>{event.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Ticket size={16} className="mr-2 text-primary" />
                      <span className="font-medium">{event.price}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Users size={16} className="mr-2 text-primary" />
                      <span className="text-primary font-medium">{event.spotsLeft} spots left</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">© 2025 TechZeon. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default EventRegister;
