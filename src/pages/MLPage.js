import React from 'react';
import { useTranslation } from 'react-i18next';

const MLPage = () => {
    const { t } = useTranslation();
    return <div style={{padding: '2rem'}}><h1>{t('ml')}</h1></div>;
};

export default MLPage;