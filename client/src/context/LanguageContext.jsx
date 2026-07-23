import React, { createContext, useState, useContext } from 'react';

const translations = {
    en: {
        welcome: "Welcome to KaamSetu",
        tagline: "Connecting Workers to Work in UP",
        hire_workers: "Hire Workers",
        find_work: "Find Work",
        create_account: "Create Account",
        login: "Login",
        logout: "Logout",
        dashboard: "Dashboard",
        post_job: "Post Job",
        find_workers: "Find Workers",
        my_jobs: "My Jobs",
        edit_profile: "Edit Profile",
        fullname: "Full Name",
        phone: "Phone Number",
        skill: "Skill",
        location: "Location",
        wage: "Daily Wage",
        apply: "Apply Now",
        hire: "Hire Now",
        send: "Send",
        type_message: "Type a message...",
        save: "Save",
        setup_profile: "Setup Profile",
        upload_work: "Upload Work Photo"
    },
    hi: {
        welcome: "कामसेतु में आपका स्वागत है",
        tagline: "उत्तर प्रदेश में कामगारों को काम से जोड़ना",
        hire_workers: "मजदूर खोजें",
        find_work: "काम खोजें",
        create_account: "खाता बनाएं",
        login: "लॉगिन",
        logout: "लॉगआउट",
        dashboard: "डैशबोर्ड",
        post_job: "काम डालें",
        find_workers: "मजदूर खोजें",
        my_jobs: "मेरे काम",
        edit_profile: "प्रोफाइल बदलें",
        fullname: "पूरा नाम",
        phone: "फोन नंबर",
        skill: "हुनर",
        location: "स्थान",
        wage: "दैनिक मजदूरी",
        apply: "अभी आवेदन करें",
        hire: "अभी काम पर रखें",
        send: "भेजें",
        type_message: "संदेश लिखें...",
        save: "सुरक्षित करें",
        setup_profile: "प्रोफाइल बनाएं",
        upload_work: "काम का फोटो डालें"
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('hi'); // Default to Hindi

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'hi' : 'en');
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
