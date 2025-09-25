import React, { useState, useEffect } from 'react';
import { WhatsAppIcon, ChevronRightIcon, ChevronLeftIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface DietFormData {
    // Step 1: Contact
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
    
    // Step 2: Physical Parameters
    height: string;
    weight: string;
    bodyFat: string;
    activity: string;
    goal: string;
    pace: string;
    
    // Step 3: Training
    trainingExperience: string;
    trainingFrequency: string;
    trainingType: string;
    
    // Step 4: Health & Lifestyle
    intolerances: string[];
    allergyInfo: string;
    healthInfo: string;
    medications: string;
    digestionIssues: string[];
    sleepQuality: string;
    stressLevel: string;
    hydration: string;
    
    // Step 5: Dietary Habits
    dietType: string;
    eatingHabits: string;
    cookingSkills: string;
    foodPrepTime: string;
    sweetSnacks: string;
    saltySnacks: string;
    likedProducts: string;
    dislikedProducts: string;
    
    // Step 6: Preferences & Arrangements
    cuisines: string[];
    mealsPerDay: string;
    mealTimes: string;
    budget: string;
    supplementsUsed: string;
    notes: string;
}

interface MultiStepDietModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const STORAGE_KEY = 'dietFormDraft';

const MultiStepDietModal: React.FC<MultiStepDietModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<DietFormData>({
        // Step 1
        firstName: '', lastName: '', email: '', phone: '', birthDate: '', gender: '',
        // Step 2
        height: '', weight: '', bodyFat: '', activity: 'moderate', goal: 'reduction', pace: 'p_5',
        // Step 3
        trainingExperience: '1-3y', trainingFrequency: '', trainingType: 'strength',
        // Step 4
        intolerances: [], allergyInfo: '', healthInfo: '', medications: '', digestionIssues: [],
        sleepQuality: 'good', stressLevel: 'moderate', hydration: '',
        // Step 5
        dietType: '', eatingHabits: 'regular', cookingSkills: 'intermediate', foodPrepTime: '30-60min',
        sweetSnacks: 'sometimes', saltySnacks: 'sometimes', likedProducts: '', dislikedProducts: '',
        // Step 6
        cuisines: [], mealsPerDay: '4', mealTimes: '', budget: 'medium', supplementsUsed: '', notes: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Load draft from localStorage
    useEffect(() => {
        const draft = localStorage.getItem(STORAGE_KEY);
        if (draft) {
            try {
                const parsedDraft = JSON.parse(draft);
                setFormData(parsedDraft);
            } catch (error) {
                console.error('Failed to load draft:', error);
            }
        }
    }, [isOpen]);

    // Save draft to localStorage
    useEffect(() => {
        if (isOpen) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        }
    }, [formData, isOpen]);

    const steps = [
        { id: 1, title: t('diet_modal.steps.contact'), icon: '👤' },
        { id: 2, title: t('diet_modal.steps.physical'), icon: '📏' },
        { id: 3, title: t('diet_modal.steps.training'), icon: '💪' },
        { id: 4, title: t('diet_modal.steps.health'), icon: '🏥' },
        { id: 5, title: t('diet_modal.steps.dietary'), icon: '🍽️' },
        { id: 6, title: t('diet_modal.steps.preferences'), icon: '⚙️' },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleMultiSelect = (category: 'intolerances' | 'cuisines' | 'digestionIssues', value: string) => {
        setFormData(prev => {
            const current = prev[category] as string[];
            const updated = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
            return { ...prev, [category]: updated };
        });
    };

    const validateStep = (step: number): boolean => {
        const newErrors: { [key: string]: string } = {};

        switch (step) {
            case 1:
                if (!formData.firstName.trim()) newErrors.firstName = t('diet_modal.validation.required');
                if (!formData.lastName.trim()) newErrors.lastName = t('diet_modal.validation.required');
                if (!formData.email.trim()) newErrors.email = t('diet_modal.validation.required');
                else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('diet_modal.validation.email');
                if (!formData.phone.trim()) newErrors.phone = t('diet_modal.validation.required');
                break;
            case 2:
                if (!formData.height.trim()) newErrors.height = t('diet_modal.validation.required');
                if (!formData.weight.trim()) newErrors.weight = t('diet_modal.validation.required');
                break;
            case 3:
                if (!formData.trainingFrequency.trim()) newErrors.trainingFrequency = t('diet_modal.validation.required');
                break;
            case 4:
                // Optional validations for health section
                break;
            case 5:
                // Optional validations for dietary habits
                break;
            case 6:
                // Final step validations
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 6));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleWhatsAppSubmit = () => {
        if (!validateStep(6)) return;

        const phoneNumber = "31613877931";
        const w = (key: string) => t(`diet_modal.whatsapp.${key}`);
        const o = (path: string, key: string) => t(`diet_modal.options.${path}.${key}`);
        const none = w('none');
        
        let message = `${w('title')}\n\n`;
        
        // Step 1
        message += `${w('s1_title')}\n`;
        message += `${w('name')}: ${formData.firstName}\n`;
        message += `${w('surname')}: ${formData.lastName}\n`;
        message += `Email: ${formData.email}\n`;
        message += `${w('phone')}: ${formData.phone}\n`;
        message += `${w('dob')}: ${formData.birthDate || none}\n`;
        message += `${w('gender')}: ${formData.gender || none}\n\n`;
        
        // Step 2
        message += `${w('s2_title')}\n`;
        message += `${w('height')}: ${formData.height} cm\n`;
        message += `${w('weight')}: ${formData.weight} kg\n`;
        message += `${w('bodyFat')}: ${formData.bodyFat ? formData.bodyFat + '%' : none}\n`;
        message += `${w('activity')}: ${o('activity', formData.activity)}\n`;
        message += `${w('goal')}: ${o('goal', formData.goal)}\n`;
        message += `${w('pace')}: ${o('pace', formData.pace)}\n\n`;
        
        // Step 3
        message += `${w('s3_title')}\n`;
        message += `${w('trainingExp')}: ${o('trainingExperience', formData.trainingExperience)}\n`;
        message += `${w('trainingFreq')}: ${formData.trainingFrequency} ${w('timesPerWeek')}\n`;
        message += `${w('trainingType')}: ${o('trainingType', formData.trainingType)}\n\n`;
        
        // Step 4
        message += `${w('s4_title')}\n`;
        message += `${w('intolerances')}: ${formData.intolerances.join(', ') || none}\n`;
        message += `${w('allergies')}: ${formData.allergyInfo || none}\n`;
        message += `${w('diseases')}: ${formData.healthInfo || none}\n`;
        message += `${w('meds')}: ${formData.medications || none}\n`;
        message += `${w('digestion')}: ${formData.digestionIssues.join(', ') || none}\n`;
        message += `${w('sleep')}: ${o('sleepQuality', formData.sleepQuality)}\n`;
        message += `${w('stress')}: ${o('stressLevel', formData.stressLevel)}\n`;
        message += `${w('hydration')}: ${formData.hydration ? formData.hydration + ' L' : none}\n\n`;
        
        // Step 5
        message += `${w('s5_title')}\n`;
        message += `${w('dietType')}: ${formData.dietType || none}\n`;
        message += `${w('eatingHabits')}: ${o('eatingHabits', formData.eatingHabits)}\n`;
        message += `${w('cookingSkills')}: ${o('cookingSkills', formData.cookingSkills)}\n`;
        message += `${w('prepTime')}: ${o('foodPrepTime', formData.foodPrepTime)}\n`;
        message += `${w('sweetSnacks')}: ${o('snackPrefs', formData.sweetSnacks)}\n`;
        message += `${w('saltySnacks')}: ${o('snackPrefs', formData.saltySnacks)}\n`;
        message += `${w('likedProducts')}: ${formData.likedProducts || none}\n`;
        message += `${w('dislikedProducts')}: ${formData.dislikedProducts || none}\n\n`;
        
        // Step 6
        message += `${w('s6_title')}\n`;
        message += `${w('cuisines')}: ${formData.cuisines.join(', ') || none}\n`;
        message += `${w('mealsPerDay')}: ${formData.mealsPerDay}\n`;
        message += `${w('mealTimes')}: ${formData.mealTimes || none}\n`;
        message += `${w('budget')}: ${o('budget', formData.budget)}\n`;
        message += `${w('supplements')}: ${formData.supplementsUsed || none}\n`;
        message += `${w('notes')}: ${formData.notes || none}\n`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // Clear draft after successful submission
        localStorage.removeItem(STORAGE_KEY);
        onClose();
    };

    const renderMultiSelectItem = (category: 'intolerances' | 'cuisines' | 'digestionIssues', value: string, label: string) => (
        <button
            type="button"
            key={value}
            onClick={() => handleMultiSelect(category, value)}
            className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                (formData[category] as string[]).includes(value)
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
            }`}
        >
            {label}
        </button>
    );

    const renderStep = () => {
        const inputClass = (fieldName: string) => `w-full bg-[#333] border rounded-lg p-3 focus:ring-red-500 focus:border-red-500 transition-colors ${
            errors[fieldName] ? 'border-red-500' : 'border-gray-600'
        }`;

        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-red-500 mb-4">{t('diet_modal.sections.contact')}</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder={t('diet_modal.placeholders.firstName')}
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className={inputClass('firstName')}
                                />
                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder={t('diet_modal.placeholders.lastName')}
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className={inputClass('lastName')}
                                />
                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                            </div>
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder={t('diet_modal.placeholders.email')}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={inputClass('email')}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder={t('diet_modal.placeholders.phone')}
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={inputClass('phone')}
                                />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                            </div>
                            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('diet_modal.labels.birth_date')}
                            </label>
                            <input
                                id="birthDate"
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleInputChange}
                                className={inputClass('birthDate')}
                                aria-label={t('diet_modal.labels.birth_date')}
                            />
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('diet_modal.labels.gender')}
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className={inputClass('gender')}
                                aria-label={t('diet_modal.labels.gender')}
                            >
                                <option value="">{t('diet_modal.placeholders.gender')}</option>
                                <option value="male">{t('diet_modal.options.gender.male')}</option>
                                <option value="female">{t('diet_modal.options.gender.female')}</option>
                                <option value="other">{t('diet_modal.options.gender.other')}</option>
                            </select>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-red-500 mb-4">{t('diet_modal.sections.physical')}</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="number"
                                    name="height"
                                    placeholder={t('diet_modal.placeholders.height')}
                                    value={formData.height}
                                    onChange={handleInputChange}
                                    className={inputClass('height')}
                                />
                                {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
                            </div>
                            <div>
                                <input
                                    type="number"
                                    name="weight"
                                    placeholder={t('diet_modal.placeholders.weight')}
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    className={inputClass('weight')}
                                />
                                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
                            </div>
                            <input
                                type="number"
                                name="bodyFat"
                                placeholder={t('diet_modal.placeholders.bodyFat')}
                                value={formData.bodyFat}
                                onChange={handleInputChange}
                                className={inputClass('bodyFat')}
                            />
                            <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('diet_modal.labels.activity')}
                            </label>
                            <select
                                id="activity"
                                name="activity"
                                value={formData.activity}
                                onChange={handleInputChange}
                                className={inputClass('activity')}
                                aria-label={t('diet_modal.labels.activity')}
                            >
                                <option value="low">{t('diet_modal.options.activity.low')}</option>
                                <option value="moderate">{t('diet_modal.options.activity.moderate')}</option>
                                <option value="high">{t('diet_modal.options.activity.high')}</option>
                                <option value="very_high">{t('diet_modal.options.activity.very_high')}</option>
                            </select>
                            <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('diet_modal.whatsapp.goal')}
                            </label>
                            <select
                                id="goal"
                                name="goal"
                                value={formData.goal}
                                onChange={handleInputChange}
                                className={inputClass('goal')}
                                aria-label={t('diet_modal.whatsapp.goal')}
                            >
                                <option value="reduction">{t('diet_modal.options.goal.reduction')}</option>
                                <option value="maintenance">{t('diet_modal.options.goal.maintenance')}</option>
                                <option value="muscle_gain">{t('diet_modal.options.goal.muscle_gain')}</option>
                            </select>
                            <label htmlFor="pace" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('diet_modal.whatsapp.pace')}
                            </label>
                            <select
                                id="pace"
                                name="pace"
                                value={formData.pace}
                                onChange={handleInputChange}
                                className={inputClass('pace')}
                                aria-label={t('diet_modal.whatsapp.pace')}
                            >
                                <option value="p_25">{t('diet_modal.options.pace.p_25')}</option>
                                <option value="p_5">{t('diet_modal.options.pace.p_5')}</option>
                                <option value="p_75">{t('diet_modal.options.pace.p_75')}</option>
                                <option value="p_1">{t('diet_modal.options.pace.p_1')}</option>
                            </select>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-red-500 mb-4">{t('diet_modal.sections.training')}</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="trainingExperience" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('diet_modal.whatsapp.trainingExp')}
                                </label>
                                <select
                                    id="trainingExperience"
                                    name="trainingExperience"
                                    value={formData.trainingExperience}
                                    onChange={handleInputChange}
                                    className={inputClass('trainingExperience')}
                                    aria-label={t('diet_modal.whatsapp.trainingExp')}
                                >
                                <option value="beginner">{t('diet_modal.options.trainingExperience.beginner')}</option>
                                <option value="1-3y">{t('diet_modal.options.trainingExperience.1-3y')}</option>
                                <option value="3-5y">{t('diet_modal.options.trainingExperience.3-5y')}</option>
                                <option value="5y+">{t('diet_modal.options.trainingExperience.5y+')}</option>
                            </select>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    name="trainingFrequency"
                                    placeholder={t('diet_modal.placeholders.trainingFrequency')}
                                    value={formData.trainingFrequency}
                                    onChange={handleInputChange}
                                    className={inputClass('trainingFrequency')}
                                    min="1"
                                    max="7"
                                />
                                {errors.trainingFrequency && <p className="text-red-500 text-sm mt-1">{errors.trainingFrequency}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="trainingType" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('diet_modal.whatsapp.trainingType')}
                                </label>
                                <select
                                    id="trainingType"
                                    name="trainingType"
                                    value={formData.trainingType}
                                    onChange={handleInputChange}
                                    className={inputClass('trainingType')}
                                    aria-label={t('diet_modal.whatsapp.trainingType')}
                                >
                                <option value="strength">{t('diet_modal.options.trainingType.strength')}</option>
                                <option value="cardio">{t('diet_modal.options.trainingType.cardio')}</option>
                                <option value="mixed">{t('diet_modal.options.trainingType.mixed')}</option>
                                <option value="functional">{t('diet_modal.options.trainingType.functional')}</option>
                            </select>
                            </div>
                        </div>
                    </div>
                );

            case 4:
                const intolerancesItems = ['gluten', 'lactose', 'nuts', 'eggs', 'soy', 'fish', 'shellfish'];
                const digestionItems = ['bloating', 'gas', 'constipation', 'diarrhea', 'heartburn'];
                
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-red-500 mb-4">{t('diet_modal.sections.health')}</h3>
                        
                        <div>
                            <label className="block text-white mb-2">{t('diet_modal.labels.intolerances')}</label>
                            <div className="flex flex-wrap gap-2">
                                {intolerancesItems.map(item => 
                                    renderMultiSelectItem('intolerances', item, t(`diet_modal.options.intolerances.${item}`))
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-white mb-2">{t('diet_modal.labels.digestionIssues')}</label>
                            <div className="flex flex-wrap gap-2">
                                {digestionItems.map(item => 
                                    renderMultiSelectItem('digestionIssues', item, t(`diet_modal.options.digestionIssues.${item}`))
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <textarea
                                name="allergyInfo"
                                placeholder={t('diet_modal.placeholders.allergyInfo')}
                                value={formData.allergyInfo}
                                onChange={handleInputChange}
                                className={inputClass('allergyInfo')}
                                rows={3}
                            />
                            <textarea
                                name="healthInfo"
                                placeholder={t('diet_modal.placeholders.healthInfo')}
                                value={formData.healthInfo}
                                onChange={handleInputChange}
                                className={inputClass('healthInfo')}
                                rows={3}
                            />
                            <textarea
                                name="medications"
                                placeholder={t('diet_modal.placeholders.medications')}
                                value={formData.medications}
                                onChange={handleInputChange}
                                className={inputClass('medications')}
                                rows={3}
                            />
                            <input
                                type="number"
                                name="hydration"
                                placeholder={t('diet_modal.placeholders.hydration')}
                                value={formData.hydration}
                                onChange={handleInputChange}
                                className={inputClass('hydration')}
                                step="0.5"
                                min="0"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="sleepQuality" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('diet_modal.labels.sleep_quality')}
                                </label>
                                <select
                                    id="sleepQuality"
                                    name="sleepQuality"
                                    value={formData.sleepQuality}
                                    onChange={handleInputChange}
                                    className={inputClass('sleepQuality')}
                                    aria-label={t('diet_modal.labels.sleep_quality')}
                                >
                                    <option value="poor">{t('diet_modal.options.sleepQuality.poor')}</option>
                                    <option value="fair">{t('diet_modal.options.sleepQuality.fair')}</option>
                                    <option value="good">{t('diet_modal.options.sleepQuality.good')}</option>
                                    <option value="excellent">{t('diet_modal.options.sleepQuality.excellent')}</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="stressLevel" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('diet_modal.labels.stress_level')}
                                </label>
                                <select
                                    id="stressLevel"
                                    name="stressLevel"
                                    value={formData.stressLevel}
                                    onChange={handleInputChange}
                                    className={inputClass('stressLevel')}
                                    aria-label={t('diet_modal.labels.stress_level')}
                                >
                                    <option value="low">{t('diet_modal.options.stressLevel.low')}</option>
                                    <option value="moderate">{t('diet_modal.options.stressLevel.moderate')}</option>
                                    <option value="high">{t('diet_modal.options.stressLevel.high')}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-red-500 mb-4">{t('diet_modal.sections.dietary')}</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="dietType" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('diet_modal.labels.dietType')}
                                </label>
                                <input
                                    id="dietType"
                                    type="text"
                                    name="dietType"
                                    placeholder={t('diet_modal.placeholders.dietType')}
                                    value={formData.dietType}
                                    onChange={handleInputChange}
                                    className={inputClass('dietType')}
                                    aria-label={t('diet_modal.labels.dietType')}
                                />
                            </div>
                            <div>
                                <label htmlFor="eatingHabits" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('diet_modal.labels.eating_habits')}
                                </label>
                                <select
                                    id="eatingHabits"
                                    name="eatingHabits"
                                    value={formData.eatingHabits}
                                    onChange={handleInputChange}
                                    className={inputClass('eatingHabits')}
                                    aria-label={t('diet_modal.labels.eating_habits')}
                                >
                                <option value="regular">{t('diet_modal.options.eatingHabits.regular')}</option>
                                <option value="irregular">{t('diet_modal.options.eatingHabits.irregular')}</option>
                                <option value="emotional">{t('diet_modal.options.eatingHabits.emotional')}</option>
                            </select>
                            </div>
                            <div>
                                <label htmlFor="cookingSkills" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('diet_modal.labels.cooking_skills')}
                                </label>
                                <select
                                    id="cookingSkills"
                                    name="cookingSkills"
                                    value={formData.cookingSkills}
                                    onChange={handleInputChange}
                                className={inputClass('cookingSkills')}
                                aria-label={t('diet_modal.labels.cooking_skills')}
                            >
                                <option value="beginner">{t('diet_modal.options.cookingSkills.beginner')}</option>
                                <option value="intermediate">{t('diet_modal.options.cookingSkills.intermediate')}</option>
                                <option value="advanced">{t('diet_modal.options.cookingSkills.advanced')}</option>
                            </select>
                            </div>
                            <div>
                                <label htmlFor="foodPrepTime" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('diet_modal.labels.food_prep_time')}
                                </label>
                                <select
                                    id="foodPrepTime"
                                    name="foodPrepTime"
                                    value={formData.foodPrepTime}
                                    onChange={handleInputChange}
                                    className={inputClass('foodPrepTime')}
                                    aria-label={t('diet_modal.labels.food_prep_time')}
                                >
                                <option value="15min">{t('diet_modal.options.foodPrepTime.15min')}</option>
                                <option value="30-60min">{t('diet_modal.options.foodPrepTime.30-60min')}</option>
                                <option value="60+min">{t('diet_modal.options.foodPrepTime.60+min')}</option>
                            </select>
                            </div>
                            <div>
                                <label htmlFor="sweetSnacks" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('diet_modal.labels.sweet_snacks')}
                                </label>
                                <select
                                    id="sweetSnacks"
                                    name="sweetSnacks"
                                    value={formData.sweetSnacks}
                                    onChange={handleInputChange}
                                    className={inputClass('sweetSnacks')}
                                    aria-label={t('diet_modal.labels.sweet_snacks')}
                                >
                                    <option value="never">{t('diet_modal.options.snackPrefs.never')}</option>
                                    <option value="rarely">{t('diet_modal.options.snackPrefs.rarely')}</option>
                                    <option value="sometimes">{t('diet_modal.options.snackPrefs.sometimes')}</option>
                                    <option value="often">{t('diet_modal.options.snackPrefs.often')}</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="saltySnacks" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('diet_modal.labels.salty_snacks')}
                                </label>
                                <select
                                    id="saltySnacks"
                                    name="saltySnacks"
                                    value={formData.saltySnacks}
                                    onChange={handleInputChange}
                                    className={inputClass('saltySnacks')}
                                    aria-label={t('diet_modal.labels.salty_snacks')}
                                >
                                <option value="never">{t('diet_modal.options.snackPrefs.never')}</option>
                                <option value="rarely">{t('diet_modal.options.snackPrefs.rarely')}</option>
                                <option value="sometimes">{t('diet_modal.options.snackPrefs.sometimes')}</option>
                                <option value="often">{t('diet_modal.options.snackPrefs.often')}</option>
                            </select>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <textarea
                                name="likedProducts"
                                placeholder={t('diet_modal.placeholders.likedProducts')}
                                value={formData.likedProducts}
                                onChange={handleInputChange}
                                className={inputClass('likedProducts')}
                                rows={3}
                            />
                            <textarea
                                name="dislikedProducts"
                                placeholder={t('diet_modal.placeholders.dislikedProducts')}
                                value={formData.dislikedProducts}
                                onChange={handleInputChange}
                                className={inputClass('dislikedProducts')}
                                rows={3}
                            />
                        </div>
                    </div>
                );

            case 6:
                const cuisinesItems = ['polish', 'mediterranean', 'asian', 'italian', 'mexican'];
                
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-red-500 mb-4">{t('diet_modal.sections.preferences')}</h3>
                        
                        <div>
                            <label className="block text-white mb-2">{t('diet_modal.labels.cuisines')}</label>
                            <div className="flex flex-wrap gap-2">
                                {cuisinesItems.map(item => 
                                    renderMultiSelectItem('cuisines', item, t(`diet_modal.options.cuisines.${item}`))
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="mealsPerDay" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('diet_modal.labels.meals_per_day')}
                                </label>
                                <select
                                    id="mealsPerDay"
                                    name="mealsPerDay"
                                    value={formData.mealsPerDay}
                                    onChange={handleInputChange}
                                    className={inputClass('mealsPerDay')}
                                    aria-label={t('diet_modal.labels.meals_per_day')}
                                >
                                    <option value="3">3 {t('diet_modal.common.meals')}</option>
                                    <option value="4">4 {t('diet_modal.common.meals')}</option>
                                    <option value="5">5 {t('diet_modal.common.meals')}</option>
                                    <option value="6">6 {t('diet_modal.common.meals')}</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="mealTimes" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('diet_modal.labels.meal_times')}
                                </label>
                                <input
                                    id="mealTimes"
                                    type="text"
                                    name="mealTimes"
                                    placeholder={t('diet_modal.placeholders.mealTimes')}
                                    value={formData.mealTimes}
                                    onChange={handleInputChange}
                                    className={inputClass('mealTimes')}
                                    aria-label={t('diet_modal.labels.meal_times')}
                                />
                            </div>
                            <div>
                                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('diet_modal.labels.budget')}
                                </label>
                                <select
                                    id="budget"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleInputChange}
                                    className={inputClass('budget')}
                                    aria-label={t('diet_modal.labels.budget')}
                                >
                                    <option value="low">{t('diet_modal.options.budget.low')}</option>
                                    <option value="medium">{t('diet_modal.options.budget.medium')}</option>
                                    <option value="high">{t('diet_modal.options.budget.high')}</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="supplementsUsed" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('diet_modal.labels.supplements')}
                                </label>
                                <input
                                    id="supplementsUsed"
                                    type="text"
                                    name="supplementsUsed"
                                    placeholder={t('diet_modal.placeholders.supplementsUsed')}
                                    value={formData.supplementsUsed}
                                    onChange={handleInputChange}
                                    className={inputClass('supplementsUsed')}
                                    aria-label={t('diet_modal.labels.supplements')}
                                />
                            </div>
                        </div>
                        <textarea
                            name="notes"
                            placeholder={t('diet_modal.placeholders.notes')}
                            value={formData.notes}
                            onChange={handleInputChange}
                            className={inputClass('notes')}
                            rows={4}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-[#1a1a1a] p-6 border-b border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-2xl font-bold uppercase text-white font-['Teko']">{t('diet_modal.title')}</h2>
                            <p className="text-gray-400">{t('diet_modal.subtitle')}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                        <div 
                            className="bg-red-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStep / 6) * 100}%` }}
                        ></div>
                    </div>

                    {/* Steps */}
                    <div className="flex justify-between items-center text-sm">
                        {steps.map((step) => (
                            <div key={step.id} className={`flex items-center ${
                                step.id === currentStep ? 'text-red-500' : 
                                step.id < currentStep ? 'text-green-500' : 'text-gray-500'
                            }`}>
                                <span className="text-lg mr-2">{step.icon}</span>
                                <span className="hidden md:block">{step.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
                    {renderStep()}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-[#1a1a1a] p-6 border-t border-gray-800 flex justify-between items-center">
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className="flex items-center px-6 py-2 bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
                    >
                        <ChevronLeftIcon className="w-5 h-5 mr-2" />
                        {t('diet_modal.navigation.previous')}
                    </button>

                    <span className="text-gray-400">
                        {t('diet_modal.navigation.step')} {currentStep} {t('diet_modal.navigation.of')} 6
                    </span>

                    {currentStep < 6 ? (
                        <button
                            onClick={handleNext}
                            className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            {t('diet_modal.navigation.next')}
                            <ChevronRightIcon className="w-5 h-5 ml-2" />
                        </button>
                    ) : (
                        <button
                            onClick={handleWhatsAppSubmit}
                            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <WhatsAppIcon className="w-5 h-5 mr-2" />
                            {t('diet_modal.submit')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MultiStepDietModal;