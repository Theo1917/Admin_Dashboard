import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  MapPin, 
  DollarSign,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Mail,
  Phone,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { eventApi, Event, EventResponse } from '../services/api';
import DescriptionBlocksEditor, { DescriptionBlock } from '@/components/DescriptionBlocksEditor';

// Types are imported from services/api

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventResponses, setEventResponses] = useState<EventResponse[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewResponsesOpen, setIsViewResponsesOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [importJsonText, setImportJsonText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<Array<{ index: number; title?: string; success: boolean; id?: string; error?: string }>>([]);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    descriptionBlocks: [] as DescriptionBlock[],
    coverImage: '',
    imageUrls: [] as string[],
    location: '',
    date: '',
    entryFee: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const statuses = ['ALL', 'DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'];

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventApi.getAll();
        setEvents(data.events || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Error",
          description: "Failed to load events. Please check your connection.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  // Filter events
  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(event => event.status === selectedStatus);
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedStatus, events]);

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      fullDate: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <CheckCircle className="h-4 w-4" />;
      case 'DRAFT':
        return <Clock className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleCreateEvent = () => {
    setEventForm({
      title: '',
      description: '',
      descriptionBlocks: [],
      coverImage: '',
      imageUrls: [],
      location: '',
      date: '',
      entryFee: '',
      status: 'DRAFT'
    });
    setIsCreateDialogOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      descriptionBlocks: (event.descriptionBlocks || []) as DescriptionBlock[],
      coverImage: event.coverImage || '',
      imageUrls: event.imageUrls || [],
      location: event.location || '',
      date: event.date.split('T')[0] + 'T' + event.date.split('T')[1].substring(0, 5),
      entryFee: event.entryFee?.toString() || '',
      status: event.status
    });
    setIsEditDialogOpen(true);
  };

  const handleOpenImport = () => {
    setImportJsonText('');
    setImportResults([]);
    setIsImportDialogOpen(true);
  };

  const handleViewResponses = async (event: Event) => {
    setSelectedEvent(event);
    try {
      const data = await eventApi.getResponses(event.id);
      setEventResponses(data.responses || []);
      setIsViewResponsesOpen(true);
    } catch (error) {
      console.error('Error fetching responses:', error);
      toast({
        title: "Error",
        description: "Failed to load event responses.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (event: Event) => {
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) {
      return;
    }

    try {
      await eventApi.delete(event.id);
      toast({
        title: "Success",
        description: "Event deleted successfully.",
      });
      // Refresh events
      const data = await eventApi.getAll();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (event: Event, newStatus: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED') => {
    try {
      await eventApi.update(event.id, { status: newStatus });
      toast({
        title: "Success",
        description: `Event status updated to ${newStatus.toLowerCase()}.`,
      });
      // Refresh events
      const data = await eventApi.getAll();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error updating event status:', error);
      toast({
        title: "Error",
        description: "Failed to update event status.",
        variant: "destructive",
      });
    }
  };

  const submitEvent = async () => {
    if (!eventForm.title || !eventForm.description || !eventForm.date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const eventData: Partial<Event> = {
        ...eventForm,
        entryFee: eventForm.entryFee ? parseFloat(eventForm.entryFee) : undefined,
        date: new Date(eventForm.date).toISOString()
      };

      if (isEditDialogOpen && editingEvent) {
        await eventApi.update(editingEvent.id, eventData);
        toast({
          title: "Success",
          description: "Event updated successfully.",
        });
      } else {
        await eventApi.create(eventData);
        toast({
          title: "Success",
          description: "Event created successfully.",
        });
      }
      
      setIsCreateDialogOpen(false);
      setIsEditDialogOpen(false);
      
      // Refresh events
      const data = await eventApi.getAll();
      setEvents(data.events || []);
    } catch (error: unknown) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to save event.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Import helpers
  const readFileAsText = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsText(file);
    });

  const normalizeBlocks = (raw: unknown): DescriptionBlock[] | undefined => {
    try {
      let blocks: unknown = raw;
      if (typeof raw === 'string') {
        try { blocks = JSON.parse(raw); } catch { /* keep as string */ }
      }
      if (!blocks) return undefined;
      if (Array.isArray(blocks)) {
        return blocks.map((b: unknown) => {
          if (typeof b === 'string') {
            return { title: b } as DescriptionBlock;
          }
          const obj = b as { title?: unknown; description?: unknown; items?: unknown };
          const title = typeof obj?.title === 'string' ? obj.title : '';
          const description = typeof obj?.description === 'string' ? obj.description : undefined;
          let items: string[] | undefined;
          if (Array.isArray(obj?.items)) {
            items = obj.items.filter((it: unknown) => typeof it === 'string' && it.trim()).map((it: string) => it.trim());
          } else if (typeof obj?.items === 'string') {
            items = obj.items.split('\n').map((s: string) => s.trim()).filter(Boolean);
          }
          return { title, description, items } as DescriptionBlock;
        }).filter((b) => b.title || (b.items && b.items.length) || b.description);
      }
      return undefined;
    } catch {
      return undefined;
    }
  };

  type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  const isEventStatus = (val: unknown): val is EventStatus =>
    typeof val === 'string' && (['DRAFT','PUBLISHED','CANCELLED','COMPLETED'] as const).includes(val as EventStatus);

  type UnknownRecord = Record<string, unknown>;
  const getString = (obj: UnknownRecord, key: string): string | undefined => {
    const v = obj[key];
    return typeof v === 'string' ? v : undefined;
  };
  const getNumber = (obj: UnknownRecord, key: string): number | undefined => {
    const v = obj[key];
    if (typeof v === 'number' && !isNaN(v)) return v;
    if (typeof v === 'string') {
      const n = parseFloat(v);
      return isNaN(n) ? undefined : n;
    }
    return undefined;
  };
  const getUnknown = (obj: UnknownRecord, key: string): unknown => obj[key];
  const getUnknownArray = (obj: UnknownRecord, key: string): unknown[] | undefined => {
    const v = obj[key];
    return Array.isArray(v) ? (v as unknown[]) : undefined;
  };
  const coerceString = (v: unknown): string => (typeof v === 'string' ? v : v != null ? JSON.stringify(v) : '');
  const toIsoDate = (v: unknown): string | undefined => {
    if (v == null) return undefined;
    const d = new Date(typeof v === 'string' || typeof v === 'number' ? v : String(v));
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  };

  const normalizeImportedEvent = (raw: UnknownRecord): Partial<Event> => {
    const e: Partial<Event> = {};
    // title (required)
    e.title = String(getString(raw, 'title') ?? getString(raw, 'name') ?? '').trim();
    // description
    const desc = getUnknown(raw, 'description') ?? getUnknown(raw, 'excerpt') ?? '';
    e.description = typeof desc === 'string' ? desc : coerceString(desc);
    // date
    const dateVal = getUnknown(raw, 'date') ?? getUnknown(raw, 'datetime') ?? getUnknown(raw, 'eventDate');
    const iso = toIsoDate(dateVal);
    if (iso) e.date = iso;
    // status
    const status = String((getString(raw, 'status') ?? 'DRAFT')).toUpperCase();
    e.status = isEventStatus(status) ? status : 'DRAFT';
    // entryFee
    const feeNum = getNumber(raw, 'entryFee');
    if (feeNum !== undefined) e.entryFee = feeNum;
    // location
    const loc = getString(raw, 'location');
    if (loc) e.location = loc;
    // coverImage
    const cover = getString(raw, 'coverImage') ?? getString(raw, 'image');
    if (cover) e.coverImage = cover;
    // imageUrls
    const imagesArray = getUnknownArray(raw, 'imageUrls');
    const imagesStr = getString(raw, 'imageUrls');
    if (imagesArray) {
      e.imageUrls = imagesArray.map((u: unknown) => String(u)).filter(Boolean);
    } else if (imagesStr) {
      e.imageUrls = imagesStr.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    // descriptionBlocks
    const blocks = normalizeBlocks(getUnknown(raw, 'descriptionBlocks') ?? getUnknown(raw, 'blocks') ?? getUnknown(raw, 'sections'));
    if (blocks && blocks.length) e.descriptionBlocks = blocks;
    return e;
  };

  const parseImportJson = (text: string): unknown[] => {
    const trimmed = text.trim();
    if (!trimmed) return [];
    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      throw new Error('Invalid JSON. Please check the content.');
    }
    if (Array.isArray(parsed)) return parsed as unknown[];
    if (parsed && typeof parsed === 'object') {
      const obj = parsed as Record<string, unknown>;
      if (Array.isArray(obj.events)) return obj.events as unknown[];
      return [obj];
    }
    throw new Error('Unsupported JSON structure. Provide an array of events or an object with an "events" array.');
  };

  const getErrorMessage = (e: unknown) => (e instanceof Error ? e.message : String(e ?? 'Unknown error'));

  const handleImport = async () => {
    try {
      setIsImporting(true);
      setImportResults([]);
      const raws = parseImportJson(importJsonText);
      if (!raws.length) {
        toast({ title: 'Nothing to import', description: 'No items found in the provided JSON.' });
        return;
      }
      const results: Array<{ index: number; title?: string; success: boolean; id?: string; error?: string }> = [];
      for (let i = 0; i < raws.length; i++) {
        const raw = raws[i] as UnknownRecord;
        try {
          const payload = normalizeImportedEvent(raw);
          if (!payload.title) throw new Error('Missing required field: title');
          if (!payload.date) throw new Error('Missing required field: date');
          // Default status if absent
          payload.status = payload.status || 'DRAFT';
          const created = await eventApi.create(payload);
          results.push({ index: i, title: payload.title, success: true, id: created.id });
          setImportResults([...results]);
        } catch (err: unknown) {
          const msg = getErrorMessage(err);
          const titleForResult = getString(raw, 'title') ?? getString(raw, 'name');
          results.push({ index: i, title: titleForResult, success: false, error: msg });
          setImportResults([...results]);
        }
      }
      // Refresh list after import
      const data = await eventApi.getAll();
      setEvents(data.events || []);
      toast({ title: 'Import complete', description: `${results.filter(r => r.success).length} succeeded, ${results.filter(r => !r.success).length} failed.` });
    } catch (err: unknown) {
      toast({ title: 'Import failed', description: getErrorMessage(err) || 'Could not import. Please check JSON and try again.', variant: 'destructive' });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Events Management | Fitflix Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
            <p className="text-gray-600 mt-1">Manage fitness events and workshops</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleOpenImport} className="border-orange-300 text-orange-600 hover:text-orange-700">
              <Upload className="h-4 w-4 mr-2" />
              Import JSON
            </Button>
            <Button onClick={handleCreateEvent} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {events.filter(e => e.status === 'PUBLISHED').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Drafts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {events.filter(e => e.status === 'DRAFT').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {events.reduce((sum, e) => sum + (e.responseCount || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === 'ALL' ? 'All Status' : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="grid gap-6">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const { fullDate } = formatEventDate(event.date);
              
              return (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                          <Badge className={`${getStatusColor(event.status)} border`}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(event.status)}
                              {event.status}
                            </span>
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{fullDate}</span>
                          </div>
                          
                          {event.location && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign className="h-4 w-4" />
                            <span>{event.entryFee === 0 || !event.entryFee ? 'FREE' : `₹${event.entryFee}`}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>{event.responseCount || 0} registered</span>
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewResponses(event)}>
                            <Users className="h-4 w-4 mr-2" />
                            View Responses
                          </DropdownMenuItem>
                          {event.status === 'DRAFT' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(event, 'PUBLISHED')}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Publish
                            </DropdownMenuItem>
                          )}
                          {event.status === 'PUBLISHED' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(event, 'CANCELLED')}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancel
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDeleteEvent(event)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedStatus !== 'ALL' 
                    ? 'Try adjusting your search criteria.' 
                    : 'Get started by creating your first event.'
                  }
                </p>
                {(!searchTerm && selectedStatus === 'ALL') && (
                  <Button onClick={handleCreateEvent} className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Create/Edit Event Dialog */}
        <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
          }
        }}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditDialogOpen ? 'Edit Event' : 'Create New Event'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="Enter event title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Enter event description"
                  rows={4}
                />
              </div>
              
              <div>
                <Label>Event Description Blocks</Label>
                <DescriptionBlocksEditor
                  value={eventForm.descriptionBlocks}
                  onChange={(next) => setEventForm({ ...eventForm, descriptionBlocks: next })}
                />
                <p className="text-sm text-gray-500 mt-2">These power the dark cards on the website. Add items for bullet lists, or use description text.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Event Date & Time *</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="entryFee">Entry Fee (₹)</Label>
                  <Input
                    id="entryFee"
                    type="number"
                    value={eventForm.entryFee}
                    onChange={(e) => setEventForm({ ...eventForm, entryFee: e.target.value })}
                    placeholder="0 for free events"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  placeholder="Enter event location"
                />
              </div>
              
              <div>
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  value={eventForm.coverImage}
                  onChange={(e) => setEventForm({ ...eventForm, coverImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={eventForm.status} onValueChange={(value: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED') => setEventForm({ ...eventForm, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setIsEditDialogOpen(false);
                }}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={submitEvent}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  isEditDialogOpen ? 'Update Event' : 'Create Event'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Responses Dialog */}
        <Dialog open={isViewResponsesOpen} onOpenChange={setIsViewResponsesOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Event Responses - {selectedEvent?.title}
              </DialogTitle>
            </DialogHeader>
            
            {eventResponses.length > 0 ? (
              <div className="space-y-4">
                {eventResponses.map((response) => (
                  <Card key={response.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{response.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              <span>{response.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{response.phone}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Registered: {new Date(response.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={`${
                          response.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          response.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {response.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Responses Yet</h3>
                <p className="text-gray-600">No one has registered for this event yet.</p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Import JSON Dialog */}
        <Dialog open={isImportDialogOpen} onOpenChange={(open) => { if (!isImporting) setIsImportDialogOpen(open); }}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Import Events from JSON</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="jsonFile">Upload JSON file</Label>
                <input
                  id="jsonFile"
                  type="file"
                  accept="application/json,.json"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const text = await readFileAsText(file);
                        setImportJsonText(text);
                        toast({ title: 'File loaded', description: `${file.name} loaded (${text.length} chars)` });
                      } catch (err: unknown) {
                        toast({ title: 'Failed to read file', description: getErrorMessage(err) || 'Please try again', variant: 'destructive' });
                      }
                    }
                  }}
                  className="mt-2 block w-full border rounded px-3 py-2 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">You can also paste JSON below instead of uploading a file.</p>
              </div>

              <div>
                <Label htmlFor="jsonText">Paste JSON</Label>
                <Textarea
                  id="jsonText"
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder='[ { "title": "Event", "description": "...", "date": "2025-01-31T10:00:00", "status": "DRAFT", "entryFee": 0, "location": "City", "coverImage": "https://...", "imageUrls": ["https://..."], "descriptionBlocks": [ { "title": "Who is this for?", "items": ["...", "..."] } ] } ]'
                  rows={12}
                />
                <p className="text-xs text-gray-500 mt-1">Accepts an array of events, a single event object, or an object with an "events" array.</p>
              </div>

              {importResults.length > 0 && (
                <div className="border rounded p-3 bg-gray-50">
                  <p className="text-sm font-medium mb-2">Results</p>
                  <ul className="space-y-1 max-h-40 overflow-y-auto text-sm">
                    {importResults.map((r) => (
                      <li key={r.index} className={r.success ? 'text-green-700' : 'text-red-700'}>
                        #{r.index + 1} {r.title ? `- ${r.title}` : ''}: {r.success ? `Created (id: ${r.id})` : `Failed - ${r.error}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => { if (!isImporting) setIsImportDialogOpen(false); }}
                className="flex-1"
                disabled={isImporting}
              >
                Close
              </Button>
              <Button
                onClick={handleImport}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                disabled={isImporting || !importJsonText.trim()}
              >
                {isImporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Importing...
                  </>
                ) : (
                  'Import'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Events;
