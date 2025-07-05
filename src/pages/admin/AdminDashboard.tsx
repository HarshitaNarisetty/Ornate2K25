
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Edit, Trash2, Plus, ChevronRight, Users, Activity, Folder, List, Grid } from "lucide-react";
import NavigationMenu from "@/components/NavigationMenu";
import { ButtonEffect } from "@/components/ui/button-effect";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: number;
  title: string;
  date: string;
  capacity: number;
  status: string;
  registrations_count?: number;
}

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    upcomingEvents: 0,
    categories: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/events');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const eventsData = await response.json();
        
        // Get registrations count (for a real app, this would be from the API)
        const eventsWithRegistrations = eventsData.map((event: any) => ({
          ...event,
          registrations_count: Math.floor(Math.random() * event.capacity)
        }));
        
        setEvents(eventsWithRegistrations);
        
        // Calculate stats
        setStats({
          totalEvents: eventsData.length,
          totalRegistrations: eventsWithRegistrations.reduce((sum: number, event: Event) => 
            sum + (event.registrations_count || 0), 0),
          upcomingEvents: eventsData.filter((event: Event) => event.status === 'upcoming').length,
          categories: [...new Set(eventsData.map((event: any) => event.category))].length
        });
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Error",
          description: "Failed to fetch events data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [toast]);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (eventId: number, eventTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete event');
        }
        
        // Remove the event from state
        setEvents(events.filter(event => event.id !== eventId));
        
        toast({
          title: "Event Deleted",
          description: `"${eventTitle}" has been deleted successfully.`
        });
      } catch (error) {
        console.error('Error deleting event:', error);
        toast({
          title: "Error",
          description: "Failed to delete event",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationMenu />
      
      <main className="pt-24 pb-16 flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">Manage events, registrations, and more</p>
              </div>
              
              <div className="flex gap-2">
                <ButtonEffect 
                  variant="primary"
                  icon={<Plus size={16} />}
                >
                  <Link to="/admin/events/create">Create Event</Link>
                </ButtonEffect>
              </div>
            </div>
            
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="glass-card p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Events</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.totalEvents}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Calendar size={20} />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm text-muted-foreground">
                  <span className="text-green-600 font-medium">+{Math.floor(stats.totalEvents / 4)}</span>
                  <span className="ml-1.5">from last month</span>
                </div>
              </div>
              
              <div className="glass-card p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Registrations</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.totalRegistrations}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Users size={20} />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm text-muted-foreground">
                  <span className="text-green-600 font-medium">+{Math.floor(stats.totalRegistrations / 6)}</span>
                  <span className="ml-1.5">from last month</span>
                </div>
              </div>
              
              <div className="glass-card p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-muted-foreground text-sm">Upcoming Events</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.upcomingEvents}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Activity size={20} />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm text-muted-foreground">
                  <Link to="/admin/events" className="text-primary flex items-center hover:underline">
                    View all <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
              
              <div className="glass-card p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-muted-foreground text-sm">Categories</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.categories}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Folder size={20} />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm text-muted-foreground">
                  <Link to="#" className="text-primary flex items-center hover:underline">
                    Manage <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Events Management */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                <h2 className="text-xl font-semibold">Event Management</h2>
                
                <div className="flex gap-2 items-center">
                  <div className="relative w-full md:w-auto">
                    <Input 
                      placeholder="Search events..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="min-w-[220px]"
                    />
                  </div>
                  
                  <div className="flex border rounded-md overflow-hidden">
                    <button 
                      className={`p-2 ${viewMode === 'list' ? 'bg-muted' : 'bg-transparent'}`}
                      onClick={() => setViewMode('list')}
                      aria-label="List view"
                    >
                      <List size={18} />
                    </button>
                    <button 
                      className={`p-2 ${viewMode === 'grid' ? 'bg-muted' : 'bg-transparent'}`}
                      onClick={() => setViewMode('grid')}
                      aria-label="Grid view"
                    >
                      <Grid size={18} />
                    </button>
                  </div>
                </div>
              </div>
              
              {isLoading ? (
                <div className="glass-card p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-t-2 border-primary rounded-full mx-auto mb-4"></div>
                  <p>Loading events data...</p>
                </div>
              ) : (
                viewMode === 'list' ? (
                  <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium">Event</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Registrations</th>
                            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredEvents.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                No events found. {searchQuery ? "Try a different search term." : ""}
                              </td>
                            </tr>
                          ) : (
                            filteredEvents.map(event => (
                              <tr key={event.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-4">
                                  <Link to={`/event/${event.id}`} className="font-medium hover:text-primary">
                                    {event.title}
                                  </Link>
                                </td>
                                <td className="px-4 py-4 text-sm">{new Date(event.date).toLocaleDateString()}</td>
                                <td className="px-4 py-4">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    event.status === 'upcoming' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-sm">
                                  {event.registrations_count} / {event.capacity}
                                  <div className="w-full bg-muted h-1.5 mt-1 rounded-full overflow-hidden">
                                    <div 
                                      className="bg-primary h-full rounded-full"
                                      style={{ width: `${(event.registrations_count || 0) / event.capacity * 100}%` }}
                                    ></div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-right space-x-2">
                                  <ButtonEffect
                                    variant="outline"
                                    size="sm"
                                    icon={<Edit size={14} />}
                                  >
                                    <Link to={`/admin/events/edit/${event.id}`}>Edit</Link>
                                  </ButtonEffect>
                                  <ButtonEffect
                                    variant="outline"
                                    size="sm"
                                    className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20"
                                    icon={<Trash2 size={14} />}
                                    onClick={() => handleDelete(event.id, event.title)}
                                  >
                                    Delete
                                  </ButtonEffect>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredEvents.length === 0 ? (
                      <div className="col-span-2 glass-card p-8 text-center">
                        <p className="text-muted-foreground">
                          No events found. {searchQuery ? "Try a different search term." : ""}
                        </p>
                      </div>
                    ) : (
                      filteredEvents.map(event => (
                        <div key={event.id} className="glass-card p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{event.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{new Date(event.date).toLocaleDateString()}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              event.status === 'upcoming' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                            </span>
                          </div>
                          
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Registrations</span>
                              <span>{event.registrations_count} / {event.capacity}</span>
                            </div>
                            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-primary h-full rounded-full"
                                style={{ width: `${(event.registrations_count || 0) / event.capacity * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-end gap-2">
                            <ButtonEffect
                              variant="outline"
                              size="sm"
                              icon={<Edit size={14} />}
                            >
                              <Link to={`/admin/events/edit/${event.id}`}>Edit</Link>
                            </ButtonEffect>
                            <ButtonEffect
                              variant="outline"
                              size="sm"
                              className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20"
                              icon={<Trash2 size={14} />}
                              onClick={() => handleDelete(event.id, event.title)}
                            >
                              Delete
                            </ButtonEffect>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )
              )}
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

export default AdminDashboard;
