import React from 'react';
import { InstagramIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-black border-t border-gray-800 py-10">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-2xl font-bold uppercase tracking-wider font-['Teko']">KAJFASZ</h3>
                        <p className="text-gray-400 text-sm mt-2">{t('footer.slogan')}</p>
                    </div>
                    <div>
                        <h4 className="font-bold uppercase text-gray-400">{t('footer.follow')}</h4>
                        <div className="flex justify-center md:justify-start mt-4">
                             <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
                               <InstagramIcon />
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold uppercase text-gray-400">{t('footer.contact')}</h4>
                        <p className="text-gray-400 text-sm mt-4">Email: <a href="mailto:jakubsorota8@gmail.com" className="hover:text-red-500">jakubsorota8@gmail.com</a></p>
                    </div>
                </div>
                <div className="text-center text-gray-500 text-xs mt-10 pt-6 border-t border-gray-800">
                    &copy; {new Date().getFullYear()} KAJFASZ. {t('footer.copyright')}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
