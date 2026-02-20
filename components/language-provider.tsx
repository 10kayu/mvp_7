"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import type { Language } from "@/lib/i18n";
import { isChinaDeployment } from "@/lib/config/deployment.config";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined
);

const STORAGE_KEY = "preferred-language";

/**
 * 语言提供者组件
 * Language Provider Component
 *
 * 功能：
 * 1. 管理全局语言状态
 * 2. 持久化到 localStorage
 * 3. 根据部署区域自动设置默认语言（中国区域=中文，国际区域=英文）
 * 4. 允许用户手动切换语言偏好
 * 5. 提供语言切换功能
 *
 * 优先级：
 * 1. localStorage 中的用户选择（最高优先级）
 * 2. 部署区域设置（DEPLOYMENT_REGION）
 *    - 中国区域 (CN)：默认中文
 *    - 国际区域 (INTL)：强制英文
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
    const defaultLanguage: Language = isChinaDeployment() ? "zh" : "en";
    const [language, setLanguageState] = useState<Language>(defaultLanguage);

    // 初始化语言
    useEffect(() => {
        // 优先级1: 从 localStorage 读取用户选择
        const saved = localStorage.getItem(STORAGE_KEY) as Language | null;

        if (saved === "zh" || saved === "en") {
            setLanguageState(saved);
            return;
        }

        // 优先级2: 根据部署区域推断默认语言
        setLanguageState(defaultLanguage);
        localStorage.setItem(STORAGE_KEY, defaultLanguage);
    }, [defaultLanguage]);

    // 设置语言（带持久化）
    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem(STORAGE_KEY, lang);
    };

    // 切换语言（中英文互换）
    const toggleLanguage = () => {
        const newLang: Language = language === "zh" ? "en" : "zh";
        setLanguage(newLang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

/**
 * 使用语言的 Hook
 * Use Language Hook
 */
export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return context;
}
