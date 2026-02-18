import { Navigation } from "@/components/Navigation";
import { BackgroundCanvas } from "@/components/BackgroundCanvas";
import { Section } from "@/components/Section";
import { ArrowDown, Check, Star, Shield, Car, Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useServices } from "@/hooks/use-services";
import { useGallery } from "@/hooks/use-gallery";
import { useSendMessage } from "@/hooks/use-contact";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: galleryItems, isLoading: galleryLoading } = useGallery();
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { toast } = useToast();

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: InsertContactMessage) => {
    sendMessage(data, {
      onSuccess: () => {
        toast({
          title: "Poruka poslata",
          description: "Hvala na interesovanju. Kontaktiraćemo vas uskoro.",
        });
        form.reset();
      },
      onError: () => {
        toast({
          title: "Greška",
          description: "Došlo je do greške prilikom slanja poruke. Pokušajte ponovo.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="bg-background text-foreground min-h-screen relative overflow-x-hidden selection:bg-primary selection:text-white">
      <BackgroundCanvas />
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Image Overlay with Gradient */}
        <div className="absolute inset-0 z-0">
          {/* Unsplash image of a red sports car or abstract dark automotive texture */}
          {/* Photo by Grahame Jenkins on Unsplash */}
          <img 
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop" 
            alt="Luxury Car Wrap" 
            className="w-full h-full object-cover opacity-40 scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/50" />
        </div>

        <div className="container relative z-10 px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm md:text-base">
              Premium Car Styling
            </h2>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold uppercase leading-tight mb-8 text-white drop-shadow-2xl">
              Transformišite <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-800">
                Svoje Vozilo
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-light mb-10 border-l-4 border-primary pl-6">
              Profesionalno presvlačenje vozila, zatamnjivanje stakala i zaštitne folije. 
              Vrhunski kvalitet i garancija na sve radove.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-red-700 text-white font-bold uppercase tracking-wider text-lg px-8 py-6 rounded-none shadow-[0_0_20px_rgba(213,0,0,0.4)] hover:shadow-[0_0_30px_rgba(213,0,0,0.6)] transition-all"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Zakaži Konsultaciju
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 hover:text-white hover:border-white font-bold uppercase tracking-wider text-lg px-8 py-6 rounded-none backdrop-blur-sm transition-all"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Naše Usluge
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest">Scroll Down</span>
          <ArrowDown className="animate-bounce w-5 h-5" />
        </motion.div>
      </section>

      {/* Services Section */}
      <Section id="services" title="Naše Usluge" subtitle="Kompletna rešenja za estetiku i zaštitu vašeg vozila.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-80 bg-white/5 rounded-lg animate-pulse" />
            ))
          ) : services?.filter(s => s.isActive).map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white/5 border border-white/10 p-8 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Car className="w-24 h-24" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                {service.description}
              </p>
              <div className="flex justify-between items-end mt-auto">
                <span className="text-2xl font-bold text-white">
                  {service.price}
                </span>
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <ArrowDown className="w-4 h-4 -rotate-90 text-primary group-hover:text-white transition-colors" />
                </span>
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Gallery Section */}
      <Section id="gallery" title="Galerija Radova" subtitle="Pogledajte neke od naših najboljih projekata.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[300px]">
          {galleryLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white/5 rounded-lg animate-pulse" />
            ))
          ) : galleryItems?.filter(i => i.isActive).map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`relative group overflow-hidden rounded-sm cursor-pointer border border-white/10 ${
                idx === 0 || idx === 3 ? "md:col-span-2" : ""
              }`}
            >
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-gray-300 mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {item.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
          {/* Fallback if empty */}
          {(!galleryItems || galleryItems.length === 0) && !galleryLoading && (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              Galerija je trenutno prazna.
            </div>
          )}
        </div>
      </Section>

      {/* Benefits Section */}
      <Section id="benefits" title="Zašto Izabrati Nas?" className="bg-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Star,
              title: "Premium Materijali",
              desc: "Koristimo isključivo folije renomiranih proizvođača kao što su 3M, Avery Dennison i Oracal."
            },
            {
              icon: Shield,
              title: "Garancija Kvaliteta",
              desc: "Svaki naš rad dolazi sa pismenom garancijom na postojanost folije i kvalitet ugradnje."
            },
            {
              icon: Check,
              title: "Sertifikovani Tim",
              desc: "Naši instalateri poseduju međunarodne sertifikate i godine iskustva u industriji."
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-8 border border-white/10 rounded-lg hover:border-primary/50 transition-colors bg-background"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* FAQ Section */}
      <Section id="faq" title="Česta Pitanja">
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              {
                q: "Koliko traje proces presvlačenja vozila?",
                a: "Kompletno presvlačenje vozila obično traje 3 do 5 radnih dana, u zavisnosti od veličine vozila i složenosti zahteva."
              },
              {
                q: "Da li folija oštećuje farbu?",
                a: "Ne, naprotiv. Kvalitetna folija štiti originalnu farbu od ogrebotina, UV zračenja i manjih oštećenja. Prilikom skidanja, farba ostaje netaknuta."
              },
              {
                q: "Kolika je garancija?",
                a: "Garancija zavisi od tipa folije, ali standardno dajemo garanciju od 3 do 7 godina na postojanost materijala i kvalitet radova."
              },
              {
                q: "Kako se održava vozilo sa folijom?",
                a: "Preporučuje se ručno pranje. Izbegavajte automatske perionice sa četkama i agresivna hemijska sredstva."
              }
            ].map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border border-white/10 rounded-lg px-4 bg-white/5 data-[state=open]:border-primary/50">
                <AccordionTrigger className="hover:text-primary transition-colors text-left font-display uppercase tracking-wide text-lg py-6">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* Contact Section */}
      <Section id="contact" title="Kontaktirajte Nas" className="pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold mb-6 text-primary">Informacije</h3>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 rounded flex items-center justify-center shrink-0">
                <MapPin className="text-primary w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold mb-1">Lokacija</h4>
                <p className="text-muted-foreground">Bulevar Oslobođenja 123<br />21000 Novi Sad, Srbija</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 rounded flex items-center justify-center shrink-0">
                <Phone className="text-primary w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold mb-1">Telefon</h4>
                <p className="text-muted-foreground">+381 60 123 4567</p>
                <p className="text-muted-foreground text-sm mt-1">Pon - Pet: 09:00 - 17:00</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 rounded flex items-center justify-center shrink-0">
                <Mail className="text-primary w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold mb-1">Email</h4>
                <p className="text-muted-foreground">info@wrapstudio.rs</p>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-64 bg-white/5 rounded border border-white/10 mt-8 relative overflow-hidden group">
              {/* Using a static map image for demo */}
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1748&auto=format&fit=crop" 
                alt="Map location" 
                className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button variant="outline" className="bg-black/50 backdrop-blur border-primary text-white hover:bg-primary">
                  Otvori Mapu
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/5 p-8 rounded-lg border border-white/10">
            <h3 className="text-2xl font-bold mb-6 text-primary">Pošaljite Poruku</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ime i Prezime</FormLabel>
                      <FormControl>
                        <Input placeholder="Vaše ime" {...field} className="bg-black/50 border-white/10 focus:border-primary h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Adresa</FormLabel>
                      <FormControl>
                        <Input placeholder="vas@email.com" {...field} className="bg-black/50 border-white/10 focus:border-primary h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poruka</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Zanima me presvlačenje vozila..." 
                          {...field} 
                          className="bg-black/50 border-white/10 focus:border-primary min-h-[150px]" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-red-700 text-white font-bold py-6 text-lg uppercase tracking-wider"
                  disabled={isSending}
                >
                  {isSending ? "Slanje..." : "Pošalji Poruku"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </Section>
      
      <footer className="py-8 bg-black border-t border-white/10 text-center text-sm text-gray-500">
        <div className="container mx-auto px-6">
          <p>© {new Date().getFullYear()} WrapStudio. Sva prava zadržana.</p>
        </div>
      </footer>
    </div>
  );
}
