import { motion } from 'framer-motion';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useFaqs } from '@/hooks/useContent';

const FAQ = () => {
    const { data: faqs = [] } = useFaqs();

    return (
        <section className="py-20 bg-background relative">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <span className="text-primary tracking-widest uppercase text-sm font-bold">FAQ</span>
                    <h2 className="text-3xl md:text-5xl font-bold mt-4">General Questions</h2>
                    <p className="text-muted-foreground mt-4">Have questions? Check out our FAQ for quick answers on safety, bookings, and park rules.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={faq.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-premium rounded-3xl border border-border/40 shadow-sm overflow-hidden"
                        >
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value={`item-${idx}`} className="border-none">
                                    <AccordionTrigger className="text-left font-bold text-lg hover:text-primary transition-colors py-6 px-8">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 px-8 pt-0">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
