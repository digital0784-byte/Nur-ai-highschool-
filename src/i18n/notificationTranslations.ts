import { NotificationType, SupportedNotificationLanguage } from '../types/notifications';

export interface NotificationTemplate {
  title: string;
  body: string;
  defaultAction: string;
}

export const NOTIFICATION_TRANSLATIONS: Record<
  SupportedNotificationLanguage,
  Record<NotificationType, NotificationTemplate>
> = {
  en: {
    new_lesson: {
      title: 'New Lesson Available: {subject}',
      body: 'Unit {unit}: "{title}" has been published. Explore your MoE textbook reading and interactive exercises now.',
      defaultAction: 'View Lesson',
    },
    new_quiz: {
      title: 'New Curriculum Quiz Ready',
      body: 'A new quiz for Grade {grade} {subject} (Unit {unit}) is ready. Test your knowledge and earn mastery points!',
      defaultAction: 'Start Quiz',
    },
    new_exam: {
      title: 'Official Exam Scheduled: {title}',
      body: 'Comprehensive examination for {subject} has been announced. Review curriculum units and start when ready.',
      defaultAction: 'Open Exam',
    },
    assignment: {
      title: 'New Assignment Assigned: {title}',
      body: 'Your teacher has posted a new assignment for {subject}. Due date: {deadline}.',
      defaultAction: 'Open Assignment',
    },
    assignment_deadline: {
      title: 'Assignment Deadline Approaching',
      body: 'Reminder: Assignment "{title}" for {subject} is due soon ({deadline}). Complete and submit your work.',
      defaultAction: 'Submit Work',
    },
    quiz_exam_result: {
      title: 'Assessment Results Released: {title}',
      body: 'Your results are in! You scored {score}/{maxScore} ({percentage}%). Check feedback and review mistakes.',
      defaultAction: 'View Results',
    },
    ai_recommendation: {
      title: 'NUR AI Personal Tutor Recommendation',
      body: 'Based on your recent study path, NUR AI recommends: "{title}" to reinforce your foundational skills.',
      defaultAction: 'Study Now',
    },
    weak_topic_alert: {
      title: 'Weak Topic Alert: {topic}',
      body: 'Learning gap identified in {subject} ({topic}). Take a 5-minute remedial lesson with step-by-step guidance.',
      defaultAction: 'Start Remedy',
    },
    new_curriculum_content: {
      title: 'New Ministry of Education Content Indexed',
      body: 'New national textbook chapter added for Grade {grade} {subject}. Check the updated knowledge map.',
      defaultAction: 'Explore Curriculum',
    },
    system_announcement: {
      title: 'NUR AI School Announcement',
      body: '{message}',
      defaultAction: 'Read Notice',
    },
    admin_notification: {
      title: 'Administrative Notice: {title}',
      body: '{message}',
      defaultAction: 'Review',
    },
  },

  am: {
    new_lesson: {
      title: 'አዲስ የትምህርት ክፍል ቀርቧል: {subject}',
      body: 'ምዕራፍ {unit}፡ "{title}" ተለቋል። የመማሪያ መጽሐፍ ንባብ እና በይነተገናኝ ልምምዶችን አሁን ይጀምሩ።',
      defaultAction: 'ትምህርቱን ተመልከት',
    },
    new_quiz: {
      title: 'አዲስ የስርዓተ-ትምህርት ጥያቄ (Quiz) ተዘጋጅቷል',
      body: 'የክፍል {grade} {subject} (ምዕራፍ {unit}) አጭር ፈተና ዝግጁ ነው። እውቀትዎን ይፈትሹ እና ነጥብ ያግኙ!',
      defaultAction: 'ፈተናውን ጀምር',
    },
    new_exam: {
      title: 'ኦፊሴላዊ ፈተና ተመድቧል: {title}',
      body: 'የ {subject} አጠቃላይ ፈተና ተዘጋጅቷል። የተማሩትን ምዕራፎች ከልሰው ፈተናውን ይጀምሩ።',
      defaultAction: 'ፈተናውን ክፈት',
    },
    assignment: {
      title: 'አዲስ የቤት ስራ ተሰጥቷል: {title}',
      body: 'የ {subject} መምህር አዲስ የቤት ስራ ሰጥተዋል። የመጨረሻ ቀን፡ {deadline}።',
      defaultAction: 'ስራውን ክፈት',
    },
    assignment_deadline: {
      title: 'የቤት ስራ ማስረከቢያ ጊዜ ደርሷል',
      body: 'ማሳሰቢያ፡ የ {subject} ስራ "{title}" የሚጠናቀቅበት ጊዜ ደርሷል ({deadline})። ስራዎን አጠናቀው ያስረክቡ።',
      defaultAction: 'አሁን አስረክብ',
    },
    quiz_exam_result: {
      title: 'የፈተና ውጤት ይፋ ሆኗል: {title}',
      body: 'ውጤትዎ ደርሷል! ካገኙት ነጥብ {score}/{maxScore} ({percentage}%) ነው። የስህተት ማብራሪያዎችን ይመልከቱ።',
      defaultAction: 'ውጤቱን ተመልከት',
    },
    ai_recommendation: {
      title: 'የኑር AI የግል አስተማሪ የጥናት ምክር',
      body: 'በጥናትዎ ሂደት መሰረት ኑር AI የሚከተለውን ርዕስ እንዲያጠኑ ይመክራል፡ "{title}"።',
      defaultAction: 'አሁን አጥና',
    },
    weak_topic_alert: {
      title: 'የማጠናከሪያ ማስጠንቀቂያ: {topic}',
      body: 'በ {subject} ({topic}) ላይ ድክመት ተስተውሏል። የ 5 ደቂቃ ማጠናከሪያ ትምህርቱን ደረጃ በደረጃ ይውሰዱ።',
      defaultAction: 'ማጠናከሪያ ጀምር',
    },
    new_curriculum_content: {
      title: 'አዲስ የትምህርት ሚኒስቴር መጽሐፍ ታክሏል',
      body: 'ለክፍል {grade} {subject} አዲስ ምዕራፍ ተካቷል። የዕውቀት ካርታውን ይመልከቱ።',
      defaultAction: 'ስርዓተ-ትምህርቱን ፈትሽ',
    },
    system_announcement: {
      title: 'የትምህርት ቤት አጠቃላይ ማስታወቂያ',
      body: '{message}',
      defaultAction: 'ማስታወቂያውን አንብብ',
    },
    admin_notification: {
      title: 'የአስተዳደር መልዕክት: {title}',
      body: '{message}',
      defaultAction: 'ተመልከት',
    },
  },

  om: {
    new_lesson: {
      title: 'Barnoota Haaraa: {subject}',
      body: 'Boqonnaa {unit}: "{title}" gadhiifameera. Kitaaba barataa MoE fi shaakala amma eegalaa.',
      defaultAction: 'Barnoota Ilaali',
    },
    new_quiz: {
      title: 'Qormaata Gabaabaa Haaraa Qophaa\'eera',
      body: 'Qormaanni Daree {grade} {subject} (Boqonnaa {unit}) qophaa\'eera. Beekumsa keessan madaalaa!',
      defaultAction: 'Qormaata Jalqabi',
    },
    new_exam: {
      title: 'Qormaata Seera Qabeessa: {title}',
      body: 'Qormaanni waliigalaa {subject} labsameera. Boqonnaalee irra deebi\'aa.',
      defaultAction: 'Qormaata Bani',
    },
    assignment: {
      title: 'Hojiin Manneen Haaraa Kenname: {title}',
      body: 'Barsiisaan keessan {subject} hojii manaa haaraa kenneera. Guyyaa xumuraa: {deadline}.',
      defaultAction: 'Hojii Bani',
    },
    assignment_deadline: {
      title: 'Yeroon Hojii Manaa Dhiyaateera',
      body: 'Yaadachiisa: Hojiin "{title}" dhiyaateera ({deadline}). Xumuraa galchaa.',
      defaultAction: 'Amma Galchi',
    },
    quiz_exam_result: {
      title: 'Bu\'aan Qormaataa Ba\'eera: {title}',
      body: 'Bu\'aa keessan: {score}/{maxScore} ({percentage}%). Dogoggora keessan ilaalaa.',
      defaultAction: 'Bu\'aa Ilaali',
    },
    ai_recommendation: {
      title: 'Gorsa Barsiisaa NUR AI',
      body: 'Adeemsa barumsa keessan irratti hundaa\'uun NUR AI: "{title}" akka qo\'attan gorsa.',
      defaultAction: 'Amma Qo\'adhu',
    },
    weak_topic_alert: {
      title: 'Akeekkachiisa Mata Duree Laafaa: {topic}',
      body: '{subject} ({topic}) irratti hanqinni mul\'ateera. Barnoota daqiiqaa 5 fudhadhaa.',
      defaultAction: 'Barnoota Eegali',
    },
    new_curriculum_content: {
      title: 'Qabiyyee Sirna Barnootaa Haaraa',
      body: 'Daree {grade} {subject} boqonnaan haaraan dabalameera. Kaartaa beekumsaa ilaalaa.',
      defaultAction: 'Qabiyyee Ilaali',
    },
    system_announcement: {
      title: 'Beeksisa Mana Barumsaa NUR AI',
      body: '{message}',
      defaultAction: 'Beeksisa Dubbisi',
    },
    admin_notification: {
      title: 'Ergaa Bulchiinsaa: {title}',
      body: '{message}',
      defaultAction: 'Ilaali',
    },
  },

  ti: {
    new_lesson: {
      title: 'ሓድሽ ትምህርቲ ተዳልዩ: {subject}',
      body: 'ምዕራፍ {unit}፡ "{title}" ወጺኡ ኣሎ። መጽሓፍ ተማሃራይ ኣንቢብኩም ልምምድ ጀምሩ።',
      defaultAction: 'ትምህርቲ ርአ',
    },
    new_quiz: {
      title: 'ሓድሽ ፈተና (Quiz) ተዳልዩ',
      body: 'ናይ ክፍሊ {grade} {subject} (ምዕራፍ {unit}) ፈተና ተዳልዩ ኣሎ። ፍልጠትኩም መዝኑ!',
      defaultAction: 'ፈተና ጀምር',
    },
    new_exam: {
      title: 'ወግዓዊ ፈተና ተመዲቡ: {title}',
      body: 'ናይ {subject} ሓፈሻዊ ፈተና ወጺኡ ኣሎ። ምዕራፋት ደጊምኩም ጀምሩ።',
      defaultAction: 'ፈተና ኽፈት',
    },
    assignment: {
      title: 'ሓድሽ ዕዮ ገዛ ተዋሂቡ: {title}',
      body: 'መምህርኩም ናይ {subject} ዕዮ ገዛ ሂቡ ኣሎ። ናይ መወዳእታ መዓልቲ፡ {deadline}።',
      defaultAction: 'ዕዮ ኽፈት',
    },
    assignment_deadline: {
      title: 'ናይ ዕዮ ገዛ ግዜ ቀሪቡ',
      body: 'መዘኻኸሪ፡ ናይ {subject} ዕዮ ገዛ "{title}" መወድእታ ግዜ ቀሪቡ ({deadline})። ኣረክቡ።',
      defaultAction: 'ሕጂ ኣረክብ',
    },
    quiz_exam_result: {
      title: 'ውጽኢት ፈተና ወጺኡ: {title}',
      body: 'ውጽኢትኩም በጺሑ! ዝረኸብኩምዎ ነጥቢ {score}/{maxScore} ({percentage}%) እዩ። ርአዩ።',
      defaultAction: 'ውጽኢት ርአ',
    },
    ai_recommendation: {
      title: 'ናይ ኑር AI መምህር ምኽሪ',
      body: 'ኣብ መስርሕ መጽናዕትኹም ተመርኲሱ ኑር AI ነዚ ርእሲ ንኽተጽንዑ ይመክር፡ "{title}"።',
      defaultAction: 'ሕጂ ኣጽንዕ',
    },
    weak_topic_alert: {
      title: 'ናይ ድኹም ርእሲ መጠንቀቕታ: {topic}',
      body: 'ኣብ {subject} ({topic}) ድኻም ተራእዩ ኣሎ። ናይ 5 ደቒቕ መተካእታ ትምህርቲ ውሰዱ።',
      defaultAction: 'ምዕራይ ጀምር',
    },
    new_curriculum_content: {
      title: 'ሓድሽ ትሕዝቶ ስርዓተ-ትምህርቲ ተወሲኹ',
      body: 'ንክፍሊ {grade} {subject} ሓድሽ ምዕራፍ ተወሲኹ ኣሎ። ካርታ ፍልጠት ርአዩ።',
      defaultAction: 'ትሕዝቶ ርአ',
    },
    system_announcement: {
      title: 'ናይ ቤት ትምህርቲ ሓፈሻዊ ምልክታ',
      body: '{message}',
      defaultAction: 'ምልክታ ኣንብብ',
    },
    admin_notification: {
      title: 'ናይ ምምሕዳር መልእኽቲ: {title}',
      body: '{message}',
      defaultAction: 'መርምር',
    },
  },

  so: {
    new_lesson: {
      title: 'Cashar Cusub oo Diyaar ah: {subject}',
      body: 'Cutubka {unit}: "{title}" waa la daabacay. Bilow akhriska buugga MoE iyo layliyada.',
      defaultAction: 'Eeg Casharka',
    },
    new_quiz: {
      title: 'Imtixaan Gaaban oo Cusub',
      body: 'Imtixaanka Fasalka {grade} {subject} (Cutubka {unit}) waa diyaar. Tijaabi aqoontaada!',
      defaultAction: 'Bilow Imtixaanka',
    },
    new_exam: {
      title: 'Imtixaan Rasmi ah: {title}',
      body: 'Imtixaanka guud ee {subject} waa la shaaciyay. Dib u eeg cutubyada oo bilow.',
      defaultAction: 'Fur Imtixaanka',
    },
    assignment: {
      title: 'Shaqo Guri Cusub: {title}',
      body: 'Macallinkaaga ayaa soo dhigay shaqo guri oo {subject} ah. Xilliga kama dambaysta: {deadline}.',
      defaultAction: 'Fur Shaqada',
    },
    assignment_deadline: {
      title: 'Waqtiga Shaqada Guriga oo Soo Dhawaaday',
      body: 'Xusuusin: Shaqada "{title}" ee {subject} waqtigeedu wuxuu ku eg yahay ({deadline}). Soo gudbi.',
      defaultAction: 'Gudbi Hadda',
    },
    quiz_exam_result: {
      title: 'Natiijooyinka Imtixaanka: {title}',
      body: 'Natiijadaadu waa diyaar! Waxaad heshay {score}/{maxScore} ({percentage}%). Fiiri faallooyinka.',
      defaultAction: 'Eeg Natiijada',
    },
    ai_recommendation: {
      title: 'Talada Macallinka Gaarka ah ee NUR AI',
      body: 'Iyadoo lagu saleynayo waxbarashadaada, NUR AI wuxuu kugula talinayaa: "{title}".',
      defaultAction: 'Baro Hadda',
    },
    weak_topic_alert: {
      title: 'Digniin Mawduuc Liita: {topic}',
      body: 'Waxaa la ogaaday daciifnimo ku saabsan {subject} ({topic}). Qaado cashar 5 daqiiqo ah.',
      defaultAction: 'Bilow Casharka',
    },
    new_curriculum_content: {
      title: 'Cutub Cusub oo Manhajka Wasaaradda ah',
      body: 'Cutub cusub ayaa lagu daray Fasalka {grade} {subject}. Hubi khariidada aqoonta.',
      defaultAction: 'Baadh Manhajka',
    },
    system_announcement: {
      title: 'Ogeysiiska Dugsiga NUR AI',
      body: '{message}',
      defaultAction: 'Akhri Ogeysiiska',
    },
    admin_notification: {
      title: 'Farriin Maamul: {title}',
      body: '{message}',
      defaultAction: 'Dib u eeg',
    },
  },
};

export function formatNotificationContent(
  type: NotificationType,
  lang: SupportedNotificationLanguage = 'am',
  params: Record<string, string | number | undefined> = {}
): { title: string; body: string; defaultAction: string } {
  const language = NOTIFICATION_TRANSLATIONS[lang] || NOTIFICATION_TRANSLATIONS['am'] || NOTIFICATION_TRANSLATIONS['en'];
  const template = language[type] || NOTIFICATION_TRANSLATIONS['en'][type];

  let title = template.title;
  let body = template.body;

  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      title = title.replace(regex, String(val));
      body = body.replace(regex, String(val));
    }
  });

  return {
    title,
    body,
    defaultAction: template.defaultAction,
  };
}
