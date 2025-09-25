import React, { useState, useEffect } from 'react';
import { useLanguage, Language, useAuth } from '../contexts/LanguageContext';
import { MenuIcon, CloseIcon } from './icons';

interface NavLink {
    name: string;
    ref: React.RefObject<HTMLDivElement>;
}

interface HeaderProps {
    navLinks: NavLink[];
    scrollTo: (ref: React.RefObject<HTMLDivElement>) => void;
    onLoginClick: () => void;
    onDashboardClick: () => void;
    onTrainerDashboardClick: () => void;
    onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ navLinks, scrollTo, onLoginClick, onDashboardClick, onTrainerDashboardClick, onHomeClick }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();
    const { currentUser, logout } = useAuth();

    const languages: { key: Language, label: string }[] = [
        { key: 'pl', label: 'PL' },
        { key: 'en', label: 'EN' },
        { key: 'nl', label: 'NL' },
        { key: 'de', label: 'DE' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const handleMobileLinkClick = (ref: React.RefObject<HTMLDivElement>) => {
        scrollTo(ref);
        setMobileMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
        onHomeClick();
    };
    
    const handleDashboardClick = () => {
        onDashboardClick();
        setMobileMenuOpen(false);
    }

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent'}`}>
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <button onClick={onHomeClick} className="text-3xl font-bold uppercase tracking-wider font-['Teko']">KAJFASZ</button>
                    <nav className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <button key={link.name} onClick={() => scrollTo(link.ref)} className="text-gray-300 hover:text-red-500 transition-colors duration-300 uppercase text-sm font-semibold">
                                {link.name}
                            </button>
                        ))}
                    </nav>
                    <div className="flex items-center space-x-4">
                         <div className="relative" onMouseLeave={() => setDropdownOpen(false)}>
                            <button onMouseEnter={() => setDropdownOpen(true)} className="flex items-center space-x-1 text-sm font-semibold text-gray-300 hover:text-white">
                                <span>{languages.find(l => l.key === language)?.label}</span>
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-24 bg-black/90 border border-gray-700 rounded-md shadow-lg py-1">
                                    {languages.map(({ key, label }) => (
                                        <button
                                            key={key}
                                            onClick={() => { setLanguage(key); setDropdownOpen(false); }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
                                        >
                                            {label} ({t(key as any)})
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="hidden sm:flex items-center space-x-2">
                             {currentUser ? (
                                <>
                                    <button onClick={onDashboardClick} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full transition-colors duration-300 text-sm">{t('header.nav.dashboard')}</button>
                                    <button onClick={onTrainerDashboardClick} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full transition-colors duration-300 text-sm">Panel Trenera</button>
                                    <button onClick={handleLogout} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-5 rounded-full transition-colors duration-300 text-sm">{t('header.nav.logout')}</button>
                                </>
                            ) : (
                                <button onClick={onLoginClick} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full transition-colors duration-300 text-sm">{t('header.nav.login')}</button>
                            )}
                        </div>

                        <div className="md:hidden">
                            <button 
                                onClick={() => setMobileMenuOpen(true)} 
                                className="text-white p-1"
                                aria-label="Open mobile menu"
                                title="Open navigation menu"
                            >
                                <MenuIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className={`fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-6 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <button 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="absolute top-6 right-6 text-gray-400 hover:text-white"
                    aria-label="Close mobile menu"
                    title="Close navigation menu"
                >
                    <CloseIcon className="h-8 w-8" />
                </button>
                
                <nav className="flex flex-col items-center space-y-8">
                    {navLinks.map((link) => (
                        <button 
                            key={link.name} 
                            onClick={() => handleMobileLinkClick(link.ref)} 
                            className="text-gray-300 hover:text-red-500 transition-colors duration-300 uppercase text-2xl font-semibold"
                        >
                            {link.name}
                        </button>
                    ))}
                </nav>

                <div className="mt-12 flex flex-col items-center space-y-4">
                    {currentUser ? (
                         <>
                            <button onClick={handleDashboardClick} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 text-lg">{t('header.nav.dashboard')}</button>
                            <button onClick={handleLogout} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 text-lg">{t('header.nav.logout')}</button>
                         </>
                    ) : (
                         <button onClick={() => { onLoginClick(); setMobileMenuOpen(false); }} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 text-lg">{t('header.nav.login')}</button>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;