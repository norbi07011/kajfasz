

import React, { useRef } from 'react';
import { FoundationIcon, TransformIcon, EliteIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

// FIX: Change JSX.Element to React.ReactNode to resolve namespace issue
// and define props with an interface for clarity and correctness.
// Also, define OfferCard as a React.FC to correctly handle React-specific props like 'key'.
interface OfferCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const OfferCard: React.FC<OfferCardProps> = ({ icon, title, description }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;

        const { left, top, width, height } = card.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        
        const rotateX = -1 * ((y - height / 2) / (height / 2)) * 12;
        const rotateY = ((x - width / 2) / (width / 2)) * 12;

        card.style.transform = `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transform = 'perspective(2000px) rotateX(0deg) rotateY(0deg)';
    };

    return (
        <div 
            ref={cardRef} 
            className="offer-card-container w-[320px] h-[450px] transition-transform duration-300 ease-out rounded-3xl relative" 
            style={{ transformStyle: 'preserve-3d' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="absolute inset-0 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl offer-card-content"></div>
            
            <div className="relative w-full h-full p-8 flex flex-col justify-center items-center text-center">
                <div 
                    className="mb-6 bg-red-600/20 h-24 w-24 rounded-full flex items-center justify-center"
                    style={{ transform: 'translateZ(50px)' }}
                >
                    <div className="h-20 w-20 rounded-full bg-red-600 flex items-center justify-center">
                        {icon}
                    </div>
                </div>
                <h3 
                    className="text-3xl font-bold uppercase text-white mb-4 font-['Teko']"
                    style={{ transform: 'translateZ(40px)', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                >
                    {title}
                </h3>
                <p 
                    className="text-gray-300 text-sm leading-relaxed"
                    style={{ transform: 'translateZ(25px)', textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}
                >
                    {description}
                </p>
            </div>
        </div>
    );
};


const OfferSection: React.FC = () => {
    const { t } = useLanguage();

    const offers = [
        {
            icon: <FoundationIcon />,
            title: t('offer.cards.foundation.title'),
            description: t('offer.cards.foundation.description')
        },
        {
            icon: <TransformIcon />,
            title: t('offer.cards.transformation.title'),
            description: t('offer.cards.transformation.description')
        },
        {
            icon: <EliteIcon />,
            title: t('offer.cards.elite.title'),
            description: t('offer.cards.elite.description')
        }
    ];

    return (
        <section className="bg-black py-20">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-black uppercase text-white font-['Teko']">{t('offer.title')}</h2>
                <p className="text-gray-400 mt-2 mb-12 max-w-2xl mx-auto">
                    {t('offer.subtitle')}
                </p>
                <div className="flex flex-wrap justify-center items-center gap-12 mt-16">
                    {offers.map((offer, index) => (
                        <OfferCard key={index} icon={offer.icon} title={offer.title} description={offer.description} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OfferSection;