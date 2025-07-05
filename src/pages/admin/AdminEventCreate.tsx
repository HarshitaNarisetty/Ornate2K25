
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Image as ImageIcon, Users, DollarSign } from "lucide-react";
import NavigationMenu from "@/components/NavigationMenu";
import { ButtonEffect } from "@/components/ui/button-effect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AdminEventCreate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    address: "",
    category: "",
    capacity: "",
    price: "Free",
    imageUrl: ""
  });

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
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        address: formData.address,
        category: formData.category,
        capacity: Number(formData.capacity),
        price: formData.price,
        imageUrl: formData.imageUrl
      };
      
      // Call the API to create the event
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create event');
      }
      
      const result = await response.json();
      
      toast({
        title: "Event Created Successfully",
        description: `"${formData.title}" has been created and is now published.`
      });
      
      navigate("/admin");
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <h1 className="text-2xl md:text-3xl font-bold mb-6">Create New Event</h1>
              
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
                      <Label htmlFor="startTime">Start Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                          id="startTime" 
                          name="startTime"
                          type="time" 
                          className="pl-10"
                          value={formData.startTime}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                          id="endTime" 
                          name="endTime"
                          type="time" 
                          className="pl-10"
                          value={formData.endTime}
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
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                          id="imageUrl" 
                          name="imageUrl"
                          placeholder="URL to event cover image" 
                          className="pl-10"
                          value={formData.imageUrl}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                      {formData.imageUrl ? (
                        <div className="rounded-lg overflow-hidden h-40">
                          <img 
                            src={formData.imageUrl} 
                            alt="Event cover preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-center">
                            <ImageIcon className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Preview will appear here once URL is provided
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Submit Buttons */}
                <div className="pt-4 border-t flex flex-col sm:flex-row gap-3">
                  <ButtonEffect 
                    type="submit" 
                    className="flex-1" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Event..." : "Create Event"}
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

export default AdminEventCreate;
