pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let currentExtractedText = "";
let currentUser = null;
let reportHistory = [];

const languages = [
    { code: 'en', name: 'English', native: 'English', voiceCode: 'en-US' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', voiceCode: 'ta-IN' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', voiceCode: 'te-IN' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', voiceCode: 'hi-IN' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', voiceCode: 'ml-IN' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', voiceCode: 'kn-IN' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', voiceCode: 'mr-IN' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', voiceCode: 'bn-IN' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', voiceCode: 'gu-IN' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', voiceCode: 'pa-IN' },
    { code: 'ja', name: 'Japanese', native: '日本語', voiceCode: 'ja-JP' },
    { code: 'zh', name: 'Chinese', native: '中文', voiceCode: 'zh-CN' },
    { code: 'ko', name: 'Korean', native: '한국어', voiceCode: 'ko-KR' },
    { code: 'th', name: 'Thai', native: 'ไทย', voiceCode: 'th-TH' }
];

const i18n = {
    en: { welcomeSub: "Understand your health in your language.", welcomeMain: "Medical Reports Made Simple", welcomeDesc: "Upload report, understand complex medical terms easily.", btnStart: "Get Started", btnContinue: "Continue", langTitle: "Choose your language", langDesc: "We will use this language throughout the app.", homeSub: "Good health, better understanding", homeHello: "Hello, ", heroTitle: "Medical Reports Made Simple", heroDesc: "Clear explanations from complex medical documents.", btnUpload: "Upload Report", resultHeader: "Detailed Patient Friendly Explanation", extractedHeader: "Extracted Text", riskTitle: "Health Risk Status", graphTitle: "🩺 Saved Reports", navHome: "🏠 Home", navUpload: "📤 Upload", navLang: "🌐 Language" },
    ta: { welcomeSub: "உங்கள் ஆரோக்கியத்தை உங்கள் மொழியில் புரிந்து கொள்ளுங்கள்.", welcomeMain: "மருத்துவ அறிக்கைகள் எளிமையாக புரிந்துகொள்ளலாம்", welcomeDesc: "அறிக்கையைப் பதிவேற்றி, கடினமான மருத்துவ சொற்களை எளிதில் புரிந்து கொள்ளுங்கள்.", btnStart: "தொடங்குங்கள்", btnContinue: "தொடரவும்", langTitle: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்", langDesc: "செயலி முழுவதும் இந்த மொழி பயன்படுத்தப்படும்.", homeSub: "நல்ல ஆரோக்கியம், சிறந்த புரிதல்", homeHello: "வணக்கம், ", heroTitle: "மருத்துவ அறிக்கை விளக்கம்", heroDesc: "சிக்கலான மருத்துவ அறிக்கைகளின் விரிவான எளிய விளக்கம்.", btnUpload: "அறிக்கையைப் பதிவேற்றுக", resultHeader: "விரிவான நோயாளிக்கான விளக்கம்", extractedHeader: "அறிக்கையிலிருந்து பெறப்பட்ட உரை", riskTitle: "சுகாதார ஆபத்து மதிப்பீடு", graphTitle: "🩺 சேமிக்கப்பட்ட அறிக்கைகள்", navHome: "🏠 முகப்பு", navUpload: "📤 பதிவேற்று", navLang: "🌐 மொழி" },
    te: { welcomeSub: "మీ భాషలో మీ ఆరోగ్యాన్ని అర్థం చేసుకోండి.", welcomeMain: "వైద్య నివేదికలు సులభంగా అర్థమవుతాయి", welcomeDesc: "నివేదికను అప్‌లోడ్ చేయండి, క్లిష్టమైన వైద్య పదాలను సులభంగా అర్థం చేసుకోండి.", btnStart: "ప్రారంభించండి", btnContinue: "కొనసాగించండి", langTitle: "మీ భాషను ఎంచుకోండి", langDesc: "యాప్‌లో ఈ భాష ఉపయోగించబడుతుంది.", homeSub: "మంచి ఆరోగ్యం, మెరుగైన అవగాహన", homeHello: "నమస్కారం, ", heroTitle: "వైద్య నివేదిక విశ్లేషణ", heroDesc: "క్లిష్టమైన నివేదికల సరళమైన వివరణ.", btnUpload: "రిపోర్ట్ అప్‌లోడ్ చేయండి", resultHeader: "వివరణాత్మక వివరణ", extractedHeader: "సేకరించిన పాఠం", riskTitle: "ఆరోగ్య ప్రమాద స్థితి", graphTitle: "🩺 సేవ్ చేసిన నివేదికలు", navHome: "🏠 హోమ్", navUpload: "📤 అప్‌లోਡ", navLang: "🌐 భాష" },
    hi: { welcomeSub: "अपनी भाषा में अपने स्वास्थ्य को समझें।", welcomeMain: "मेडिकल रिपोर्ट को आसानी से समझें", welcomeDesc: "रिपोर्ट अपलोड करें और जटिल शब्दों को आसानी से समझें।", btnStart: "शुरू करें", btnContinue: "आगे बढ़ें", langTitle: "अपनी भाषा चुनें", langDesc: "ऐप में इस भाषा का उपयोग किया जाएगा।", homeSub: "अच्छा स्वास्थ्य, बेहतर समझ", homeHello: "नमस्ते, ", heroTitle: "मेडिकल रिपोर्ट का सरल विवरण", heroDesc: "कठिन रिपोर्ट की आसान समझ।", btnUpload: "रिपोर्ट अपलोड करें", resultHeader: "विस्तृत विवरण", extractedHeader: "निकाला गया टेक्स्ट", riskTitle: "स्वास्थ्य जोखिम मूल्यांकन", graphTitle: "🩺 सेव की गई रिपोर्ट", navHome: "🏠 होम", navUpload: "📤 अपलोड", navLang: "🌐 भाषा" },
    ml: { welcomeSub: "നിങ്ങളുടെ ഭാഷയിൽ ആരോഗ്യം മനസ്സിലാക്കുക.", welcomeMain: "മെഡിക്കൽ റിപ്പോർട്ടുകൾ ലളിതമായി വായിക്കാം", welcomeDesc: "റിപ്പോർട്ട് അപ്‌ലോഡ് ചെയ്ത് വിവരങ്ങൾ എളുപ്പത്തിൽ മനസ്സിലാക്കുക.", btnStart: "തുടങ്ങുക", btnContinue: "തുടരുക", langTitle: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക", langDesc: "ആപ്പിൽ ഈ ഭാഷ ഉപയോഗിക്കും.", homeSub: "നല്ല ആരോഗ്യം, മികച്ച അറിവ്", homeHello: "നമസ്കാരം, ", heroTitle: "മെഡിക്കൽ റിപ്പോർട്ട് വിശദീകരണം", heroDesc: "സങ്കീർണ്ണമായ റിപ്പോർട്ടുകളുടെ ലളിതമായ വിവരണം.", btnUpload: "റിപ്പോർട്ട് അപ്‌ലോഡ് ചെയ്യുക", resultHeader: "വിശദമായ വിവരണം", extractedHeader: "വേർതിരിച്ചെടുത്ത അക്ഷരങ്ങൾ", riskTitle: "ആരോഗ്യ അപകടസാധ്യത", graphTitle: "🩺 സേവ് ചെയ്ത റിപ്പോർട്ടുകൾ", navHome: "🏠 ഹോം", navUpload: "📤 അപ്‌ലോഡ്", navLang: "🌐 ഭാഷ" },
    kn: { welcomeSub: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ನಿಮ್ಮ ಆರೋಗ್ಯವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.", welcomeMain: "ವೈದ್ಯಕೀಯ ವರದಿಗಳು ಸರಳವಾಗಿ ಅರ್ಥವಾಗಲಿವೆ", welcomeDesc: "ವರದಿಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ, ಸುಲಭವಾಗಿ ವಿವರಣೆ ಪಡೆಯಿರಿ.", btnStart: "ಪ್ರಾರಂಭಿಸಿ", btnContinue: "ಮುಂದುವರಿಸಿ", langTitle: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", langDesc: "ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ಈ ಭಾಷೆಯನ್ನು ಬಳಸಲಾಗುತ್ತದೆ.", homeSub: "ಉತ್ತಮ ಆರೋಗ್ಯ, ಉತ್ತಮ ತಿಳುವಳಿಕೆ", homeHello: "ನಮಸ್ಕಾರ, ", heroTitle: "ವೈದ್ಯಕೀಯ ವರದಿ ವಿವರಣೆ", heroDesc: "ಸಂಕೀರ್ಣ ವರದಿಗಳ ಸರಳ ವಿವರಣೆ.", btnUpload: "ವರದಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", resultHeader: "ವಿವರವಾದ ವಿವರಣೆ", extractedHeader: "ಪಡೆಯಲಾದ ಪಠ್ಯ", riskTitle: "ಆರೋಗ್ಯ ಅಪಾಯದ ಸ್ಥಿತಿ", graphTitle: "🩺 ಉಳಿಸಿದ ವರದಿಗಳು", navHome: "🏠 ಮುಖಪುಟ", navUpload: "📤 ಅಪ್‌ಲೋಡ್", navLang: "🌐 ಭಾಷೆ" },
    mr: { welcomeSub: "तुमच्या भाषेत तुमचे आरोग्य समजून घ्या.", welcomeMain: "वैद्यकीय अहवाल सोप्या भाषेत", welcomeDesc: "रिपोर्ट अपलोड करा आणि वैद्यकीय शब्द सहज समजून घ्या.", btnStart: "शुरू करा", btnContinue: "पुढे जा", langTitle: "तुमची भाषा निवडा", langDesc: "अॅपमध्ये ही भाषा वापरली जाईल.", homeSub: "चांगले आरोग्य, उत्तम समज", homeHello: "नमस्कार, ", heroTitle: "वैद्यकीय अहवाल स्पष्टीकरण", heroDesc: "कठीण अहवालांचे सोपे स्पष्टीकरण.", btnUpload: "अहवाल अपलोड करा", resultHeader: "सविस्तर स्पष्टीकरण", extractedHeader: "काढलेला मजकूर", riskTitle: "आरोग्य धोका स्थिती", graphTitle: "🩺 सेव्ह केलेले अहवाल", navHome: "🏠 होम", navUpload: "📤 अपलोड", navLang: "🌐 भाषा" },
    bn: { welcomeSub: "আপনার নিজের ভাষায় স্বাস্থ্য বুঝুন।", welcomeMain: "মেডিকেল রিপোর্ট এখন সহজ", welcomeDesc: "রিপোর্ট আপলোড করুন এবং জটিল শব্দ সহজে বুঝুন।", btnStart: "শুরু করুন", btnContinue: "এগিয়ে যান", langTitle: "আপনার ভাষা বেছে নিন", langDesc: "অ্যাপটিতে এই ভাষা ব্যবহার করা হবে।", homeSub: "ভালো স্বাস্থ্য, উন্নত বোঝাপড়া", homeHello: "হ্যালো, ", heroTitle: "মেডিকেল রিপোর্ট বিশ্লেষণ", heroDesc: "জটিল রিপোর্টের সহজ বিবরণ।", btnUpload: "রিপোর্ট আপলোড করুন", resultHeader: "বিস্তারিত ব্যাখ্যা", extractedHeader: "সংগৃহীত টেক্সট", riskTitle: "স্বাস্থ্য ঝুঁকির অবস্থা", graphTitle: "🩺 সংরক্ষিত রিপোর্ট", navHome: "🏠 হোম", navUpload: "📤 আপলোড", navLang: "🌐 ভাষা" },
    gu: { welcomeSub: "તમારી ભાષામાં તમારું સ્વાસ્થ્ય સમજો.", welcomeMain: "મેડિકલ રિપોર્ટ સરળ ભાષામાં", welcomeDesc: "રિપોર્ટ અપલોડ કરો અને જટિલ શબ્દો સરળતાથી સમજો.", btnStart: "શરૂ કરો", btnContinue: "આગળ વધો", langTitle: "તમારી ભાષા પસંદ કરો", langDesc: "એપમાં આ ભાષાનો ઉપયોગ થશે.", homeSub: "સારું સ્વાસ્થ્ય, સારી સમજ", homeHello: "નમસ્તે, ", heroTitle: "મેડિકલ રિપોર્ટ સમજૂતી", heroDesc: "અઘરા રિપોર્ટની સરળ સમજૂતી.", btnUpload: "રિપોર્ટ અપલોડ કરો", resultHeader: "વિગતવાર સમજૂતી", extractedHeader: "મેળવેલ ટેક્સ્ટ", riskTitle: "સ્વાસ્થ્ય જોખમ સ્થિતિ", graphTitle: "🩺 સાચવેલ રિપોર્ટ્સ", navHome: "🏠 હોમ", navUpload: "📤 અપલોડ", navLang: "🌐 ભાષા" },
    pa: { welcomeSub: "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਆਪਣੀ ਸਿਹਤ ਨੂੰ ਸਮਝੋ।", welcomeMain: "ਮੈਡੀਕਲ ਰਿਪੋਰਟਾਂ ਹੁਣ ਆਸਾਨ", welcomeDesc: "ਰਿਪੋਰਟ ਅੱਪਲੋਡ ਕਰੋ ਅਤੇ ਔਖੇ ਸ਼ਬਦ ਆਸਾਨੀ ਨਾਲ ਸਮਝੋ।", btnStart: "ਸ਼ੁਰੂ ਕਰੋ", btnContinue: "ਅੱਗੇ ਵਧੋ", langTitle: "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ", langDesc: "ਐਪ ਵਿੱਚ ਇਹ ਭਾਸ਼ਾ ਵਰਤੀ ਜਾਵੇਗੀ।", homeSub: "ਚੰਗੀ ਸਿਹਤ, ਬਿਹਤਰ ਸਮਝ", homeHello: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ, ", heroTitle: "ਮੈਡੀਕਲ ਰਿਪੋਰਟ ਵਿਆਖਿਆ", heroDesc: "ਔਖੀਆਂ ਰਿਪੋਰਟਾਂ ਦੀ ਆਸਾਨ ਸਮਝ।", btnUpload: "ਰਿਪੋਰਟ ਅੱਪਲੋਡ ਕਰੋ", resultHeader: "ਵਿਸਥਾਰਪੂਰਵਕ ਵਿਆਖਿਆ", extractedHeader: "ਪ੍ਰਾਪਤ ਕੀਤਾ ਟੈਕਸਟ", riskTitle: "ਸਿਹਤ ਜੋਖਮ ਦੀ ਸਥਿਤੀ", graphTitle: "🩺 ਸੰਭਾਲੀਆਂ ਰਿਪੋਰਟਾਂ", navHome: "🏠 ਹੋਮ", navUpload: "📤 ਅੱਪਲੋਡ", navLang: "🌐 ਭਾਸ਼ਾ" },
    ja: { welcomeSub: "あなたの言語で健康状態を理解しましょう。", welcomeMain: "医療レポートを簡単に解釈", welcomeDesc: "レポートをアップロードして難しい用語を簡単に理解します。", btnStart: "始める", btnContinue: "次へ", langTitle: "言語を選択してください", langDesc: "アプリ内でこの言語が使用されます。", homeSub: "より良い健康、より深い理解", homeHello: "こんにちは、", heroTitle: "医療レポートの簡単解説", heroDesc: "複雑な医療ドキュメントをわかりやすく説明します。", btnUpload: "レポートをアップロード", resultHeader: "詳細な解説", extractedHeader: "抽出されたテキスト", riskTitle: "健康リスク状況", graphTitle: "🩺 保存されたレポート", navHome: "🏠 ホーム", navUpload: "📤 アップロード", navLang: "🌐 言語" },
    zh: { welcomeSub: "用您的母语了解您的健康状况。", welcomeMain: "让医疗报告变得简单易懂", welcomeDesc: "上传报告，轻松理解复杂的医学术语。", btnStart: "开始", btnContinue: "继续", langTitle: "选择您的语言", langDesc: "将在整个应用中使用此语言。", homeSub: "良好的健康，更好的理解", homeHello: "你好，", heroTitle: "医疗报告解析", heroDesc: "简单清晰地解释复杂的医疗报告。", btnUpload: "上传报告", resultHeader: "详细解释", extractedHeader: "提取的文本", riskTitle: "健康风险评估", graphTitle: "🩺 已保存的报告", navHome: "🏠 首页", navUpload: "📤 上传", navLang: "🌐 语言" },
    ko: { welcomeSub: "당신의 언어로 건강 상태를 이해하세요.", welcomeMain: "쉬운 의료 리포트 분석", welcomeDesc: "보고서를 업로드하고 어려운 의학 용어를 쉽게 이해하세요.", btnStart: "시작하기", btnContinue: "계속하기", langTitle: "언어를 선택하세요", langDesc: "앱 전반에 이 언어가 사용됩니다.", homeSub: "더 나은 건강, 더 나은 이해", homeHello: "안녕하세요, ", heroTitle: "의료 리포트 설명", heroDesc: "복잡한 보고서를 알기 쉽게 설명해 드립니다.", btnUpload: "리포트 업로드", resultHeader: "상세한 설명", extractedHeader: "추출된 텍스트", riskTitle: "건강 위험 상태", graphTitle: "🩺 저장된 리포트", navHome: "🏠 홈", navUpload: "📤 업로드", navLang: "🌐 언어" },
    th: { welcomeSub: "เข้าใจสุขภาพของคุณในภาษาของคุณเอง", welcomeMain: "เข้าใจรายงานการแพทย์ได้ง่ายๆ", welcomeDesc: "อัปโหลดรายงานเพื่อเข้าใจ ศัพท์แพทย์ ยากๆ ได้ง่ายขึ้น", btnStart: "เริ่มต้น", btnContinue: "ดำเนินการต่อ", langTitle: "เลือกภาษาของคุณ", langDesc: "ภาษานี้จะถูกใช้ในแอปทั้งหมด", homeSub: "สุขภาพที่ดี มาจากการเข้าใจที่ดี", homeHello: "สวัสดี, ", heroTitle: "คำอธิบายรายงานการแพทย์", heroDesc: "อธิบายรายงานแพทย์ที่ซับซ้อนให้เข้าใจง่าย", btnUpload: "อัปโหลดรายงาน", resultHeader: "คำอธิบายโดยละเอียด", extractedHeader: "ข้อความที่สกัดได้", riskTitle: "สถานะความเสี่ยงสุขภาพ", graphTitle: "🩺 รายงานที่บันทึกไว้", navHome: "🏠 หน้าแรก", navUpload: "📤 อัปโหลด", navLang: "🌐 ภาษา" }
};

let selectedLang = 'en';

// Reference database for standard medical parameters
const medicalRef = {
    'hemoglobin': { min: 12.0, max: 17.5, unit: 'g/dL', name: 'Hemoglobin (ஹேமோகுளோபின் - ரத்த அளவு)' },
    'hb': { min: 12.0, max: 17.5, unit: 'g/dL', name: 'Hemoglobin (ஹேமோகுளோபின்)' },
    'wbc': { min: 4000, max: 11000, unit: 'cells/cu.mm', name: 'WBC (வெள்ளை ரத்த அணுக்கள்)' },
    'rbc': { min: 4.2, max: 5.9, unit: 'million/cu.mm', name: 'RBC (சிவப்பு ரத்த அணுக்கள்)' },
    'platelets': { min: 150000, max: 450000, unit: 'cells/cu.mm', name: 'Platelets (ரத்த தட்டுக்கள்)' },
    'glucose': { min: 70, max: 100, unit: 'mg/dL', name: 'Fasting Blood Sugar (ரத்த சர்க்கரை அளவு)' },
    'fbs': { min: 70, max: 100, unit: 'mg/dL', name: 'Fasting Blood Sugar' },
    'hba1c': { min: 4.0, max: 5.6, unit: '%', name: 'HbA1c (3 மாத சர்க்கரை சராசரி)' },
    'cholesterol': { min: 125, max: 200, unit: 'mg/dL', name: 'Total Cholesterol (கொலஸ்ட்ரால்)' },
    'triglycerides': { min: 50, max: 150, unit: 'mg/dL', name: 'Triglycerides (ரத்த கொழுப்பு)' },
    'thyroid': { min: 0.4, max: 4.0, unit: 'uIU/mL', name: 'TSH (தைராய்டு அளவு)' },
    'tsh': { min: 0.4, max: 4.0, unit: 'uIU/mL', name: 'TSH (தைராய்டு)' },
    'creatinine': { min: 0.6, max: 1.2, unit: 'mg/dL', name: 'Serum Creatinine (கிட்னி செயல்பாடு)' },
    'urea': { min: 7, max: 20, unit: 'mg/dL', name: 'Blood Urea' }
};

window.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('introVideo');
    
    // Video முடிவடைந்தவுடன் தானாக skip செய்யும்
    if (video) {
        video.onended = () => {
            skipIntro();
        };
    }
    
    // பயன்பாட்டை எப்போதும் Intro screen-ல் தொடங்கும்
    showScreen('screen-intro');
    const nav = document.getElementById('bottomNav');
    if (nav) nav.style.display = 'none';
});

// Skip Intro அல்லது Video முடிந்தால் இயங்கும் Function
function skipIntro() {
    const video = document.getElementById('introVideo');
    if (video) {
        video.pause();
    }

    const savedUser = localStorage.getItem('activeUser');
    if (savedUser) {
        currentUser = savedUser;
        loadUserData();
        showScreen('screen-home');
        const nav = document.getElementById('bottomNav');
        if (nav) nav.style.display = 'flex';
    } else {
        showScreen('screen-login');
        const nav = document.getElementById('bottomNav');
        if (nav) nav.style.display = 'none';
    }
    
    initLangGrid();
    updateUI();
}

function handleLogin(e) {
    if (e && e.preventDefault) e.preventDefault();
    const inputVal = document.getElementById('loginUser').value.trim();
    if (!inputVal) return;

    currentUser = inputVal;
    localStorage.setItem('activeUser', currentUser);
    
    loadUserData();
    
    showScreen('screen-welcome');
    document.getElementById('bottomNav').style.display = 'flex';
    updateUI();
}

function handleLogout() {
    localStorage.removeItem('activeUser');
    currentUser = null;
    reportHistory = [];
    document.getElementById('bottomNav').style.display = 'none';
    document.getElementById('resultArea').style.display = 'none';
    currentExtractedText = "";
    document.getElementById('loginUser').value = "";
    showScreen('screen-login');
}

function loadUserData() {
    if (!currentUser) return;
    const key = `medicalReports_${currentUser}`;
    reportHistory = JSON.parse(localStorage.getItem(key)) || [];
    renderHistoryList();
}

function saveUserData() {
    if (!currentUser) return;
    const key = `medicalReports_${currentUser}`;
    localStorage.setItem(key, JSON.stringify(reportHistory));
}

function initLangGrid() {
    const grid = document.getElementById('lang-grid');
    if (!grid) return;
    grid.innerHTML = '';
    languages.forEach(l => {
        const card = document.createElement('div');
        card.className = `lang-card ${l.code === selectedLang ? 'selected' : ''}`;
        card.onclick = () => selectLanguage(l.code);
        card.innerHTML = `
            <strong style="font-size: 16px;">${l.native}</strong>
            <span style="font-size: 12px; color: var(--subtext);">${l.name}</span>
        `;
        grid.appendChild(card);
    });
}

function selectLanguage(code) {
    selectedLang = code;
    initLangGrid();
    updateUI();
    if (currentExtractedText) {
        generateDynamicAnalysis(currentExtractedText);
    }
}

function updateUI() {
    const t = i18n[selectedLang] || i18n['en'];
    const fallback = i18n['en'];

    if (document.getElementById('t-welcome-sub')) document.getElementById('t-welcome-sub').innerText = t.welcomeSub || fallback.welcomeSub;
    if (document.getElementById('t-welcome-main')) document.getElementById('t-welcome-main').innerText = t.welcomeMain || fallback.welcomeMain;
    if (document.getElementById('t-welcome-desc')) document.getElementById('t-welcome-desc').innerText = t.welcomeDesc || fallback.welcomeDesc;
    if (document.getElementById('t-btn-start')) document.getElementById('t-btn-start').innerText = t.btnStart || fallback.btnStart;
    if (document.getElementById('t-btn-continue')) document.getElementById('t-btn-continue').innerText = t.btnContinue || fallback.btnContinue;
    if (document.getElementById('t-lang-title')) document.getElementById('t-lang-title').innerText = t.langTitle || fallback.langTitle;
    if (document.getElementById('t-lang-desc')) document.getElementById('t-lang-desc').innerText = t.langDesc || fallback.langDesc;
    if (document.getElementById('t-home-sub')) document.getElementById('t-home-sub').innerText = t.homeSub || fallback.homeSub;
    if (document.getElementById('t-home-hello')) document.getElementById('t-home-hello').innerText = (t.homeHello || fallback.homeHello) + (currentUser || "User") + " 👋";
    if (document.getElementById('t-hero-title')) document.getElementById('t-hero-title').innerText = t.heroTitle || fallback.heroTitle;
    if (document.getElementById('t-hero-desc')) document.getElementById('t-hero-desc').innerText = t.heroDesc || fallback.heroDesc;
    if (document.getElementById('t-btn-upload')) document.getElementById('t-btn-upload').innerText = t.btnUpload || fallback.btnUpload;
    if (document.getElementById('t-result-header')) document.getElementById('t-result-header').innerText = t.resultHeader || fallback.resultHeader;
    if (document.getElementById('t-extracted-header')) document.getElementById('t-extracted-header').innerText = t.extractedHeader || fallback.extractedHeader;
    if (document.getElementById('t-risk-title')) document.getElementById('t-risk-title').innerText = t.riskTitle || fallback.riskTitle;
    if (document.getElementById('t-nav-home')) document.getElementById('t-nav-home').innerText = t.navHome || fallback.navHome;
    if (document.getElementById('t-nav-upload')) document.getElementById('t-nav-upload').innerText = t.navUpload || fallback.navUpload;
    if (document.getElementById('t-nav-lang')) document.getElementById('t-nav-lang').innerText = t.navLang || fallback.navLang;
    
    renderHistoryList();
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (id === 'screen-home') {
        renderHistoryList();
    }
}

async function processFile(file) {
    if (!file) return;
    const pBar = document.getElementById('progressBar');
    const pFill = document.getElementById('progressFill');
    pBar.style.display = 'block';
    pFill.style.width = '30%';

    try {
        currentExtractedText = "";
        
        if (file.type === 'application/pdf') {
            currentExtractedText = await extractPdfText(file);
        } else {
            const res = await Tesseract.recognize(file);
            currentExtractedText = res.data.text;
        }
        
        pFill.style.width = '70%';

        if (!currentExtractedText || currentExtractedText.trim() === "") {
            alert("Could not extract text from this document. Please upload a clearer report.");
            pBar.style.display = 'none';
            return;
        }

        const analysis = await generateDynamicAnalysis(currentExtractedText);
        
        const newReport = {
            id: Date.now(),
            fileName: file.name,
            time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: currentExtractedText,
            analysis: analysis
        };

        reportHistory.unshift(newReport);
        saveUserData();
        
        openSavedReport(newReport.id);

        pFill.style.width = '100%';
        setTimeout(() => { pBar.style.display = 'none'; }, 500);

        document.getElementById('fileInput').value = "";

    } catch (err) {
        alert("Error processing file: " + err.message);
        pBar.style.display = 'none';
    }
}

async function extractPdfText(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map(s => s.str).join(" ") + "\n";
    }
    return fullText;
}

async function translateDynamicText(text, targetLangCode) {
    if (targetLangCode === 'en') return text;
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLangCode}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        const data = await res.json();
        return data[0].map(item => item[0]).join("");
    } catch (e) {
        return text;
    }
}

async function generateDynamicAnalysis(text) {
    const summaryList = document.getElementById('summaryText');
    const badge = document.getElementById('riskBadge');
    
    summaryList.innerHTML = `<p style="color: #666; font-style: italic;">⏳ Analyzing medical values & percentages...</p>`;

    const lines = text.split('\n');
    let parsedData = [];
    let isHighRisk = false;

    // Advanced regex extraction for test names, values and units
    lines.forEach(line => {
        const match = line.match(/([a-zA-Z\s]{3,30})\s*[:\=-]?\s*(\d+(?:\.\d+)?)\s*(g\/dL|mg\/dL|mmol\/L|\%|uIU\/mL|pg\/mL|fL|cells\/cu\.mm)?/i);
        if (match) {
            const rawName = match[1].trim();
            const val = parseFloat(match[2]);
            const unit = match[3] || '';

            if (rawName.length > 2 && !rawName.toLowerCase().includes('page') && !rawName.toLowerCase().includes('date')) {
                const key = rawName.toLowerCase().replace(/[^a-z]/g, '');
                let ref = null;
                
                for (let k in medicalRef) {
                    if (key.includes(k)) {
                        ref = medicalRef[k];
                        break;
                    }
                }

                let status = "Normal";
                let percentage = 100;
                let explanation = "";

                if (ref) {
                    const avg = (ref.min + ref.max) / 2;
                    percentage = Math.round((val / avg) * 100);

                    if (val < ref.min) {
                        status = "Low";
                        isHighRisk = true;
                        explanation = `Your test value is ${val} ${unit}, which is below the normal range (${ref.min} - ${ref.max} ${unit}). It is at ${percentage}% of the standard average.`;
                    } else if (val > ref.max) {
                        status = "High";
                        isHighRisk = true;
                        explanation = `Your test value is ${val} ${unit}, which is above the normal range (${ref.min} - ${ref.max} ${unit}). It is at ${percentage}% of the normal average.`;
                    } else {
                        status = "Normal";
                        explanation = `Your test value is ${val} ${unit}. This is within the normal healthy range (${ref.min} - ${ref.max} ${unit}) at approximately ${percentage}% of average reference value.`;
                    }
                } else {
                    explanation = `Measured value: ${val} ${unit}.`;
                }

                parsedData.push({ name: rawName, val, unit, status, percentage, explanation });
            }
        }
    });

    let englishReport = [];
    englishReport.push("📋 Overall Medical Analysis Summary:");
    englishReport.push("We have thoroughly analyzed your uploaded medical report and extracted the key test parameters below with clear percentage indicators.");

    if (parsedData.length > 0) {
        englishReport.push("\n🔍 Detailed Test Findings & Percentages:");
        parsedData.forEach((item, idx) => {
            let statusTag = item.status === "Normal" ? "✅ [NORMAL]" : "⚠️ [" + item.status.toUpperCase() + "]";
            englishReport.push(`${idx + 1}. ${item.name} ${statusTag}:\n   - Result Value: ${item.val} ${item.unit}\n   - Health Relative Indicator: ${item.percentage}%\n   - Meaning: ${item.explanation}`);
        });
    } else {
        englishReport.push("\n📄 General Report Status:\nYour report has been scanned and recognized. Standard numerical lab tests were identified and verified.");
    }

    englishReport.push("\n💡 Clinical Advice & Next Steps:");
    if (isHighRisk) {
        englishReport.push("• Attention Needed: Some of your lab parameters fall outside the standard reference range.");
        englishReport.push("• Action Plan: We recommend sharing these detailed percentages with your doctor or physician for a complete clinical assessment.");
    } else {
        englishReport.push("• Status: All identified parameters appear stable and within healthy normal limits.");
        englishReport.push("• Action Plan: Continue maintaining a healthy lifestyle, balanced diet, and schedule regular wellness checkups.");
    }

    const fullEnglishText = englishReport.join("\n\n");
    const translatedText = await translateDynamicText(fullEnglishText, selectedLang);

    summaryList.innerHTML = translatedText
        .split('\n')
        .filter(l => l.trim().length > 0)
        .map(l => `<p style="margin: 8px 0; font-size: 14px; line-height: 1.6;">${l}</p>`)
        .join("");

    if (isHighRisk) {
        badge.style.backgroundColor = "#e74c3c";
        badge.innerText = selectedLang === 'ta' ? "கவனம் தேவை" : "Attention Needed";
    } else {
        badge.style.backgroundColor = "#4caf50";
        badge.innerText = selectedLang === 'ta' ? "இயல்பானது (Normal)" : "Normal / Stable";
    }

    return { translatedText, isHighRisk };
}

function openSavedReport(reportId) {
    const report = reportHistory.find(r => r.id === reportId);
    if (!report) return;

    currentExtractedText = report.text;
    document.getElementById('extractedText').innerText = report.text;
    generateDynamicAnalysis(currentExtractedText);
    
    document.getElementById('resultArea').style.display = 'block';
    document.getElementById('resultArea').scrollIntoView({ behavior: 'smooth' });
}

function deleteReport(event, reportId) {
    event.stopPropagation();
    if (confirm("Are you sure you want to delete this report?")) {
        reportHistory = reportHistory.filter(r => r.id !== reportId);
        saveUserData();
        renderHistoryList();
        document.getElementById('resultArea').style.display = 'none';
    }
}

function renderHistoryList() {
    const historyContainer = document.getElementById('historyContainer');
    if (!historyContainer) return;
    
    const t = i18n[selectedLang] || i18n['en'];

    historyContainer.innerHTML = `
        <h4 style="margin: 0 0 10px 0; color: var(--primary); font-size: 15px;">
            ${t.graphTitle || '🩺 Saved Reports'} (${reportHistory.length})
        </h4>
        <div id="historyList" style="max-height: 250px; overflow-y: auto;"></div>
    `;

    const listDiv = document.getElementById('historyList');

    if (reportHistory.length === 0) {
        listDiv.innerHTML = `<p style="font-size: 13px; color: #888; text-align: center;">No saved reports found for ${currentUser}.</p>`;
        return;
    }

    listDiv.innerHTML = reportHistory.map((item) => `
        <div onclick="openSavedReport(${item.id})" style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0; border-left: 4px solid var(--primary); margin-bottom: 8px; cursor: pointer;">
            <div style="display: flex; justify-content: space-between; align-align: center;">
                <strong style="font-size: 14px; color: #2c3e50;">📄 ${item.fileName}</strong>
                <button onclick="deleteReport(event, ${item.id})" style="background: transparent; border: none; color: #e74c3c; cursor: pointer; font-size: 14px;">🗑️</button>
            </div>
            <div style="font-size: 11px; color: #777; margin-top: 2px;">🕒 ${item.time}</div>
            <div style="margin-top: 6px; font-size: 12px; color: #444; font-weight: 500;">👉 Click to view analysis</div>
        </div>
    `).join("");
}

function speakText() {
    const listItems = document.querySelectorAll('#summaryText p');
    let textToSpeak = "";
    listItems.forEach(p => textToSpeak += p.innerText + ". ");
    if (!textToSpeak) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const langObj = languages.find(l => l.code === selectedLang);
    if (langObj) utterance.lang = langObj.voiceCode;
    window.speechSynthesis.speak(utterance);
}

