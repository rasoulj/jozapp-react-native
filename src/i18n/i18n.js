import I18n from 'react-native-i18n';

import en from './locales/en';
import fa from './locales/fa';

I18n.fallbacks = true;

I18n.translations = {
    en,
    fa: {
        "login": "لاگین",
        "auth.forget_password": "auth.forget_password",
        "auth.contact_us": "auth.forget_password",
        "wallet.my": "wallet.my",
        "profile.your_wallet_no": "Your wallet number-fa",
        "wallet": "کیف پول"
    }
};

export default I18n;
