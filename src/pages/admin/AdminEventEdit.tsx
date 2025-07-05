
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Image as ImageIcon, Users, DollarSign } from "lucide-react";
import NavigationMenu from "@/components/NavigationMenu";
import { ButtonEffect } from "@/components/ui/button-effect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  address: string;
  category: string;
  capacity: number;
  price: string;
  image_url: string;
}

const AdminEventEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<EventData>({
    id: "",
    title: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    location: "",
    address: "",
    category: "",
    capacity: 0,
    price: "",
    image_url: ""
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/events/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            toast({
              title: "Event Not Found",
              description: "The event you're trying to edit doesn't exist.",
              variant: "destructive"
            });
            navigate("/admin");
            return;
          }
          throw new Error('Failed to fetch event data');
        }
        
        const eventData = await response.json();
        
        // Format the data for the form
        setFormData({
          id: eventData.id,
          title: eventData.title,
          description: eventData.description || "",
          date: eventData.date ? new Date(eventData.date).toISOString().split('T')[0] : "",
          start_time: eventData.start_time || "",
          end_time: eventData.end_time || "",
          location: eventData.location || "",
          address: eventData.address || "",
          category: eventData.category || "",
          capacity: eventData.capacity || 0,
          price: eventData.price || "Free",
          image_url: eventData.image_url || ""
        });
      } catch (error) {
        console.error('Error fetching event data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch event data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchEventData();
    }
  }, [id, navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convert form data to match API format
      const apiData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        startTime: formData.start_time,
        endTime: formData.end_time,
        location: formData.location,
        address: formData.address,
        category: formData.category,
        capacity: Number(formData.capacity),
        price: formData.price,
        imageUrl: formData.image_url
      };
      
      // Call the API to update the event
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update event');
      }
      
      toast({
        title: "Event Updated Successfully",
        description: `"${formData.title}" has been updated.`
      });
      
      navigate("/admin");
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationMenu />
      
      <main className="pt-24 pb-16 flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link to="/admin" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft size={16} className="mr-1" />
              Back to Dashboard
            </Link>
            
            <div className="glass-card p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-6">Edit Event</h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Basic Information</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Event Title</Label>
                      <Input 
                        id="title" 
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter event title" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <textarea 
                        id="description" 
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4} 
                        className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                        placeholder="Describe your event"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category" 
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="Conference">Conference</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Bootcamp">Bootcamp</option>
                        <option value="Masterclass">Masterclass</option>
                        <option value="Hackathon">Hackathon</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Date & Time */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Date & Time</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                          id="date" 
                          name="date"
                          type="date" 
                          className="pl-10"
                          value={formData.date}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="start_time">Start Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                          id="start_time" 
                          name="start_time"
                          type="time" 
                          className="pl-10"
                          value={formData.start_time}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="end_time">End Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                          id="end_time" 
                          name="end_time"
                          type="time" 
                          className="pl-10"
                          value={formData.end_time}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Location */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Location</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Venue Name</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                          id="location" 
                          name="location"
                          placeholder="e.g., TechZeon Campus, Building A" 
                          className="pl-10"
                          value={formData.location}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                          id="address" 
                          name="address"
                          placeholder="Full address of the venue" 
                          className="pl-10"
                          value={formData.address}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Capacity & Price */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Additional Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                          id="capacity" 
                          name="capacity"
                          type="number" 
                          placeholder="Maximum number of attendees" 
                          className="pl-10"
                          value={formData.capacity}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                          id="price" 
                          name="price"
                          placeholder="Price (or 'Free')" 
                          className="pl-10"
                          value={formData.price}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Cover Image */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Cover Image</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image_url">Image URL</Label>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                          id="image_url" 
                          name="image_url"
                          placeholder="URL to event cover image" 
                          className="pl-10"
                          value={formData.image_url}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    {formData.image_url && (
                      <div className="rounded-lg overflow-hidden h-40">
                        <img 
                          src={formData.image_url} 
                          alt={formData.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Submit Buttons */}
                <div className="pt-4 border-t flex flex-col sm:flex-row gap-3">
                  <ButtonEffect 
                    type="submit" 
                    className="flex-1" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving Changes..." : "Save Changes"}
                  </ButtonEffect>
                  
                  <ButtonEffect 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate("/admin")}
                  >
                    Cancel
                  </ButtonEffect>
                </div>
              </form>
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
    </div>
  );
};

export default AdminEventEdit;
