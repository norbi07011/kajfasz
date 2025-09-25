import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ProcessSection: React.FC = () => {
    const { t } = useLanguage();

    const steps = [
        {
            number: 1,
            title: t('process.steps.1.title'),
            description: t('process.steps.1.description')
        },
        {
            number: 2,
            title: t('process.steps.2.title'),
            description: t('process.steps.2.description')
        },
        {
            number: 3,
            title: t('process.steps.3.title'),
            description: t('process.steps.3.description')
        }
    ];

    return (
        <section className="py-20 bg-[#111]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                     <h2 className="text-4xl md:text-5xl font-black uppercase text-white font-['Teko']">{t('process.title')}</h2>
                     <p className="text-gray-400 mt-2 mb-12 max-w-3xl mx-auto">
                        {t('process.subtitle')}
                     </p>
                </div>
                <div className="max-w-3xl mx-auto space-y-8">
                    {steps.map((step) => (
                        <div key={step.number} className="flex items-center space-x-6">
                             <div className="flex-shrink-0 flex items-center justify-center h-20 w-20 rounded-full bg-red-600 text-white font-black text-4xl shadow-lg">
                                {step.number}
                            </div>
                            <div className="bg-[#1a1a1a] border border-gray-800 p-6 rounded-lg flex-grow">
                                <h3 className="text-xl font-bold uppercase text-white mb-2 font-['Teko']">{step.title}</h3>
                                <p className="text-gray-400">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;
