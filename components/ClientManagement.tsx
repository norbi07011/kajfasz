import React, { useState } from 'react';
import { useAuth, Client, ClientPersonalInfo, ClientGoals } from '../contexts/LanguageContext';
import { CloseIcon, AnalyticsIcon, ChevronRightIcon, ListIcon } from './icons';

interface ClientManagementProps {
    isOpen: boolean;
    onClose: () => void;
}

const ClientManagement: React.FC<ClientManagementProps> = ({ isOpen, onClose }) => {
    const { 
        currentTrainer, 
        clients, 
        addClient, 
        updateClient, 
        deleteClient, 
        getClientsByTrainer,
        addMeasurement 
    } = useAuth();
    
    const [view, setView] = useState<'list' | 'add' | 'view' | 'edit' | 'measurements'>('list');
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [formData, setFormData] = useState<{
        personalInfo: ClientPersonalInfo;
        goals: ClientGoals;
        notes?: string;
    }>({
        personalInfo: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            dateOfBirth: '',
            gender: 'male',
            height: undefined,
            medicalConditions: [],
        },
        goals: {
            primary: 'general_fitness',
            targetWeight: undefined,
            targetDate: '',
            motivations: [],
            experience: 'beginner',
            availableTime: 3,
            preferredActivities: []
        },
        notes: ''
    });

    const [measurementData, setMeasurementData] = useState({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        bodyFat: '',
        muscleMass: '',
        chest: '',
        waist: '',
        hips: '',
        bicep: '',
        thigh: '',
        notes: ''
    });

    if (!isOpen || !currentTrainer) return null;

    const trainerClients = getClientsByTrainer(currentTrainer.id);
    const selectedClient = selectedClientId ? clients.find(c => c.id === selectedClientId) : null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name.startsWith('personalInfo.')) {
            const field = name.replace('personalInfo.', '');
            setFormData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, [field]: value }
            }));
        } else if (name.startsWith('goals.')) {
            const field = name.replace('goals.', '');
            setFormData(prev => ({
                ...prev,
                goals: { ...prev.goals, [field]: field === 'availableTime' ? parseInt(value) : value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMeasurementData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddClient = (e: React.FormEvent) => {
        e.preventDefault();
        
        const success = addClient({
            personalInfo: formData.personalInfo,
            goals: formData.goals,
            status: 'active',
            notes: formData.notes,
            measurements: [],
            workoutPlans: [],
            nutritionPlans: []
        });

        if (success) {
            setView('list');
            // Reset form
            setFormData({
                personalInfo: {
                    firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '',
                    gender: 'male', height: undefined, medicalConditions: []
                },
                goals: {
                    primary: 'general_fitness', targetWeight: undefined, targetDate: '',
                    motivations: [], experience: 'beginner', availableTime: 3, preferredActivities: []
                },
                notes: ''
            });
        } else {
            alert('Błąd podczas dodawania klienta');
        }
    };

    const handleAddMeasurement = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClientId) return;

        const measurements: any = {};
        if (measurementData.chest) measurements.chest = parseFloat(measurementData.chest);
        if (measurementData.waist) measurements.waist = parseFloat(measurementData.waist);
        if (measurementData.hips) measurements.hips = parseFloat(measurementData.hips);
        if (measurementData.bicep) measurements.bicep = parseFloat(measurementData.bicep);
        if (measurementData.thigh) measurements.thigh = parseFloat(measurementData.thigh);

        const success = addMeasurement(selectedClientId, {
            date: measurementData.date,
            weight: measurementData.weight ? parseFloat(measurementData.weight) : undefined,
            bodyFat: measurementData.bodyFat ? parseFloat(measurementData.bodyFat) : undefined,
            muscleMass: measurementData.muscleMass ? parseFloat(measurementData.muscleMass) : undefined,
            measurements: Object.keys(measurements).length > 0 ? measurements : undefined,
            notes: measurementData.notes || undefined
        });

        if (success) {
            setView('view');
            // Reset form
            setMeasurementData({
                date: new Date().toISOString().split('T')[0],
                weight: '', bodyFat: '', muscleMass: '', chest: '', waist: '', 
                hips: '', bicep: '', thigh: '', notes: ''
            });
        } else {
            alert('Błąd podczas dodawania pomiaru');
        }
    };

    const renderClientList = () => (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Klienci ({trainerClients.length})</h2>
                <button
                    onClick={() => setView('add')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    + Dodaj Klienta
                </button>
            </div>

            {trainerClients.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <ListIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Brak klientów</p>
                    <p>Dodaj pierwszego klienta aby rozpocząć zarządzanie</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {trainerClients.map((client) => (
                        <div key={client.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        {client.personalInfo.firstName} {client.personalInfo.lastName}
                                    </h3>
                                    <p className="text-gray-400">{client.personalInfo.email}</p>
                                    <div className="flex items-center mt-2 space-x-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            client.status === 'active' ? 'bg-green-900 text-green-200' :
                                            client.status === 'paused' ? 'bg-yellow-900 text-yellow-200' :
                                            'bg-red-900 text-red-200'
                                        }`}>
                                            {client.status === 'active' ? 'Aktywny' : 
                                             client.status === 'paused' ? 'Wstrzymany' : 'Nieaktywny'}
                                        </span>
                                        <span className="text-gray-500">
                                            Cel: {client.goals.primary === 'weight_loss' ? 'Utrata wagi' :
                                                  client.goals.primary === 'muscle_gain' ? 'Przyrost masy' :
                                                  client.goals.primary === 'strength' ? 'Siła' :
                                                  client.goals.primary === 'endurance' ? 'Wytrzymałość' : 'Ogólna forma'}
                                        </span>
                                        <span className="text-gray-500">
                                            Pomiary: {client.measurements.length}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectedClientId(client.id);
                                            setView('view');
                                        }}
                                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm"
                                    >
                                        Szczegóły
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedClientId(client.id);
                                            setView('measurements');
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                                    >
                                        Pomiary
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderAddClientForm = () => (
        <div>
            <div className="flex items-center mb-6">
                <button
                    onClick={() => setView('list')}
                    className="text-gray-400 hover:text-white mr-4"
                >
                    ← Powrót
                </button>
                <h2 className="text-2xl font-bold text-white">Dodaj Nowego Klienta</h2>
            </div>

            <form onSubmit={handleAddClient} className="space-y-6">
                {/* Dane osobowe */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Dane Osobowe</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Imię *</label>
                            <input
                                type="text"
                                name="personalInfo.firstName"
                                value={formData.personalInfo.firstName}
                                onChange={handleInputChange}
                                required
                                aria-label="Imię klienta"
                                placeholder="Wprowadź imię"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Nazwisko *</label>
                            <input
                                type="text"
                                name="personalInfo.lastName"
                                value={formData.personalInfo.lastName}
                                onChange={handleInputChange}
                                required
                                aria-label="Nazwisko klienta"
                                placeholder="Wprowadź nazwisko"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Email *</label>
                            <input
                                type="email"
                                name="personalInfo.email"
                                value={formData.personalInfo.email}
                                onChange={handleInputChange}
                                required
                                aria-label="Email klienta"
                                placeholder="email@example.com"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Telefon</label>
                            <input
                                type="tel"
                                name="personalInfo.phone"
                                value={formData.personalInfo.phone || ''}
                                onChange={handleInputChange}
                                aria-label="Numer telefonu klienta"
                                placeholder="+48 123 456 789"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Data urodzenia</label>
                            <input
                                type="date"
                                name="personalInfo.dateOfBirth"
                                value={formData.personalInfo.dateOfBirth || ''}
                                onChange={handleInputChange}
                                aria-label="Data urodzenia klienta"
                                placeholder="RRRR-MM-DD"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Płeć</label>
                            <select
                                name="personalInfo.gender"
                                value={formData.personalInfo.gender || 'male'}
                                onChange={handleInputChange}
                                aria-label="Płeć klienta"
                                title="Wybierz płeć klienta"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="male">Mężczyzna</option>
                                <option value="female">Kobieta</option>
                                <option value="other">Inne</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Cele treningowe */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Cele Treningowe</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Główny cel *</label>
                            <select
                                name="goals.primary"
                                value={formData.goals.primary}
                                onChange={handleInputChange}
                                required
                                aria-label="Główny cel treningowy"
                                title="Wybierz główny cel treningowy klienta"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="weight_loss">Utrata wagi</option>
                                <option value="muscle_gain">Przyrost masy mięśniowej</option>
                                <option value="strength">Zwiększenie siły</option>
                                <option value="endurance">Poprawa wytrzymałości</option>
                                <option value="general_fitness">Ogólna forma</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Doświadczenie</label>
                            <select
                                name="goals.experience"
                                value={formData.goals.experience}
                                onChange={handleInputChange}
                                aria-label="Poziom doświadczenia klienta"
                                title="Wybierz poziom doświadczenia klienta"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="beginner">Początkujący</option>
                                <option value="intermediate">Średniozaawansowany</option>
                                <option value="advanced">Zaawansowany</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Treningi w tygodniu</label>
                            <input
                                type="number"
                                name="goals.availableTime"
                                value={formData.goals.availableTime}
                                onChange={handleInputChange}
                                min="1"
                                max="7"
                                aria-label="Liczba treningów w tygodniu"
                                placeholder="3"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Cel wagowy (kg)</label>
                            <input
                                type="number"
                                name="goals.targetWeight"
                                value={formData.goals.targetWeight || ''}
                                onChange={handleInputChange}
                                step="0.1"
                                aria-label="Docelowa waga klienta w kilogramach"
                                placeholder="75.5"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Notatki */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Notatki</h3>
                    <textarea
                        name="notes"
                        value={formData.notes || ''}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Dodatkowe informacje o kliencie..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => setView('list')}
                        className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Anuluj
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Dodaj Klienta
                    </button>
                </div>
            </form>
        </div>
    );

    const renderClientDetails = () => {
        if (!selectedClient) return null;

        return (
            <div>
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => setView('list')}
                        className="text-gray-400 hover:text-white mr-4"
                    >
                        ← Powrót
                    </button>
                    <h2 className="text-2xl font-bold text-white">
                        {selectedClient.personalInfo.firstName} {selectedClient.personalInfo.lastName}
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Dane osobowe */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Dane Osobowe</h3>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-gray-400">Email:</span> <span className="text-white">{selectedClient.personalInfo.email}</span></p>
                            {selectedClient.personalInfo.phone && (
                                <p><span className="text-gray-400">Telefon:</span> <span className="text-white">{selectedClient.personalInfo.phone}</span></p>
                            )}
                            {selectedClient.personalInfo.dateOfBirth && (
                                <p><span className="text-gray-400">Data urodzenia:</span> <span className="text-white">{selectedClient.personalInfo.dateOfBirth}</span></p>
                            )}
                            <p><span className="text-gray-400">Data dołączenia:</span> <span className="text-white">{selectedClient.joinDate}</span></p>
                            <p><span className="text-gray-400">Status:</span> 
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                    selectedClient.status === 'active' ? 'bg-green-900 text-green-200' :
                                    selectedClient.status === 'paused' ? 'bg-yellow-900 text-yellow-200' :
                                    'bg-red-900 text-red-200'
                                }`}>
                                    {selectedClient.status === 'active' ? 'Aktywny' : 
                                     selectedClient.status === 'paused' ? 'Wstrzymany' : 'Nieaktywny'}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Cele treningowe */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Cele Treningowe</h3>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-gray-400">Główny cel:</span> 
                                <span className="text-white ml-2">
                                    {selectedClient.goals.primary === 'weight_loss' ? 'Utrata wagi' :
                                     selectedClient.goals.primary === 'muscle_gain' ? 'Przyrost masy' :
                                     selectedClient.goals.primary === 'strength' ? 'Siła' :
                                     selectedClient.goals.primary === 'endurance' ? 'Wytrzymałość' : 'Ogólna forma'}
                                </span>
                            </p>
                            <p><span className="text-gray-400">Doświadczenie:</span> 
                                <span className="text-white ml-2">
                                    {selectedClient.goals.experience === 'beginner' ? 'Początkujący' :
                                     selectedClient.goals.experience === 'intermediate' ? 'Średniozaawansowany' : 'Zaawansowany'}
                                </span>
                            </p>
                            <p><span className="text-gray-400">Treningi/tydzień:</span> <span className="text-white">{selectedClient.goals.availableTime}</span></p>
                            {selectedClient.goals.targetWeight && (
                                <p><span className="text-gray-400">Cel wagowy:</span> <span className="text-white">{selectedClient.goals.targetWeight} kg</span></p>
                            )}
                        </div>
                    </div>

                    {/* Ostatnie pomiary */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Ostatnie Pomiary</h3>
                            <button
                                onClick={() => setView('measurements')}
                                className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                                Zobacz wszystkie →
                            </button>
                        </div>
                        {selectedClient.measurements.length === 0 ? (
                            <p className="text-gray-400 text-sm">Brak pomiarów</p>
                        ) : (
                            <div className="space-y-2 text-sm">
                                {selectedClient.measurements.slice(-3).reverse().map((measurement) => (
                                    <div key={measurement.id} className="border-b border-gray-700 pb-2">
                                        <p className="text-white font-medium">{measurement.date}</p>
                                        {measurement.weight && <p className="text-gray-400">Waga: {measurement.weight} kg</p>}
                                        {measurement.bodyFat && <p className="text-gray-400">Tłuszcz: {measurement.bodyFat}%</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notatki */}
                    {selectedClient.notes && (
                        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-4">Notatki</h3>
                            <p className="text-gray-300 text-sm whitespace-pre-wrap">{selectedClient.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderMeasurements = () => {
        if (!selectedClient) return null;

        return (
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <button
                            onClick={() => setView('view')}
                            className="text-gray-400 hover:text-white mr-4"
                        >
                            ← Powrót
                        </button>
                        <h2 className="text-2xl font-bold text-white">
                            Pomiary - {selectedClient.personalInfo.firstName} {selectedClient.personalInfo.lastName}
                        </h2>
                    </div>
                    <AnalyticsIcon className="w-6 h-6 text-blue-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Dodawanie nowego pomiaru */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Dodaj Nowy Pomiar</h3>
                        <form onSubmit={handleAddMeasurement} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Data</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={measurementData.date}
                                    onChange={handleMeasurementChange}
                                    required
                                    aria-label="Data pomiaru"
                                    placeholder="RRRR-MM-DD"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Waga (kg)</label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={measurementData.weight}
                                        onChange={handleMeasurementChange}
                                        step="0.1"
                                        aria-label="Waga w kilogramach"
                                        placeholder="75.5"
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Tłuszcz (%)</label>
                                    <input
                                        type="number"
                                        name="bodyFat"
                                        value={measurementData.bodyFat}
                                        onChange={handleMeasurementChange}
                                        step="0.1"
                                        aria-label="Procent tłuszczu w organizmie"
                                        placeholder="15.0"
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Klatka (cm)</label>
                                    <input
                                        type="number"
                                        name="chest"
                                        value={measurementData.chest}
                                        onChange={handleMeasurementChange}
                                        step="0.1"
                                        aria-label="Obwód klatki piersiowej w centymetrach"
                                        placeholder="95.0"
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Talia (cm)</label>
                                    <input
                                        type="number"
                                        name="waist"
                                        value={measurementData.waist}
                                        onChange={handleMeasurementChange}
                                        step="0.1"
                                        aria-label="Obwód talii w centymetrach"
                                        placeholder="80.0"
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Notatki</label>
                                <textarea
                                    name="notes"
                                    value={measurementData.notes}
                                    onChange={handleMeasurementChange}
                                    rows={3}
                                    aria-label="Notatki dodatkowe dotyczące pomiarów"
                                    placeholder="Dodatkowe uwagi, postępy, obserwacje..."
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                            >
                                Dodaj Pomiar
                            </button>
                        </form>
                    </div>

                    {/* Historia pomiarów */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Historia Pomiarów ({selectedClient.measurements.length})
                        </h3>
                        <div className="max-h-96 overflow-y-auto space-y-3">
                            {selectedClient.measurements.length === 0 ? (
                                <p className="text-gray-400 text-center py-8">Brak pomiarów</p>
                            ) : (
                                selectedClient.measurements.slice().reverse().map((measurement) => (
                                    <div key={measurement.id} className="border border-gray-700 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-white font-medium">{measurement.date}</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            {measurement.weight && (
                                                <p className="text-gray-300">Waga: <span className="text-white">{measurement.weight} kg</span></p>
                                            )}
                                            {measurement.bodyFat && (
                                                <p className="text-gray-300">Tłuszcz: <span className="text-white">{measurement.bodyFat}%</span></p>
                                            )}
                                            {measurement.measurements?.chest && (
                                                <p className="text-gray-300">Klatka: <span className="text-white">{measurement.measurements.chest} cm</span></p>
                                            )}
                                            {measurement.measurements?.waist && (
                                                <p className="text-gray-300">Talia: <span className="text-white">{measurement.measurements.waist} cm</span></p>
                                            )}
                                        </div>
                                        {measurement.notes && (
                                            <p className="text-gray-400 text-sm mt-2 italic">{measurement.notes}</p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg border border-gray-700">
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h1 className="text-3xl font-bold text-white">Zarządzanie Klientami</h1>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl"
                        aria-label="Zamknij panel zarządzania klientami"
                        title="Zamknij"
                    >
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {view === 'list' && renderClientList()}
                    {view === 'add' && renderAddClientForm()}
                    {view === 'view' && renderClientDetails()}
                    {view === 'measurements' && renderMeasurements()}
                </div>
            </div>
        </div>
    );
};

export default ClientManagement;