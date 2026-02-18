import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit, CheckCircle, Mail, Image as ImageIcon, Box, LogOut, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

// Hooks
import { useServices, useCreateService, useUpdateService, useDeleteService } from "@/hooks/use-services";
import { useGallery, useCreateGalleryItem, useUpdateGalleryItem, useDeleteGalleryItem } from "@/hooks/use-gallery";
import { useAdminMessages, useUpdateMessageStatus } from "@/hooks/use-contact";
import { InsertService, InsertGalleryItem } from "@shared/schema";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("services");
  const [, setLocation] = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLocation("/admin/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();

      if (profile?.is_admin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, [setLocation]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLocation("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
        <h1 className="text-2xl font-bold">Pristup Odbijen</h1>
        <p className="text-muted-foreground">Nemate administratorska prava.</p>
        <Button onClick={handleLogout} variant="destructive">
          <LogOut className="w-4 h-4 mr-2" /> Odjavi se
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold font-display uppercase tracking-wide text-white">
              Admin <span className="text-primary">Panel</span>
            </h1>
            <p className="text-muted-foreground mt-1">Upravljanje sadržajem sajta</p>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline" className="border-white/20">Nazad na sajt</Button>
            </Link>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Odjavi se
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="services" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Box className="w-4 h-4 mr-2" /> Usluge
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <ImageIcon className="w-4 h-4 mr-2" /> Galerija
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Mail className="w-4 h-4 mr-2" /> Poruke
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <ServicesManager />
          </TabsContent>
          
          <TabsContent value="gallery">
            <GalleryManager />
          </TabsContent>
          
          <TabsContent value="messages">
            <MessagesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ServicesManager() {
  const { data: services, isLoading } = useServices();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state for creating/editing
  const [formData, setFormData] = useState<InsertService>({
    title: "",
    description: "",
    price: "",
    isActive: true,
    sortOrder: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...formData });
        toast({ title: "Uspešno ažurirano" });
      } else {
        await createMutation.mutateAsync(formData);
        toast({ title: "Uspešno kreirano" });
      }
      setIsCreateOpen(false);
      setEditingId(null);
      setFormData({ title: "", description: "", price: "", isActive: true, sortOrder: 0 });
    } catch (err) {
      toast({ title: "Greška", description: "Došlo je do greške", variant: "destructive" });
    }
  };

  const handleEdit = (service: any) => {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price,
      isActive: service.isActive,
      sortOrder: service.sortOrder
    });
    setIsCreateOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Da li ste sigurni da želite da obrišete ovu uslugu?")) {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Obrisano" });
    }
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Usluge</CardTitle>
          <CardDescription>Upravljajte listom usluga i cenama.</CardDescription>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) {
            setEditingId(null);
            setFormData({ title: "", description: "", price: "", isActive: true, sortOrder: 0 });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-red-700"><Plus className="w-4 h-4 mr-2" /> Dodaj Uslugu</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10">
            <DialogHeader>
              <DialogTitle>{editingId ? "Izmeni Uslugu" : "Nova Usluga"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Naslov</Label>
                <Input 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>Opis</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>Cena</Label>
                <Input 
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: e.target.value})} 
                  placeholder="npr. 500€ ili 'Na upit'"
                  required 
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={formData.isActive} 
                  onCheckedChange={c => setFormData({...formData, isActive: c})} 
                />
                <Label>Aktivno</Label>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-red-700" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? "Sačuvaj Izmene" : "Kreiraj"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead>Naslov</TableHead>
              <TableHead>Cena</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Akcije</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center">Učitavanje...</TableCell></TableRow>
            ) : services?.map((service) => (
              <TableRow key={service.id} className="border-white/10 hover:bg-white/5">
                <TableCell className="font-medium">{service.title}</TableCell>
                <TableCell>{service.price}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${service.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {service.isActive ? 'Aktivno' : 'Neaktivno'}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(service)}><Edit className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleDelete(service.id)}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function GalleryManager() {
  const { data: items, isLoading } = useGallery();
  const createMutation = useCreateGalleryItem();
  const updateMutation = useUpdateGalleryItem();
  const deleteMutation = useDeleteGalleryItem();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState<InsertGalleryItem>({
    title: "",
    description: "",
    imageUrl: "",
    isActive: true,
    sortOrder: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(formData);
      toast({ title: "Slika dodata" });
      setIsCreateOpen(false);
      setFormData({ title: "", description: "", imageUrl: "", isActive: true, sortOrder: 0 });
    } catch (err) {
      toast({ title: "Greška", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Obisati sliku?")) {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Obrisano" });
    }
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Galerija</CardTitle>
          <CardDescription>Dodajte slike vaših radova.</CardDescription>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-red-700"><Plus className="w-4 h-4 mr-2" /> Dodaj Sliku</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10">
            <DialogHeader>
              <DialogTitle>Nova Slika</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Naslov</Label>
                <Input 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>URL Slike</Label>
                <Input 
                  value={formData.imageUrl} 
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                  placeholder="https://..."
                  required 
                />
                <p className="text-xs text-muted-foreground">Unesite direktan link do slike (npr. Unsplash)</p>
              </div>
              <div className="space-y-2">
                <Label>Opis (opciono)</Label>
                <Input 
                  value={formData.description || ""} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={formData.isActive} 
                  onCheckedChange={c => setFormData({...formData, isActive: c})} 
                />
                <Label>Prikaži na sajtu</Label>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-red-700" disabled={createMutation.isPending}>
                Dodaj
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading ? <p>Učitavanje...</p> : items?.map((item) => (
            <div key={item.id} className="relative group rounded overflow-hidden border border-white/10">
              <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover" />
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 text-center">
                <p className="text-sm font-bold text-white truncate w-full">{item.title}</p>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MessagesManager() {
  const { data: messages, isLoading } = useAdminMessages();
  const updateStatus = useUpdateMessageStatus();
  const { toast } = useToast();

  const handleMarkRead = async (id: number) => {
    try {
      await updateStatus.mutateAsync({ id, status: 'read' });
      toast({ title: "Označeno kao pročitano" });
    } catch (err) {
      toast({ title: "Greška", variant: "destructive" });
    }
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle>Poruke</CardTitle>
        <CardDescription>Kontakt forme poslate sa sajta.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead>Datum</TableHead>
              <TableHead>Ime</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Poruka</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Akcija</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center">Učitavanje...</TableCell></TableRow>
            ) : messages?.map((msg) => (
              <TableRow key={msg.id} className={`border-white/10 hover:bg-white/5 ${msg.status === 'new' ? 'bg-primary/5' : ''}`}>
                <TableCell className="text-muted-foreground text-xs">
                  {new Date(msg.createdAt!).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium">{msg.name}</TableCell>
                <TableCell>{msg.email}</TableCell>
                <TableCell className="max-w-xs truncate" title={msg.message}>{msg.message}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs capitalize ${
                    msg.status === 'new' ? 'bg-primary text-white' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {msg.status === 'new' ? 'Novo' : msg.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {msg.status === 'new' && (
                    <Button size="sm" variant="ghost" onClick={() => handleMarkRead(msg.id)}>
                      <CheckCircle className="w-4 h-4 mr-2" /> Pročitano
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
