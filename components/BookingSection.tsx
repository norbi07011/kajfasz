import React, { useState } from 'react';
import { WhatsAppIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

const BookingSection: React.FC = () => {
    const { t, language } = useLanguage();
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 8, 27)); // Example date
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 8, 1));
    const [selectedTime, setSelectedTime] = useState<string | null>('11:00');
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        level: 'intermediate',
        message: '',
    });

    const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleInputChange = <T,>(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };
    
    const timeSlots = ["08:00", "09:30", "11:00", "12:30", "17:00", "18:30", "20:00"];

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const changeMonth = (offset: number) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };
    
    const generateCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const totalDays = daysInMonth(year, month);
        const firstDay = firstDayOfMonth(year, month);
        const blanks = Array(firstDay === 0 ? 6 : firstDay - 1).fill(null);
        const days = Array.from({ length: totalDays }, (_, i) => i + 1);

        return [...blanks, ...days].map((day, index) => {
             if (!day) return <div key={`blank-${index}`} className="p-2"></div>;
             const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
             return (
                <div key={day} 
                     onClick={() => setSelectedDate(new Date(year, month, day))}
                     className={`p-2 text-center rounded-full cursor-pointer transition-colors ${isSelected ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`}>
                    {day}
                </div>
             );
        });
    };

    const validateForm = (): boolean => {
        const newErrors: { name?: string; email?: string } = {};
        if (!formData.name.trim()) {
            newErrors.name = t('booking.form.errors.name_required');
        }
        if (!formData.email.trim()) {
            newErrors.email = t('booking.form.errors.email_required');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('booking.form.errors.email_invalid');
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleWhatsAppSubmit = () => {
        if (!validateForm()) return;
        setIsConfirmModalOpen(true);
    };
    
    const confirmAndSendWhatsApp = () => {
        const phoneNumber = "31613877931"; // Updated phone number
        const locale = { pl: 'pl-PL', en: 'en-US', nl: 'nl-NL', de: 'de-DE' }[language];
        const dateStr = selectedDate.toLocaleDateString(locale);
        let message = t('booking.whatsapp.greeting') + `\n\n`;
        message += `${t('booking.whatsapp.appointment')}: ${dateStr} @ ${selectedTime}\n`;
        message += `${t('booking.whatsapp.name')}: ${formData.name}\n`;
        message += `${t('booking.whatsapp.email')}: ${formData.email}\n`;
        if (formData.phone) message += `${t('booking.whatsapp.phone')}: ${formData.phone}\n`;
        message += `${t('booking.whatsapp.level')}: ${t('booking.form.levels.' + formData.level)}\n`;
        message += `${t('booking.whatsapp.goal')}: ${formData.message}\n`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        setIsConfirmModalOpen(false);
    };
    
    const locale = { pl: 'pl-PL', en: 'en-US', nl: 'nl-NL', de: 'de-DE' }[language];

    return (
        <section className="py-20 bg-[#111]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black uppercase text-white font-['Teko']">{t('booking.title')}</h2>
                    <p className="text-gray-400 mt-2 max-w-2xl mx-auto">{t('booking.subtitle')}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 bg-[#1a1a1a] p-8 rounded-lg border border-gray-800">
                    <div>
                         {/* Calendar */}
                        <div className="bg-[#222] p-4 rounded-lg">
                           <div className="flex justify-between items-center mb-4">
                               <button onClick={() => changeMonth(-1)}>&lt;</button>
                               <h3 className="font-bold text-lg uppercase">{currentMonth.toLocaleString(locale, { month: 'long', year: 'numeric' })}</h3>
                               <button onClick={() => changeMonth(1)}>&gt;</button>
                           </div>
                           <div className="grid grid-cols-7 gap-1 text-sm text-gray-400 mb-2">
                               {t('booking.calendar.days').split(',').map((d: string) => <div key={d} className="text-center font-semibold">{d}</div>)}
                           </div>
                           <div className="grid grid-cols-7 gap-1">{generateCalendar()}</div>
                        </div>
                         {/* Time Slots */}
                         <div className="mt-6">
                             <h3 className="font-bold mb-4 uppercase text-center">{t('booking.calendar.select_time')}</h3>
                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {timeSlots.map(time => (
                                    <button key={time} onClick={() => setSelectedTime(time)} className={`p-3 rounded-lg transition-colors ${selectedTime === time ? 'bg-red-600 text-white' : 'bg-[#222] hover:bg-gray-700'}`}>{time}</button>
                                ))}
                             </div>
                         </div>
                    </div>
                    
                    <div>
                        <div className="bg-[#222] p-6 rounded-lg">
                             <h3 className="font-bold uppercase text-lg mb-2">{t('booking.form.title')}</h3>
                             <p className="text-red-500 mb-4">{t('booking.form.selected_date')}: <span className="font-bold">{selectedDate.toLocaleDateString(locale)} @ {selectedTime}</span></p>
                             <form className="space-y-4">
                                <div>
                                    <input type="text" name="name" placeholder={t('booking.form.placeholders.name')} className={`w-full bg-[#333] border rounded-lg p-3 focus:ring-red-500 focus:border-red-500 ${errors.name ? 'border-red-500' : 'border-gray-600'}`} value={formData.name} onChange={handleInputChange} />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <input type="email" name="email" placeholder={t('booking.form.placeholders.email')} className={`w-full bg-[#333] border rounded-lg p-3 focus:ring-red-500 focus:border-red-500 ${errors.email ? 'border-red-500' : 'border-gray-600'}`} value={formData.email} onChange={handleInputChange} />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <input type="tel" name="phone" placeholder={t('booking.form.placeholders.phone')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3 focus:ring-red-500 focus:border-red-500" value={formData.phone} onChange={handleInputChange} />
                                <select name="level" className="w-full bg-[#333] border-gray-600 rounded-lg p-3 focus:ring-red-500 focus:border-red-500" value={formData.level} onChange={handleInputChange}>
                                    <option value="beginner">{t('booking.form.levels.beginner')}</option>
                                    <option value="intermediate">{t('booking.form.levels.intermediate')}</option>
                                    <option value="advanced">{t('booking.form.levels.advanced')}</option>
                                </select>
                                <textarea name="message" rows={4} placeholder={t('booking.form.placeholders.message')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3 focus:ring-red-500 focus:border-red-500" value={formData.message} onChange={handleInputChange}></textarea>
                                <button type="button" onClick={handleWhatsAppSubmit} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                                    <WhatsAppIcon />
                                    <span>{t('booking.form.submit_button')}</span>
                                </button>
                             </form>
                        </div>
                    </div>
                </div>
            </div>

            {isConfirmModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-8 shadow-lg max-w-sm w-full text-center">
                        <h3 className="text-2xl font-bold uppercase text-white font-['Teko'] mb-4">{t('booking.confirm_modal.title')}</h3>
                        <p className="text-gray-400 mb-6">
                            {t('booking.confirm_modal.message_part1')}{' '}
                            <span className="font-bold text-red-500">{selectedDate.toLocaleDateString(locale)}</span>
                            {' '}{t('booking.confirm_modal.message_part2')}{' '}
                            <span className="font-bold text-red-500">{selectedTime}</span>?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setIsConfirmModalOpen(false)} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                {t('booking.confirm_modal.cancel_button')}
                            </button>
                            <button onClick={confirmAndSendWhatsApp} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                {t('booking.confirm_modal.confirm_button')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default BookingSection;