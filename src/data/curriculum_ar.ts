import { Subject } from '../types';

export const curriculumArabic: Subject[] = [
  // 1. الرياضيات (Mathematics)
  {
    id: 'math',
    name: 'الرياضيات',
    subName: 'Mathematics',
    accentColor: '#1D4ED8',
    accentLight: '#EFF6FF',
    accentBorder: '#2563EB',
    accentBadge: '#1E40AF',
    topics: [
      {
        id: 'math-9-10',
        title: 'المعادلات التربيعية (Quadratic Equations)',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'طرق حل معادلات الدرجة الثانية في متغير واحد',
        lessonContent: [
          'المعادلة التربيعية هي معادلة متعددة الحدود من الدرجة الثانية تُكتب بالصيغة القياسية: ax² + bx + c = 0، حيث a و b و c أعداد حقيقية مع شرط a ≠ 0.',
          'توجد ثلاث طرق جبرية رئيسية لحل المعادلات التربيعية: التحليل إلى عوامل (Factorization)، إكمال المربع (Completing the Square)، واستخدام القانون العام: x = (-b ± √(b² - 4ac)) / (2a).',
          'يُسمى المقدار (b² - 4ac) بالمميز (Discriminant). إذا كان D > 0 يوجد حلان حقيقيان مختلفان؛ وإذا كان D = 0 يوجد حل حقيقي واحد مكرر؛ وإذا كان D < 0 لا توجد حلول حقيقية.'
        ],
        keyPoints: [
          'الصيغة القياسية: ax² + bx + c = 0 (a ≠ 0)',
          'القانون العام: x = (-b ± √(b² - 4ac)) / 2a',
          'المميز D = b² - 4ac يحدد طبيعة وعدد الجذور'
        ],
        flashcards: [
          {
            id: 'm1-fc1',
            front: 'ما هي المعادلة التربيعية؟',
            back: 'معادلة من الدرجة الثانية صيغتها القياسية ax² + bx + c = 0 حيث a ≠ 0.'
          },
          {
            id: 'm1-fc2',
            front: 'ما هو المميز (Discriminant)؟',
            back: 'D = b² - 4ac وهو المقدار الذي يحدد عدد ونوع جذور المعادلة.'
          },
          {
            id: 'm1-fc3',
            front: 'ماذا يحدث عندما يكون المميز D < 0؟',
            back: 'لا توجد جذور حقيقية للمعادلة (الجذور مركبة).'
          },
          {
            id: 'm1-fc4',
            front: 'ما هو القانون العام لحل المعادلة التربيعية؟',
            back: 'x = (-b ± √(b² - 4ac)) / (2a)'
          }
        ],
        quizQuestions: [
          {
            id: 'm1-q1',
            question: 'إذا كان b² - 4ac = 0 في المعادلة التربيعية، فكم عدداً من الجذور الحقيقية يوجد؟',
            options: ['جذر حقيقي واحد فقط (مكرر)', 'لا توجد جذور حقيقية', 'جذران حقيقيان مختلفان', 'أربعة جذور'],
            correctIndex: 0,
            explanation: 'عندما يكون المميز مساوياً للصفر، يكون للمعادلة جذر حقيقي واحد مكرر.'
          },
          {
            id: 'm1-q2',
            question: 'ما هما حلا المعادلة x² - 5x + 6 = 0؟',
            options: ['x = 2 و x = 3', 'x = -2 و x = -3', 'x = 1 و x = 6', 'x = -1 و x = 5'],
            correctIndex: 0,
            explanation: 'بالتحليل إلى عوامل: (x - 2)(x - 3) = 0 ومنها x = 2 أو x = 3.'
          },
          {
            id: 'm1-q3',
            question: 'ما هو الشكل الهندسي لتمثيل الدالة التربيعية بيانياً؟',
            options: ['قطع مكافئ (Parabola)', 'خط مستقيم', 'دائرة', 'قطع زائد'],
            correctIndex: 0,
            explanation: 'الرسم البياني لأي دالة تربيعية هو منحنى قطع مكافئ.'
          },
          {
            id: 'm1-q4',
            question: 'في المعادلة 2x² + 4x - 6 = 0، ما هي قيم المعاملات a و b و c؟',
            options: ['a=2, b=4, c=-6', 'a=4, b=2, c=6', 'a=2, b=-4, c=6', 'a=1, b=2, c=-3'],
            correctIndex: 0,
            explanation: 'بالمقارنة مع الصيغة القياسية ax² + bx + c = 0 تكون a=2, b=4, c=-6.'
          }
        ]
      },
      {
        id: 'math-11-12',
        title: 'التفاضل والتكامل وحساب المشتقات (Calculus & Derivatives)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'معدل التغير اللحظي وأساسيات حساب التفاضل',
        lessonContent: [
          'حساب التفاضل والتكامل هو دراسة التغير المستمر. تقيس المشتقة معدل التغير اللحظي للدالة بالنسبة لمتغيرها المستقل، وتُمثل هندسياً ميل خط المماس عند أي نقطة.',
          'التعريف الرياضي للمشتقة باستخدام النهايات هو: f\'(x) = lim(h→0) [f(x+h) - f(x)] / h. يُستخدم التفاضل لتحديد القيم العظمى والصغرى ونقاط الانقلاب.',
          'تشمل قواعد الاشتقاق الأساسية قاعدة القوة d/dx(xⁿ) = n·xⁿ⁻¹، وقاعدة ضرب وقسمة الدوال، وقاعدة السلسلة (Chain Rule) للدوال المركبة.'
        ],
        keyPoints: [
          'قاعدة القوة: d/dx(xⁿ) = n · xⁿ⁻¹',
          'المعنى الهندسي: ميل خط المماس للمنحنى',
          'مشتقة أي عدد ثابت تساوي دائماً 0'
        ],
        flashcards: [
          {
            id: 'm2-fc1',
            front: 'ماذا تمثل المشتقة الأولى هندسياً؟',
            back: 'ميل خط المماس لمنحنى الدالة عند تلك النقطة.'
          },
          {
            id: 'm2-fc2',
            front: 'ما هي مشتقة الدالة f(x) = x⁴؟',
            back: 'f\'(x) = 4x³ (باستخدام قاعدة القوة).'
          },
          {
            id: 'm2-fc3',
            front: 'ما هي مشتقة المقدار الثابت (مثل f(x) = 15)؟',
            back: 'تساوي دائماً 0 (صفر).'
          },
          {
            id: 'm2-fc4',
            front: 'متى نستخدم قاعدة السلسلة (Chain Rule)؟',
            back: 'عند اشتقاق الدوال المركبة f(g(x)).'
          }
        ],
        quizQuestions: [
          {
            id: 'm2-q1',
            question: 'ما هي مشتقة الدالة f(x) = 3x² + 5x - 7؟',
            options: ['6x + 5', '3x + 5', '6x - 7', '6x² + 5'],
            correctIndex: 0,
            explanation: 'باشتقاق كل حد: d/dx(3x²) = 6x، d/dx(5x) = 5، d/dx(-7) = 0، فيكون الناتج 6x + 5.'
          },
          {
            id: 'm2-q2',
            question: 'عندما تكون f\'(x) = 0 عند نقطة ما، فإن مماس المنحنى يكون:',
            options: ['أفقياً (Horizontal)', 'رأسياً (Vertical)', 'بزاوية 45 درجة', 'غير موجود'],
            correctIndex: 0,
            explanation: 'ميل يساوي الصفر يعني أن خط المماس أفقي تماماً عند النقاط الحرجة.'
          },
          {
            id: 'm2-q3',
            question: 'ما هي مشتقة الدالة المثلثية f(x) = sin(x)؟',
            options: ['cos(x)', '-cos(x)', '-sin(x)', 'tan(x)'],
            correctIndex: 0,
            explanation: 'مشتقة دالة الجيب sin(x) هي دالة جيب التمام cos(x).'
          },
          {
            id: 'm2-q4',
            question: 'كيف نحسب السرعة اللحظية v(t) من دالة الموضع s(t)؟',
            options: ['بإيجاد المشتقة الأولى للموضع v(t) = ds/dt', 'بضرب المسافة في الزمن', 'بقسمة التسارع على الكتلة', 'بتربيع الزمن'],
            correctIndex: 0,
            explanation: 'السرعة اللحظية هي المشتقة الزمنية الأولى للمسافة/الموضع: v(t) = ds/dt.'
          }
        ]
      }
    ]
  },

  // 2. الفيزياء (Physics)
  {
    id: 'physics',
    name: 'الفيزياء',
    subName: 'Physics',
    accentColor: '#7C3AED',
    accentLight: '#F5F3FF',
    accentBorder: '#8B5CF6',
    accentBadge: '#6D28D9',
    topics: [
      {
        id: 'phys-9-10',
        title: 'قوانين نيوتن للحركة (Newton\'s Laws)',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'مبادئ القوة والكتلة وحركة الأجسام',
        lessonContent: [
          'صاغ السير إسحاق نيوتن ثلاثة قوانين أساسية للحركة تمثل العمود الفقري للميكانيكا الكلاسيكية.',
          'القانون الأول (القصور الذاتي): يبقى الجسم الساكن ساكناً والمتحرك بسرعة منتظمة في خط مستقيم ما لم تؤثر عليه قوة محصلة خارجية. القانون الثاني: التسارع يتناسب طردياً مع القوة المحصلة وعكسياً مع الكتلة (F = ma).',
          'القانون الثالث: لكل فعل رد فعل مساوٍ له في المقدار ومعاكس له في الاتجاه يؤثران في جسمين مختلفين في آن واحد.'
        ],
        keyPoints: [
          'القانون 1: القصور الذاتي — مقاومة الجسم لتغيير حالته الحركية',
          'القانون 2: F = m · a (القوة = الكتلة × التسارع)',
          'القانون 3: قوى الفعل ورد الفعل متساوية ومتعاكسة'
        ],
        flashcards: [
          {
            id: 'p1-fc1',
            front: 'ماذا يُطلق على قانون نيوتن الأول؟',
            back: 'قانون القصور الذاتي (Law of Inertia).'
          },
          {
            id: 'p1-fc2',
            front: 'ما هي صيغة قانون نيوتن الثاني؟',
            back: 'F = m · a (القوة المحصلة = الكتلة × التسارع).'
          },
          {
            id: 'p1-fc3',
            front: 'ما هي وحدة قياس القوة في النظام الدولي؟',
            back: 'النيوتن (Newton - N) وهو ما يعادل kg·m/s².'
          },
          {
            id: 'p1-fc4',
            front: 'اذكر مثالاً على قانون نيوتن الثالث.',
            back: 'يدفع السباح الماء للخلف، فيدفعه الماء للأمام بنفس القوة.'
          }
        ],
        quizQuestions: [
          {
            id: 'p1-q1',
            question: 'ما هو التسارع الناتج عن تأثير قوة مقدارها 50 نيوتن على جسم كتلته 10 كجم؟',
            options: ['5 م/ث²', '500 م/ث²', '0.2 م/ث²', '40 م/ث²'],
            correctIndex: 0,
            explanation: 'a = F / m = 50 N / 10 kg = 5 m/s².'
          },
          {
            id: 'p1-q2',
            question: 'لماذا يندفع الركاب للأمام عند توقف الحافلة فجأة؟',
            options: ['بسبب القصور الذاتي للحركة', 'بسبب زيادة الجاذبية', 'بسبب قلة الاحتكاك', 'بسبب ضغط الهواء'],
            correctIndex: 0,
            explanation: 'يميل جسم الراكب لمواصلة الحركة إلى الأمام بنفس السرعة نتيجة لخاصية القصور الذاتي.'
          },
          {
            id: 'p1-q3',
            question: 'تؤثر قوتا الفعل ورد الفعل دائماً على:',
            options: ['جسمين مختلفين متفاعلين', 'جسم واحد فقط', 'نفس الاتجاه', 'أوقات مختلفة'],
            correctIndex: 0,
            explanation: 'قوتا الفعل ورد الفعل تنشآن في نفس اللحظة وتؤثران على جسمين مختلفين.'
          },
          {
            id: 'p1-q4',
            question: 'إذا كان جسم يتحرك بسرعة ثابتة في خط مستقيم، فإن القوة المحصلة المؤثرة عليه تساوي:',
            options: ['0 نيوتن (صفر)', 'تساوي كتلته', 'تساوي سرعته', 'قيمة لانهائية'],
            correctIndex: 0,
            explanation: 'السرعة الثابتة تعني أن التسارع a = 0، وبالتالي القوة المحصلة F = m(0) = 0 N.'
          }
        ]
      },
      {
        id: 'phys-11-12',
        title: 'الكهرومغناطيسية والأمواج (Electromagnetism & Waves)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'الحث الكهرومغناطيسي والميكانيكا الموجية',
        lessonContent: [
          'الكهرومغناطيسية هي دراسة العلاقة المتبادلة بين الشحنات الكهربائية المتحركة والمجالات المغناطيسية.',
          'ينص قانون فاراداي للحث الكهرومغناطيسي على أن التغير في التدفق المغناطيسي يولد قوة دافعة كهربائية حثية (EMF) في الموصل. ويحدد قانون لينز اتجاه التيار الحثي بحيث يعاكس التغير المسبب له.',
          'تتكون الموجات الكهرومغناطيسية من مجالات كهربائية ومغناطيسية متعامدة تنتشر في الفراغ بسرعة الضوء (3 × 10⁸ م/ث). والمعادلة العامة للموجات هي v = f · λ.'
        ],
        keyPoints: [
          'قانون فاراداي: EMF = -N(ΔΦ/Δt)',
          'معادلة الموجة: v = f · λ (السرعة = التردد × الطول الموجي)',
          'الموجات الكهرومغناطيسية لا تحتاج إلى وسط مادي للانتشار'
        ],
        flashcards: [
          {
            id: 'p2-fc1',
            front: 'ماذا ينص قانون فاراداي للحث؟',
            back: 'يؤدي التغير في التدفق المغناطيسي إلى توليد قوة دافعة كهربائية حثية في الموصل.'
          },
          {
            id: 'p2-fc2',
            front: 'كم تبلغ سرعة الضوء في الفراغ؟',
            back: 'حوالي 3 × 10⁸ م/ث (300,000 كم/ث).'
          },
          {
            id: 'p2-fc3',
            front: 'ما هي وحدة قياس التردد في النظام الدولي؟',
            back: 'الهرتز (Hertz - Hz) أو 1/ثانية.'
          },
          {
            id: 'p2-fc4',
            front: 'ما هو المبدأ الذي يعمل به المولد الكهربائي؟',
            back: 'الحث الكهرومغناطيسي (تحويل الطاقة الميكانيكية إلى طاقة كهربائية).'
          }
        ],
        quizQuestions: [
          {
            id: 'p2-q1',
            question: 'ما هي سرعة موجة طولها الموجي 2 متر وترددها 150 هرتز؟',
            options: ['300 م/ث', '75 م/ث', '152 م/ث', '0.013 م/ث'],
            correctIndex: 0,
            explanation: 'v = f · λ = 150 Hz × 2 m = 300 m/s.'
          },
          {
            id: 'p2-q2',
            question: 'ما هي الوظيفة الأساسية للمحول الكهربائي (Transformer)؟',
            options: ['رفع أو خفض الجهد الكهربائي المتردد (AC)', 'تحويل التيار المتردد إلى مستمر', 'إلغاء التدفق المغناطيسي', 'تخزين الشحنات'],
            correctIndex: 0,
            explanation: 'يعمل المحول على تغيير مستويات الجهد المتردد بالحث الكهرومغناطيسي.'
          },
          {
            id: 'p2-q3',
            question: 'أي من الموجات التالية موجة ميكانيكية تحتاج لوسط مادي للانتشار؟',
            options: ['موجة الصوت (Sound wave)', 'موجات الراديو', 'الأشعة السينية (X-rays)', 'أشعة جاما'],
            correctIndex: 0,
            explanation: 'موجات الصوت موجات ميكانيكية طولية لا تنتشر في الفراغ وتتطلب وسطاً مادياً.'
          },
          {
            id: 'p2-q4',
            question: 'يُعتبر قانون لينز تطبيقاً مباشراً لأي قانون فيزيائي؟',
            options: ['قانون حفظ الطاقة', 'قانون حفظ الكتلة', 'قانون حفظ الشحنة', 'قانون حفظ كمية الحركة'],
            correctIndex: 0,
            explanation: 'يضمن قانون لينز عدم توليد طاقة من العدم التزاماً بمبدأ حفظ الطاقة.'
          }
        ]
      }
    ]
  },

  // 3. الكيمياء (Chemistry)
  {
    id: 'chemistry',
    name: 'الكيمياء',
    subName: 'Chemistry',
    accentColor: '#C2410C',
    accentLight: '#FFF7ED',
    accentBorder: '#EA580C',
    accentBadge: '#9A3412',
    topics: [
      {
        id: 'chem-9-10',
        title: 'التركيب الذري والروابط الكيميائية',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'الجسيمات تحت الذرية وأنواع الروابط الكيميائية',
        lessonContent: [
          'الذرة هي وحدة البناء الأساسية للمادة، وتتكون من نواة مركزية كثيفة تحتوي على بروتونات (+ موجبة) ونيوترونات (متعادلة)، تدور حولها إلكترونات (- سالبة) في مستويات طاقة محددة.',
          'ترتبط الذرات للوصول إلى حالة الاستقرار الإلكتروني (قاعدة الثمانيات - 8 إلكترونات تكافؤ). تشمل الروابط: الرابطة الأيونية (انتقال الإلكترونات)، الرابطة التساهمية (مشاركة الإلكترونات)، والرابطة الفلزية.',
          'يُنظم الجدول الدوري العناصر وفقاً لأعدادها الذرية وتوزيعها الإلكتروني في مجموعات ودورات.'
        ],
        keyPoints: [
          'العدد الذري (Z) = عدد البروتونات في النواة',
          'العدد الكتلي (A) = البروتونات + النيوترونات',
          'الرابطة الأيونية (فقد واكتساب) مقابل الرابطة التساهمية (مشاركة)'
        ],
        flashcards: [
          {
            id: 'c1-fc1',
            front: 'ما هي النظائر (Isotopes)؟',
            back: 'ذرات لنفس العنصر لها نفس عدد البروتونات وتختلف في عدد النيوترونات.'
          },
          {
            id: 'c1-fc2',
            front: 'كيف تتشكل الرابطة التساهمية؟',
            back: 'عن طريق مشاركة أزواج من إلكترونات التكافؤ بين الذرات غير الفلزية.'
          },
          {
            id: 'c1-fc3',
            front: 'ما هو الجسيم الذري الذي يحمل شحنة سالبة؟',
            back: 'الإلكترون (Electron).'
          },
          {
            id: 'c1-fc4',
            front: 'ما نوع الرابطة في كلوريد الصوديوم (NaCl)؟',
            back: 'رابطة أيونية (Ionic bond) بين أيون الصوديوم والكلوريد.'
          }
        ],
        quizQuestions: [
          {
            id: 'c1-q1',
            question: 'ما هو العدد الكتلي لذرة تحتوي على 11 بروتوناً و 12 نيوتروناً؟',
            options: ['23', '11', '12', '1'],
            correctIndex: 0,
            explanation: 'العدد الكتلي A = 11 + 12 = 23 (الصوديوم).'
          },
          {
            id: 'c1-q2',
            question: 'ما نوع الرابطة الكيميائية بين الهيدروجين والأكسجين في جزيء الماء (H₂O)؟',
            options: ['رابطة تساهمية قطبية', 'رابطة أيونية', 'رابطة فلزية', 'رابطة نووية'],
            correctIndex: 0,
            explanation: 'ترتبط ذرات الماء تساهمياً بمشاركة الإلكترونات بين اللافلزات.'
          },
          {
            id: 'c1-q3',
            question: 'وفقاً لقاعدة الثمانيات، تسعى ذرات العناصر الرئيسية لامتلاك كم إلكتروناً في مدارها الخارجي؟',
            options: ['8', '2', '6', '10'],
            correctIndex: 0,
            explanation: 'تسعى الذرات للحصول على 8 إلكترونات في غلاف التكافؤ لمحاكاة الغازات النبيلة.'
          },
          {
            id: 'c1-q4',
            question: 'ماذا تُسمى عناصر المجموعة الأولى في الجدول الدوري؟',
            options: ['الفلزات القلوية (Alkali metals)', 'الهالوجينات', 'الغازات النبيلة', 'الفلزات القلوية الترابية'],
            correctIndex: 0,
            explanation: 'تُعرف عناصر المجموعة الأولى (Li, Na, K...) بالفلزات القلوية.'
          }
        ]
      },
      {
        id: 'chem-11-12',
        title: 'الاتزان الكيميائي والديناميكا الحرارية',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'سرعة التفاعل، التوازن الديناميكي، والطاقة الحرة',
        lessonContent: [
          'يحدث الاتزان الكيميائي في نظام مغلق عندما تتساوى سرعة التفاعل الأمامي مع سرعة التفاعل العكسي، فتثبت تراكيز المواد المتفاعلة والناتجة.',
          'ينص مبدأ لوشاتلييه (Le Chatelier\'s Principle) على أنه إذا طرأ تغير على نظام في حالة اتزان (مثل تغير درجة الحرارة أو الضغط أو التركيز)، فإن النظام ينزاح في الاتجاه الذي يقلل من أثر هذا التغير.',
          'تدرس الديناميكا الحرارية الكيميائية التلقائية من خلال المحتوى الحراري (ΔH)، والإنتروبيا (ΔS)، وطاقة جيبس الحرة (ΔG = ΔH - TΔS). التفاعل التلقائي يكون فيه ΔG < 0.'
        ],
        keyPoints: [
          'مبدأ لوشاتلييه: النظام يقاوم التغيرات الخارجية المؤثرة عليه',
          'ثابت الاتزان Keq = [النواتج] / [المتفاعلات]',
          'ΔG < 0 تعني أن التفاعل يحدث تلقائياً (Spontaneous)'
        ],
        flashcards: [
          {
            id: 'c2-fc1',
            front: 'ماذا ينص مبدأ لوشاتلييه؟',
            back: 'إذا تعرض نظام متزن لتغير في الشروط، انزاح الاتزان لتقليل أثر هذا التغير.'
          },
          {
            id: 'c2-fc2',
            front: 'ما هي الإنتروبيا (Entropy - S)؟',
            back: 'مقياس درجة العشوائية والفوضى في النظام الكيميائي.'
          },
          {
            id: 'c2-fc3',
            front: 'ما هي إشارة ΔH في التفاعل الطارد للحرارة (Exothermic)؟',
            back: 'سالبة (ΔH < 0) لأن التفاعل يُطلق حرارة للوسط المحيط.'
          },
          {
            id: 'c2-fc4',
            front: 'ما هي معادلة طاقة جيبس الحرة؟',
            back: 'ΔG = ΔH - TΔS'
          }
        ],
        quizQuestions: [
          {
            id: 'c2-q1',
            question: 'يكون التفاعل الكيميائي تلقائياً من الناحية الثرموديناميكية عندما تكون طاقة جيبس الحرة ΔG:',
            options: ['سالبة (ΔG < 0)', 'موجبة (ΔG > 0)', 'تساوي صفراً', 'غير محددة'],
            correctIndex: 0,
            explanation: 'القيم السالبة لطاقة جيبس الحرة (ΔG < 0) تدل على حدوث التفاعل تلقائياً.'
          },
          {
            id: 'c2-q2',
            question: 'في التفاعل N₂ + 3H₂ ⇌ 2NH₃، يؤدي زيادة الضغط إلى إزاحة موضع الاتزان نحو:',
            options: ['اليمين (نحو تكوين NH₃)', 'اليسار (نحو N₂ و H₂)', 'لا يتأثر الاتزان', 'يتوقف التفاعل تماماً'],
            correctIndex: 0,
            explanation: 'زيادة الضغط تدفع التفاعل نحو الطرف الذي يحتوي على عدد مولات غازية أقل (مولان في اليمين مقابل 4 في اليسار).'
          },
          {
            id: 'c2-q3',
            question: 'كيف يؤثر العامل المساعد (الإنزيم أو المحفز) على التفاعل في حالة الاتزان؟',
            options: ['يقلل طاقة التنشيط ويزيد سرعة التفاعلين الأمامي والعكسي بنفس المقدار', 'يغير قيمة ثابت الاتزان Keq', 'يزيد من كمية النواتج', 'يغير المحتوى الحراري ΔH'],
            correctIndex: 0,
            explanation: 'يخفض المحفز حاجز طاقة التنشيط لكلا الاتجاهين دون التأثير على موضع أو ثابت الاتزان.'
          },
          {
            id: 'c2-q4',
            question: 'ما هي إشارة التغير في الإنتروبيا (ΔS) عند تجمد الماء السائل إلى جليد؟',
            options: ['سالبة (ΔS < 0)', 'موجبة (ΔS > 0)', 'تساوي صفراً', 'لانهائية'],
            correctIndex: 0,
            explanation: 'التحول من سائل عشوائي إلى بنية بلورية صلبة منتظمة يقلل الفوضى (ΔS < 0).'
          }
        ]
      }
    ]
  },

  // 4. الأحياء (Biology)
  {
    id: 'biology',
    name: 'الأحياء',
    subName: 'Biology',
    accentColor: '#15803D',
    accentLight: '#F0FDF4',
    accentBorder: '#16A34A',
    accentBadge: '#166534',
    topics: [
      {
        id: 'bio-9-10',
        title: 'تركيب الخلية ووظائفها (Cell Structure)',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'الوحدة الأساسية للحياة وعضيات الخلية',
        lessonContent: [
          'الخلية هي الوحدة التركيبية والوظيفية الأساسية لجميع الكائنات الحية. تنص النظرية الخلوية على أن جميع الكائنات الحية تتكون من خلايا، وأن الخلية هي وحدة الحياة، وأن الخلايا تنشأ من خلايا سابقة لها.',
          'تُصنف الخلايا إلى بدائيات النوى (تفتقر لغشاء نووي مثل البكتيريا) وحقيقيات النوى (تحتوي على نواة محاطة بغشاء وعضيات متعددة كخلايا النبات والحيوان).',
          'تشمل العضيات الرئيسية: الميتوكوندريا (إنتاج الطاقة ATP عبر التنفس الخلوي)، البلاستيدات الخضراء (البناء الضوئي في النباتات)، النواة (حفظ المادة الوراثية)، والريبوسومات (بناء البروتينات).'
        ],
        keyPoints: [
          'النظرية الخلوية: الخلية هي الوحدة الأساسية لجميع أشكال الحياة',
          'الميتوكوندريا: محطة توليد الطاقة (ATP) في الخلية',
          'الخلايا النباتية تتميز بوجود الجدار الخلوي والبلاستيدات الخضراء'
        ],
        flashcards: [
          {
            id: 'b1-fc1',
            front: 'ما هي العضية المعروفة بـ "محطة توليد الطاقة" في الخلية؟',
            back: 'الميتوكوندريا (Mitochondria) - تنتج جزيئات ATP.'
          },
          {
            id: 'b1-fc2',
            front: 'اذكر تركيبين يوجدان في الخلية النباتية ولا يوجدان في الحيوانية.',
            back: 'الجدار الخلوي (Cell wall) والبلاستيدات الخضراء (Chloroplasts).'
          },
          {
            id: 'b1-fc3',
            front: 'بماذا تتميز الخلايا بدائية النوى (Prokaryotes)؟',
            back: 'بعدم وجود نواة محاطة بغشاء نووي أو عضيات غشائية.'
          },
          {
            id: 'b1-fc4',
            front: 'ما هي الوظيفة الأساسية للريبوسومات (Ribosomes)؟',
            back: 'بناء وتخليق البروتينات (Protein synthesis).'
          }
        ],
        quizQuestions: [
          {
            id: 'b1-q1',
            question: 'في أي عضية خلوية تحدث عملية البناء الضوئي في النباتات؟',
            options: ['البلاستيدات الخضراء (Chloroplast)', 'الميتوكوندريا', 'جهاز جولجي', 'الليزوسوم'],
            correctIndex: 0,
            explanation: 'تمتص البلاستيدات الخضراء الطاقة الضوئية لإنتاج السكر والأكسجين.'
          },
          {
            id: 'b1-q2',
            question: 'أي تركيب خلوي يحتوي على المادة الوراثية (DNA) في حقيقيات النوى؟',
            options: ['النواة (Nucleus)', 'السيتوبلازم', 'الفجوة العصارية', 'الغشاء البلازمي'],
            correctIndex: 0,
            explanation: 'تحتوي النواة على الكروموسومات والحمض النووي وتوجه أنشطة الخلية.'
          },
          {
            id: 'b1-q3',
            question: 'أي من الكائنات التالية يُعتبر من بدائيات النوى؟',
            options: ['البكتيريا (E. coli)', 'فطر الخميرة', 'خلية الدم الحمراء البشرية', 'الأميبا'],
            correctIndex: 0,
            explanation: 'البكتيريا كائنات حية دقيقة تفتقر لنواة حقيقية محاطة بغشاء.'
          },
          {
            id: 'b1-q4',
            question: 'ما هو السكر المتعدد الرئيسي المكون للجدار الخلوي في النباتات؟',
            options: ['السيليلوز (Cellulose)', 'الجليكوجين', 'الكوليسترول', 'الكيراتين'],
            correctIndex: 0,
            explanation: 'يتكون الجدار الخلوي للنباتات من ألياف السيليلوز القوية.'
          }
        ]
      },
      {
        id: 'bio-11-12',
        title: 'علم الوراثة والبيولوجيا الجزيئية للـ DNA',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'أنماط الوراثة المندلية والعقيدة المركزية للبيولوجيا',
        lessonContent: [
          'علم الوراثة هو دراسة كيفية انتقال الصفات من الآباء إلى الأبناء. وضع جريجور مندل قوانين الوراثة الأساسية (انعزال الصفات والتوزيع المستقل) من خلال تجاربه على نبات البازلاء.',
          'يحمل الحمض النووي (DNA) الشفرة الوراثية على شكل لولب مزدوج (Double Helix)، وتتزاوج القواعد النيتروجينية بتخصص: الأدينين (A) مع الثايمين (T)، والجوانين (G) مع السيتوسين (C).',
          'يتبع تصنيع البروتين العقيدة المركزية: النسخ (تحويل DNA إلى mRNA في النواة) والترجمة (تحويل mRNA إلى سلسلة أحماض أمينية على الريبوسومات).'
        ],
        keyPoints: [
          'تزاوج القواعد: A يرتبط مع T، و G يرتبط مع C',
          'العقيدة المركزية: DNA → mRNA (نسخ) → بروتين (ترجمة)',
          'وراثة مندل: انعزال الأليلات السائدة والمتنحية'
        ],
        flashcards: [
          {
            id: 'b2-fc1',
            front: 'أي قاعدة نيتروجينية ترتبط مع الأدينين (A) في الحمض النووي DNA؟',
            back: 'الثايمين (Thymine - T).'
          },
          {
            id: 'b2-fc2',
            front: 'ما هي عملية النسخ (Transcription)؟',
            back: 'تصنيع شريط mRNA المكمل من قالب DNA داخل النواة.'
          },
          {
            id: 'b2-fc3',
            front: 'من هو العالم الملقب بـ "مؤسس علم الوراثة"؟',
            back: 'جريجور مندل (Gregor Mendel).'
          },
          {
            id: 'b2-fc4',
            front: 'كم قاعدة نيتروجينية تكون الكودون الواحد (Codon)؟',
            back: '3 قواعد نيتروجينية (شفرة ثلاثية لكل حمض أميني).'
          }
        ],
        quizQuestions: [
          {
            id: 'b2-q1',
            question: 'ما هي القاعدة النيتروجينية التي تحل محل الثايمين (T) في جزيء الـ RNA؟',
            options: ['اليوراسيل (Uracil - U)', 'الأدينين (A)', 'السيتوسين (C)', 'الجوانين (G)'],
            correctIndex: 0,
            explanation: 'يحتوي RNA على اليوراسيل (U) بدلاً من الثايمين ويرتبط مع الأدينين.'
          },
          {
            id: 'b2-q2',
            question: 'عند تزاوج فردين هجينين (Aa × Aa)، ما هو احتمال ظهور نسل ذي صفة متنحية (aa)؟',
            options: ['25% (1/4)', '50% (1/2)', '75% (3/4)', '100%'],
            correctIndex: 0,
            explanation: 'مربع بانيت يعطي نسبة 1 AA : 2 Aa : 1 aa، وبالتالي نسبة النمط المتنحي 25%.'
          },
          {
            id: 'b2-q3',
            question: 'من هما العالمان اللذان اكتشفا نموذج اللولب المزدوج للـ DNA عام 1953؟',
            options: ['واطسون وكريك (Watson & Crick)', 'داروين ووالاس', 'مندل ومورجان', 'باستور وكوخ'],
            correctIndex: 0,
            explanation: 'اقترح جيمس واطسون وفرانسيس كريك نموذج اللولب المزدوج للـ DNA.'
          },
          {
            id: 'b2-q4',
            question: 'ما هي الطفرة الجينية (Mutation)؟',
            options: ['تغير دائم ومفاجئ في تسلسل النيوكليوتيدات في الحمض النووي', 'انقسام خلوي طبيعي', 'فقدان الماء بالتناضح', 'هضم البروتينات'],
            correctIndex: 0,
            explanation: 'الطفرة هي تغير وراثي في تسلسل الشفرة الوراثية للـ DNA.'
          }
        ]
      }
    ]
  },

  // 5. اللغة الإنجليزية (English)
  {
    id: 'english',
    name: 'English',
    subName: 'اللغة الإنجليزية',
    accentColor: '#0D9488',
    accentLight: '#F0FDFA',
    accentBorder: '#14B8A6',
    accentBadge: '#115E59',
    topics: [
      {
        id: 'eng-9-10',
        title: 'Active & Passive Voice and Tenses',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Grammatical Voice and Verb Forms',
        lessonContent: [
          'In English grammar, Active Voice highlights the subject doing the action: "The student solved the equation." Passive Voice highlights the receiver of the action: "The equation was solved by the student."',
          'Forming the passive voice requires an appropriate tense form of "to be" + Past Participle (V3). It is standard in academic and scientific writing.',
          'Mastering tenses (Simple Past, Past Continuous, Present Perfect) ensures accurate and coherent expression of time.'
        ],
        keyPoints: [
          'Active: Subject acts',
          'Passive: Subject receives action (be + V3)',
          'Standard for scientific and objective reports'
        ],
        flashcards: [
          {
            id: 'e1-fc1',
            front: 'Change to passive: "The teacher graded the exams."',
            back: '"The exams were graded by the teacher."'
          },
          {
            id: 'e1-fc2',
            front: 'When is passive voice preferred?',
            back: 'When the action/result is more important than who did it.'
          },
          {
            id: 'e1-fc3',
            front: 'What is the past participle of "write"?',
            back: '"Written" (write - wrote - written).'
          },
          {
            id: 'e1-fc4',
            front: 'Change to passive: "They are repairing the bridge."',
            back: '"The bridge is being repaired."'
          }
        ],
        quizQuestions: [
          {
            id: 'e1-q1',
            question: 'Which of the following sentences is in the Passive Voice?',
            options: [
              'The new curriculum was approved by the ministry.',
              'The ministry approved the new curriculum.',
              'Teachers examined the new curriculum.',
              'Students loved the new curriculum.'
            ],
            correctIndex: 0,
            explanation: '"Was approved" uses "be + V3", placing emphasis on the recipient.'
          },
          {
            id: 'e1-q2',
            question: 'Complete: "By the time we arrived, the train _______ the station."',
            options: ['had left', 'has left', 'was leaving', 'leaves'],
            correctIndex: 0,
            explanation: 'Past Perfect denotes an action completed before another past event.'
          },
          {
            id: 'e1-q3',
            question: 'Passive form of "Alexander Fleming discovered penicillin":',
            options: [
              'Penicillin was discovered by Alexander Fleming.',
              'Penicillin is discovered by Alexander Fleming.',
              'Penicillin had discovered Alexander Fleming.',
              'Alexander Fleming was discovered by penicillin.'
            ],
            correctIndex: 0,
            explanation: 'Simple past passive requires "was + discovered".'
          },
          {
            id: 'e1-q4',
            question: 'Select the correct Present Perfect sentence:',
            options: [
              'She has lived in Cairo for ten years.',
              'She lived in Cairo since ten years.',
              'She has lived in Cairo yesterday.',
              'She is living in Cairo last year.'
            ],
            correctIndex: 0,
            explanation: '"Has lived" with "for ten years" denotes an action continuing to the present.'
          }
        ]
      },
      {
        id: 'eng-11-12',
        title: 'Conditionals & Discourse Markers',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Advanced Conditionals and Academic Transitions',
        lessonContent: [
          'Conditionals describe hypothetical situations. Third Conditional deals with unreal past events: "If + had + V3, would have + V3" (e.g., "If I had known, I would have arrived early").',
          'Inversion can replace if-clauses in formal prose: "Had we known the result..." instead of "If we had known...".',
          'Discourse markers (moreover, consequently, nevertheless, in contrast) build cohesion across arguments.'
        ],
        keyPoints: [
          '3rd Conditional: If + had + V3, would have + V3',
          'Inversion: "Had I known..." replaces "If I had known..."',
          'Discourse markers create smooth transitions'
        ],
        flashcards: [
          {
            id: 'e2-fc1',
            front: 'What does the 3rd Conditional express?',
            back: 'Hypothetical past situations that did not actually happen.'
          },
          {
            id: 'e2-fc2',
            front: 'Complete: "If she had studied, she _______ passed."',
            back: '"would have" (3rd conditional).'
          },
          {
            id: 'e2-fc3',
            front: 'Give an example of a contrast discourse marker.',
            back: '"Nevertheless", "However", or "Nonetheless".'
          },
          {
            id: 'e2-fc4',
            front: 'Inverted form of "If you had warned us"?',
            back: '"Had you warned us..."'
          }
        ],
        quizQuestions: [
          {
            id: 'e2-q1',
            question: '"If the engineers _______ the plans, the bridge would not have failed."',
            options: ['had reviewed', 'reviewed', 'have reviewed', 'would review'],
            correctIndex: 0,
            explanation: 'The third conditional if-clause requires Past Perfect ("had reviewed").'
          },
          {
            id: 'e2-q2',
            question: 'Which discourse marker indicates a cause-and-effect result?',
            options: ['Consequently', 'However', 'Whereas', 'Nonetheless'],
            correctIndex: 0,
            explanation: '"Consequently" establishes a direct cause-and-effect relationship.'
          },
          {
            id: 'e2-q3',
            question: '"If the weather is favorable tomorrow, we _______ the experiment."',
            options: ['will conduct', 'would conduct', 'would have conducted', 'conducted'],
            correctIndex: 0,
            explanation: 'First conditional pairs present simple with "will + verb".'
          },
          {
            id: 'e2-q4',
            question: 'Choose the sentence with correct academic cohesion:',
            options: [
              'The experiment was challenging; nevertheless, the researchers reached a breakthrough.',
              'The experiment was challenging; because, they reached a breakthrough.',
              'The experiment was challenging; although, breakthrough occurred.',
              'The experiment was challenging; therefore, it was effortless.'
            ],
            correctIndex: 0,
            explanation: '"Nevertheless" accurately links the difficult challenge with the positive breakthrough.'
          }
        ]
      }
    ]
  },

  // 6. الأدب واللغات (Literature & Rhetoric)
  {
    id: 'amharic',
    name: 'الأدب واللغات',
    subName: 'الأدب والبلاغة',
    accentColor: '#D97706',
    accentLight: '#FFFBEB',
    accentBorder: '#F59E0B',
    accentBadge: '#B45309',
    topics: [
      {
        id: 'amh-9-10',
        title: 'فنون الأدب والتراث الشفهي (Literature & Oral Folklore)',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'عناصر العمل الأدبي وفنون التراث الشفهي',
        lessonContent: [
          'الأدب فن تعبيري راقٍ يجسد مشاعر الإنسان وأفكاره وتجاربه الاجتماعية بلغة إبداعية. ينقسم إلى أدب شفهي (مروي عبر الأجيال) وأدب مكتوب.',
          'يشمل التراث الشفهي الأمثال والحكايات الشعبية والألغاز والأناشيد الحماسية والمراثي، وهي تعكس الهوية والحكمة الجمعية.',
          'يشمل الأدب المكتوب الرواية والقصة والمسرح والشعر. عناصر القصة الأساسية هي: الفكرة (الموضوع)، الحبكة (العقدة والحل)، الشخصيات، والمكان والزمان (البيئة).'
        ],
        keyPoints: [
          'الأدب الشفهي: موروث ثقافي حي يتناقله الرواة',
          'عناصر القصة: الفكرة، الحبكة، الشخصيات، البيئة، الصراع',
          'الشعر: الوزن، القافية، والموسيقى اللفظية'
        ],
        flashcards: [
          {
            id: 'a1-fc1',
            front: 'ما هو الأدب الشفهي (Oral Literature)؟',
            back: 'فنون أدبية متوارثة شفهياً عبر الأجيال كالأمثال والقصص الشعبية.'
          },
          {
            id: 'a1-fc2',
            front: 'ماذا تُسمى سلسلة الأحداث المترابطة في الرواية؟',
            back: 'الحبكة (Plot).'
          },
          {
            id: 'a1-fc3',
            front: 'ما الذي يميز النص المسرحي (Drama)؟',
            back: 'أدب يُكتب ليؤديه ممثلون على خشبة المسرح بالحوار والحركة.'
          },
          {
            id: 'a1-fc4',
            front: 'اذكر أمثلة على الأدب الشفهي.',
            back: 'الأمثال، الحكايات الشعبية، الأهازيج، والمراثي.'
          }
        ],
        quizQuestions: [
          {
            id: 'a1-q1',
            question: 'ما هو المصطلح الذي يعبر عن الفكرة المركزية العميقة للعمل الأدبي؟',
            options: ['الفكرة / الموضوع (Theme)', 'الحبكة', 'البيئة المكانية', 'الحوار'],
            correctIndex: 0,
            explanation: 'الفكرة أو الموضوع هي المعنى الإنساني العام الذي يقصده الكاتب.'
          },
          {
            id: 'a1-q2',
            question: 'أي من التالي يُعتبر عملاً أدبياً مكتوباً وليس تراثاً شفهياً؟',
            options: ['الرواية المطبوعة (Novel)', 'الأمثال الشعبية', 'الألغاز الشعبية', 'الأهازيج المتوارثة'],
            correctIndex: 0,
            explanation: 'الرواية جنس أدبي نثري مكتوب ومطبوع.'
          },
          {
            id: 'a1-q3',
            question: 'ما هو العنصر الذي يحدد زمان ومكان وقوع أحداث القصة؟',
            options: ['البيئة / الإطار الزماني والمكاني (Setting)', 'العقدة', 'الصراع', 'الشخصية الرئيسية'],
            correctIndex: 0,
            explanation: 'يحدد الإطار الزماني والمكاني أين ومتى دارت أحداث العمل الأدبي.'
          },
          {
            id: 'a1-q4',
            question: 'السطر الواحد في القصيدة الشعرية يُسمى:',
            options: ['بيت شعري / سطر شعري', 'فقرة', 'مقطع نثري', 'مقدمة'],
            correctIndex: 0,
            explanation: 'يتكون الشعر من أبيات أو أسطر شعرية منتظمة الإيقاع.'
          }
        ]
      },
      {
        id: 'amh-11-12',
        title: 'بلاغة التورية وفن الشمع والذهب (Wax & Gold Rhetoric)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'المعنى المزدوج وفلسفة البلاغة التقليدية',
        lessonContent: [
          'يُعد فن "الشمع والذهب" (سِمْ أِنَا وَرْقْ) من أرفع تقاليد البلاغة الشعرية؛ حيث يمتلك النص معنيين: "الشمع" وهو المعنى الظاهري الحرفي البسيط، و"الذهب" وهو المعنى الباطني العميق المقصود.',
          'يرتكز الانتقال بين المعنيين على كلمة محورية مشتركة (حِبْرِ قال) أو التورية الجناسيّة. يُستخدم هذا الأسلوب للنقد الاجتماعي والفلسفي والسياسي بذكاء أدبي رفيع.',
          'ازدهر هذا الفن في مدارس الشعر التقليدية ويثري التفكير النقدي والتذوق الجمالي للبلاغة الإفريقية العريقة.'
        ],
        keyPoints: [
          'الشمع (Sem): المعنى الظاهر المباشر',
          'الذهب (Worq): المعنى الخفي العميق والرسالة الحقيقية',
          'الكلمة المحورية: الجسر اللفظي الرابط بين المعنيين'
        ],
        flashcards: [
          {
            id: 'a2-fc1',
            front: 'ماذا يمثل "الشمع" في بلاغة الشمع والذهب؟',
            back: 'المعنى السطحي والظاهري المباشر للعبارة.'
          },
          {
            id: 'a2-fc2',
            front: 'ماذا يمثل "الذهب"؟',
            back: 'المعنى الخفي والعميق والمقصود الحقيقي للشاعر.'
          },
          {
            id: 'a2-fc3',
            front: 'ما هي "الكلمة المحورية" (حِبْرِ قال)؟',
            back: 'الكلمة ذات المعنيين التي تصل المعنى الظاهر بالباطن.'
          },
          {
            id: 'a2-fc4',
            front: 'ما هي الفائدة البلاغية لهذا الفن؟',
            back: 'إيصال النقد والأفكار الفلسفية بأسلوب رمزي ذكي وممتع.'
          }
        ],
        quizQuestions: [
          {
            id: 'a2-q1',
            question: 'ما هي الكلمة المحورية التي تربط المعنى الظاهري بالباطني في شعر الشمع والذهب؟',
            options: ['الكلمة الرابطة المزدوجة (حِبْرِ قال)', 'القافية', 'الصدر', 'العجز'],
            correctIndex: 0,
            explanation: 'الكلمة الرابطة تحمل دلالتين لغويتين تمكن السامع من الانتقال من الشمع إلى الذهب.'
          },
          {
            id: 'a2-q2',
            question: 'المعنى الظاهري السطحي في هذه البلاغة يُسمى:',
            options: ['الشمع (Sem)', 'الذهب (Worq)', 'البيت', 'الوزن'],
            correctIndex: 0,
            explanation: 'الشمع يغلف الذهب كما يغلف المعنى الظاهر الحقيقة الباطنة.'
          },
          {
            id: 'a2-q3',
            question: 'أين كانت تُدرس وتُمارس هذه الفنون البلاغية الرمزية تاريخياً؟',
            options: ['في المدارس البلاغية التقليدية (قِني بيت)', 'في المعاهد البحرية', 'في المصانع', 'في الأكاديميات الرياضية'],
            correctIndex: 0,
            explanation: 'حافظت مدارس القني التقليدية على هذا التراث الشعري العريق.'
          },
          {
            id: 'a2-q4',
            question: 'ما هي القيمة الفكرية الأبرز لفن الشمع والذهب؟',
            options: ['التعبير عن النقد الاجتماعي والفلسفة بذكاء ورمزية', 'تقليل عدد الكلمات فقط', 'إلغاء المعاني المجازية', 'رفع الصوت'],
            correctIndex: 0,
            explanation: 'يمكّن الأديب من تقديم نقد اجتماعي وفكري عميق بحصانة وبراعة بلاغية.'
          }
        ]
      }
    ]
  },

  // 7. التاريخ والدراسات الاجتماعية (History)
  {
    id: 'social-studies',
    name: 'التاريخ',
    subName: 'التاريخ والدراسات الاجتماعية',
    accentColor: '#B91C1C',
    accentLight: '#FEF2F2',
    accentBorder: '#DC2626',
    accentBadge: '#991B1B',
    topics: [
      {
        id: 'soc-9-10',
        title: 'حضارة أكسوم وشبكات التجارة القديمة',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'إمبراطورية أكسوم وتجارة البحر الأحمر والعمارة',
        lessonContent: [
          'ازدهرت حضارة أكسوم في القرن الإفريقي بين القرنين الأول والثامن الميلاديين، واعتُبرت إحدى القوى الأربع العظمى في العالم القديم بجانب روما وفارس والصين.',
          'من خلال ميناء عدوليس على البحر الأحمر، أقامت أكسوم شبكة تجارية واسعة مع حوض البحر الأبيض المتوسط وشبه الجزيرة العربية والهند، وصدرت الذهب والعاج والبخور والزجاج.',
          'كانت أكسوم أول حضارة في إفريقيا جنوب الصحراء تسك عملتها الخاصة بالذهب والفضة والبرونز، وشيدت مسلات جرانيتية حجرية عملاقة منحوتة من صخرة واحدة متجانسة بدون ملاط.'
        ],
        keyPoints: [
          'ميناء عدوليس: مركز دولي لطرق التجارة البحرية',
          'سك العملة: إصدار عملات ذهبية وفضية خاصة',
          'العمارة الأكسومية: مسلات جرانيتية عملاقة متجانسة'
        ],
        flashcards: [
          {
            id: 's1-fc1',
            front: 'ما هو الميناء الدولي الرئيسي لحضارة أكسوم على البحر الأحمر؟',
            back: 'ميناء عدوليس (Adulis).'
          },
          {
            id: 's1-fc2',
            front: 'من هو أول ملك أكسومي سك العملات المعدنية؟',
            back: 'الملك إندوبيس (King Endubis).'
          },
          {
            id: 's1-fc3',
            front: 'ما هي أهم صادرات حضارة أكسوم التجارية؟',
            back: 'الذهب، العاج، اللبان، البخور، والزمرد.'
          },
          {
            id: 's1-fc4',
            front: 'ما سبب تراجع إمبراطورية أكسوم تجارياً؟',
            back: 'فقدان السيطرة على خطوط الملاحة البحرية وتحول المراكز التجارية.'
          }
        ],
        quizQuestions: [
          {
            id: 's1-q1',
            question: 'في أي فترة بدأت إمبراطورية أكسوم بسك عملتها النقدية الخاصة؟',
            options: ['أواخر القرن الثالث الميلادي', 'القرن العاشر الميلادي', 'القرن الأول قبل الميلاد', 'القرن السادس عشر'],
            correctIndex: 0,
            explanation: 'بدأ الملك إندوبيس سك العملة الأكسومية في أواخر القرن الثالث الميلادي.'
          },
          {
            id: 's1-q2',
            question: 'أي من الحضارات التالية لم تتصل تجارياً بأكسوم قديماً؟',
            options: ['حضارة الإنكا في أمريكا الجنوبية', 'الإمبراطورية الرومانية', 'الإمبراطورية البيزنطية', 'الهند القديمة'],
            correctIndex: 0,
            explanation: 'حضارة الإنكا نشأت في أمريكا الجنوبية ولم تكن متصلة بالعالم القديم.'
          },
          {
            id: 's1-q3',
            question: 'نُحتت مسلات أكسوم التاريخية الشهيرة من:',
            options: ['كتلة واحدة متجانسة من صخور الجرانيت (Monolithic)', 'طوب طيني محروق', 'حجر جيري مضغوط', 'صفائح معدنية'],
            correctIndex: 0,
            explanation: 'مسلات أكسوم معالم متجانسة نحتت كل مسلة من كتلة جرانيتية واحدة ضخمة.'
          },
          {
            id: 's1-q4',
            question: 'في عهد أي ملك دخلت المسيحية رسمياً كديانة لمملكة أكسوم؟',
            options: ['الملك عيزانا (King Ezana)', 'الملك كالب', 'الملك إندوبيس', 'الملك يوحنس'],
            correctIndex: 0,
            explanation: 'اعتنق الملك عيزانا المسيحية في منتصف القرن الرابع الميلادي وجعلها ديانة رسمية.'
          }
        ]
      },
      {
        id: 'soc-11-12',
        title: 'التاريخ الحديث ومعركة عدوة الخالدة (Battle of Adwa)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'حماية السيادة الوطنية والنصر التاريخي في معركة عدوة',
        lessonContent: [
          'تُمثل معركة عدوة (1 مارس 1896 / 23 يكاتيت 1888 بالتقويم الإثيوبي) ملحمة وطنية خالدة استطاعت فيها القوات الإثيوبية إلحاق هزيمة ساحقة بالجيش الاستعماري الإيطالي، والحفاظ على الاستقلال والسيادة.',
          'اندلعت الحرب نتيجة الخلاف حول المادة 17 من معاهدة وتشالي (1889)؛ حيث نصت النسخة الإيطالية على أن إثيوبيا "تلتزم" بإجراء علاقاتها الخارجية عبر إيطاليا (جعلها محمية)، بينما نصت النسخة الأمهرية على أنها "تستطيع" ذلك اختيارياً.',
          'قاد الإمبراطور منليك الثاني والإمبراطورة تايتو بيتول تعبئة وطنية شاملة ضمت أكثر من 100,000 مقاتل، واستطاعوا عزل قوات الجنرال باراتيري وتحقيق نصر تاريخي ألهَم حركات التحرر الإفريقية.'
        ],
        keyPoints: [
          'تاريخ النصر: 1 مارس 1896 (23 يكاتيت 1888)',
          'المادة 17 من معاهدة وتشالي كانت الشرارة الدبلوماسية',
          'أصبحت عدوة رمزاً تاريخياً لحركات التحرر والوحدة الإفريقية (Pan-Africanism)'
        ],
        flashcards: [
          {
            id: 's2-fc1',
            front: 'متى وقعت معركة عدوة التاريخية؟',
            back: '1 مارس 1896 (23 يكاتيت 1888 بالتقويم الإثيوبي).'
          },
          {
            id: 's2-fc2',
            front: 'ما هي المعاهدة التي كانت سبباً مباشراً في اندلاع الحرب؟',
            back: 'معاهدة وتشالي (المادة 17 المتنازع عليها).'
          },
          {
            id: 's2-fc3',
            front: 'من كان قائد القوات الإيطالية الغازية في عدوة؟',
            back: 'الجنرال أوريستي باراتيري (General Oreste Baratieri).'
          },
          {
            id: 's2-fc4',
            front: 'ما هو الأثر العالمي لنصر معركة عدوة؟',
            back: 'أثبت قدرة الشعوب الإفريقية على دحر الاستعمار وألهم حركة الوحدة الإفريقية.'
          }
        ],
        quizQuestions: [
          {
            id: 's2-q1',
            question: 'في أي عام وُقّعت معاهدة وتشالي الأصلية؟',
            options: ['1889 (1881 بالتاريخ الإثيوبي)', '1896', '1875', '1905'],
            correctIndex: 0,
            explanation: 'وُقّعت معاهدة وتشالي في مايو 1889.'
          },
          {
            id: 's2-q2',
            question: 'من القائدة التي ابتكرت خطة حصار موارد المياه عن القوات الإيطالية في حصن مقلي؟',
            options: ['الإمبراطورة تايتو بيتول', 'الملكة زوديitu', 'الإمبراطورة منن', 'الملكة إليني'],
            correctIndex: 0,
            explanation: 'قادت الإمبراطورة تايتو خطة عزل مصادر المياه في مقلي مما أجبر العدو على التراجع.'
          },
          {
            id: 's2-q3',
            question: 'ما هي المعاهدة التي ألغت معاهدة وتشالي واعترفت باستقلال وسيادة إثيوبيا التامة؟',
            options: ['معاهدة أديس أبابا (أكتوبر 1896)', 'معاهدة لندن', 'معاهدة روما', 'معاهدة باريس'],
            correctIndex: 0,
            explanation: 'ألغت معاهدة أديس أبابا للسلام عام 1896 معاهدة وتشالي وأقرت باستقلال إثيوبيا غير المشروط.'
          },
          {
            id: 's2-q4',
            question: 'ما هو التأثير الدولي الأبرز لانتصار عدوة؟',
            options: ['تحطيم أسطورة التفوق الاستعماري وإلهام حركة التحرر الإفريقي', 'تسريع استعمار المنطقة', 'وقف التجارة البحرية', 'إلغاء الملاحة في البحر الأحمر'],
            correctIndex: 0,
            explanation: 'شكل نصر عدوة منارة أمل لحركات التحرر الوطني واستقلال القارة الإفريقية.'
          }
        ]
      }
    ]
  },

  // 8. تكنولوجيا المعلومات والاتصالات (ICT)
  {
    id: 'ict',
    name: 'ICT',
    subName: 'تكنولوجيا المعلومات والاتصالات',
    accentColor: '#475569',
    accentLight: '#F8FAFC',
    accentBorder: '#64748B',
    accentBadge: '#334155',
    topics: [
      {
        id: 'ict-9-10',
        title: 'عتاد الحاسوب، البرمجيات، والشبكات',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'معمارية الحاسوب، الذاكرة، وأساسيات شبكات الاتصال',
        lessonContent: [
          'يتكون نظام الحاسوب من العتاد (Hardware - المكونات المادية: المعالج، الذاكرة، أجهزة الإدخال والإخراج) والبرمجيات (Software - البرامج وأنظمة التشغيل).',
          'وحدة المعالجة المركزية (CPU) هي عقل الحاسوب. ذاكرة الوصول العشوائي (RAM) ذاكرة مؤقتة تفقد بياناتها عند انقطاع التيار، بينما توفر الأقراص الصلبة (Hard Drives / SSD) تخزيناً دائماً.',
          'تتيح شبكات الحاسوب تبادل البيانات والموارد. تُصنف جغرافياً إلى LAN (شبكة محلية لمدرسة أو مكتب) و WAN (شبكة واسعة تغطي دولاً كالإنترنت).'
        ],
        keyPoints: [
          'المعالج (CPU): عقل النظام الذي ينفذ العمليات والتعليمات',
          'RAM (ذاكرة مؤقتة متطايرة) مقابل التخزين الدائم (Non-volatile)',
          'LAN (شبكة محلية) مقابل WAN (شبكة واسعة / الإنترنت)'
        ],
        flashcards: [
          {
            id: 'i1-fc1',
            front: 'ما هو المكون الذي يُعتبر "عقل" جهاز الحاسوب؟',
            back: 'وحدة المعالجة المركزية (CPU - Central Processing Unit).'
          },
          {
            id: 'i1-fc2',
            front: 'ما هو الفرق الأساسي بين RAM و ROM؟',
            back: 'RAM ذاكرة مؤقتة متطايرة، بينما ROM ذاكرة قراءة دائمة غير متطايرة.'
          },
          {
            id: 'i1-fc3',
            front: 'ماذا يعني اختصار LAN؟',
            back: 'Local Area Network (شبكة محلية محدودة المساحة).'
          },
          {
            id: 'i1-fc4',
            front: 'اذكر أمثلة على أنظمة التشغيل (OS).',
            back: 'Windows, Linux, macOS, Android, و iOS.'
          }
        ],
        quizQuestions: [
          {
            id: 'i1-q1',
            question: 'أي من الأجهزة التالية يُعتبر وحدة إدخال (Input Device) فقط؟',
            options: ['لوحة المفاتيح والفأرة (Keyboard & Mouse)', 'شاشة العرض', 'الطابعة', 'مكبر الصوت'],
            correctIndex: 0,
            explanation: 'تُدخل لوحة المفاتيح والفأرة الأوامر والبيانات إلى الحاسوب.'
          },
          {
            id: 'i1-q2',
            question: '1 جيجابايت (1 GB) تعادل كم ميجابايت (MB)؟',
            options: ['1,024 ميجابايت', '100 ميجابايت', '1,000,000 ميجابايت', '10 ميجابايت'],
            correctIndex: 0,
            explanation: 'في النظام الثنائي الرقمي للحواسيب 1 GB = 1024 MB.'
          },
          {
            id: 'i1-q3',
            question: 'ما هو البرنامج المستخدم لتصفح صفحات شبكة الويب العالمية؟',
            options: ['متصفح الويب (Web Browser)', 'نواة نظام التشغيل', 'مترجم الجداول', 'برنامج تجزئة القرص'],
            correctIndex: 0,
            explanation: 'تستعرض متصفحات الويب (مثل Chrome و Firefox) صفحات الإنترنت ومواقعها.'
          },
          {
            id: 'i1-q4',
            question: 'ما هي الوظيفة الأساسية لعنوان IP (IP Address)؟',
            options: ['التعريف الفريد لكل جهاز متصل بالشبكة', 'تسريع معالج الحاسوب', 'تنظيف الذاكرة', 'ضبط ألوان الشاشة'],
            correctIndex: 0,
            explanation: 'عنوان IP هو الهوية الرقمية الفريدة لكل جهاز للتواصل والتوجيه عبر الشبكة.'
          }
        ]
      },
      {
        id: 'ict-11-12',
        title: 'قواعد البيانات العلائقية والأمن السيبراني',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'تصميم قواعد البيانات، لغة SQL، وحماية الفضاء الرقمي',
        lessonContent: [
          'قاعدة البيانات (Database) هي مجموعة منظمة من البيانات لتسهيل التخزين والاسترجاع. تنظم أنظمة RDBMS البيانات في جداول تتألف من صفوف (سجلات) وأعمدة (حقول).',
          'تُستخدم لغة الاستعلام الهيكلية (SQL) لإدارة البيانات عبر الأوامر: SELECT (استعلام)، INSERT (إضافة)، UPDATE (تعديل)، و DELETE (حذف). والمفتاح الأساسي (Primary Key) يميز كل سجل فريداً.',
          'يحمي الأمن السيبراني الأنظمة والشبكات من الهجمات الرقمية (البرمجيات الخبيثة، التصيد الاحتيالي). يرتكز على ثالوث CIA: السرية، السلامة، والتوافر.'
        ],
        keyPoints: [
          'أوامر SQL الأساسية: SELECT, INSERT INTO, UPDATE, DELETE',
          'المفتاح الأساسي (Primary Key): معرف فريد لكل سجل بالجدول',
          'ثالوث الأمن (CIA): السرية (Confidentiality)، السلامة (Integrity)، والتوافر (Availability)'
        ],
        flashcards: [
          {
            id: 'i2-fc1',
            front: 'ما هو المفتاح الأساسي (Primary Key) في قواعد البيانات؟',
            back: 'حقل أو مجموعة حقول تُحدد كل سجل في الجدول بشكل فريد ودون تكرار.'
          },
          {
            id: 'i2-fc2',
            front: 'ما هو هجوم التصيد الاحتيالي (Phishing)؟',
            back: 'رسائل خادعة تخدع المستخدمين للكشف عن كلمات المرور أو البيانات الحساسة.'
          },
          {
            id: 'i2-fc3',
            front: 'ما هو أمر SQL المستخدم لاسترجاع البيانات من الجدول؟',
            back: 'أمر SELECT (مثال: SELECT * FROM Students;).'
          },
          {
            id: 'i2-fc4',
            front: 'ما هو التشفير (Encryption)؟',
            back: 'تحويل البيانات إلى رمز سري لا يقرؤه إلا من يملك مفتاح فك التشفير.'
          }
        ],
        quizQuestions: [
          {
            id: 'i2-q1',
            question: 'أي أمر من أوامر SQL يُستخدم لإضافة سجلات جديدة إلى جدول قاعدة البيانات؟',
            options: ['INSERT INTO', 'SELECT', 'UPDATE', 'ADD RECORD'],
            correctIndex: 0,
            explanation: 'يُضيف الأمر INSERT INTO بيانات جديدة إلى الجداول المحددة.'
          },
          {
            id: 'i2-q2',
            question: 'ماذا يمثل ثالوث CIA في أمن المعلومات؟',
            options: [
              'السرية، السلامة، والتوافر (Confidentiality, Integrity, Availability)',
              'الحاسوب، الإنترنت، الوصول',
              'الشفرة، المعلومات، التوثيق',
              'التحكم، المدخلات، الأتمتة'
            ],
            correctIndex: 0,
            explanation: 'يمثل ثالوث CIA الركائز الجوهرية لأي سياسة أمن معلومات فعالة.'
          },
          {
            id: 'i2-q3',
            question: 'ما هي الفائدة الأمنية للمصادقة الثنائية (Two-Factor Authentication - 2FA)؟',
            options: [
              'تتطلب خطوة تحقق إضافية، مما يحمي الحسابات حتى لو تسربت كلمة المرور',
              'زيادة سرعة التنزيل',
              'تقليل استهلاك البطارية',
              'إلغاء الحاجة لكلمات المرور'
            ],
            correctIndex: 0,
            explanation: 'تفرض 2FA خطوة تحقق ثانية تمنع الدخول غير المصرح به.'
          },
          {
            id: 'i2-q4',
            question: 'ما هي الوظيفة الأساسية للجدار الناري (Firewall) في الشبكات؟',
            options: [
              'فحص ومراقبة حركة مرور البيانات وحظر الوصول غير المصرح به',
              'تبريد معالجات الخوادم',
              'إصلاح الأقراص الصلبة التالفة',
              'تنظيم الجهد الكهربائي'
            ],
            correctIndex: 0,
            explanation: 'يعمل الجدار الناري كحاجز أمني يفحص حزم البيانات وفق قواعد أمان صارمة.'
          }
        ]
      }
    ]
  }
];
