
export const translations = {
  pl: {
    lang: "Polski",
    header: {
      nav: {
        offer: "Oferta",
        about: "O Mnie",
        philosophy: "Filozofia",
        booking: "Rezerwacja",
        login: "Zaloguj",
        dashboard: "Panel",
        logout: "Wyloguj"
      },
      call_button: "Zadzwoń",
    },
    hero: {
      subtitle: "Trener Personalny",
      title_1: "Zbuduj swoją formę.",
      title_2: "Pora doszlifować diament.",
      description: "Zapamiętaj: tutaj nie ma miękkiej gry. Haga | Rotterdam | Wateringen i okolice do 25 km.",
      cta_transform: "Zacznij Transformację",
      cta_diet: "Ankieta Dietetyczna",
    },
    offer: {
      title: "OFERTA",
      subtitle: "Żadnych wymówek, tylko rezultaty. Wybierz ścieżkę, która zaprowadzi Cię do Twojej najlepszej wersji.",
      cards: {
        foundation: {
          title: "FUNDAMENT",
          description: "Dla początkujących, którzy chcą zbudować solidne podstawy siły, techniki i żelaznej dyscypliny. Tu zaczyna się Twoja zmiana."
        },
        transformation: {
          title: "TRANSFORMACJA",
          description: "Kompleksowy program przemiany ciała i umysłu. Intensywna praca nad sylwetką, siłą i mentalnością zwycięzcy."
        },
        elite: {
          title: "ELITA",
          description: "Dla zaawansowanych i zawodników. Specjalistyczne przygotowanie motoryczne, które przekracza granice i wynosi Cię na wyższy poziom."
        }
      }
    },
     about: {
      title: "O MNIE",
      name: "Patryk 'KAJFASZ' Kulpa",
      description: "Tutaj kończą się wymówki. Nie interesuje mnie twój zły dzień ani brak motywacji. Wchodzisz na salę, by walczyć – ze swoimi słabościami, z wczorajszym sobą. Moje treningi to 100% intensywności, potu i żelaznej dyscypliny. Nie ma tu miejsca na ziewanie. Albo dajesz z siebie wszystko, albo szukaj innego trenera. (Tu nie ma miękkiej gry).",
      quote: "Z bólu rodzi się charakter, a z potu siła.",
      gallery_title: "Galeria Zdjęć",
      video_gallery_title: "Galeria Wideo",
    },
    process: {
      title: "FILOZOFIA WALKI",
      subtitle: "Moje podejście opiera się na zasadach wykutych w walce: dyscyplinie, szacunku i nieustannym dążeniu do doskonałości.",
      steps: {
        1: { title: "ANALIZA I CEL", description: "Zaczynamy od szczerej oceny Twojej aktualnej formy i wyznaczamy jasne, mierzalne cele. Bez owijania w bawełnę." },
        2: { title: "CIĘŻKA PRACA", description: "Wdrażamy plan w życie. Każdy trening to krok naprzód. Wymagam 100% zaangażowania, bo sam daję z siebie 100%." },
        3: { title: "REZULTAT I DOMINACJA", description: "Nie tylko osiągasz swoje cele – przekraczasz je. Budujesz nie tylko ciało, ale niezłomny charakter." }
      }
    },
    booking: {
      title: "ZAREZERWUJ KONSULTACJĘ",
      subtitle: "Pierwszy krok jest najtrudniejszy. Wybierz datę i godzinę, aby rozpocząć swoją transformację. Wypełnij formularz i ruszamy.",
      calendar: {
        select_time: "Wybierz Godzinę",
        days: "PN,WT,ŚR,CZ,PT,SO,ND"
      },
      form: {
        title: "Twoje Dane do Konsultacji",
        selected_date: "Wybrany termin",
        placeholders: {
          name: "Imię i Nazwisko*",
          email: "Email*",
          phone: "Telefon (opcjonalnie)",
          message: "Opisz krótko swoje cele*",
        },
        levels: {
          beginner: "Początkujący",
          intermediate: "Średniozaawansowany",
          advanced: "Zaawansowany",
        },
        submit_button: "Wyślij Zapytanie przez WhatsApp",
        errors: {
          name_required: "Imię i Nazwisko jest wymagane.",
          email_required: "Email jest wymagany.",
          email_invalid: "Proszę podać poprawny adres email.",
        }
      },
      whatsapp: {
        greeting: "Cześć! Chciałbym zarezerwować konsultację.",
        appointment: "Termin",
        name: "Imię i Nazwisko",
        email: "Email",
        phone: "Telefon",
        level: "Poziom",
        goal: "Cel",
      },
      confirm_modal: {
        title: "Potwierdź rezerwację",
        message_part1: "Czy na pewno chcesz zarezerwować termin na",
        message_part2: "o godzinie",
        confirm_button: "Potwierdź",
        cancel_button: "Anuluj"
      }
    },
    diet_modal: {
      title: "Ankieta Dietetyczna",
      subtitle: "Wypełnij szczegóły — trener przygotuje dla Ciebie spersonalizowany plan żywieniowy.",
      steps: {
        contact: "Dane Kontaktowe",
        physical: "Parametry Fizyczne",
        training: "Trening",
        health: "Zdrowie i Styl Życia",
        dietary: "Nawyki Żywieniowe",
        preferences: "Preferencje i Ustalenia",
      },
      sections: {
        contact: "1) Dane Kontaktowe",
        physical: "2) Parametry Fizyczne",
        training: "3) Trening",
        health: "4) Zdrowie i Styl Życia",
        dietary: "5) Nawyki Żywieniowe",
        preferences: "6) Preferencje i Ustalenia",
      },
      navigation: {
        previous: "Wstecz",
        next: "Dalej",
        step: "Krok",
        of: "z",
      },
      validation: {
        required: "To pole jest wymagane",
        email: "Podaj prawidłowy adres email",
      },
      labels: {
        intolerances: "Nietolerancje pokarmowe:",
        digestionIssues: "Problemy trawienne:",
        cuisines: "Preferowane kuchnie:",
      },
      common: {
        meals: "posiłków",
        none: "Brak",
      },
      submit: "Wyślij przez WhatsApp",
      placeholders: {
        firstName: "Imię", lastName: "Nazwisko", email: "E-mail", phone: "Telefon", birthDate: "Data urodzenia (dd/mm/yyyy)", gender: "Płeć (opcjonalnie)",
        height: "Wzrost (cm)", weight: "Waga (kg)", bodyFat: "Tkanka tł. % (opcjonalnie)", trainingFrequency: "Ile treningów w tyg.?*",
        allergyInfo: "Alergie (opisz)", healthInfo: "Choroby / diagnozy (np. nadciśnienie, IBS)", medications: "Leki (stałe)", hydration: "Ile wody pijesz dziennie (L)?",
        likedProducts: "Produkty lubiane / must-have", dislikedProducts: "Produkty nielubiane / wykluczenia",
        mealsPerDay: "Liczba posiłków", mealTimes: "Preferowane godziny posiłków", supplementsUsed: "Używane suplementy", notes: "Dodatkowe notatki (np. post 16/8)",
      },
      options: {
        gender: { male: "Mężczyzna", female: "Kobieta", other: "Inne" },
        activity: { low: "Niska aktywność", moderate: "Umiarkowana aktywność", high: "Wysoka aktywność", very_high: "Bardzo wysoka aktywność" },
        goal: { reduction: "Redukcja (spadek masy ciała)", maintenance: "Utrzymanie wagi", muscle_gain: "Masa (budowa mięśni)" },
        pace: { p_25: "Tempo: 0.25 kg/tydz.", p_5: "Tempo: 0.5 kg/tydz.", p_75: "Tempo: 0.75 kg/tydz.", p_1: "Tempo: 1.0 kg/tydz." },
        trainingExperience: { beginner: "Początkujący", '1-3y': "1-3 lata", '3-5y': "3-5 lat", '5y+': "5+ lat" },
        trainingType: { strength: "Siłowy", cardio: "Cardio", mixed: "Mieszany", functional: "Funkcjonalny" },
        dietType: { select: "— Wybierz główny typ diety —", balanced: "Zbilansowana", vegetarian: "Wegetariańska", vegan: "Wegańska", gluten_free: "Bezglutenowa", lactose_free: "Bezlaktozowa", keto: "Ketogeniczna" },
        intolerances: { gluten: "Gluten", lactose: "Laktoza", nuts: "Orzechy", eggs: "Jaja", soy: "Soja", fish: "Ryby", shellfish: "Skorupiaki" },
        digestionIssues: { bloating: "Wzdęcia", gas: "Gazy", constipation: "Zaparcia", diarrhea: "Biegunki", heartburn: "Zgaga" },
        sleepQuality: { excellent: "Doskonała", good: "Dobra", fair: "Przeciętna", poor: "Słaba" },
        stressLevel: { low: "Niski", moderate: "Średni", high: "Wysoki" },
        eatingHabits: { regular: "Regularne posiłki", irregular: "Nieregularne", emotional: "Jedzenie emocjonalne" },
        cookingSkills: { beginner: "Początkujący", intermediate: "Średnio zaawansowany", advanced: "Zaawansowany" },
        foodPrepTime: { '15min': "< 15 min", '30-60min': "30-60 min", '60+min': "> 60 min" },
        snackPrefs: { never: "Nigdy", rarely: "Rzadko", sometimes: "Czasami", often: "Często" },
        cuisines: { polish: "Polska", mediterranean: "Śródziemnomorska", asian: "Azjatycka", italian: "Włoska", mexican: "Meksykańska" },
        budget: { title: "Budżet", low: "Niski", medium: "Średni", high: "Wysoki" }
      },
      submit_button: "Wyślij Ankietę przez WhatsApp",
      whatsapp: {
        title: "--- ANKIETA DIETETYCZNA ---",
        s1_title: "*1) DANE KONTAKTOWE*",
        name: "Imię", surname: "Nazwisko", phone: "Telefon", dob: "Data ur.", gender: "Płeć",
        s2_title: "*2) PARAMETRY, CEL I TRENING*",
        height: "Wzrost", weight: "Waga", bodyFat: "Tkanka tł.", activity: "Aktywność", goal: "Cel", pace: "Tempo",
        trainingExp: "Dośw. treningowe", trainingFreq: "Częst. treningów", trainingType: "Typ treningu", timesPerWeek: "razy/tydz.",
        s3_title: "*3) WYBÓR DIETY*",
        dietType: "Typ diety",
        s4_title: "*4) ZDROWIE I STYL ŻYCIA*",
        intolerances: "Nietolerancje", allergies: "Alergie", diseases: "Choroby/diagnozy", meds: "Leki",
        digestion: "Problemy trawienne", sleep: "Jakość snu", stress: "Poziom stresu", hydration: "Nawodnienie",
        s5_title: "*5) NAWYKI ŻYWIENIOWE*",
        eatingHabits: "Nawyki jedzeniowe", cookingSkills: "Umiej. gotowania", prepTime: "Czas na prep",
        sweetSnacks: "Słodkie przekąski", saltySnacks: "Słone przekąski",
        likedProducts: "Produkty lubiane", dislikedProducts: "Produkty nielubiane",
        s6_title: "*6) PREFEROWANE KUCHNIE*",
        cuisines: "Kuchnie",
        s7_title: "*7) USTALENIA KOŃCOWE*",
        mealsPerDay: "Liczba posiłków", mealTimes: "Godziny posiłków", budget: "Budżet", supplements: "Suplementy", notes: "Notatki",
        none: "Brak"
      }
    },
    footer: {
      slogan: "Charakter wykuty w walce. Dyscyplina zbudowana na treningu.",
      follow: "Obserwuj Mnie",
      contact: "Kontakt",
      copyright: "Wszelkie prawa zastrzeżone.",
    },
    auth_modal: {
      login_title: "Logowanie",
      register_title: "Rejestracja",
      goals_title: "Ustaw swoje cele",
      goals_subtitle: "Określ swój punkt startowy i cele, do których będziemy dążyć.",
      name: "Imię",
      email: "Email",
      password: "Hasło",
      confirm_password: "Potwierdź hasło",
      login_button: "Zaloguj się",
      register_button: "Zarejestruj się i zacznij",
      next_button: "Dalej",
      no_account: "Nie masz konta?",
      have_account: "Masz już konto?",
      register_now: "Zarejestruj się",
      login_now: "Zaloguj się",
      errors: {
        invalid_credentials: "Nieprawidłowy email lub hasło.",
        password_mismatch: "Hasła nie są takie same.",
        user_exists: "Użytkownik o tym adresie email już istnieje."
      }
    },
    dashboard: {
      welcome_message: "Witaj z powrotem, {{name}}!",
      subtitle: "Twoje postępy, twoje cele. Czas na trening."
    },
    goals: {
      current: "Obecnie",
      goal: "Cel",
      reps: "powt.",
      update_button: "Aktualizuj Postęp",
      save_button: "Zapisz",
      progress_label: "POSTĘP",
      view_history_button: "Zobacz historię",
      weight: { title: "Waga Ciała" },
      pushups: { title: "Pompki" },
      pullups: { title: "Podciągnięcia" },
      runDistance: { title: "Bieg (Dystans)" },
      runTime: { title: "Bieg 5km (Czas)" },
      boxingDuration: { title: "Worek Bokserski" },
    },
    history_modal: {
      title: "Historia postępów dla {{goalTitle}}",
      date_header: "Data",
      value_header: "Wartość",
      no_history: "Brak zapisanej historii."
    }
  },
  en: {
    lang: "English",
    header: {
      nav: {
        offer: "Offer",
        about: "About Me",
        philosophy: "Philosophy",
        booking: "Booking",
        login: "Login",
        dashboard: "Dashboard",
        logout: "Logout"
      },
      call_button: "Call",
    },
    hero: {
      subtitle: "Personal Trainer",
      title_1: "Build your physique.",
      title_2: "Time to polish the diamond.",
      description: "Remember: there is no soft play here. The Hague | Rotterdam | Wateringen and surrounding areas up to 25 km.",
      cta_transform: "Start Transformation",
      cta_diet: "Dietary Survey",
    },
    offer: {
      title: "OFFER",
      subtitle: "No excuses, only results. Choose the path that will lead you to the best version of yourself.",
      cards: {
        foundation: {
          title: "FOUNDATION",
          description: "For beginners who want to build a solid foundation of strength, technique, and iron discipline. This is where your change begins."
        },
        transformation: {
          title: "TRANSFORMATION",
          description: "A comprehensive program to transform your body and mind. Intensive work on physique, strength, and a winner's mentality."
        },
        elite: {
          title: "ELITE",
          description: "For advanced individuals and competitors. Specialized motor preparation that pushes boundaries and takes you to a higher level."
        }
      }
    },
    about: {
      title: "ABOUT ME",
      name: "Patryk 'KAJFASZ' Kulpa",
      description: "Excuses end here. I don't care about your bad day or lack of motivation. You enter the gym to fight – against your weaknesses, against the person you were yesterday. My workouts are 100% intensity, sweat, and iron discipline. There's no room for yawning. Either you give it your all, or find another trainer. (There is no soft play here).",
      quote: "Character is born from pain, strength from sweat.",
      gallery_title: "Photo Gallery",
      video_gallery_title: "Video Gallery",
    },
    process: {
      title: "FIGHTING PHILOSOPHY",
      subtitle: "My approach is based on principles forged in combat: discipline, respect, and the relentless pursuit of perfection.",
      steps: {
        1: { title: "ANALYSIS & GOAL", description: "We start with an honest assessment of your current form and set clear, measurable goals. No beating around the bush." },
        2: { title: "HARD WORK", description: "We put the plan into action. Every workout is a step forward. I demand 100% commitment because I give 100% of myself." },
        3: { title: "RESULT & DOMINATION", description: "You don't just achieve your goals – you surpass them. You build not only a body, but an unbreakable character." }
      }
    },
    booking: {
      title: "BOOK A CONSULTATION",
      subtitle: "The first step is the hardest. Choose a date and time to start your transformation. Fill out the form and let's go.",
      calendar: {
        select_time: "Select Time",
        days: "MON,TUE,WED,THU,FRI,SAT,SUN"
      },
      form: {
        title: "Your Consultation Details",
        selected_date: "Selected date",
        placeholders: {
          name: "Name and Surname*",
          email: "Email*",
          phone: "Phone (optional)",
          message: "Briefly describe your goals*",
        },
        levels: {
          beginner: "Beginner",
          intermediate: "Intermediate",
          advanced: "Advanced",
        },
        submit_button: "Send Inquiry via WhatsApp",
        errors: {
            name_required: "Name and Surname is required.",
            email_required: "Email is required.",
            email_invalid: "Please provide a valid email address.",
        }
      },
      whatsapp: {
        greeting: "Hi! I would like to book a consultation.",
        appointment: "Appointment",
        name: "Name and Surname",
        email: "Email",
        phone: "Phone",
        level: "Level",
        goal: "Goal",
      },
      confirm_modal: {
        title: "Confirm Your Booking",
        message_part1: "Are you sure you want to book an appointment for",
        message_part2: "at",
        confirm_button: "Confirm",
        cancel_button: "Cancel"
      }
    },
    diet_modal: {
      title: "Dietary Survey",
      subtitle: "Fill in the details — the trainer will prepare a personalized nutrition plan for you.",
      sections: {
        contact: "1) Contact Details",
        params: "2) Parameters, Goal & Training",
        diet_choice: "3) Diet Choice",
        health_lifestyle: "4) Health & Lifestyle",
        dietary_habits: "5) Dietary Habits",
        cuisine: "6) Preferred Cuisines",
        arrangements: "7) Final Arrangements",
      },
      placeholders: {
        firstName: "First Name", lastName: "Last Name", email: "E-mail", phone: "Phone", birthDate: "Date of birth (yyyy-mm-dd)", gender: "Gender (optional)",
        height: "Height (cm)", weight: "Weight (kg)", bodyFat: "Body Fat % (optional)", trainingFrequency: "Workouts per week?*",
        allergyInfo: "Allergies (describe)", healthInfo: "Diseases / diagnoses (e.g., hypertension, IBS)", medications: "Medications (permanent)", hydration: "How much water you drink daily (L)?",
        likedProducts: "Liked products / must-haves", dislikedProducts: "Disliked products / exclusions",
        mealsPerDay: "Number of meals", mealTimes: "Preferred meal times", supplementsUsed: "Supplements used", notes: "Additional notes (e.g., 16/8 fasting)",
      },
      options: {
        gender: { male: "Male", female: "Female" },
        activity: { sedentary: "Sedentary lifestyle", light: "Light (1-2 workouts/wk)", moderate: "Moderate (3-4 workouts/wk)", high: "High (5+ workouts/wk)", very_high: "Very high (physical work)" },
        goal: { reduction: "Reduction (weight loss)", maintenance: "Weight maintenance", mass: "Mass (muscle building)" },
        pace: { p_5: "Pace: 0.5 kg/wk", p_7: "Pace: 0.7 kg/wk", p_1: "Pace: 1.0 kg/wk" },
        trainingExperience: { '0-1y': "Experience: < 1 year", '1-3y': "Experience: 1-3 years", '3-5y': "Experience: 3-5 years", '5y+': "Experience: 5+ years" },
        trainingType: { strength: "Type: Strength", hypertrophy: "Type: Bodybuilding", crossfit: "Type: CrossFit", endurance: "Type: Endurance", hybrid: "Type: Hybrid" },
        dietType: { select: "— Select main diet type —", balanced: "Balanced", vegetarian: "Vegetarian", vegan: "Vegan", gluten_free: "Gluten-free", lactose_free: "Lactose-free", keto: "Ketogenic" },
        intolerances: { title: "Intolerances / exclusions:", gluten: "Gluten", lactose: "Lactose", nuts: "Nuts", eggs: "Eggs", soy: "Soy", fish: "Fish", shellfish: "Shellfish" },
        digestionIssues: { title: "Digestion issues:", bloating: "Bloating", gas: "Gas", constipation: "Constipation", diarrhea: "Diarrhea", heartburn: "Heartburn" },
        sleepQuality: { title: "Sleep Quality", excellent: "Excellent", good: "Good", fair: "Fair", poor: "Poor" },
        stressLevel: { title: "Stress Level", low: "Low", moderate: "Moderate", high: "High" },
        eatingHabits: { title: "Eating Habits", regular: "Regular meals", irregular: "Irregular", emotional: "Emotional eating", night_snacking: "Night snacking" },
        cookingSkills: { title: "Cooking Skills", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
        foodPrepTime: { title: "Prep Time", '0-30min': "< 30 min", '30-60min': "30-60 min", '60min+': "> 60 min" },
        snackPrefs: { title_sweet: "Sweet snacks?", title_salty: "Salty snacks?", t_never: "Never", t_rarely: "Rarely", t_sometimes: "Sometimes", t_often: "Often" },
        cuisines: { polish: "Polish", mediterranean: "Mediterranean", asian: "Asian", italian: "Italian", mexican: "Mexican" },
        budget: { title: "Budget", low: "Low", medium: "Medium", high: "High" }
      },
      submit_button: "Send Survey via WhatsApp",
      whatsapp: {
        title: "--- DIETARY SURVEY ---",
        s1_title: "*1) CONTACT DETAILS*",
        name: "First Name", surname: "Last Name", phone: "Phone", dob: "DOB", gender: "Gender",
        s2_title: "*2) PARAMETERS, GOAL & TRAINING*",
        height: "Height", weight: "Weight", bodyFat: "Body Fat", activity: "Activity", goal: "Goal", pace: "Pace",
        trainingExp: "Training Exp", trainingFreq: "Training Freq", trainingType: "Training Type", timesPerWeek: "times/week",
        s3_title: "*3) DIET CHOICE*",
        dietType: "Diet Type",
        s4_title: "*4) HEALTH & LIFESTYLE*",
        intolerances: "Intolerances", allergies: "Allergies", diseases: "Diseases/diagnoses", meds: "Medications",
        digestion: "Digestion issues", sleep: "Sleep quality", stress: "Stress level", hydration: "Hydration",
        s5_title: "*5) DIETARY HABITS*",
        eatingHabits: "Eating habits", cookingSkills: "Cooking skills", prepTime: "Prep time",
        sweetSnacks: "Sweet snacks", saltySnacks: "Salty snacks",
        likedProducts: "Liked products", dislikedProducts: "Disliked products",
        s6_title: "*6) PREFERRED CUISINES*",
        cuisines: "Cuisines",
        s7_title: "*7) FINAL ARRANGEMENTS*",
        mealsPerDay: "Meals per day", mealTimes: "Meal times", budget: "Budget", supplements: "Supplements", notes: "Notes",
        none: "None"
      }
    },
    footer: {
      slogan: "Character forged in combat. Discipline built on training.",
      follow: "Follow Me",
      contact: "Contact",
      copyright: "All rights reserved.",
    },
    auth_modal: {
      login_title: "Login",
      register_title: "Register",
      goals_title: "Set Your Goals",
      goals_subtitle: "Define your starting point and the goals we will strive for.",
      name: "Name",
      email: "Email",
      password: "Password",
      confirm_password: "Confirm Password",
      login_button: "Log In",
      register_button: "Register & Start",
      next_button: "Next",
      no_account: "Don't have an account?",
      have_account: "Already have an account?",
      register_now: "Sign up",
      login_now: "Log in",
      errors: {
        invalid_credentials: "Invalid email or password.",
        password_mismatch: "Passwords do not match.",
        user_exists: "A user with this email already exists."
      }
    },
    dashboard: {
      welcome_message: "Welcome back, {{name}}!",
      subtitle: "Your progress, your goals. Time to train."
    },
    goals: {
      current: "Current",
      goal: "Goal",
      reps: "reps",
      update_button: "Update Progress",
      save_button: "Save",
      progress_label: "PROGRESS",
      view_history_button: "View History",
      weight: { title: "Body Weight" },
      pushups: { title: "Push-ups" },
      pullups: { title: "Pull-ups" },
      runDistance: { title: "Run (Distance)" },
      runTime: { title: "Run 5k (Time)" },
      boxingDuration: { title: "Boxing Bag" },
    },
    history_modal: {
        title: "Progress History for {{goalTitle}}",
        date_header: "Date",
        value_header: "Value",
        no_history: "No history recorded yet."
    }
  },
  nl: {
    lang: "Nederlands",
    header: {
      nav: {
        offer: "Aanbod",
        about: "Over Mij",
        philosophy: "Filosofie",
        booking: "Reserveren",
        login: "Inloggen",
        dashboard: "Dashboard",
        logout: "Uitloggen"
      },
      call_button: "Bellen",
    },
    hero: {
      subtitle: "Personal Trainer",
      title_1: "Bouw je vorm.",
      title_2: "Tijd om de diamant te slijpen.",
      description: "Onthoud: hier wordt niet zacht gespeeld. Den Haag | Rotterdam | Wateringen en omgeving tot 25 km.",
      cta_transform: "Start Transformatie",
      cta_diet: "Dieet Enquête",
    },
    offer: {
      title: "AANBOD",
      subtitle: "Geen excuses, alleen resultaten. Kies het pad dat je naar de beste versie van jezelf leidt.",
      cards: {
        foundation: {
          title: "FUNDAMENT",
          description: "Voor beginners die een solide basis van kracht, techniek en ijzeren discipline willen opbouwen. Hier begint je verandering."
        },
        transformation: {
          title: "TRANSFORMATIE",
          description: "Een compleet programma voor de transformatie van lichaam en geest. Intensief werk aan figuur, kracht en een winnaarsmentaliteit."
        },
        elite: {
          title: "ELITE",
          description: "Voor gevorderden en wedstrijdatleten. Gespecialiseerde motorische voorbereiding die grenzen verlegt en je naar een hoger niveau tilt."
        }
      }
    },
     about: {
      title: "OVER MIJ",
      name: "Patryk 'KAJFASZ' Kulpa",
      description: "Hier eindigen de excuses. Je slechte dag of gebrek aan motivatie interesseert me niet. Je komt de sportschool binnen om te vechten – tegen je zwaktes, tegen de persoon die je gisteren was. Mijn trainingen zijn 100% intensiteit, zweet en ijzeren discipline. Er is geen ruimte om te gapen. Of je geeft alles, of je zoekt een andere trainer. (Hier wordt niet zacht gespeeld).",
      quote: "Karakter wordt geboren uit pijn, kracht uit zweet.",
      gallery_title: "Fotogalerij",
      video_gallery_title: "Videogalerij",
    },
    process: {
      title: "VECHTFILOSOFIE",
      subtitle: "Mijn aanpak is gebaseerd op principes die in de strijd zijn gesmeed: discipline, respect en een onophoudelijk streven naar perfectie.",
      steps: {
        1: { title: "ANALYSE & DOEL", description: "We beginnen met een eerlijke evaluatie van je huidige vorm en stellen duidelijke, meetbare doelen. Zonder omwegen." },
        2: { title: "HARD WERKEN", description: "We brengen het plan in de praktijk. Elke training is een stap vooruit. Ik eis 100% inzet, want ik geef zelf 100%." },
        3: { title: "RESULTAAT & DOMINATIE", description: "Je bereikt niet alleen je doelen – je overtreft ze. Je bouwt niet alleen een lichaam, maar een onbreekbaar karakter." }
      }
    },
    booking: {
      title: "BOEK EEN CONSULT",
      subtitle: "De eerste stap is het moeilijkst. Kies een datum en tijd om je transformatie te starten. Vul het formulier in en laten we beginnen.",
      calendar: {
        select_time: "Kies Tijd",
        days: "MA,DI,WO,DO,VR,ZA,ZO"
      },
      form: {
        title: "Jouw Consultatiegegevens",
        selected_date: "Gekozen datum",
        placeholders: {
          name: "Naam en Achternaam*",
          email: "E-mail*",
          phone: "Telefoon (optioneel)",
          message: "Beschrijf kort je doelen*",
        },
        levels: {
          beginner: "Beginner",
          intermediate: "Gemiddeld",
          advanced: "Gevorderd",
        },
        submit_button: "Verstuur Aanvraag via WhatsApp",
        errors: {
            name_required: "Naam en Achternaam zijn verplicht.",
            email_required: "E-mail is verplicht.",
            email_invalid: "Voer een geldig e-mailadres in.",
        }
      },
      whatsapp: {
        greeting: "Hallo! Ik wil graag een consult boeken.",
        appointment: "Afspraak",
        name: "Naam en Achternaam",
        email: "E-mail",
        phone: "Telefoon",
        level: "Niveau",
        goal: "Doel",
      },
      confirm_modal: {
        title: "Bevestig je boeking",
        message_part1: "Weet je zeker dat je een afspraak wilt boeken voor",
        message_part2: "om",
        confirm_button: "Bevestig",
        cancel_button: "Annuleren"
      }
    },
    diet_modal: {
      title: "Dieet Enquête",
      subtitle: "Vul de details in — de trainer stelt een persoonlijk voedingsplan voor je op.",
      sections: {
        contact: "1) Contactgegevens",
        params: "2) Parameters, Doel & Training",
        diet_choice: "3) Dieetkeuze",
        health_lifestyle: "4) Gezondheid & Levensstijl",
        dietary_habits: "5) Eetgewoonten",
        cuisine: "6) Voorkeurskeukens",
        arrangements: "7) Laatste Afspraken",
      },
      placeholders: {
        firstName: "Voornaam", lastName: "Achternaam", email: "E-mail", phone: "Telefoon", birthDate: "Geboortedatum (jjjj-mm-dd)", gender: "Geslacht (optioneel)",
        height: "Lengte (cm)", weight: "Gewicht (kg)", bodyFat: "Vetpercentage % (optioneel)", trainingFrequency: "Trainingen per week?*",
        allergyInfo: "Allergieën (beschrijf)", healthInfo: "Ziekten / diagnoses (bijv. hoge bloeddruk, PDS)", medications: "Medicijnen (permanent)", hydration: "Hoeveel water drink je per dag (L)?",
        likedProducts: "Favoriete producten / must-haves", dislikedProducts: "Ongewenste producten / uitsluitingen",
        mealsPerDay: "Aantal maaltijden", mealTimes: "Voorkeurstijden voor maaltijden", supplementsUsed: "Gebruikte supplementen", notes: "Extra opmerkingen (bijv. 16/8 vasten)",
      },
      options: {
        gender: { male: "Man", female: "Vrouw" },
        activity: { sedentary: "Zittende levensstijl", light: "Licht (1-2 trainingen/wk)", moderate: "Gemiddeld (3-4 trainingen/wk)", high: "Hoog (5+ trainingen/wk)", very_high: "Zeer hoog (fysiek werk)" },
        goal: { reduction: "Reductie (gewichtsverlies)", maintenance: "Gewichtsbehoud", mass: "Massa (spieropbouw)" },
        pace: { p_5: "Tempo: 0.5 kg/wk", p_7: "Tempo: 0.7 kg/wk", p_1: "Tempo: 1.0 kg/wk" },
        trainingExperience: { '0-1y': "Ervaring: < 1 jaar", '1-3y': "Ervaring: 1-3 jaar", '3-5y': "Ervaring: 3-5 jaar", '5y+': "Ervaring: 5+ jaar" },
        trainingType: { strength: "Type: Kracht", hypertrophy: "Type: Bodybuilding", crossfit: "Type: CrossFit", endurance: "Type: Uithoudingsvermogen", hybrid: "Type: Hybride" },
        dietType: { select: "— Kies een dieettype —", balanced: "Gebalanceerd", vegetarian: "Vegetarisch", vegan: "Veganistisch", gluten_free: "Glutenvrij", lactose_free: "Lactosevrij", keto: "Ketogeen" },
        intolerances: { title: "Intoleranties / uitsluitingen:", gluten: "Gluten", lactose: "Lactose", nuts: "Noten", eggs: "Eieren", soy: "Soja", fish: "Vis", shellfish: "Schaaldieren" },
        digestionIssues: { title: "Spijsverteringsproblemen:", bloating: "Opgeblazen gevoel", gas: "Winderigheid", constipation: "Constipatie", diarrhea: "Diarree", heartburn: "Zuurbranden" },
        sleepQuality: { title: "Slaapkwaliteit", excellent: "Uitstekend", good: "Goed", fair: "Redelijk", poor: "Slecht" },
        stressLevel: { title: "Stressniveau", low: "Laag", moderate: "Gemiddeld", high: "Hoog" },
        eatingHabits: { title: "Eetgewoonten", regular: "Regelmatige maaltijden", irregular: "Onregelmatig", emotional: "Emotie-eten", night_snacking: "Nachtelijk snacken" },
        cookingSkills: { title: "Kookvaardigheid", beginner: "Beginner", intermediate: "Gemiddeld", advanced: "Gevorderd" },
        foodPrepTime: { title: "Tijd voor prep", '0-30min': "< 30 min", '30-60min': "30-60 min", '60min+': "> 60 min" },
        snackPrefs: { title_sweet: "Zoete snacks?", title_salty: "Zoute snacks?", t_never: "Nooit", t_rarely: "Zelden", t_sometimes: "Soms", t_often: "Vaak" },
        cuisines: { polish: "Pools", mediterranean: "Mediterraan", asian: "Aziatisch", italian: "Italiaans", mexican: "Mexicaans" },
        budget: { title: "Budget", low: "Laag", medium: "Gemiddeld", high: "Hoog" }
      },
      submit_button: "Verstuur Enquête via WhatsApp",
      whatsapp: {
        title: "--- DIEET ENQUÊTE ---",
        s1_title: "*1) CONTACTGEGEGEVENS*",
        name: "Voornaam", surname: "Achternaam", phone: "Telefoon", dob: "Geboortedatum", gender: "Geslacht",
        s2_title: "*2) PARAMETERS, DOEL & TRAINING*",
        height: "Lengte", weight: "Gewicht", bodyFat: "Vetpercentage", activity: "Activiteit", goal: "Doel", pace: "Tempo",
        trainingExp: "Trainingservaring", trainingFreq: "Trainingsfreq.", trainingType: "Trainingstype", timesPerWeek: "keer/week",
        s3_title: "*3) DIEETKEUZE*",
        dietType: "Dieettype",
        s4_title: "*4) GEZONDHEID & LEVENSSTIJL*",
        intolerances: "Intoleranties", allergies: "Allergieën", diseases: "Ziekten/diagnoses", meds: "Medicijnen",
        digestion: "Spijsverteringsproblemen", sleep: "Slaapkwaliteit", stress: "Stressniveau", hydration: "Hydratatie",
        s5_title: "*5) EETGEWOONTEN*",
        eatingHabits: "Eetgewoonten", cookingSkills: "Kookvaardigheid", prepTime: "Tijd voor prep",
        sweetSnacks: "Zoete snacks", saltySnacks: "Zoute snacks",
        likedProducts: "Favoriete producten", dislikedProducts: "Ongewenste producten",
        s6_title: "*6) VOORKEURSKEUKENS*",
        cuisines: "Keukens",
        s7_title: "*7) LAATSTE AFSPRAKEN*",
        mealsPerDay: "Maaltijden per dag", mealTimes: "Eetmomenten", budget: "Budget", supplements: "Supplementen", notes: "Opmerkingen",
        none: "Geen"
      }
    },
    footer: {
      slogan: "Karakter gesmeed in de strijd. Discipline gebouwd op training.",
      follow: "Volg Mij",
      contact: "Contact",
      copyright: "Alle rechten voorbehouden.",
    },
    auth_modal: {
        login_title: "Inloggen",
        register_title: "Registreren",
        goals_title: "Stel je doelen in",
        goals_subtitle: "Definieer je startpunt en de doelen waar we naar zullen streven.",
        name: "Naam",
        email: "E-mail",
        password: "Wachtwoord",
        confirm_password: "Bevestig Wachtwoord",
        login_button: "Inloggen",
        register_button: "Registreer & Start",
        next_button: "Volgende",
        no_account: "Geen account?",
        have_account: "Heb je al een account?",
        register_now: "Meld je aan",
        login_now: "Log in",
        errors: {
            invalid_credentials: "Ongeldig e-mailadres of wachtwoord.",
            password_mismatch: "Wachtwoorden komen niet overeen.",
            user_exists: "Een gebruiker met dit e-mailadres bestaat al."
        }
    },
    dashboard: {
        welcome_message: "Welkom terug, {{name}}!",
        subtitle: "Jouw vooruitgang, jouw doelen. Tijd om te trainen."
    },
    goals: {
        current: "Huidig",
        goal: "Doel",
        reps: "herh.",
        update_button: "Voortgang bijwerken",
        save_button: "Opslaan",
        progress_label: "VOORUITGANG",
        view_history_button: "Bekijk geschiedenis",
        weight: { title: "Lichaamsgewicht" },
        pushups: { title: "Push-ups" },
        pullups: { title: "Pull-ups" },
        runDistance: { title: "Hardlopen (Afstand)" },
        runTime: { title: "5km Loop (Tijd)" },
        boxingDuration: { title: "Bokszak" },
    },
    history_modal: {
        title: "Voortgangsgeschiedenis voor {{goalTitle}}",
        date_header: "Datum",
        value_header: "Waarde",
        no_history: "Nog geen geschiedenis vastgelegd."
    }
  },
  de: {
    lang: "Deutsch",
    header: {
      nav: {
        offer: "Angebot",
        about: "Über Mich",
        philosophy: "Philosophie",
        booking: "Buchen",
        login: "Anmelden",
        dashboard: "Dashboard",
        logout: "Abmelden"
      },
      call_button: "Anrufen",
    },
    hero: {
      subtitle: "Personal Trainer",
      title_1: "Baue deine Form auf.",
      title_2: "Zeit, den Diamanten zu schleifen.",
      description: "Denk daran: Hier gibt es kein sanftes Spiel. Den Haag | Rotterdam | Wateringen und Umgebung bis 25 km.",
      cta_transform: "Transformation starten",
      cta_diet: "Ernährungsumfrage",
    },
    offer: {
      title: "ANGEBOT",
      subtitle: "Keine Ausreden, nur Ergebnisse. Wähle den Weg, der dich zur besten Version deiner selbst führt.",
      cards: {
        foundation: {
          title: "FUNDAMENT",
          description: "Für Anfänger, die eine solide Grundlage aus Kraft, Technik und eiserner Disziplin aufbauen wollen. Hier beginnt deine Veränderung."
        },
        transformation: {
          title: "TRANSFORMATION",
          description: "Ein umfassendes Programm zur Umgestaltung von Körper und Geist. Intensive Arbeit an Figur, Kraft und einer Siegermentalität."
        },
        elite: {
          title: "ELITE",
          description: "Für Fortgeschrittene und Wettkämpfer. Spezialisierte motorische Vorbereitung, die Grenzen sprengt und dich auf ein höheres Niveau bringt."
        }
      }
    },
     about: {
      title: "ÜBER MICH",
      name: "Patryk 'KAJFASZ' Kulpa",
      description: "Hier enden die Ausreden. Dein schlechter Tag oder deine mangelnde Motivation interessieren mich nicht. Du betrittst das Studio, um zu kämpfen – gegen deine Schwächen, gegen die Person, die du gestern warst. Meine Workouts sind 100% Intensität, Schweiß und eiserne Disziplin. Hier gibt es keinen Platz zum Gähnen. Entweder gibst du alles, oder du suchst dir einen anderen Trainer. (Hier gibt es kein sanftes Spiel).",
      quote: "Aus Schmerz wird Charakter geboren, aus Schweiß wird Stärke.",
      gallery_title: "Fotogalerie",
      video_gallery_title: "Videogalerie",
    },
    process: {
      title: "KAMPFPHILOSOPHIE",
      subtitle: "Mein Ansatz basiert auf im Kampf geschmiedeten Prinzipien: Disziplin, Respekt und dem unermüdlichen Streben nach Perfektion.",
      steps: {
        1: { title: "ANALYSE & ZIEL", description: "Wir beginnen mit einer ehrlichen Einschätzung deiner aktuellen Form und setzen klare, messbare Ziele. Ohne Umschweife." },
        2: { title: "HARTE ARBEIT", description: "Wir setzen den Plan in die Tat um. Jedes Training ist ein Schritt nach vorn. Ich verlange 100% Einsatz, weil ich selbst 100% gebe." },
        3: { title: "ERGEBNIS & DOMINANZ", description: "Du erreichst nicht nur deine Ziele – du übertriffst sie. Du baust nicht nur einen Körper auf, sondern einen unzerbrechlichen Charakter." }
      }
    },
    booking: {
      title: "BERATUNG BUCHEN",
      subtitle: "Der erste Schritt ist der schwerste. Wähle ein Datum und eine Uhrzeit, um deine Transformation zu beginnen. Fülle das Formular aus und los geht's.",
      calendar: {
        select_time: "Zeit wählen",
        days: "MO,DI,MI,DO,FR,SA,SO"
      },
      form: {
        title: "Ihre Beratungsdetails",
        selected_date: "Gewählter Termin",
        placeholders: {
          name: "Name und Nachname*",
          email: "E-Mail*",
          phone: "Telefon (optional)",
          message: "Beschreiben Sie kurz Ihre Ziele*",
        },
        levels: {
          beginner: "Anfänger",
          intermediate: "Fortgeschritten",
          advanced: "Profi",
        },
        submit_button: "Anfrage per WhatsApp senden",
        errors: {
            name_required: "Name und Nachname sind erforderlich.",
            email_required: "E-Mail ist erforderlich.",
            email_invalid: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
        }
      },
      whatsapp: {
        greeting: "Hallo! Ich möchte eine Beratung buchen.",
        appointment: "Termin",
        name: "Name und Nachname",
        email: "E-Mail",
        phone: "Telefon",
        level: "Niveau",
        goal: "Ziel",
      },
      confirm_modal: {
        title: "Bestätigen Sie Ihre Buchung",
        message_part1: "Möchten Sie wirklich einen Termin für den",
        message_part2: "um",
        confirm_button: "Bestätigen",
        cancel_button: "Abbrechen"
      }
    },
    diet_modal: {
      title: "Ernährungsumfrage",
      subtitle: "Füllen Sie die Details aus — der Trainer wird einen personalisierten Ernährungsplan für Sie erstellen.",
      sections: {
        contact: "1) Kontaktdaten",
        params: "2) Parameter, Ziel & Training",
        diet_choice: "3) Diätwahl",
        health_lifestyle: "4) Gesundheit & Lebensstil",
        dietary_habits: "5) Essgewohnheiten",
        cuisine: "6) Bevorzugte Küchen",
        arrangements: "7) Abschließende Vereinbarungen",
      },
      placeholders: {
        firstName: "Vorname", lastName: "Nachname", email: "E-Mail", phone: "Telefon", birthDate: "Geburtsdatum (JJJJ-MM-TT)", gender: "Geschlecht (optional)",
        height: "Größe (cm)", weight: "Gewicht (kg)", bodyFat: "Körperfett % (optional)", trainingFrequency: "Trainingseinheiten pro Woche?*",
        allergyInfo: "Allergien (beschreiben)", healthInfo: "Krankheiten / Diagnosen (z.B. Bluthochdruck, Reizdarm)", medications: "Medikamente (dauerhaft)", hydration: "Wie viel Wasser trinken Sie täglich (L)?",
        likedProducts: "Bevorzugte Produkte / Must-haves", dislikedProducts: "Unerwünschte Produkte / Ausschlüsse",
        mealsPerDay: "Anzahl der Mahlzeiten", mealTimes: "Bevorzugte Essenszeiten", supplementsUsed: "Verwendete Supplemente", notes: "Zusätzliche Anmerkungen (z.B. 16/8 Fasten)",
      },
      options: {
        gender: { male: "Männlich", female: "Weiblich" },
        activity: { sedentary: "Sitzende Lebensweise", light: "Leicht (1-2 Trainingseinheiten/Wo.)", moderate: "Mäßig (3-4 Trainingseinheiten/Wo.)", high: "Hoch (5+ Trainingseinheiten/Wo.)", very_high: "Sehr hoch (körperliche Arbeit)" },
        goal: { reduction: "Reduktion (Gewichtsverlust)", maintenance: "Gewicht halten", mass: "Masse (Muskelaufbau)" },
        pace: { p_5: "Tempo: 0.5 kg/Wo.", p_7: "Tempo: 0.7 kg/Wo.", p_1: "Tempo: 1.0 kg/Wo." },
        trainingExperience: { '0-1y': "Erfahrung: < 1 Jahr", '1-3y': "Erfahrung: 1-3 Jahre", '3-5y': "Erfahrung: 3-5 Jahre", '5y+': "Erfahrung: 5+ Jahre" },
        trainingType: { strength: "Typ: Kraft", hypertrophy: "Typ: Bodybuilding", crossfit: "Typ: CrossFit", endurance: "Typ: Ausdauer", hybrid: "Typ: Hybrid" },
        dietType: { select: "— Hauptdiättyp wählen —", balanced: "Ausgewogen", vegetarian: "Vegetarisch", vegan: "Vegan", gluten_free: "Glutenfrei", lactose_free: "Laktosefrei", keto: "Ketogen" },
        intolerances: { title: "Unverträglichkeiten / Ausschlüsse:", gluten: "Gluten", lactose: "Laktose", nuts: "Nüsse", eggs: "Eier", soy: "Soja", fish: "Fisch", shellfish: "Schalentiere" },
        digestionIssues: { title: "Verdauungsprobleme:", bloating: "Blähungen", gas: "Gase", constipation: "Verstopfung", diarrhea: "Durchfall", heartburn: "Sodbrennen" },
        sleepQuality: { title: "Schlafqualität", excellent: "Ausgezeichnet", good: "Gut", fair: "Mäßig", poor: "Schlecht" },
        stressLevel: { title: "Stresslevel", low: "Niedrig", moderate: "Mittel", high: "Hoch" },
        eatingHabits: { title: "Essgewohnheiten", regular: "Regelmäßige Mahlzeiten", irregular: "Unregelmäßig", emotional: "Emotionales Essen", night_snacking: "Nächtliches Naschen" },
        cookingSkills: { title: "Kochkenntnisse", beginner: "Anfänger", intermediate: "Mittel", advanced: "Fortgeschritten" },
        foodPrepTime: { title: "Vorbereitungszeit", '0-30min': "< 30 Min", '30-60min': "30-60 Min", '60min+': "> 60 Min" },
        snackPrefs: { title_sweet: "Süße Snacks?", title_salty: "Salzige Snacks?", t_never: "Nie", t_rarely: "Selten", t_sometimes: "Manchmal", t_often: "Oft" },
        cuisines: { polish: "Polnisch", mediterranean: "Mediterran", asian: "Asiatisch", italian: "Italienisch", mexican: "Mexikanisch" },
        budget: { title: "Budget", low: "Niedrig", medium: "Mittel", high: "Hoch" }
      },
      submit_button: "Umfrage per WhatsApp senden",
      whatsapp: {
        title: "--- ERNÄHRUNGSUMFRAGE ---",
        s1_title: "*1) KONTAKTDATEN*",
        name: "Vorname", surname: "Nachname", phone: "Telefon", dob: "Geburtsdatum", gender: "Geschlecht",
        s2_title: "*2) PARAMETER, ZIEL & TRAINING*",
        height: "Größe", weight: "Gewicht", bodyFat: "Körperfett", activity: "Aktivität", goal: "Ziel", pace: "Tempo",
        trainingExp: "Trainingserfahrung", trainingFreq: "Trainingsfrequenz", trainingType: "Trainingstyp", timesPerWeek: "Mal/Woche",
        s3_title: "*3) DIÄTWAHL*",
        dietType: "Diättyp",
        s4_title: "*4) GESUNDHEIT & LEBENSSTIL*",
        intolerances: "Unverträglichkeiten", allergies: "Allergien", diseases: "Krankheiten/Diagnosen", meds: "Medikamente",
        digestion: "Verdauungsprobleme", sleep: "Schlafqualität", stress: "Stresslevel", hydration: "Hydration",
        s5_title: "*5) ESSGEWOHNHEITEN*",
        eatingHabits: "Essgewohnheiten", cookingSkills: "Kochkenntnisse", prepTime: "Vorbereitungszeit",
        sweetSnacks: "Süße Snacks", saltySnacks: "Salzige Snacks",
        likedProducts: "Bevorzugte Produkte", dislikedProducts: "Unerwünschte Produkte",
        s6_title: "*6) BEVORZUGTE KÜCHEN*",
        cuisines: "Küchen",
        s7_title: "*7) ABSCHLIESSENDE VEREINBARUNGEN*",
        mealsPerDay: "Mahlzeiten pro Tag", mealTimes: "Essenszeiten", budget: "Budget", supplements: "Supplemente", notes: "Anmerkungen",
        none: "Keine"
      }
    },
    footer: {
      slogan: "Charakter, im Kampf geschmiedet. Disziplin, auf Training aufgebaut.",
      follow: "Folge Mir",
      contact: "Kontakt",
      copyright: "Alle Rechte vorbehalten.",
    },
    auth_modal: {
        login_title: "Anmelden",
        register_title: "Registrieren",
        goals_title: "Setze deine Ziele",
        goals_subtitle: "Definiere deinen Ausgangspunkt und die Ziele, die wir anstreben werden.",
        name: "Name",
        email: "E-Mail",
        password: "Passwort",
        confirm_password: "Passwort bestätigen",
        login_button: "Anmelden",
        register_button: "Registrieren & Starten",
        next_button: "Weiter",
        no_account: "Kein Konto?",
        have_account: "Bereits ein Konto?",
        register_now: "Registrieren",
        login_now: "Anmelden",
        errors: {
            invalid_credentials: "Ungültige E-Mail oder ungültiges Passwort.",
            password_mismatch: "Passwörter stimmen nicht überein.",
            user_exists: "Ein Benutzer mit dieser E-Mail existiert bereits."
        }
    },
    dashboard: {
        welcome_message: "Willkommen zurück, {{name}}!",
        subtitle: "Dein Fortschritt, deine Ziele. Zeit zum Trainieren."
    },
    goals: {
        current: "Aktuell",
        goal: "Ziel",
        reps: "Wdh.",
        update_button: "Fortschritt aktualisieren",
        save_button: "Speichern",
        progress_label: "FORTSCHRITT",
        view_history_button: "Verlauf anzeigen",
        weight: { title: "Körpergewicht" },
        pushups: { title: "Liegestütze" },
        pullups: { title: "Klimmzüge" },
        runDistance: { title: "Laufen (Distanz)" },
        runTime: { title: "5km Lauf (Zeit)" },
        boxingDuration: { title: "Boxsack" },
    },
    history_modal: {
        title: "Fortschrittsverlauf für {{goalTitle}}",
        date_header: "Datum",
        value_header: "Wert",
        no_history: "Noch kein Verlauf aufgezeichnet."
    }
  }
};