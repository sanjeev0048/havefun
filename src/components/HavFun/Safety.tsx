import { motion } from 'framer-motion';
import { Shield, LifeBuoy, Heart, Sparkles } from 'lucide-react';

const SAFETY_FEATURES = [
    {
        title: "Trained Professionals",
        description: "Certified instructors ensuring safe play and guidance throughout your visit.",
        icon: "https://havfuntrampolinepark.com/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-08-at-4.17.20-PM3.jpeg1_.png"
    },
    {
        title: "Safety Equipment",
        description: "Non-slip socks, padded walls, and premium springs for maximum safety.",
        icon: "https://havfuntrampolinepark.com/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-08-at-4.17.20-PM3.png"
    },
    {
        title: "First-Aid Ready",
        description: "First-aid certified staff always available for immediate assistance.",
        icon: "https://havfuntrampolinepark.com/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-08-at-4.17.20-PM2.jpeg.png"
    },
    {
        title: "Clean and Sanitized",
        description: "Daily cleaning and strict hygiene protocols maintained throughout the park.",
        icon: "https://havfuntrampolinepark.com/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-08-at-4.17.20-PM11.png"
    }
];

const Safety = () => {
    return (
        <section className="py-28 bg-background relative overflow-hidden">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]"
                    >
                        Safe & Secure
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight"
                    >
                        Ensuring a Clean, Safe, and <br /><span className="text-primary italic">Fun Environment</span> for Everyone!
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-xl font-light"
                    >
                        At HaveFun, your safety and comfort are our top priorities. We go the extra mile with daily sanitization, rigorous equipment inspections, and certified staff.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
                    {SAFETY_FEATURES.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.6 }}
                            whileHover={{
                                y: -10,
                                rotateY: 10,
                                transition: { duration: 0.4 }
                            }}
                            className="bg-card/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 hover:border-primary/40 transition-all group text-center perspective-1000"
                        >
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 + 0.3 }}
                                className="mb-8 mx-auto p-4 rounded-3xl bg-white/5 border border-white/10 w-28 h-28 flex items-center justify-center group-hover:shadow-neon transition-all duration-500 overflow-hidden ring-1 ring-primary/0 group-hover:ring-primary/40"
                            >
                                <img src={feature.icon} alt={feature.title} className="w-full h-full object-contain group-hover:scale-125 transition-transform duration-500" />
                            </motion.div>
                            <h3 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-primary transition-colors">{feature.title}</h3>
                            <p className="text-muted-foreground text-base leading-relaxed font-light">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Safety;
