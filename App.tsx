


import React, { useState, useRef, FC, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import OfferSection from './components/OfferSection';
import AboutSection from './components/AboutSection';
import ProcessSection from './components/ProcessSection';
import BookingSection from './components/BookingSection';
import Footer from './components/Footer';
import MultiStepDietModal from './components/MultiStepDietModal';
import TrainerDashboard from './components/TrainerDashboard';
import AdvancedDashboard from './components/AdvancedDashboard';
import TrainerLoginModal from './components/TrainerLoginModal';
import UnifiedLoginModal from './components/UnifiedLoginModal';
import ProtectedTrainerRoute from './components/ProtectedTrainerRoute';
import ApiTestComponent from './components/ApiTestComponent';
import ErrorBoundary from './components/ErrorBoundary';
import { useLanguage, useAuth, UserGoals, Goal, User } from './contexts/LanguageContext';
import SocialLinks from './components/SocialLinks';
import { CloseIcon, AnalyticsIcon, ChevronRightIcon, ListIcon } from './components/icons';

// --- Reusable Input Component ---
const FormInput: FC<{name: string, type: string, placeholder: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean, error?: string, min?: number}> = 
    ({ name, type, placeholder, value, onChange, required, error, min }) => (
    <div>
        <input 
            type={type} 
            name={name} 
            placeholder={placeholder} 
            value={value} 
            onChange={onChange}
            min={min}
            required={required}
            className={`w-full bg-[#333] border rounded-lg p-3 focus:ring-red-500 focus:border-red-500 transition-colors ${error ? 'border-red-500' : 'border-gray-600'}`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);


// --- Goal History Modal ---
interface GoalHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        title: string;
        history: Goal['history'];
        unit: string;
    } | null;
}

const GoalHistoryModal: FC<GoalHistoryModalProps> = ({ isOpen, onClose, data }) => {
    const { t, language } = useLanguage();

    if (!isOpen || !data) return null;

    const reversedHistory = [...data.history].reverse();
    const locale = { pl: 'pl-PL', en: 'en-GB', nl: 'nl-NL', de: 'de-DE' }[language];

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold uppercase text-white font-['Teko']">
                        {t('history_modal.title', { goalTitle: data.title })}
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white"
                        aria-label="Close history modal"
                        title="Close progress history dialog"
                    >
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {reversedHistory.length > 1 ? (
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="border-b border-gray-700">
                                <tr>
                                    <th className="py-2 px-4">{t('history_modal.date_header')}</th>
                                    <th className="py-2 px-4 text-right">{t('history_modal.value_header')} ({data.unit})</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reversedHistory.map((entry, index) => (
                                    <tr key={index} className="border-b border-gray-800 last:border-b-0">
                                        <td className="py-3 px-4">{new Date(entry.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                        <td className="py-3 px-4 text-right font-semibold">{entry.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500 text-center py-8">{t('history_modal.no_history')}</p>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- Dashboard Components ---
const GoalChart: FC<{ history: Goal['history'] }> = ({ history }) => {
    const { language } = useLanguage();
    const [tooltip, setTooltip] = useState<{ x: number, y: number, value: number, date: string } | null>(null);
    const data = history.slice(-10);

    if (data.length < 2) {
        return <div className="h-full flex items-center justify-center text-gray-500 text-sm">Not enough data for chart.</div>;
    }

    const locale = { pl: 'pl-PL', en: 'en-GB', nl: 'nl-NL', de: 'de-DE' }[language];

    const SVG_WIDTH = 300;
    const SVG_HEIGHT = 100;
    const PADDING = 5;

    const values = data.map(h => h.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const valueRange = maxVal - minVal;
    
    // Add padding to prevent chart touching top/bottom edges
    const paddedMin = Math.max(0, minVal - valueRange * 0.1);
    const paddedMax = maxVal + valueRange * 0.1;
    const displayRange = paddedMax - paddedMin;

    const points = data.map((entry, index) => {
        const x = (index / (data.length - 1)) * (SVG_WIDTH - PADDING * 2) + PADDING;
        const y = SVG_HEIGHT - ((entry.value - paddedMin) / (displayRange || 1)) * (SVG_HEIGHT - PADDING * 2) - PADDING;
        return { x, y, value: entry.value, date: entry.date };
    });

    const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} V ${SVG_HEIGHT} H ${points[0].x} Z`;
    
    const handleMouseMove = (e: React.MouseEvent<SVGRectElement, MouseEvent>) => {
        const svg = e.currentTarget.ownerSVGElement;
        if (!svg) return;

        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const cursorPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());
        
        const closestPoint = points.reduce((prev, curr) => 
            Math.abs(curr.x - cursorPoint.x) < Math.abs(prev.x - cursorPoint.x) ? curr : prev
        );

        const formattedDate = new Date(closestPoint.date).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: '2-digit' });
        setTooltip({ x: closestPoint.x, y: closestPoint.y, value: closestPoint.value, date: formattedDate });
    };

    return (
         <div className="w-full h-full relative" onMouseLeave={() => setTooltip(null)}>
            <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 0.6 }} />
                        <stop offset="100%" style={{ stopColor: '#8B5CF6', stopOpacity: 0.0 }} />
                    </linearGradient>
                </defs>

                 {/* Grid lines */}
                {Array.from({ length: 4 }).map((_, i) => (
                    <line key={i} x1="0" y1={(i + 1) * SVG_HEIGHT / 5} x2={SVG_WIDTH} y2={(i + 1) * SVG_HEIGHT / 5} className="crypto-chart-grid" />
                ))}

                <path d={areaPath} className="crypto-chart-area" fill="url(#area-gradient)" />
                <path d={linePath} className="crypto-chart-line" />
                
                {points.map((p, index) => {
                    let pointClass = 'crypto-chart-point-neutral';
                    if (index > 0) {
                        if (data[index].value > data[index - 1].value) pointClass = 'crypto-chart-point-increase';
                        else if (data[index].value < data[index - 1].value) pointClass = 'crypto-chart-point-decrease';
                    }
                     return (
                         <g key={index}>
                            <circle cx={p.x} cy={p.y} r="4" className={`crypto-chart-point ${pointClass}`} />
                         </g>
                    );
                })}
                {/* Invisible hover rectangle */}
                <rect x="0" y="0" width={SVG_WIDTH} height={SVG_HEIGHT} fill="transparent" onMouseMove={handleMouseMove} />
            </svg>
            {tooltip && (
                <div 
                    className="absolute bg-black/80 text-white text-xs px-2 py-1 rounded-md pointer-events-none transition-transform duration-100"
                    style={{ 
                        left: `${(tooltip.x / SVG_WIDTH) * 100}%`, 
                        top: `${(tooltip.y / SVG_HEIGHT) * 100}%`,
                        transform: `translate(-50%, -150%)`,
                        whiteSpace: 'nowrap'
                    }}
                >
                    {tooltip.value} - {tooltip.date}
                </div>
            )}
        </div>
    );
};

const GoalCard: FC<{ title: string; unit: string; goalData: Goal; onUpdate: (newValue: number) => void; onViewHistory: () => void; isTime?: boolean }> = 
    ({ title, unit, goalData, onUpdate, onViewHistory, isTime = false }) => {
    const { t } = useLanguage();
    const [newValue, setNewValue] = useState(goalData.current);
    const [isUpdating, setIsUpdating] = useState(false);
    
    const prevValue = goalData.history.length > 1 ? goalData.history[goalData.history.length - 2].value : goalData.history.length > 0 ? goalData.history[0].value : goalData.current;
    
    const percentageChange = (isTime ? (prevValue - goalData.current) : (goalData.current - prevValue)) / (prevValue !== 0 ? prevValue : 1) * 100;

    const handleUpdate = () => {
        onUpdate(newValue);
        setIsUpdating(false);
    };

    return (
        <div className="bg-[#1E202B] border border-gray-700/50 rounded-2xl p-6 flex flex-col h-full font-sans">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-600/20 p-2 rounded-lg">
                        <AnalyticsIcon className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="text-md font-bold text-gray-200 uppercase tracking-wide">{title}</h3>
                </div>
                 <button onClick={onViewHistory} className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10" aria-label={t('goals.view_history_button')}>
                    <ListIcon className="h-5 w-5" />
                </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4 border-b border-gray-700/50 pb-4">
                <div>
                    <p className="text-sm text-gray-400">{t('goals.current')}</p>
                    <p className="text-3xl font-bold text-white">{goalData.current}</p>
                     {goalData.history.length > 1 && percentageChange !== 0 && (
                      <p className={`text-sm font-semibold ${percentageChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(1)}%
                      </p>
                    )}
                </div>
                 <div>
                    <p className="text-sm text-gray-400">{t('goals.goal')}</p>
                    <p className="text-3xl font-bold text-gray-500">{goalData.goal}</p>
                </div>
            </div>

            <div className="flex-grow h-24 mb-6">
                <GoalChart history={goalData.history} />
            </div>

            <div className="mt-auto">
                 {isUpdating ? (
                    <div className="flex gap-2 w-full">
                        <input 
                            type="number" 
                            value={newValue} 
                            onChange={e => setNewValue(Number(e.target.value))} 
                            className="w-full bg-black/30 border border-white/20 rounded-lg p-2 text-sm text-white focus:ring-purple-500 focus:border-purple-500"
                            aria-label="Enter new goal value"
                            title="New goal value"
                            placeholder="Enter new value"
                        />
                        <button onClick={handleUpdate} className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-transform hover:scale-105">{t('goals.save_button')}</button>
                    </div>
                ) : (
                    <button onClick={() => setIsUpdating(true)} className="w-full btn-purple-grad font-bold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2">
                        <span>{t('goals.update_button')}</span>
                        <ChevronRightIcon className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

interface DashboardProps {
    onClose?: () => void;
}

const Dashboard: FC<DashboardProps> = ({ onClose }) => {
    const { currentUser, updateUser } = useAuth();
    const { t } = useLanguage();
    const [historyModalData, setHistoryModalData] = useState<{ title: string; history: Goal['history']; unit: string } | null>(null);

    if (!currentUser) return null;

    const handleGoalUpdate = (category: keyof UserGoals, newValue: number) => {
        const updatedUser = { ...currentUser };
        const newHistoryEntry = { date: new Date().toISOString(), value: newValue };
        
        if (!Array.isArray(updatedUser.goals[category].history)) {
            updatedUser.goals[category].history = [];
        }
        
        updatedUser.goals[category].current = newValue;
        updatedUser.goals[category].history.push(newHistoryEntry);
        updateUser(updatedUser);
    };

    const goalConfig = [
        { key: 'weight', title: t('goals.weight.title'), unit: 'kg', isTime: true },
        { key: 'pushups', title: t('goals.pushups.title'), unit: t('goals.reps') },
        { key: 'pullups', title: t('goals.pullups.title'), unit: t('goals.reps') },
        { key: 'runDistance', title: t('goals.runDistance.title'), unit: 'km' },
        { key: 'runTime', title: t('goals.runTime.title'), unit: 'min', isTime: true },
        { key: 'boxingDuration', title: t('goals.boxingDuration.title'), unit: 'min' },
    ];

    return (
        <>
            <div className="min-h-screen pt-24 pb-12 dashboard-bg-new">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12 relative">
                        {onClose && (
                            <button 
                                onClick={onClose}
                                className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Zamknij Panel
                            </button>
                        )}
                         <h1 className="text-4xl md:text-5xl font-black uppercase text-white font-['Teko']">{t('dashboard.welcome_message', { name: currentUser.name })}</h1>
                         <p className="text-gray-300 mt-2">{t('dashboard.subtitle')}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {goalConfig.map(config => (
                            <GoalCard 
                                key={config.key}
                                title={config.title}
                                unit={config.unit}
                                goalData={currentUser.goals[config.key as keyof UserGoals]}
                                onUpdate={(val) => handleGoalUpdate(config.key as keyof UserGoals, val)}
                                onViewHistory={() => setHistoryModalData({
                                    title: config.title,
                                    history: currentUser.goals[config.key as keyof UserGoals].history,
                                    unit: config.unit
                                })}
                                isTime={!!config.isTime}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <GoalHistoryModal 
                isOpen={!!historyModalData} 
                onClose={() => setHistoryModalData(null)} 
                data={historyModalData}
            />
        </>
    );
};


const App: React.FC = () => {
    const { currentUser } = useAuth();
    const [isDietModalOpen, setDietModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isTrainerDashboardOpen, setIsTrainerDashboardOpen] = useState(false);
    const [isAdvancedDashboardOpen, setIsAdvancedDashboardOpen] = useState(false);
    const [view, setView] = useState<'landing' | 'dashboard'>('landing');
    const { t } = useLanguage();

    useEffect(() => {
        if (currentUser) {
            setIsLoginModalOpen(false);
            // Nie zmieniamy view - strona główna pozostaje dostępna
        }
    }, [currentUser]);

    const offerRef = useRef<HTMLDivElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);
    const philosophyRef = useRef<HTMLDivElement>(null);
    const bookingRef = useRef<HTMLDivElement>(null);

    const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
        setView('landing');
        // Use timeout to ensure view has switched before scrolling
        setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    const navLinks = [
        { name: t('header.nav.offer'), ref: offerRef },
        { name: t('header.nav.about'), ref: aboutRef },
        { name: t('header.nav.philosophy'), ref: philosophyRef },
        { name: t('header.nav.booking'), ref: bookingRef }
    ];

    return (
        <div className="bg-[#111] text-gray-200 font-sans">
            <Header 
                navLinks={navLinks} 
                scrollTo={scrollTo} 
                onLoginClick={() => setIsLoginModalOpen(true)}
                onDashboardClick={() => setIsAdvancedDashboardOpen(true)}
                onTrainerLoginClick={() => setIsLoginModalOpen(true)}
                onTrainerDashboardClick={() => setIsTrainerDashboardOpen(true)}
                onHomeClick={() => setView('landing')}
            />
            <SocialLinks />
            
            <main>
                <Hero onBookClick={() => scrollTo(bookingRef)} onDietClick={() => setDietModalOpen(true)} />
                <div ref={offerRef}><OfferSection /></div>
                <div ref={aboutRef}><AboutSection /></div>
                <div ref={philosophyRef}><ProcessSection /></div>
                <div ref={bookingRef}><BookingSection /></div>
            </main>
            
            {/* Client Dashboard Modal */}
            {isAdvancedDashboardOpen && currentUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] rounded-xl w-full h-full max-w-7xl max-h-[95vh] overflow-auto">
                        <Dashboard onClose={() => setIsAdvancedDashboardOpen(false)} />
                    </div>
                </div>
            )}
           
            <Footer />
            <MultiStepDietModal isOpen={isDietModalOpen} onClose={() => setDietModalOpen(false)} />
            {/* Trainer Dashboard Modal - tylko gdy ma być otwarty */}
            {isTrainerDashboardOpen && (
                <ProtectedTrainerRoute 
                    fallback={<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-[#1a1a1a] p-6 rounded-lg text-center border border-gray-700">
                            <h2 className="text-xl font-bold mb-4 text-white">Brak autoryzacji</h2>
                            <p className="mb-4 text-gray-300">Musisz być zalogowany jako trener aby uzyskać dostęp do panelu zarządzania.</p>
                            <button 
                                onClick={() => {
                                    setIsTrainerDashboardOpen(false);
                                    setIsLoginModalOpen(true);
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mr-2 transition-colors"
                            >
                                Zaloguj jako trener
                            </button>
                            <button 
                                onClick={() => setIsTrainerDashboardOpen(false)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                            >
                                Zamknij
                            </button>
                        </div>
                    </div>}
                >
                    <TrainerDashboard isOpen={isTrainerDashboardOpen} onClose={() => setIsTrainerDashboardOpen(false)} />
                </ProtectedTrainerRoute>
            )}
            <UnifiedLoginModal 
                isOpen={isLoginModalOpen} 
                onClose={() => setIsLoginModalOpen(false)} 
                onSuccess={() => {
                    setIsLoginModalOpen(false);
                    // Po pomyślnym logowaniu strona główna pozostaje dostępna
                    // Użytkownik może kliknąć przycisk dashboard w headerze
                }} 
            />
            
            {/* API Test Component - Development Only */}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed bottom-4 right-4 z-50">
                    <ApiTestComponent />
                </div>
            )}
        </div>
    );
};

export default App;