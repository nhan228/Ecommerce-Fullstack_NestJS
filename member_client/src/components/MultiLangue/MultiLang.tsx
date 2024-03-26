import React, { useState, ChangeEvent } from "react";
import { useTranslation } from 'react-i18next';
import pictures from "@/pictures";

import './MultiLanguage.scss'

const MultiLanguage: React.FC = () => {
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState('vi-VI');

    const handleLangChange = (evt: ChangeEvent<HTMLSelectElement>) => {
        const lang = evt.target.value
        setLanguage(lang)
        i18n.changeLanguage(lang)
    }

    return (
        <>
            <div className="country">
                <img src={language == "vi-VI" ? pictures.flagVN : pictures.flagEN} alt="Flag" />
            </div>

            <select className="lang-select" onChange={(e) => { handleLangChange(e) }} id="language" defaultValue={language} >
                <option className="lang-option" value="vi-VI">VI</option>
                <option className="lang-option" value="en-EN">EN</option>
            </select>
        </>
    )
}

export default MultiLanguage
