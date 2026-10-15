const hiPolicies = {
  privacy: { title: 'गोपनीयता नीति', updated: '[प्रभावी होने की तारीख]', intro: 'यह प्रारूप बताता है कि बिना डेटाबेस वाली बतलाइए सेवा जानकारी कैसे संभालती है। सार्वजनिक शुरुआत से पहले कोष्ठक वाले विवरण भरें और योग्य वकील से समीक्षा कराएँ।', sections: [
    ['खाता और चैट का संग्रह नहीं', 'खाता बनाना आवश्यक नहीं है। हम प्रोफ़ाइल या चैट संदेशों का स्थायी डेटाबेस नहीं रखते। संदेश केवल डिलीवरी के लिए सर्वर की मेमोरी में रहते हैं; चैट इतिहास के रूप में सहेजे नहीं जाते।'],
    ['तकनीकी जानकारी का उपयोग', 'सेवा चलाने, सुरक्षित रखने और समस्याएँ ठीक करने के लिए सर्वर तथा होस्टिंग प्रदाता को नेटवर्क पता, कनेक्शन मेटाडेटा, ब्राउज़र या डिवाइस अनुरोध की जानकारी और तकनीकी त्रुटियाँ संसाधित करनी पड़ सकती हैं। होस्टिंग प्रदाता अपनी व्यवस्था और अवधारण अवधि के अनुसार लॉग रख सकता है।'],
    ['अस्थायी मॉडरेशन जानकारी', 'मैचिंग कतार, सक्रिय चैट के संदर्भ, अस्थायी ब्लॉक, रिपोर्ट की संख्या और दर-सीमा काउंटर सर्वर की मेमोरी में रहते हैं। सर्वर रीस्टार्ट होने या संबंधित सत्र समाप्त होने पर ये मिट जाते हैं। रिपोर्ट में चुना गया कारण और वैकल्पिक विवरण केवल मेमोरी में रहते हैं; यह स्थायी शिकायत प्रबंधन प्रणाली नहीं है।'],
    ['कुकी और तीसरी-पक्ष सेवाएँ', 'शुरुआती संस्करण में ट्रैकिंग कुकी, विज्ञापन स्क्रिप्ट या तीसरी-पक्ष एनालिटिक्स नहीं हैं। सेवा [होस्टिंग प्रदाता] पर होस्ट की गई है; उसके इंफ्रास्ट्रक्चर और उप-प्रदाताओं को कनेक्शन डेटा संसाधित करना पड़ सकता है।'],
    ['अवधारण और आपके विकल्प', 'हम यह वादा नहीं करते कि कोई जानकारी संसाधित या दर्ज नहीं होती। नेटवर्क मेटाडेटा प्रदाता के लॉग में रह सकता है। जानकारी, हटाने या गोपनीयता संबंधी सवाल के लिए [गोपनीयता संपर्क ईमेल] पर लिखें। लागू अधिकार आपके स्थान और सेवा संचालक पर निर्भर करते हैं।'],
    ['संचालक', 'संचालक: [कानूनी नाम]। अधिकार-क्षेत्र: [न्याय-क्षेत्र]। गोपनीयता संपर्क: [गोपनीयता संपर्क ईमेल]।'],
  ] },
  terms: { title: 'सेवा की शर्तें', updated: '[प्रभावी होने की तारीख]', intro: 'समीक्षा के लिए सेवा-शर्तों का प्रारूप। सार्वजनिक शुरुआत से पहले संचालक को कोष्ठक वाले विवरण भरने और योग्य वकील से समीक्षा कराने की ज़रूरत है।', sections: [
    ['पात्रता', 'बतलाइए का उपयोग केवल तभी करें जब आपकी उम्र कम से कम 18 वर्ष हो। उम्र वाला चेकबॉक्स स्वयं दी गई घोषणा है; इससे उम्र की पुष्टि नहीं होती और यह साबित नहीं होता कि कोई उपयोगकर्ता वयस्क है। सेवा को सत्यापित-वयस्क सेवा न बताएं।'],
    ['गुमनाम उपयोग और आपकी ज़िम्मेदारी', 'खाता आवश्यक नहीं है। आप अपनी कही बातों और अपनी पहचान सुरक्षित रखने के लिए ज़िम्मेदार हैं। दूसरा व्यक्ति गलत जानकारी दे सकता है, असुरक्षित हो सकता है या अपनी स्क्रीन रिकॉर्ड कर सकता है।'],
    ['निषिद्ध व्यवहार', 'नग्नता, स्पष्ट यौन सामग्री, यौन आग्रह, उत्पीड़न, घृणास्पद भाषण, धमकी, शोषण, ग्रूमिंग, निजी जानकारी साझा करना, स्पैम, धोखाधड़ी, मैलवेयर, प्रतिरूपण या गैर-कानूनी गतिविधि की अनुमति नहीं है। नाबालिगों से संपर्क करने की कोशिश न करें।'],
    ['रिपोर्ट और कार्रवाई', 'आप बातचीत छोड़ सकते हैं, समाप्त कर सकते हैं, ब्लॉक कर सकते हैं या रिपोर्ट कर सकते हैं। जहाँ संभव हो, हम उपयोगकर्ता को डिस्कनेक्ट कर सकते हैं, मेमोरी में अस्थायी ब्लॉक लगा सकते हैं या पहुँच सीमित कर सकते हैं। स्वचालित टेक्स्ट जाँच सीमित है और हर उल्लंघन नहीं पकड़ती।'],
    ['सुरक्षा की गारंटी नहीं', 'हम यह गारंटी नहीं देते कि दूसरा उपयोगकर्ता सच्चा, सुरक्षित या वयस्क है, या सेवा हमेशा उपलब्ध रहेगी। सेवा का उपयोग अपने जोखिम पर करें और संवेदनशील जानकारी साझा न करें।'],
    ['अस्वीकरण और दायित्व', 'कानून जहाँ तक अनुमति देता है, सेवा बिना वारंटी के उपलब्ध है। दायित्व की सीमाओं को स्थानीय कानून के अनुसार ढालना होगा; जिन अधिकारों को कानूनन सीमित नहीं किया जा सकता, उन्हें यह शर्तें सीमित नहीं करतीं।'],
    ['कानून और संपर्क', 'लागू कानून और विवाद प्रक्रिया: [न्याय-क्षेत्र और विवाद प्रक्रिया]। संचालक: [कानूनी नाम]। संपर्क: [संपर्क ईमेल]।'],
  ] },
  guidelines: { title: 'समुदाय दिशानिर्देश', updated: '[प्रभावी होने की तारीख]', intro: 'बातचीत को सम्मानजनक बनाए रखने में मदद करें। बतलाइए केवल 18 वर्ष या उससे अधिक उम्र के लोगों के लिए है।', sections: [
    ['बातचीत को गैर-यौन रखें', 'नग्नता, स्पष्ट यौन संदेश, यौन अनुरोध, अनचाही पहल, दबाव और किसी भी प्रकार का यौन शोषण निषिद्ध है। नाबालिगों से जुड़ी यौन सामग्री, ग्रूमिंग या उम्र की पाबंदी से बचने की कोशिश सख्त मना है।'],
    ['दूसरों का सम्मान करें', 'उत्पीड़न, बुलिंग, घृणास्पद भाषण, धमकी, पीछा करना या किसी को निशाना बनाकर परेशान करना मना है। बिना अनुमति किसी और की निजी या पहचान बताने वाली जानकारी साझा न करें।'],
    ['सुरक्षित रहें', 'स्पैम, फ़िशिंग, धोखाधड़ी, खतरनाक लिंक, मैलवेयर, प्रतिरूपण या गैर-कानूनी गतिविधि न करें। किसी पर निजी जानकारी बताने या असुरक्षित प्लेटफ़ॉर्म पर जाने का दबाव न डालें।'],
    ['नियम तोड़ने के परिणाम', 'छोड़ें, समाप्त करें, ब्लॉक करें या रिपोर्ट करें। नियम तोड़ने पर बातचीत तुरंत समाप्त की जा सकती है और मौजूदा सर्वर सत्र के लिए ब्लॉक किया जा सकता है। स्वचालित जाँच सीमित है और हर उल्लंघन नहीं पकड़ सकती।'],
  ] },
  safety: { title: 'सुरक्षा दिशानिर्देश', updated: '[प्रभावी होने की तारीख]', intro: 'गुमनाम चैट का मतलब जोखिम-मुक्त बातचीत नहीं है। आपके नेटवर्क प्रदाता या होस्टिंग प्रदाता कनेक्शन मेटाडेटा संसाधित कर सकते हैं।', sections: [
    ['निजी जानकारी सुरक्षित रखें', 'अपना असली नाम, पता, फ़ोन नंबर, ईमेल, काम की जगह, स्कूल, वित्तीय जानकारी, पासवर्ड, OTP या पहचान बताने वाली तस्वीरें साझा न करें। किसी और की निजी जानकारी भी साझा न करें।'],
    ['सतर्क रहें', 'संदिग्ध लिंक न खोलें, फ़ाइलें डाउनलोड न करें, पैसे न भेजें और लॉगिन जानकारी न बताएं। कोई अजनबी अपनी पहचान या उम्र के बारे में गलत बता सकता है। बातचीत को ऐसे प्लेटफ़ॉर्म पर न ले जाएँ जिस पर आप भरोसा नहीं करते।'],
    ['ज़रूरत पड़ने पर कार्रवाई करें', 'असहज महसूस होने पर कभी भी बातचीत समाप्त करें या आगे बढ़ें। ब्लॉक करने पर मौजूदा सर्वर सत्र के दौरान वही दोनों कनेक्शन फिर से मैच नहीं होंगे। चिंता हो तो चैट के रिपोर्ट विकल्प का इस्तेमाल करें।'],
    ['केवल वयस्कों के लिए', '18+ चेकबॉक्स स्वयं दी गई घोषणा है, उम्र की पुष्टि नहीं। अगर आपकी उम्र 18 वर्ष से कम है तो बतलाइए का उपयोग न करें।'],
  ] },
  reporting: { title: 'रिपोर्ट और मॉडरेशन नीति', updated: '[प्रभावी होने की तारीख]', intro: 'रिपोर्ट से चिंता की बात सामने आ सकती है, लेकिन डेटाबेस-विहीन यह शुरुआती संस्करण स्थायी मॉडरेशन रिकॉर्ड या टीम उपलब्ध नहीं कराता।', sections: [
    ['रिपोर्ट कैसे काम करती है', 'पहले से दिए कारणों में से चुनें और चाहें तो छोटा विवरण लिखें। रिपोर्ट केवल मौजूदा सर्वर प्रक्रिया की मेमोरी में रहती है और रीस्टार्ट होने पर मिट जाती है। रिपोर्ट में संवेदनशील निजी जानकारी न लिखें।'],
    ['ब्लॉक और डिस्कनेक्ट', 'ब्लॉक करने पर सक्रिय चैट समाप्त होती है और मौजूदा सर्वर सत्र के दौरान वही दो लाइव कनेक्शन दोबारा मैच नहीं होते। डिस्कनेक्ट या सर्वर रीस्टार्ट होने पर अस्थायी जानकारी मिट जाती है; ब्लॉक स्थायी नहीं है।'],
    ['मॉडरेशन की सीमाएँ', 'बुनियादी सर्वर टेक्स्ट जाँच और दर-सीमाएँ स्पष्ट उल्लंघनों वाले संदेश रोक सकती हैं, पर हर हानिकारक संदेश नहीं पहचान सकतीं और न ही पहचान या उम्र की पुष्टि करती हैं। मानव मॉडरेटर के जवाब का कोई तय समय नहीं है। संदेह हो तो बातचीत समाप्त करें।'],
    ['संचालक से संपर्क', 'तत्काल चिंता के लिए [सुरक्षा संपर्क ईमेल] पर लिखें। संचालक: [कानूनी नाम]।'],
  ] },
};

export const policies = { hi: hiPolicies, en: {
  privacy: { title: 'Privacy Policy', updated: '[Effective date]', intro: 'This draft explains how batlaiye handles information without a database. Fill in bracketed details and have qualified counsel review it before launch.', sections: [
    ['No accounts or chat archive', 'An account is not required. We do not keep a persistent database of profiles or chat messages. Messages remain in server memory only for delivery and are not saved as chat history.'],
    ['Technical information', 'The server and hosting provider may process network addresses, connection metadata, browser or device request details, and technical errors to operate, secure, and troubleshoot the service. The hosting provider may keep logs according to its own settings and retention periods.'],
    ['Temporary moderation data', 'Matchmaking queues, active chat references, temporary blocks, report counts, and rate limits are held in server memory. They are cleared when the server restarts or the relevant session ends. Reports are not a permanent case-management system.'],
    ['Cookies and third parties', 'The initial version has no tracking cookies, advertising scripts, or third-party analytics. The service is hosted by [hosting provider]; its infrastructure and subprocessors may process connection data.'],
    ['Retention and questions', 'We do not promise that no information is processed or recorded. Network metadata may remain in provider logs. For privacy questions, contact [privacy contact email]. Applicable rights depend on your location and the operator.'],
    ['Operator', 'Operator: [legal name]. Jurisdiction: [jurisdiction]. Privacy contact: [privacy contact email].'],
  ] },
  terms: { title: 'Terms of Service', updated: '[Effective date]', intro: 'Draft terms for review. Fill in bracketed details and obtain qualified legal review before public launch.', sections: [
    ['Eligibility', 'Use batlaiye only if you are at least 18. The age checkbox is self-declaration; it does not verify age. Do not describe this as a verified-adult service.'],
    ['Anonymous use and responsibility', 'No account is required. You are responsible for what you say and for protecting your identity. Another user may be deceptive or unsafe, or may record their own screen.'],
    ['Prohibited conduct', 'Nudity, explicit sexual content, sexual solicitation, harassment, hate speech, threats, exploitation, grooming, sharing private information, spam, scams, malware, impersonation, and unlawful activity are prohibited. Do not try to contact minors.'],
    ['Reports and enforcement', 'You can skip, end, block, or report. Where operationally possible, we may disconnect users or apply temporary in-memory blocks. Automated text checks are limited and do not catch every violation.'],
    ['No safety guarantee', 'We do not guarantee that another user is truthful, safe, or an adult, or that the service will always be available. Use the service at your own risk and do not share sensitive information.'],
    ['Disclaimer and liability', 'The service is provided without warranties to the extent permitted by law. Liability limits must be adapted to local law and cannot exclude rights that cannot legally be excluded.'],
    ['Law and contact', 'Governing law and dispute process: [jurisdiction and dispute process]. Operator: [legal name]. Contact: [contact email].'],
  ] },
  guidelines: { title: 'Community Guidelines', updated: '[Effective date]', intro: 'Help keep conversations respectful. batlaiye is for adults aged 18 and older.', sections: [
    ['Keep it non-sexual', 'Nudity, explicit messages, sexual requests, unwanted advances, coercion, and sexual exploitation are prohibited. Sexual content involving minors, grooming, or attempts to evade age limits are strictly prohibited.'],
    ['Respect others', 'Harassment, bullying, hate speech, threats, stalking, and targeted abuse are prohibited. Do not share another person’s private or identifying information without permission.'],
    ['Stay safe', 'Do not spam, phish, scam, send malicious links, distribute malware, impersonate others, or engage in unlawful activity. Do not pressure anyone to reveal personal information or move to an unsafe platform.'],
    ['Consequences', 'Skip, end, block, or report. Violations may lead to disconnection and a temporary block for the current server session. Automated checks are limited.'],
  ] },
  safety: { title: 'Safety Guidelines', updated: '[Effective date]', intro: 'Anonymous chat is not risk-free. Your network or hosting provider may process connection metadata.', sections: [
    ['Protect personal information', 'Do not share your real name, address, phone number, email, workplace, school, financial details, passwords, OTPs, or identifying photos. Do not share anyone else’s private details.'],
    ['Be cautious', 'Do not open suspicious links, download files, send money, or reveal login details. A stranger may misrepresent their identity or age. Do not move to a platform you do not trust.'],
    ['Take action', 'End or skip a chat whenever you feel uncomfortable. Blocking prevents the same pair from matching for the current server session. Use the in-chat report control if concerned.'],
    ['Adults only', 'The 18+ checkbox is self-declaration, not age verification. If you are under 18, do not use batlaiye.'],
  ] },
  reporting: { title: 'Reporting & Moderation Policy', updated: '[Effective date]', intro: 'Reports can flag concerns, but this database-free MVP is not a permanent moderation case system.', sections: [
    ['How reports work', 'Choose a predefined reason and optionally add a short explanation. Reports are held in memory for the current server process and are lost on restart. Do not include sensitive personal information.'],
    ['Blocks and disconnects', 'Blocking ends the active chat and prevents the same two live connections from matching during the current server session. Disconnects and restarts clear temporary state; blocks are not permanent.'],
    ['Moderation limits', 'Basic text checks and rate limits can catch obvious violations but cannot detect every harmful message or verify identity or age. No human response time is promised. Disconnect if concerned.'],
    ['Operator contact', 'For urgent concerns, contact [safety contact email]. Operator: [legal name].'],
  ] },
} };
