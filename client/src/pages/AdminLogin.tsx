import { useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if user is admin
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", data.user.id)
          .single();

        if (profile?.is_admin) {
          toast({ title: "Dobrodošli nazad" });
          setLocation("/admin");
        } else {
          await supabase.auth.signOut();
          toast({ 
            title: "Pristup odbijen", 
            description: "Nemate administratorska prava.", 
            variant: "destructive" 
          });
        }
      }
    } catch (error: any) {
      toast({ 
        title: "Greška pri prijavi", 
        description: error.message || "Proverite podatke i pokušajte ponovo.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black z-0 pointer-events-none" />
      
      <Card className="w-full max-w-md bg-white/5 border-white/10 relative z-10 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl text-white">Admin Pristup</CardTitle>
          <CardDescription>Unesite vaše kredencijale za pristup panelu.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="bg-black/20 border-white/10 text-white"
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Lozinka</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="bg-black/20 border-white/10 text-white"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-red-700 text-white font-bold"
              disabled={loading}
            >
              {loading ? "Prijavljivanje..." : "Prijavi se"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
