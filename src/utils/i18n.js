import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Arabic translations
const resources = {
  ar: {
    translation: {
      // Home Page
      home: "الرئيسية",
      about: "عن الموقع",
      companies: "الشركات",
      blog: "المدونة",
      contactUs: "اتصل بنا",
      login: "تسجيل الدخول",
      welcomeMessage:
        "أهلا بك في دليل التشطيبات - خدمات التشطيب والتجديد في مصر",
      findCompanies: "ابحث عن شركات التشطيب المناسبة لاحتياجاتك",
      exploreNow: "استكشف الآن",
      featuredCompanies: "شركات مميزة",
      viewAll: "عرض الكل",

      // Companies
      searchCompanies: "ابحث عن الشركات",
      filter: "تصفية",
      categories: "الفئات",
      location: "الموقع",
      rating: "التقييم",
      services: "الخدمات",
      noCompanies: "لم يتم العثور على شركات",

      // Company Details
      gallery: "معرض الصور",
      videos: "الفيديوهات",
      contactInfo: "معلومات الاتصال",
      address: "العنوان",
      phone: "الهاتف",
      whatsapp: "واتساب",
      email: "البريد الإلكتروني",
      reviews: "التقييمات",
      addReview: "إضافة تقييم",
      pricingPlans: "خطط الأسعار",
      perMeter: "للمتر",

      // Contact Form
      name: "الاسم",
      subject: "الموضوع",
      message: "الرسالة",
      send: "إرسال",
      messageSent: "تم إرسال رسالتك بنجاح",

      // Login
      username: "اسم المستخدم",
      password: "كلمة المرور",
      forgotPassword: "نسيت كلمة المرور؟",
      adminLogin: "تسجيل دخول المدير",
      companyLogin: "تسجيل دخول الشركة",

      // Footer
      copyright: "جميع الحقوق محفوظة ",
      privacyPolicy: "سياسة الخصوصية",
      termsOfService: "شروط الخدمة",
      followUs: "تابعنا",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ar", // Default language
  fallbackLng: "ar",
  interpolation: {
    escapeValue: false, // React already escapes
  },
  // RTL support
  dir: "rtl",
});

export default i18n;
