import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  className?: string;
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function Section({ id, className, children, title, subtitle }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative min-h-screen w-full flex flex-col justify-center py-20 px-6 scroll-snap-section border-b border-white/5",
        className
      )}
    >
      <div className="container mx-auto max-w-7xl">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16 text-center"
          >
            {title && (
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display uppercase tracking-tight text-white mb-4">
                {title} <span className="text-primary">.</span>
              </h2>
            )}
            {subtitle && (
              <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
            <div className="h-1 w-24 bg-primary mx-auto mt-6" />
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
