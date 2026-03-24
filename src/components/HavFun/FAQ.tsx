import { motion } from 'framer-motion';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
    {
        question: "What are the park hours?",
        answer: "Our trampoline park is open from 10 AM to 10 PM, Monday through Sunday."
    },
    {
        question: "What should I wear?",
        answer: "We recommend wearing comfortable athletic clothing and non-slip socks, which can be purchased at the park if you don’t have your own."
    },
    {
        question: "Are there age restrictions?",
        answer: "We have designated areas for different age groups to ensure safety. Children below 6 years have their designated zone."
    },
    {
        question: "Can I bring food and drinks?",
        answer: "Outside food and beverages are not allowed, but we have a snack bar offering a variety of refreshments."
    },
    {
        question: "What safety measures do you have in place?",
        answer: "We prioritize safety with padded walls, non-slip socks, and regular equipment inspections. Our trained staff are always on hand to enforce safety rules and assist guests."
    },
    {
        question: "Is there a weight limit?",
        answer: "Yes, our trampoline park has a weight limit of 100 kgs to ensure the safety of all guests. Please contact us for further details."
    }
];

const FAQ = () => {
    return (
        <section className="py-20 bg-background relative">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <span className="text-primary tracking-widest uppercase text-sm font-bold">FAQ</span>
                    <h2 className="text-3xl md:text-5xl font-bold mt-4">General Questions</h2>
                    <p className="text-muted-foreground mt-4">Have questions? Check out our FAQ for quick answers on safety, bookings, and park rules.</p>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, idx) => (
                        <motion.div
                            key={idx}
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
