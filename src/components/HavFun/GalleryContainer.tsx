import { motion } from 'framer-motion';
import ImageGallery from '@/components/ui/ImageGallery';

const GalleryContainer = () => {
    return (
        <section className="py-20 bg-muted/30 relative">
            <div className="container mx-auto px-4 text-center mb-12">
                <span className="text-primary tracking-widest uppercase text-sm font-bold">Our Gallery</span>
                <h2 className="text-3xl md:text-5xl font-bold mt-4">Captured Moments In Havfun</h2>
                <p className="text-muted-foreground mt-4">Best moments that are captured in our trampoline park are being displayed. Fun and Enjoyment is being perished here.</p>
            </div>

            <div className="container mx-auto px-4">
                <div className="glass-premium p-4 md:p-8 rounded-[2.5rem] border border-border/40 shadow-premium">
                    <ImageGallery />
                </div>
            </div>
        </section>
    );
};

export default GalleryContainer;
