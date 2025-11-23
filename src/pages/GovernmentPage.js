import React from 'react';
import { useTranslation } from 'react-i18next';

const GovernmentPage = () => {
    const { t } = useTranslation();
    return <div style={{padding: '2rem'}}><h1>{t('government')}</h1></div>;
};

export default GovernmentPage;