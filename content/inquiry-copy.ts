import type { Locale } from "@/content/i18n";
import { budgetTypes, serviceTypes, timelineTypes } from "@/lib/inquiry-schema";

const copy = {
  en: {
    fullName: "Full name", phone: "Phone number", email: "Email address", company: "Company",
    service: "What do you need help with?", budget: "Budget preference", timeline: "Expected timeline",
    description: "Project details", reference: "Reference URL", submit: "Send inquiry", required: "Required",
    optional: "Optional", sending: "Saving your inquiry…", success: "Your inquiry was saved for review.",
    unavailable: "We could not save your inquiry. Your entries are still here; please try again shortly.",
    invalid: "Please check the highlighted fields and try again.", rateLimited: "Too many attempts. Please wait before trying again.",
    fullNameError: "Enter a name using letters and normal name punctuation.", phoneError: "Enter a valid Egyptian mobile or international phone number.",
    emailError: "Enter a valid email address.", companyError: "Use 160 characters or fewer and remove control characters.",
    descriptionError: "Use 5,000 characters or fewer and remove control characters.", referenceError: "Enter a valid HTTP or HTTPS URL.",
    select: "Choose an option", noPreference: "Choose an option", honeypot: "Leave this field empty",
    projectHeading: "Tell us what you are planning", privacy: "Your inquiry will be shared with the team for follow-up. Please do not send passwords or sensitive personal information.",
    serviceLabels: ["Website or e-commerce", "Mobile application", "Business system", "AI or automation", "System integration", "Other or unsure"],
    budgetLabels: ["Not decided yet", "I need help estimating", "I have a range in mind", "Prefer not to say"],
    timelineLabels: ["Exploring options", "1–3 months", "3–6 months", "Flexible"],
  },
  ar: {
    fullName: "الاسم الكامل", phone: "رقم الهاتف", email: "البريد الإلكتروني", company: "الشركة",
    service: "ما المجال الذي تحتاج فيه إلى مساعدة؟", budget: "تفضيل الميزانية", timeline: "الجدول الزمني المتوقع",
    description: "تفاصيل المشروع", reference: "رابط مرجعي", submit: "إرسال الاستفسار", required: "مطلوب",
    optional: "اختياري", sending: "جارٍ حفظ استفسارك…", success: "تم حفظ استفسارك للمراجعة.",
    unavailable: "تعذر حفظ الاستفسار. ما زالت البيانات التي أدخلتها محفوظة هنا؛ يرجى المحاولة بعد قليل.",
    invalid: "يرجى مراجعة الحقول المحددة ثم المحاولة مجددًا.", rateLimited: "تكررت محاولات الإرسال. يرجى الانتظار قليلًا قبل المحاولة مجددًا.",
    fullNameError: "أدخل اسمًا يتكوّن من حروف وعلامات ترقيم مناسبة للأسماء.", phoneError: "أدخل رقم هاتف محمول مصريًا صالحًا أو رقمًا دوليًا صالحًا.",
    emailError: "أدخل عنوان بريد إلكتروني صالحًا.", companyError: "استخدم 160 حرفًا كحد أقصى، وتجنب محارف التحكم.",
    descriptionError: "استخدم 5000 حرف كحد أقصى، وتجنب محارف التحكم.", referenceError: "أدخل رابطًا صالحًا يبدأ بـ HTTP أو HTTPS.",
    select: "اختر خيارًا", noPreference: "اختر خيارًا", honeypot: "اترك هذا الحقل فارغًا",
    projectHeading: "أخبرنا بما تخطط له", privacy: "سيُشارك استفسارك مع الفريق للمتابعة. يرجى عدم إرسال كلمات المرور أو المعلومات الشخصية الحساسة.",
    serviceLabels: ["موقع إلكتروني أو متجر", "تطبيق جوال", "نظام أعمال", "ذكاء اصطناعي أو أتمتة", "تكامل الأنظمة", "أخرى أو غير محدد"],
    budgetLabels: ["لم أحددها بعد", "أحتاج إلى تقدير", "لدي نطاق محدد", "أفضل عدم الإفصاح"],
    timelineLabels: ["ما زلت أستكشف الخيارات", "من شهر إلى ثلاثة أشهر", "من ثلاثة إلى ستة أشهر", "مرن"],
  },
} as const;

export function getInquiryCopy(locale: Locale) { return copy[locale]; }
export const serviceKeys = serviceTypes;
export const budgetKeys = budgetTypes;
export const timelineKeys = timelineTypes;
