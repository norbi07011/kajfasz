import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
    onBookClick: () => void;
    onDietClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookClick, onDietClick }) => {
    const { t } = useLanguage();

    return (
        <section className="h-screen bg-image-hero flex items-center justify-center text-center text-white">
            <div className="container mx-auto px-6">
                <h2 className="text-red-500 font-bold uppercase tracking-widest">{t('hero.subtitle')}</h2>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase my-4 font-['Teko'] tracking-wider" style={{ textShadow: '0px 4px 10px rgba(0,0,0,0.7)' }}>
                    {t('hero.title_1')} <br /> {t('hero.title_2')}
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                    {t('hero.description')}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button onClick={onBookClick} className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full transition-transform duration-300 transform hover:scale-105 uppercase text-lg">
                        {t('hero.cta_transform')}
                    </button>
                    <button onClick={onDietClick} className="bg-gray-700/50 hover:bg-gray-600/60 backdrop-blur-sm border border-gray-500 text-white font-bold py-4 px-10 rounded-full transition-transform duration-300 transform hover:scale-105 uppercase text-lg">
                        {t('hero.cta_diet')}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
