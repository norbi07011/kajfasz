import React, { useState } from 'react';
import { WhatsAppIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface DietModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DietModal: React.FC<DietModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        // 1) Contact
        firstName: '', lastName: '', email: '', phone: '', birthDate: '', gender: '',
        // 2) Params & Goal
        height: '', weight: '', bodyFat: '', trainingExperience: '1-3y', trainingFrequency: '', trainingType: 'strength',
        activity: 'moderate', goal: 'reduction', pace: 'p_5',
        // 3) Diet Choice
        dietType: '',
        // 4) Health & Lifestyle
        intolerances: [] as string[], allergyInfo: '', healthInfo: '', medications: '', digestionIssues: [] as string[],
        sleepQuality: 'good', stressLevel: 'moderate', hydration: '',
        // 5) Dietary Habits
        eatingHabits: 'regular', cookingSkills: 'intermediate', foodPrepTime: '30-60min', sweetSnacks: 'sometimes', saltySnacks: 'sometimes',
        likedProducts: '', dislikedProducts: '',
        // 6) Cuisine
        cuisines: [] as string[],
        // 7) Arrangements
        mealsPerDay: '4', mealTimes: '', budget: 'medium', supplementsUsed: '', notes: '',
    });

    const handleInputChange = <T,>(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMultiSelect = (category: 'intolerances' | 'cuisines' | 'digestionIssues', value: string) => {
        setFormData(prev => {
            const current = prev[category] as string[];
            const updated = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
            return { ...prev, [category]: updated };
        });
    };
    
    const handleWhatsAppSubmit = () => {
        const phoneNumber = "31613877931"; // Updated phone number
        const w = (key: string) => t(`diet_modal.whatsapp.${key}`);
        const o = (path: string, key: string) => t(`diet_modal.options.${path}.${key}`);
        const none = w('none');
        
        let message = `${w('title')}\n\n`;
        // Section 1
        message += `${w('s1_title')}\n${w('name')}: ${formData.firstName}\n${w('surname')}: ${formData.lastName}\nEmail: ${formData.email}\n${w('phone')}: ${formData.phone}\n${w('dob')}: ${formData.birthDate}\n${w('gender')}: ${formData.gender || none}\n\n`;
        // Section 2
        message += `${w('s2_title')}\n${w('height')}: ${formData.height} cm\n${w('weight')}: ${formData.weight} kg\n${w('bodyFat')}: ${formData.bodyFat ? formData.bodyFat + '%' : none}\n${w('activity')}: ${o('activity', formData.activity)}\n${w('goal')}: ${o('goal', formData.goal)}\n${w('pace')}: ${o('pace', formData.pace)}\n${w('trainingExp')}: ${o('trainingExperience', formData.trainingExperience)}\n${w('trainingFreq')}: ${formData.trainingFrequency ? formData.trainingFrequency + ' ' + w('timesPerWeek') : none}\n${w('trainingType')}: ${o('trainingType', formData.trainingType)}\n\n`;
        // Section 3
        message += `${w('s3_title')}\n${w('dietType')}: ${formData.dietType || none}\n\n`;
        // Section 4
        message += `${w('s4_title')}\n${w('intolerances')}: ${formData.intolerances.join(', ') || none}\n${w('allergies')}: ${formData.allergyInfo || none}\n${w('diseases')}: ${formData.healthInfo || none}\n${w('meds')}: ${formData.medications || none}\n${w('digestion')}: ${formData.digestionIssues.join(', ') || none}\n${w('sleep')}: ${o('sleepQuality', formData.sleepQuality)}\n${w('stress')}: ${o('stressLevel', formData.stressLevel)}\n${w('hydration')}: ${formData.hydration ? formData.hydration + ' L' : none}\n\n`;
        // Section 5
        message += `${w('s5_title')}\n${w('eatingHabits')}: ${o('eatingHabits', formData.eatingHabits)}\n${w('cookingSkills')}: ${o('cookingSkills', formData.cookingSkills)}\n${w('prepTime')}: ${o('foodPrepTime', formData.foodPrepTime)}\n${w('sweetSnacks')}: ${o('snackPrefs', formData.sweetSnacks)}\n${w('saltySnacks')}: ${o('snackPrefs', formData.saltySnacks)}\n${w('likedProducts')}: ${formData.likedProducts || none}\n${w('dislikedProducts')}: ${formData.dislikedProducts || none}\n\n`;
        // Section 6
        message += `${w('s6_title')}\n${w('cuisines')}: ${formData.cuisines.join(', ') || none}\n\n`;
        // Section 7
        message += `${w('s7_title')}\n${w('mealsPerDay')}: ${formData.mealsPerDay}\n${w('mealTimes')}: ${formData.mealTimes || none}\n${w('budget')}: ${o('budget', formData.budget)}\n${w('supplements')}: ${formData.supplementsUsed || none}\n${w('notes')}: ${formData.notes || none}\n`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    if (!isOpen) return null;
    
    const intolerancesItems = ['gluten', 'lactose', 'nuts', 'eggs', 'soy', 'fish', 'shellfish'];
    const cuisinesItems = ['polish', 'mediterranean', 'asian', 'italian', 'mexican'];
    const digestionItems = ['bloating', 'gas', 'constipation', 'diarrhea', 'heartburn'];

    const renderMultiSelectItem = (category: 'intolerances' | 'cuisines' | 'digestionIssues', value: string, label: string) => (
        <button type="button" key={value} onClick={() => handleMultiSelect(category, value)}
            className={`px-4 py-2 rounded-full border text-sm transition-colors ${(formData[category] as string[]).includes(value) ? 'bg-red-600 border-red-600 text-white' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}>
            {label}
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 bg-[#1a1a1a] p-6 border-b border-gray-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold uppercase text-white font-['Teko']">{t('diet_modal.title')}</h2>
                        <p className="text-gray-400">{t('diet_modal.subtitle')}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                <div className="p-6 space-y-8">
                    {/* Section 1 */}
                    <div className="space-y-4">
                        <h3 className="font-bold uppercase text-red-500">{t('diet_modal.sections.contact')}</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input type="text" name="firstName" placeholder={t('diet_modal.placeholders.firstName')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange} />
                            <input type="text" name="lastName" placeholder={t('diet_modal.placeholders.lastName')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange} />
                            <input type="email" name="email" placeholder={t('diet_modal.placeholders.email')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange} />
                            <input type="tel" name="phone" placeholder={t('diet_modal.placeholders.phone')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange} />
                            <input type="text" name="birthDate" placeholder={t('diet_modal.placeholders.birthDate')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onFocus={(e) => (e.target.type = 'date')} onBlur={(e) => (e.target.type = 'text')}/>
                            <select name="gender" className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange}>
                                <option value="">{t('diet_modal.placeholders.gender')}</option>
                                <option value={t('diet_modal.options.gender.male')}>{t('diet_modal.options.gender.male')}</option>
                                <option value={t('diet_modal.options.gender.female')}>{t('diet_modal.options.gender.female')}</option>
                            </select>
                        </div>
                    </div>
                     {/* Section 2 */}
                     <div className="space-y-4">
                        <h3 className="font-bold uppercase text-red-500">{t('diet_modal.sections.params')}</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            <input type="number" name="height" placeholder={t('diet_modal.placeholders.height')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange} />
                            <input type="number" name="weight" placeholder={t('diet_modal.placeholders.weight')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange} />
                            <input type="number" name="bodyFat" placeholder={t('diet_modal.placeholders.bodyFat')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange} />
                            <select name="activity" value={formData.activity} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange}>
                                {Object.keys(t('diet_modal.options.activity') as object).map(key => <option key={key} value={key}>{t(`diet_modal.options.activity.${key}`)}</option>)}
                            </select>
                            <select name="goal" value={formData.goal} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange}>
                                {Object.keys(t('diet_modal.options.goal') as object).map(key => <option key={key} value={key}>{t(`diet_modal.options.goal.${key}`)}</option>)}
                            </select>
                            <select name="pace" value={formData.pace} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange}>
                               {Object.keys(t('diet_modal.options.pace') as object).map(key => <option key={key} value={key}>{t(`diet_modal.options.pace.${key}`)}</option>)}
                            </select>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            <select name="trainingExperience" value={formData.trainingExperience} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange}>
                                {Object.keys(t('diet_modal.options.trainingExperience') as object).map(key => <option key={key} value={key}>{t(`diet_modal.options.trainingExperience.${key}`)}</option>)}
                            </select>
                            <input type="number" name="trainingFrequency" placeholder={t('diet_modal.placeholders.trainingFrequency')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange} />
                            <select name="trainingType" value={formData.trainingType} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange}>
                               {Object.keys(t('diet_modal.options.trainingType') as object).map(key => <option key={key} value={key}>{t(`diet_modal.options.trainingType.${key}`)}</option>)}
                            </select>
                        </div>
                    </div>
                     {/* Section 3 */}
                     <div className="space-y-4">
                        <h3 className="font-bold uppercase text-red-500">{t('diet_modal.sections.diet_choice')}</h3>
                        <select name="dietType" className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange}>
                           {Object.keys(t('diet_modal.options.dietType') as object).map(key => <option key={key} value={t(`diet_modal.options.dietType.${key}`)}>{t(`diet_modal.options.dietType.${key}`)}</option>)}
                        </select>
                    </div>
                    {/* Section 4 */}
                    <div className="space-y-4">
                        <h3 className="font-bold uppercase text-red-500">{t('diet_modal.sections.health_lifestyle')}</h3>
                        <p className="text-sm text-gray-400">{t('diet_modal.options.intolerances.title')}</p>
                        <div className="flex flex-wrap gap-2">
                           {intolerancesItems.map(item => renderMultiSelectItem('intolerances', item, t(`diet_modal.options.intolerances.${item}` as any)))}
                        </div>
                         <p className="text-sm text-gray-400 pt-2">{t('diet_modal.options.digestionIssues.title')}</p>
                        <div className="flex flex-wrap gap-2">
                           {digestionItems.map(item => renderMultiSelectItem('digestionIssues', item, t(`diet_modal.options.digestionIssues.${item}` as any)))}
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 pt-2">
                             <input type="text" name="allergyInfo" placeholder={t('diet_modal.placeholders.allergyInfo')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange} />
                             <input type="text" name="healthInfo" placeholder={t('diet_modal.placeholders.healthInfo')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange} />
                             <input type="text" name="medications" placeholder={t('diet_modal.placeholders.medications')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange} />
                             <input type="text" name="hydration" placeholder={t('diet_modal.placeholders.hydration')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange} />
                             <select name="sleepQuality" value={formData.sleepQuality} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange}>
                               {Object.keys(t('diet_modal.options.sleepQuality') as object).map(key => <option key={key} value={key}>{t(`diet_modal.options.sleepQuality.${key}`)}</option>)}
                            </select>
                             <select name="stressLevel" value={formData.stressLevel} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange}>
                                {Object.keys(t('diet_modal.options.stressLevel') as object).map(key => <option key={key} value={key}>{t(`diet_modal.options.stressLevel.${key}`)}</option>)}
                            </select>
                        </div>
                    </div>
                     {/* Section 5 */}
                    <div className="space-y-4">
                        <h3 className="font-bold uppercase text-red-500">{t('diet_modal.sections.dietary_habits')}</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                             <select name="eatingHabits" value={formData.eatingHabits} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange}>
                               {Object.keys(t('diet_modal.options.eatingHabits') as object).map(key => <option key={key} value={key}>{t(`diet_modal.options.eatingHabits.${key}`)}</option>)}
                            </select>
                             <select name="cookingSkills" value={formData.cookingSkills} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange}>
                                {Object.keys(t('diet_modal.options.cookingSkills') as object).map(key => <option key={key} value={key}>{t(`diet_modal.options.cookingSkills.${key}`)}</option>)}
                            </select>
                             <select name="foodPrepTime" value={formData.foodPrepTime} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange}>
                                {Object.keys(t('diet_modal.options.foodPrepTime') as object).map(key => <option key={key} value={key}>{t(`diet_modal.options.foodPrepTime.${key}`)}</option>)}
                            </select>
                        </div>
                         <div className="grid md:grid-cols-2 gap-4">
                              <select name="sweetSnacks" value={formData.sweetSnacks} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange}>
                                <option disabled>{t('diet_modal.options.snackPrefs.title_sweet')}</option>
                                {Object.keys(t('diet_modal.options.snackPrefs') as object).filter(k=>k.startsWith('t_')).map(key => <option key={key} value={key.substring(2)}>{t(`diet_modal.options.snackPrefs.${key}`)}</option>)}
                            </select>
                             <select name="saltySnacks" value={formData.saltySnacks} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange}>
                                <option disabled>{t('diet_modal.options.snackPrefs.title_salty')}</option>
                                {Object.keys(t('diet_modal.options.snackPrefs') as object).filter(k=>k.startsWith('t_')).map(key => <option key={key} value={key.substring(2)}>{t(`diet_modal.options.snackPrefs.${key}`)}</option>)}
                            </select>
                         </div>
                         <div className="grid md:grid-cols-1 gap-4">
                            <textarea name="likedProducts" rows={2} placeholder={t('diet_modal.placeholders.likedProducts')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange}></textarea>
                            <textarea name="dislikedProducts" rows={2} placeholder={t('diet_modal.placeholders.dislikedProducts')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange}></textarea>
                         </div>
                    </div>
                     {/* Section 6 */}
                    <div className="space-y-4">
                        <h3 className="font-bold uppercase text-red-500">{t('diet_modal.sections.cuisine')}</h3>
                        <div className="flex flex-wrap gap-2">
                           {cuisinesItems.map(item => renderMultiSelectItem('cuisines', item, t(`diet_modal.options.cuisines.${item}` as any)))}
                        </div>
                    </div>
                     {/* Section 7 */}
                    <div className="space-y-4">
                         <h3 className="font-bold uppercase text-red-500">{t('diet_modal.sections.arrangements')}</h3>
                         <div className="grid md:grid-cols-3 gap-4">
                            <input type="number" name="mealsPerDay" value={formData.mealsPerDay} placeholder={t('diet_modal.placeholders.mealsPerDay')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange} />
                            <input type="text" name="mealTimes" placeholder={t('diet_modal.placeholders.mealTimes')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange} />
                             <select name="budget" value={formData.budget} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange}>
                                {Object.keys(t('diet_modal.options.budget') as object).map(key => <option key={key} value={key}>{t(`diet_modal.options.budget.${key}`)}</option>)}
                            </select>
                         </div>
                         <textarea name="supplementsUsed" rows={2} placeholder={t('diet_modal.placeholders.supplementsUsed')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange}></textarea>
                         <textarea name="notes" rows={2} placeholder={t('diet_modal.placeholders.notes')} className="w-full bg-[#333] border-gray-600 rounded-lg p-3" onChange={handleInputChange}></textarea>
                    </div>
                </div>
                <div className="sticky bottom-0 bg-[#1a1a1a] p-6 border-t border-gray-800">
                    <button type="button" onClick={handleWhatsAppSubmit} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                        <WhatsAppIcon />
                        <span>{t('diet_modal.submit_button')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DietModal;