// Test skrypt do sprawdzenia funkcjonalności rejestracji i logowania
console.log("=== TEST APLIKACJI TRENERA PERSONALNEGO ===");

// Test 1: Sprawdzenie localStorage
console.log("1. Sprawdzanie localStorage...");
const existingUsers = [];
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('user_')) {
        existingUsers.push(key);
    }
}
console.log("Istniejący użytkownicy:", existingUsers);

// Test 2: Test rejestracji
console.log("\n2. Test rejestracji nowego użytkownika...");
const testUser = {
    name: "Jan Kowalski",
    email: "jan.kowalski@test.com",
    password: "test123",
    goals: {
        weight: { current: 80, goal: 75, history: [{ date: new Date().toISOString(), value: 80 }] },
        pushups: { current: 10, goal: 30, history: [{ date: new Date().toISOString(), value: 10 }] },
        pullups: { current: 2, goal: 10, history: [{ date: new Date().toISOString(), value: 2 }] },
        runDistance: { current: 2, goal: 5, history: [{ date: new Date().toISOString(), value: 2 }] },
        runTime: { current: 30, goal: 25, history: [{ date: new Date().toISOString(), value: 30 }] },
        boxingDuration: { current: 15, goal: 45, history: [{ date: new Date().toISOString(), value: 15 }] }
    }
};

try {
    // Symulacja rejestracji
    const userKey = `user_${testUser.email}`;
    const accountKey = `account_${testUser.email}`;
    
    localStorage.setItem(userKey, JSON.stringify({
        name: testUser.name,
        email: testUser.email,
        goals: testUser.goals
    }));
    
    localStorage.setItem(accountKey, JSON.stringify({
        email: testUser.email,
        password: testUser.password
    }));
    
    console.log("✅ Rejestracja udana");
} catch (error) {
    console.log("❌ Błąd rejestracji:", error);
}

// Test 3: Test logowania
console.log("\n3. Test logowania...");
try {
    const accountData = localStorage.getItem(`account_${testUser.email}`);
    if (accountData) {
        const account = JSON.parse(accountData);
        if (account.password === testUser.password) {
            const userData = localStorage.getItem(`user_${testUser.email}`);
            if (userData) {
                const user = JSON.parse(userData);
                console.log("✅ Logowanie udane, użytkownik:", user.name);
                localStorage.setItem('loggedInUser', testUser.email);
            }
        }
    }
} catch (error) {
    console.log("❌ Błąd logowania:", error);
}

// Test 4: Test danych trenera
console.log("\n4. Test dodawania planu treningowego...");
const trainingPlan = {
    id: Date.now().toString(),
    name: "Plan Siłowy - Początkujący",
    description: "3-dniowy plan treningowy dla początkujących",
    duration: "4 tygodnie",
    days: [
        {
            id: "day1",
            name: "Dzień 1 - Górna część ciała",
            exercises: [
                {
                    id: "ex1",
                    name: "Pompki",
                    sets: 3,
                    reps: "8-12",
                    rest: "60s",
                    notes: "Kontrolowane tempo"
                },
                {
                    id: "ex2",
                    name: "Podciąganie",
                    sets: 3,
                    reps: "5-8",
                    rest: "90s",
                    notes: "Pełny zakres ruchu"
                }
            ]
        }
    ],
    createdAt: new Date().toISOString()
};

try {
    localStorage.setItem(`trainingPlan_${testUser.email}`, JSON.stringify(trainingPlan));
    console.log("✅ Plan treningowy dodany");
} catch (error) {
    console.log("❌ Błąd dodawania planu:", error);
}

// Test 5: Test danych dietetycznych
console.log("\n5. Test dodawania planu dietetycznego...");
const dietPlan = {
    id: Date.now().toString(),
    name: "Plan Redukcyjny 1800 kcal",
    description: "Plan dietetyczny na redukcję masy ciała",
    totalCalories: 1800,
    meals: [
        {
            id: "meal1",
            name: "Śniadanie",
            ingredients: ["Owsianka", "Banana", "Orzechy"],
            calories: 400,
            protein: 15,
            carbs: 60,
            fat: 12
        }
    ],
    createdAt: new Date().toISOString()
};

try {
    localStorage.setItem(`dietPlan_${testUser.email}`, JSON.stringify(dietPlan));
    console.log("✅ Plan dietetyczny dodany");
} catch (error) {
    console.log("❌ Błąd dodawania planu dietetycznego:", error);
}

console.log("\n=== PODSUMOWANIE TESTÓW ===");
console.log("localStorage keys:", Object.keys(localStorage));
console.log("Zalogowany użytkownik:", localStorage.getItem('loggedInUser'));