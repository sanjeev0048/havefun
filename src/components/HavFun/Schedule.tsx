import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ExternalLink } from 'lucide-react';
import { PRICING_CONFIG } from '@/lib/pricing-config';
import PremiumButton from '@/components/ui/PremiumButton';

const Schedule = () => {
    return (
        <section id="schedule" className="py-24 bg-card/20 border-t border-border/40 relative">
            <div className="container mx-auto px-4 text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest"
                    >
                        <CalendarIcon className="w-4 h-4" /> Seamless Planning
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-6xl font-bold">Schedule Your <span className="text-primary italic">Session</span></h2>
                    
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Beyond just jumping, we offer curated time slots for private events, fitness sessions, and group leaps. 
                        Use our official booking portal to secure your place in the sky.
                    </p>

                    <div className="flex flex-col items-center gap-6">
                        <a 
                            href={PRICING_CONFIG.bookingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full max-w-xs"
                        >
                            <PremiumButton className="w-full h-16 text-lg group">
                                Book on Calendly <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </PremiumButton>
                        </a>
                        
                        <p className="text-xs text-muted-foreground italic">
                            *This will redirect you to our secure scheduling portal powered by Google/Calendly.
                        </p>
                    </div>

                    {/* Fun Fact / Stat */}
                    <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: "Slots Daily", value: "24+" },
                            { label: "Peak Efficiency", value: "98%" },
                            { label: "Instant Sync", value: "100%" },
                            { label: "No Wait Time", value: "Guaranteed" }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-1">
                                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                                <div className="text-[10px] uppercase tracking-tighter text-muted-foreground font-black">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Schedule;
