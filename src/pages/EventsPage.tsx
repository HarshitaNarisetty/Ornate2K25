
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Filter, Grid3X3, List, MapPin, Search, Clock } from "lucide-react";
import NavigationMenu from "@/components/NavigationMenu";
import EventCard from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { ButtonEffect } from "@/components/ui/button-effect";

// Mock data - same as used in the Index page
const events = [
  {
    id: "1",
    title: "Tech Innovation 2025",
    date: "February 27, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "TechZeon Campus, Building A",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2070",
    category: "Conference",
    spotsLeft: 45,
  },
  {
    id: "2",
    title: "AI Workshop: Deep Learning Fundamentals",
    date: "March 1, 2025",
    time: "1:00 PM - 5:00 PM",
    location: "Lab 4, Tech Building",
    image: "https://images.unsplash.com/photo-1534366428904-e54f549e1aa4?auto=format&fit=crop&q=80&w=2070",
    category: "Workshop",
    spotsLeft: 12,
  },
  {
    id: "3",
    title: "Mobile App Development Bootcamp",
    date: "February 28, 2025",
    time: "9:00 AM - 4:00 PM",
    location: "Innovation Hub",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2070",
    category: "Bootcamp",
    spotsLeft: 8,
  },
  {
    id: "4",
    title: "Cybersecurity: Threats & Solutions",
    date: "March 2, 2025",
    time: "2:00 PM - 6:00 PM",
    location: "Auditorium C",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=2034",
    category: "Seminar",
    spotsLeft: 25,
  },
  {
    id: "5",
    title: "Web3 & Blockchain Technologies",
    date: "February 26, 2025",
    time: "10:00 AM - 3:00 PM",
    location: "Digital Gallery",
    image: "https://images.unsplash.com/photo-1639152201720-5e536d254d81?auto=format&fit=crop&q=80&w=2232",
    category: "Conference",
    spotsLeft: 18,
  },
  {
    id: "6",
    title: "UX/UI Design Masterclass",
    date: "February 27, 2025",
    time: "9:00 AM - 12:00 PM",
    location: "Design Studio",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=2070",
    category: "Masterclass",
    spotsLeft: 15,
  },
  {
    id: "7",
    title: "Data Science for Beginners",
    date: "February 25, 2025",
    time: "1:00 PM - 5:00 PM",
    location: "Room 201",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070",
    category: "Workshop",
    spotsLeft: 20,
  },
];

const categories = [
  "All Events",
  "Conference",
  "Workshop",
  "Seminar",
  "Bootcamp",
  "Masterclass",
  "Hackathon",
];

const EventsPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Events");
  const [visibleEvents, setVisibleEvents] = useState(events);

  useEffect(() => {
    const filtered = events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All Events" || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    
    setVisibleEvents(filtered);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationMenu />
      
      {/* Events Section */}
      <section className="pt-28 pb-16 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground mt-1">Discover and register for upcoming tech events</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <ButtonEffect
              variant={viewMode === "grid" ? "primary" : "outline"}
              size="sm"
              icon={<Grid3X3 size={16} />}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              Grid
            </ButtonEffect>
            
            <ButtonEffect
              variant={viewMode === "list" ? "primary" : "outline"}
              size="sm"
              icon={<List size={16} />}
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              List
            </ButtonEffect>
          </div>
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <select 
              className="w-full h-10 rounded-md border border-input bg-transparent px-10 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <select className="w-full h-10 rounded-md border border-input bg-transparent px-10 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <option value="upcoming">Upcoming Events</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="next-month">Next Month</option>
            </select>
          </div>
        </div>
        
        {visibleEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 text-muted-foreground">
              <Search size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-medium mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <ButtonEffect 
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Events");
              }}
            >
              Clear Filters
            </ButtonEffect>
          </div>
        ) : (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {visibleEvents.map((event) => (
                <Link 
                  to={`/event/${event.id}`} 
                  key={event.id}
                  className="block glass-card p-4 hover-scale"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-48 h-32 rounded-md overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-medium bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                        {event.category}
                      </span>
                      <h3 className="text-lg font-medium mt-2">{event.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={16} />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} />
                          <span>{event.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center mt-2 text-sm">
                        <MapPin size={16} className="mr-1.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{event.location}</span>
                      </div>
                    </div>
                    <div className="md:w-32 flex md:flex-col items-center md:items-end justify-between md:justify-center mt-4 md:mt-0">
                      <div className="text-sm font-medium text-primary">
                        {event.spotsLeft} spots left
                      </div>
                      <ButtonEffect 
                        variant="outline" 
                        size="sm"
                        className="mt-2 md:mt-auto"
                      >
                        View Details
                      </ButtonEffect>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}
        
        <div className="flex justify-center mt-10">
          <ButtonEffect variant="outline">
            Load More Events
          </ButtonEffect>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-secondary-foreground/80">© 2025 TechZeon. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default EventsPage;
