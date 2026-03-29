import React from 'react';
import BookingAssistant from '@/components/HavFun/BookingAssistant';
import { motion } from 'framer-motion';
import { ShieldCheck, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Booking = () => {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground relative overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[120px] rounded-full" />
            </div>

            <nav className="relative z-20 flex items-center justify-between px-8 py-6 opacity-80 backdrop-blur-md border-b border-white/10 sticky top-0">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-2 rounded-xl bg-card border border-border group-hover:border-primary/40 transition-all">
                        <ChevronLeft className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest group-hover:text-primary transition-colors">Go Back</span>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                        <span className="font-serif font-black">H</span>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 container mx-auto px-4 py-20 min-h-[calc(100vh-84px)] flex flex-col items-center justify-center">
                <BookingAssistant />
                
                <div className="mt-16 flex items-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black">
                        <ShieldCheck className="w-4 h-4" /> Secure Booking
                    </div>
                    <div className="w-px h-4 bg-border" />
                    <div className="text-[10px] uppercase tracking-widest font-black">Instant Confirmation</div>
                </div>
            </main>

            <footer className="relative z-10 py-10 opacity-60 text-center">
                <p className="text-[10px] uppercase tracking-[0.4em]">Safety • Joy • Legacy</p>
            </footer>
        </div>
    );
};

export default Booking;
