import React, { useState, useCallback, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

const imageItems = [
    { type: 'image', url: 'https://picsum.photos/seed/fighter1/600/800' },
    { type: 'image', url: 'https://picsum.photos/seed/fighter2/600/800' },
    { type: 'image', url: 'https://picsum.photos/seed/fighter3/600/800' },
    { type: 'image', url: 'https://picsum.photos/seed/fighter4/600/800' },
    { type: 'image', url: 'https://picsum.photos/seed/fighter5/600/800' },
    { type: 'image', url: 'https://picsum.photos/seed/fighter6/600/800' },
];

const videoItems = [
    { type: 'video', posterUrl: 'https://picsum.photos/seed/training1/600/800', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { type: 'video', posterUrl: 'https://picsum.photos/seed/training2/600/800', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { type: 'video', posterUrl: 'https://picsum.photos/seed/training3/600/800', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { type: 'video', posterUrl: 'https://picsum.photos/seed/training4/600/800', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
];


const AboutSection: React.FC = () => {
    const { t } = useLanguage();
    const [imageRotation, setImageRotation] = useState(0);
    const [videoRotation, setVideoRotation] = useState(0);

    const imageAngle = 360 / imageItems.length;
    const videoAngle = 360 / videoItems.length;

    const cardRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        const img = imgRef.current;
        if (!card || !img) return;

        const { left, top, width, height } = card.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        const rotateX = -1 * ((y - height / 2) / (height / 2)) * 10;
        const rotateY = ((x - width / 2) / (width / 2)) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        const imgRotateX = -1 * ((y - height / 2) / (height / 2)) * 20; // Increased rotation for more parallax
        const imgRotateY = ((x - width / 2) / (width / 2)) * 20; // Increased rotation for more parallax
        img.style.transform = `translateZ(60px) rotateX(${imgRotateX}deg) rotateY(${imgRotateY}deg)`;

        const content = card.querySelector('.about-card-content') as HTMLElement;
        if (content) {
            content.style.setProperty('--mouse-x', `${x}px`);
            content.style.setProperty('--mouse-y', `${y}px`);
        }
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        const img = imgRef.current;
        if (!card || !img) return;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        img.style.transform = 'translateZ(60px) rotateX(0deg) rotateY(0deg)';
    };

    const rotateImageCarousel = useCallback((direction: 'next' | 'prev') => {
        setImageRotation(prev => prev + (direction === 'next' ? -imageAngle : imageAngle));
    }, [imageAngle]);
    
    const rotateVideoCarousel = useCallback((direction: 'next' | 'prev') => {
        setVideoRotation(prev => prev + (direction === 'next' ? -videoAngle : videoAngle));
    }, [videoAngle]);

    const radius = 300; // Adjust this for circle size

    return (
        <section className="bg-black py-20 overflow-hidden">
            <div className="container mx-auto px-6 text-center">
                 {/* Bio Section */}
                <div 
                    className="max-w-3xl mx-auto mb-20 relative about-card-container transition-transform duration-300"
                    style={{ transformStyle: 'preserve-3d' }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    ref={cardRef}
                >
                    <div className="about-card-content bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 shadow-2xl relative w-full" style={{ transformStyle: 'preserve-3d' }}>
                        <img 
                            ref={imgRef}
                            src="https://picsum.photos/seed/logo/150/150" 
                            alt="Kajfasz Logo" 
                            className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-red-600 shadow-lg"
                            style={{ transform: 'translateZ(60px)', transition: 'transform 0.2s ease-out' }}
                        />
                        <h2 
                            className="text-3xl font-bold uppercase text-white font-['Teko']"
                            style={{ transform: 'translateZ(40px)', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                        >
                            {t('about.name')}
                        </h2>
                        <p 
                            className="text-gray-400 mt-4 leading-relaxed max-w-xl mx-auto"
                            style={{ transform: 'translateZ(30px)' }}
                        >
                            {t('about.description')}
                        </p>
                        <p 
                            className="text-red-500 italic mt-6 font-semibold"
                            style={{ transform: 'translateZ(20px)' }}
                        >
                            "{t('about.quote')}"
                        </p>
                    </div>
                </div>


                {/* Image Carousel */}
                <div className="mb-20">
                    <h3 className="text-4xl md:text-5xl font-black uppercase text-white font-['Teko'] mb-12">{t('about.gallery_title')}</h3>
                    <div className="relative h-[500px] flex items-center justify-center">
                        <div className="carousel-container w-full h-full">
                            <div className="carousel w-full h-full" style={{ transform: `rotateY(${imageRotation}deg)` }}>
                                {imageItems.map((item, index) => (
                                    <div
                                        key={`img-${index}`}
                                        className="carousel-item w-[280px] h-[420px] rounded-lg overflow-hidden bg-[#1a1a1a]"
                                        style={{ transform: `rotateY(${index * imageAngle}deg) translateZ(${radius}px)` }}
                                    >
                                        <img src={item.url} alt={`Gallery item ${index + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-16 space-x-6">
                        <button onClick={() => rotateImageCarousel('prev')} className="p-4 bg-[#1a1a1a] border border-gray-800 rounded-full text-white hover:bg-red-600 transition-colors">
                            <ChevronLeftIcon />
                        </button>
                        <button onClick={() => rotateImageCarousel('next')} className="p-4 bg-[#1a1a1a] border border-gray-800 rounded-full text-white hover:bg-red-600 transition-colors">
                            <ChevronRightIcon />
                        </button>
                    </div>
                </div>

                 {/* Video Carousel */}
                <div>
                    <h3 className="text-4xl md:text-5xl font-black uppercase text-white font-['Teko'] mb-12">{t('about.video_gallery_title')}</h3>
                    <div className="relative h-[500px] flex items-center justify-center">
                        <div className="carousel-container w-full h-full">
                            <div className="carousel w-full h-full" style={{ transform: `rotateY(${videoRotation}deg)` }}>
                                {videoItems.map((item, index) => (
                                    <div
                                        key={`vid-${index}`}
                                        className="carousel-item w-[280px] h-[420px] rounded-lg overflow-hidden bg-black"
                                        style={{ transform: `rotateY(${index * videoAngle}deg) translateZ(${radius}px)` }}
                                    >
                                        <video
                                            src={item.videoUrl}
                                            poster={item.posterUrl}
                                            controls
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-16 space-x-6">
                        <button onClick={() => rotateVideoCarousel('prev')} className="p-4 bg-[#1a1a1a] border border-gray-800 rounded-full text-white hover:bg-red-600 transition-colors">
                            <ChevronLeftIcon />
                        </button>
                        <button onClick={() => rotateVideoCarousel('next')} className="p-4 bg-[#1a1a1a] border border-gray-800 rounded-full text-white hover:bg-red-600 transition-colors">
                            <ChevronRightIcon />
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default AboutSection;