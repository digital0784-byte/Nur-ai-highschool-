import { Subject } from '../types';

export const curriculumAmharic: Subject[] = [
  // 1. ሂሳብ (Mathematics)
  {
    id: 'math',
    name: 'ሂሳብ',
    subName: 'Mathematics',
    accentColor: '#1D4ED8',
    accentLight: '#EFF6FF',
    accentBorder: '#2563EB',
    accentBadge: '#1E40AF',
    topics: [
      {
        id: 'math-9-10',
        title: 'የኳድራቲክ እኩልዮሾች (Quadratic Equations)',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'የሁለተኛ ዲግሪ (ኳድራቲክ) እኩልዮሾች አፈታት ስልቶች',
        lessonContent: [
          'ኳድራቲክ እኩልዮሽ የሚባለው ማንኛውም በ ax² + bx + c = 0 መልክ የሚገለፅ እኩልዮሽ ሲሆን፣ እዚህ ላይ a፣ b እና c ቋሚ ቁጥሮች ናቸው፤ a ደግሞ ከዜሮ ጋር እኩል መሆን አይችልም። የዚህ እኩልዮሽ ከፍተኛው የዋጋ አርቢ (degree) 2 ነው።',
          'እነዚህን እኩልዮሾች ለመፍታት ሶስት ዋና ዋና መንገዶችን እንጠቀማለን፡ አንደኛው በፋክተራይዜሽን (Factorization)፣ ሁለተኛው ሙሉ ካሬ በመስራት (Completing the Square)፣ እና ሦስተኛው በኳድራቲክ ፎርሙላ x = (-b ± √(b² - 4ac)) / (2a) ነው።',
          'በፎርሙላው ውስጥ የሚገኘው (b² - 4ac) ዲሰክሪሚናንት (Discriminant) ይባላል። ዲሰክሪሚናንቱ ከዜሮ በላይ ከሆነ እኩልዮሹ ሁለት እውነተኛ መልሶች (real roots) አሉት፣ ከዜሮ እኩል ከሆነ አንድ እውነተኛ መልስ ብቻ አለው፣ ከዜሮ በታች ከሆነ ደግሞ ምንም እውነተኛ መልስ የለውም።'
        ],
        keyPoints: [
          'መደበኛ ቀመር፡ ax² + bx + c = 0 (a ≠ 0)',
          'የኳድራቲክ ፎርሙላ፡ x = (-b ± √(b² - 4ac)) / 2a',
          'ዲሰክሪሚናንት D = b² - 4ac የመልሶቹን ባህሪ ይወስናል'
        ],
        flashcards: [
          {
            id: 'm1-fc1',
            front: 'ኳድራቲክ እኩልዮሽ ምንድን ነው?',
            back: 'በ ax² + bx + c = 0 መልክ የሚፃፍ፣ ከፍተኛው አርቢ 2 የሆነ የሂሳብ እኩልዮሽ ነው።'
          },
          {
            id: 'm1-fc2',
            front: 'ዲሰክሪሚናንት (Discriminant) ምንድን ነው?',
            back: 'D = b² - 4ac ሲሆን፣ የእኩልዮሹን የመልሶች ብዛት እና አይነት ያሳውቃል።'
          },
          {
            id: 'm1-fc3',
            front: 'ዲሰክሪሚናንት ከዜሮ በታች (D < 0) ሲሆን የመልሶች ሁኔታ?',
            back: 'እኩልዮሹ ምንም አይነት እውነተኛ መልስ (real roots) የለውም ማለት ነው።'
          },
          {
            id: 'm1-fc4',
            front: 'የኳድራቲክ ፎርሙላው ዋና ቀመር ምንድን ነው?',
            back: 'x = (-b ± √(b² - 4ac)) / (2a)'
          }
        ],
        quizQuestions: [
          {
            id: 'm1-q1',
            question: 'በ ax² + bx + c = 0 እኩልዮሽ ውስጥ b² - 4ac = 0 ከሆነ እኩልዮሹ ስንት እውነተኛ መልሶች አሉት?',
            options: ['ምንም እውነተኛ መልስ የለውም', 'አንድ እውነተኛ መልስ ብቻ', 'ሁለት የተለያዩ እውነተኛ መልሶች', 'አራት እውነተኛ መልሶች'],
            correctIndex: 1,
            explanation: 'ዲሰክሪሚናንት (b² - 4ac) ከዜሮ ጋር እኩል ሲሆን እኩልዮሹ አንድ የተደገመ እውነተኛ መልስ (one real root) ይኖረዋል።'
          },
          {
            id: 'm1-q2',
            question: 'የ x² - 5x + 6 = 0 እኩልዮሽ መልሶች (roots) የትኞቹ ናቸው?',
            options: ['x = 2 እና x = 3', 'x = -2 እና x = -3', 'x = 1 እና x = 6', 'x = -1 እና x = 5'],
            correctIndex: 0,
            explanation: '(x - 2)(x - 3) = 0 ተብሎ በፋክተራይዜሽን ሲፈታ x = 2 ወይም x = 3 ይሆናል።'
          },
          {
            id: 'm1-q3',
            question: 'የኳድራቲክ እኩልዮሽ ግራፍ ምን ቅርጽ አለው?',
            options: ['ቀጥተኛ መስመር (Linear)', 'ፓራቦላ (Parabola)', 'ክብ (Circle)', 'ሞገድ (Sine wave)'],
            correctIndex: 1,
            explanation: 'የማንኛውም የሁለተኛ ዲግሪ ፈንክሽን f(x) = ax² + bx + c ግራፍ ፓራቦላ (Parabola) ቅርጽ ያለው ነው።'
          },
          {
            id: 'm1-q4',
            question: 'በ 2x² + 4x - 6 = 0 ውስጥ የ a፣ b እና c ዋጋ በቅደም ተከተል ስንት ነው?',
            options: ['a=2, b=4, c=-6', 'a=4, b=2, c=6', 'a=2, b=-4, c=6', 'a=1, b=2, c=-3'],
            correctIndex: 0,
            explanation: 'ከመደበኛው ax² + bx + c = 0 ጋር ስናነጻጽር a = 2, b = 4, c = -6 ይሆናሉ።'
          }
        ]
      },
      {
        id: 'math-11-12',
        title: 'ካልኩለስና የዴሪቫቲቭ ጽንሰ-ሀሳብ (Calculus & Derivatives)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'የለውጥ ፍጥነት እና የዴሪቫቲቭ (Derivatives) መሰረቶች',
        lessonContent: [
          'ካልኩለስ የቀጣይነት ያለው ለውጥ የሂሳብ ጥናት ነው። የዴሪቫቲቭ ዋና አላማ የአንድ ፈንክሽን ቅፅበታዊ የለውጥ ፍጥነት (instantaneous rate of change) እና በማንኛውም ነጥብ ላይ የሚሳለው የታንጀንት መስመር ቁልቁለት (slope of the tangent line) ማስላት ነው።',
          'ዴሪቫቲቭ የሚገለፀው በሊሚት (limit) ሲሆን፣ ቀመሩም f\'(x) = lim(h→0) [f(x+h) - f(x)] / h ነው። ይህ መሰረታዊ ህግ የፈንክሽኖችን ባህሪ፣ ከፍተኛ (maximum) እና ዝቅተኛ (minimum) ነጥቦችን ለመረዳት ወሳኝ ነው።',
          'ፈጣን የዴሪቫቲቭ ህጎች መካከል የፓወር ህግ d/dx(xⁿ) = n·xⁿ⁻¹፣ የድምር ህግ፣ የብዜት ህግ (Product Rule) እና የሰንሰለት ህግ (Chain Rule) ተጠቃሽ ናቸው። ካልኩለስ በፊዚክስ፣ ኢንጂነሪንግ እና ኢኮኖሚክስ ውስጥ ሰፊ ጥቅም አለው።'
        ],
        keyPoints: [
          'የፓወር ህግ (Power Rule)፡ d/dx(xⁿ) = n · xⁿ⁻¹',
          'የዴሪቫቲቭ ጂኦሜትሪያዊ ትርጉም የታንጀንት መስመር ስሎፕ (Slope) ነው',
          'የቋሚ ቁጥር (constant) ዴሪቫቲቭ ሁልጊዜ 0 ነው'
        ],
        flashcards: [
          {
            id: 'm2-fc1',
            front: 'ዴሪቫቲቭ (Derivative) በጂኦሜትሪ ምንን ያመለክታል?',
            back: 'በተሰጠው ነጥብ ላይ የሚሳለው የታንጀንት መስመር ቁልቁለት (slope of tangent line) ነው።'
          },
          {
            id: 'm2-fc2',
            front: 'የ f(x) = x⁴ ዴሪቫቲቭ ስንት ነው?',
            back: 'f\'(x) = 4x³ (በፓወር ህግ መሰረት)'
          },
          {
            id: 'm2-fc3',
            front: 'የቋሚ ቁጥር (ለምሳሌ f(x) = 15) ዴሪቫቲቭ ምንድን ነው?',
            back: 'ሁልጊዜ 0 (ዜሮ) ነው። ምክንያቱም ቋሚ ቁጥር አይለወጥም።'
          },
          {
            id: 'm2-fc4',
            front: 'የሰንሰለት ህግ (Chain Rule) መቼ ጥቅም ላይ ይውላል?',
            back: 'የተደራረቡ ፈንክሽኖች (composite functions) f(g(x)) ዴሪቫቲቭን ለማስላት።'
          }
        ],
        quizQuestions: [
          {
            id: 'm2-q1',
            question: 'የ f(x) = 3x² + 5x - 7 ዴሪቫቲቭ f\'(x) ስንት ነው?',
            options: ['6x + 5', '3x + 5', '6x - 7', '6x² + 5'],
            correctIndex: 0,
            explanation: 'd/dx(3x²) = 6x፣ d/dx(5x) = 5 እና d/dx(-7) = 0 ስለሆነ f\'(x) = 6x + 5 ይሆናል።'
          },
          {
            id: 'm2-q2',
            question: 'በ f\'(x) = 0 ነጥብ ላይ የግራፉ ታንጀንት መስመር ምን ዓይነት አቅጣጫ አለው?',
            options: ['አግድም (Horizontal)', 'ቀጥ ያለ (Vertical)', '45 ዲግሪ ያዘነበለ', 'አቅጣጫ የለውም'],
            correctIndex: 0,
            explanation: 'ስሎፕ 0 ማለት መስመሩ ፍፁም አግድም (horizontal line) ሲሆን ይህም ከፍተኛ ወይም ዝቅተኛ ነጥብን ሊያሳይ ይችላል።'
          },
          {
            id: 'm2-q3',
            question: 'የ f(x) = sin(x) ዴሪቫቲቭ ምንድን ነው?',
            options: ['cos(x)', '-cos(x)', '-sin(x)', 'tan(x)'],
            correctIndex: 0,
            explanation: 'የ sin(x) ዴሪቫቲቭ በቀጥታ cos(x) ነው።'
          },
          {
            id: 'm2-q4',
            question: 'የተፈናጣሪ ቅፅበታዊ ፍጥነት (instantaneous velocity) የሚገኘው በየትኛው መንገድ ነው?',
            options: ['የቦታ ፈንክሽን ዴሪቫቲቭ (ds/dt)', 'የቦታ እና የጊዜ ድምር', 'የፍጥነት ቋሚ ዋጋ', 'የጊዜ ስኩዌር'],
            correctIndex: 0,
            explanation: 'ቅጽበታዊ ፍጥነት የቦታ/ርቀት ፈንክሽን የመጀመሪያው ዴሪቫቲቭ v(t) = ds/dt ነው።'
          }
        ]
      }
    ]
  },

  // 2. ፊዚክስ (Physics)
  {
    id: 'physics',
    name: 'ፊዚክስ',
    subName: 'Physics',
    accentColor: '#7C3AED',
    accentLight: '#F5F3FF',
    accentBorder: '#8B5CF6',
    accentBadge: '#6D28D9',
    topics: [
      {
        id: 'phys-9-10',
        title: 'የኒውተን የእንቅስቃሴ ህጎች (Newton\'s Laws)',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'የኃይል እና የእንቅስቃሴ መሰረታዊ መርሆዎች',
        lessonContent: [
          'ሰር አይዛክ ኒውተን ግዑዝ አካላት በኃይል አማካኝነት የሚያሳዩትን እንቅስቃሴ የሚቆጣጠሩ ሶስት ወሳኝ ህጎችን ቀምሯል። እነዚህ ህጎች የክላሲካል መካኒክስ መሰረት ናቸው።',
          'አንደኛው ህግ (Inertia) ማንኛውም አካል ውጫዊ ያልተመጣጠነ ኃይል እስካልተጫነው ድረስ ባለበት የእረፍት ሁኔታ ወይም በቋሚ ፍጥነት የመቀጠል ዝንባሌ እንዳለው ይገልጻል። ሁለተኛው ህግ ማጣደፍ (Acceleration) ከተጣራው ኃይል ጋር በቀጥታ እንደሚመጣጠን እና ከክብደት (mass) ጋር በተገላቢጦሽ እንደሚዛመድ ያሳያል (F = ma)።',
          'ሦስተኛው ህግ ደግሞ ለእያንዳንዱ ድርጊት (Action) እኩል እና ተቃራኒ የሆነ አፀፋዊ ድርጊት (Reaction) እንዳለ ያስረዳል፤ ለምሳሌ ሮኬት ወደ ላይ የሚተኮሰው ጋዝ ወደ ታች በሚገፋው እኩል አፀፋዊ ኃይል ነው።'
        ],
        keyPoints: [
          '1ኛ ህግ፡ ኢነርሺያ (Inertia) - የሁኔታ ለውጥን የመቋቋም አቅም',
          '2ኛ ህግ፡ F = ma (የተጣራ ኃይል = ክብደት × ማጣደፍ)',
          '3ኛ ህግ፡ ድርጊት እና አፀፋ (Action = -Reaction)'
        ],
        flashcards: [
          {
            id: 'p1-fc1',
            front: 'የኒውተን 1ኛ ህግ ምን ይባላል?',
            back: 'የኢነርሺያ ህግ (Law of Inertia) ይባላል።'
          },
          {
            id: 'p1-fc2',
            front: 'የኒውተን ሁለተኛ ህግ ቀመር ምንድን ነው?',
            back: 'F = m · a (ኃይል = ግዝፈት × ማጣደፍ)'
          },
          {
            id: 'p1-fc3',
            front: 'የኃይል (Force) መለኪያ አሃድ ምንድን ነው?',
            back: 'ኒውተን (Newton - N) ወይም kg·m/s² ነው።'
          },
          {
            id: 'p1-fc4',
            front: 'የኒውተን ሦስተኛ ህግ ምሳሌ ስጥ?',
            back: 'ዋናተኛው ውሃውን ወደ ኋላ ሲገፋ፣ ውሃው ደግሞ ሰውየውን ወደ ፊት ይገፋዋል።'
          }
        ],
        quizQuestions: [
          {
            id: 'p1-q1',
            question: 'በ 10 kg ግዝፈት ባለው እቃ ላይ 50 N ኃይል ቢተገበር የሚፈጠረው ማጣደፍ (a) ስንት ነው?',
            options: ['5 m/s²', '500 m/s²', '0.2 m/s²', '40 m/s²'],
            correctIndex: 0,
            explanation: 'a = F / m = 50 N / 10 kg = 5 m/s² ይሆናል።'
          },
          {
            id: 'p1-q2',
            question: 'መኪና ድንገት ፍሬን ሲይዝ ተሳፋሪዎች ወደ ፊት የሚወረወሩት በየትኛው ምክንያት ነው?',
            options: ['በኢነርሺያ (Inertia)', 'በስበት ኃይል መጨመር', 'በግጭት መቀነስ', 'በአየር ግፊት'],
            correctIndex: 0,
            explanation: 'የተሳፋሪዎቹ አካል በነበሩበት የእንቅስቃሴ ፍጥነት የመቀጠል ዝንባሌ (ኢነርሺያ) ስላለው ነው።'
          },
          {
            id: 'p1-q3',
            question: 'በኒውተን 3ኛ ህግ መሰረት የድርጊት እና አፀፋ ኃይሎች የሚተገበሩት፡',
            options: ['በሁለት የተለያዩ አካላት ላይ ነው', 'በአንድ አካል ላይ ብቻ ነው', 'በተመሳሳይ አቅጣጫ ነው', 'በጊዜ ልዩነት ነው'],
            correctIndex: 0,
            explanation: 'Action እና Reaction ሁልጊዜ በሁለት የተለያዩ ተጋጣሚ አካላት ላይ እኩል ሆነው በተቃራኒ አቅጣጫ ይተገበራሉ።'
          },
          {
            id: 'p1-q4',
            question: 'አንድ እቃ በቋሚ ፍጥነት (constant velocity) እየተጓዘ ከሆነ የተጣራው ኃይል (net force) ስንት ነው?',
            options: ['0 N (ዜሮ)', 'ከክብደቱ ጋር እኩል', 'ከፍጥነቱ ጋር እኩል', 'ማለቂያ የሌለው'],
            correctIndex: 0,
            explanation: 'ቋሚ ፍጥነት ማለት ማጣደፍ (a = 0) ማለት ሲሆን በ F = ma መሰረት የተጣራ ኃይል 0 N ነው።'
          }
        ]
      },
      {
        id: 'phys-11-12',
        title: 'ኤሌክትሮማግኔቲዝም እና ሞገድ (Electromagnetism & Waves)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'የኤሌክትሮማግኔቲክ ኢንዳክሽን እና የሞገድ ባህሪያት',
        lessonContent: [
          'ኤሌክትሮማግኔቲዝም በኤሌክትሪክ ክፍያዎች እና በማግኔቲክ መስኮች መካከል ያለውን መስተጋብር የሚያጠና ሰፊ የፊዚክስ ዘርፍ ነው። ተንቀሳቃሽ የኤሌክትሪክ ክፍያ በዙሪያው ማግኔቲክ መስክ ይፈጥራል።',
          'የፋራዳይ የኢንዳክሽን ህግ እንደሚገልጸው፣ በተዘጋ ሰርኪውት ውስጥ የሚፈጠረው የኤሌክትሮሞቲቭ ኃይል (EMF) ከማግኔቲክ ፍላክስ ለውጥ ፍጥነት ጋር በቀጥታ ይመጣጠናል። የሌንዝ ህግ ደግሞ የኢንዲዩስድ ከረንቱ አቅጣጫ ለውጡን የሚቃወም እንደሆነ ያስረዳል።',
          'የኤሌክትሮማግኔቲክ ሞገዶች በኤሌክትሪክ እና ማግኔቲክ መስኮች ንዝረት የሚፈጠሩ ሲሆኑ፣ በህዋ (vacuum) ውስጥ በብርሃን ፍጥነት (3 × 10⁸ m/s) ይጓዛሉ። የሞገድ ፍጥነት v = f · λ ነው።'
        ],
        keyPoints: [
          'የፋራዳይ ህግ፡ EMF = -N(ΔΦ/Δt)',
          'የሞገድ ቀመር፡ v = f · λ (ፍጥነት = ፍሪኩዌንሲ × የሞገድ ርዝመት)',
          'የኤሌክትሮማግኔቲክ ሞገድ በቫኪዩም ውስጥ ለመጓዝ ማዕከል (medium) አይሻም'
        ],
        flashcards: [
          {
            id: 'p2-fc1',
            front: 'የፋራዳይ የኤሌክትሮማግኔቲክ ኢንዳክሽን ህግ ዋና ሃሳብ ምንድን ነው?',
            back: 'የሚለዋወጥ ማግኔቲክ ፍላክስ በኮንዳክተር ውስጥ የቮልቴጅ (EMF) ይፈጥራል።'
          },
          {
            id: 'p2-fc2',
            front: 'የብርሃን ፍጥነት በቫኪዩም (c) ስንት ነው?',
            back: 'በግምት 3 × 10⁸ m/s (300,000 km/s) ነው።'
          },
          {
            id: 'p2-fc3',
            front: 'የሞገድ ፍሪኩዌንሲ (Frequency) መለኪያ ምንድን ነው?',
            back: 'ሄርትዝ (Hertz - Hz) ወይም 1/s ነው።'
          },
          {
            id: 'p2-fc4',
            front: 'የኤሌክትሪክ ጀነሬተር በየትኛው መርህ ይሰራል?',
            back: 'በኤሌክትሮማግኔቲክ ኢንዳክሽን (መካኒካል ኃይልን ወደ ኤሌክትሪክ ይቀይራል)።'
          }
        ],
        quizQuestions: [
          {
            id: 'p2-q1',
            question: 'የሞገድ ርዝመቱ 2 ሜትር እና ፍሪኩዌንሲው 150 Hz የሆነ ሞገድ ፍጥነት ስንት ነው?',
            options: ['300 m/s', '75 m/s', '152 m/s', '0.013 m/s'],
            correctIndex: 0,
            explanation: 'v = f · λ = 150 Hz × 2 m = 300 m/s ይሆናል።'
          },
          {
            id: 'p2-q2',
            question: 'የትራንስፎርመር (Transformer) ዋና ስራ ምንድን ነው?',
            options: ['የኤሲ ቮልቴጅን ከፍ ወይም ዝቅ ማድረግ', 'ኤሲን ወደ ዲሲ መቀየር', 'ማግኔቲክ መስክ ማጥፋት', 'የኤሌክትሪክ ክፍያ ማከማቸት'],
            correctIndex: 0,
            explanation: 'ትራንስፎርመር በኤሌክትሮማግኔቲክ ኢንዳክሽን አማካኝነት የ AC ቮልቴጅ መጠንን ይለውጣል።'
          },
          {
            id: 'p2-q3',
            question: 'ከሚከተሉት ውስጥ ሜካኒካል ሞገድ (ማዕከል የሚፈልግ) የትኛው ነው?',
            options: ['የድምፅ ሞገድ (Sound wave)', 'የራዲዮ ሞገድ', 'ኤክስ-ሬይ (X-ray)', 'የጋማ ጨረር'],
            correctIndex: 0,
            explanation: 'ድምፅ ለመጓዝ የግድ ቁስ አካል (አየር፣ ፈሳሽ፣ ጠጣር) የሚፈልግ የሜካኒካል ሞገድ አይነት ነው።'
          },
          {
            id: 'p2-q4',
            question: 'የሌንዝ ህግ (Lenz\'s Law) ከየትኛው የጥበቃ ህግ ጋር በቀጥታ ይዛመዳል?',
            options: ['የኢነርጂ ጥበቃ ህግ (Conservation of Energy)', 'የክብደት ጥበቃ ህግ', 'የሞመንተም ጥበቃ ህግ', 'የቻርጅ ጥበቃ ህግ'],
            correctIndex: 0,
            explanation: 'የሌንዝ ህግ የተፈጠረው ከረንት ለውጡን እንዲቃወም በማድረግ የኢነርጂ ጥበቃ ህግ እንዳይጣስ ያረጋግጣል።'
          }
        ]
      }
    ]
  },

  // 3. ኬሚስትሪ (Chemistry)
  {
    id: 'chemistry',
    name: 'ኬሚስትሪ',
    subName: 'Chemistry',
    accentColor: '#C2410C',
    accentLight: '#FFF7ED',
    accentBorder: '#EA580C',
    accentBadge: '#9A3412',
    topics: [
      {
        id: 'chem-9-10',
        title: 'የአተም መዋቅር እና ኬሚካላዊ ትስስር (Atomic Structure & Bonding)',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'የንዑሳን ቅንጣቶች ባህሪ እና የቦንድ አይነቶች',
        lessonContent: [
          'አተም የቁስ አካል መሰረታዊ መገንቢያ ሲሆን፣ በውስጡ ፕሮቶን (+ charge) እና ኒውትሮን (ገለልተኛ) የያዘ ኒውክሊየስ፣ እንዲሁም በዙሪያው የሚሽከረከሩ ኤሌክትሮኖችን (- charge) ይዟል።',
          'አተሞች የተረጋጋ የኦክቴት (8 የውጪ ኤሌክትሮኖች) ህግ ለማሟላት እርስ በእርስ ይተሳሰራሉ። ዋና ዋናዎቹ የትስስር አይነቶች፡ አዮኒክ ቦንድ (ኤሌክትሮን በመስጠት/በመቀበል በብረታ ብረት እና ኢ-ብረታ ብረት መካከል)፣ ኮቫለንት ቦንድ (ኤሌክትሮን በመጋራት በኢ-ብረታ ብረቶች መካከል)፣ እና ሜታሊክ ቦንድ ናቸው።',
          'የፒሪዮዲክ ሰንጠረዥ ንጥረ ነገሮችን በኤሌክትሮኒክ ውቅር እና በባህሪያቸው መሰረት በግሩፕ እና ፒሪየድ ከፋፍሎ ያሳያል።'
        ],
        keyPoints: [
          'የአተም ቁጥር (Z) = የፕሮቶኖች ብዛት',
          'የግዝፈት ቁጥር (A) = ፕሮቶን + ኒውትሮን',
          'አዮኒክ ቦንድ (ኤሌክትሮን ሽግግር) vs ኮቫለንት ቦንድ (ኤሌክትሮን መጋራት)'
        ],
        flashcards: [
          {
            id: 'c1-fc1',
            front: 'አይሶቶፕስ (Isotopes) ምንድን ናቸው?',
            back: 'ተመሳሳይ የፕሮቶን ቁጥር ያላቸው ነገር ግን የተለያየ የኒውትሮን ብዛት ያላቸው የአንድ ንጥረ ነገር አተሞች ናቸው።'
          },
          {
            id: 'c1-fc2',
            front: 'የኮቫለንት ቦንድ (Covalent bond) መገለጫ ምንድን ነው?',
            back: 'በሁለት አተሞች መካከል ኤሌክትሮኖችን በጋራ በመጠቀም የሚፈጠር ትስስር ነው።'
          },
          {
            id: 'c1-fc3',
            front: 'በአተም ውስጥ አሉታዊ (Negative) ክፍያ ያለው ቅንጣት የትኛው ነው?',
            back: 'ኤሌክትሮን (Electron) ነው።'
          },
          {
            id: 'c1-fc4',
            front: 'የጠረጴዛ ጨው (NaCl) የትስስር አይነት ምንድን ነው?',
            back: 'አዮኒክ ትስስር (Ionic bonding - በ Na⁺ እና Cl⁻ መካከል)።'
          }
        ],
        quizQuestions: [
          {
            id: 'c1-q1',
            question: 'የአንድ አተም የፕሮቶን ብዛት 11 እና የኒውትሮን ብዛት 12 ቢሆን የግዝፈት ቁጥሩ (Mass Number) ስንት ነው?',
            options: ['23', '11', '12', '1'],
            correctIndex: 0,
            explanation: 'የግዝፈት ቁጥር A = ፕሮቶን (11) + ኒውትሮን (12) = 23 (ሶዲየም) ይሆናል።'
          },
          {
            id: 'c1-q2',
            question: 'በውሃ (H₂O) ሞለኪውል ውስጥ በሃይድሮጅንና ኦክስጅን መካከል ያለው ትስስር ምን ይባላል?',
            options: ['ኮቫለንት ቦንድ', 'አዮኒክ ቦንድ', 'ሜታሊክ ቦንድ', 'ኑክሌር ቦንድ'],
            correctIndex: 0,
            explanation: 'ውሃ የተሰራው ኢ-ብረታ ብረቶች ኤሌክትሮን በመጋራት ስለሆነ ፖላር ኮቫለንት ቦንድ አለው።'
          },
          {
            id: 'c1-q3',
            question: 'የኦክቴት ህግ (Octet Rule) የሚያመለክተው አተሞች ስንት የውጪ ኤሌክትሮን ለማግኘት እንደሚጥሩ ነው?',
            options: ['8', '2', '6', '10'],
            correctIndex: 0,
            explanation: 'የተከበሩ ጋዞችን (Noble gases) የተረጋጋ መዋቅር ለማግኘት አብዛኞቹ አተሞች 8 የውጭ ቫለንስ ኤሌክትሮን ይሻሉ።'
          },
          {
            id: 'c1-q4',
            question: 'በፒሪዮዲክ ቴብል ውስጥ ግሩፕ 1 ንጥረ ነገሮች ምን ተብለው ይጠራሉ?',
            options: ['አልካሊ ብረቶች (Alkali metals)', 'ሃሎጅኖች', 'ኖብል ጋዞች', 'አልካላይን የምድር ብረቶች'],
            correctIndex: 0,
            explanation: 'ግሩፕ 1 (Li, Na, K...) አልካሊ ብረቶች (Alkali metals) በመባል ይታወቃሉ።'
          }
        ]
      },
      {
        id: 'chem-11-12',
        title: 'ኬሚካላዊ ኢኩሊብሪየምና ቴርሞዳይናሚክስ (Equilibrium & Thermodynamics)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'የኬሚካላዊ ግብረ-መልሶች ፍጥነት እና ሚዛናዊነት',
        lessonContent: [
          'ኬሚካላዊ ኢኩሊብሪየም የሚፈጠረው ወደ ፊት የሚሄደው ግብረ-መልስ ፍጥነት ወደ ኋላ ከሚመለሰው ግብረ-መልስ ፍጥነት ጋር እኩል ሲሆን እና የተዋሃጆቹ መጠን ሳይለወጥ ሲቆይ ነው።',
          'የሊ ሻቴሊየር መርህ (Le Chatelier\'s Principle) በሚዛን ላይ ባለው ስርዓት ላይ ጫና (የሙቀት፣ የግፊት ወይም የይዘት ለውጥ) ሲደረግ፣ ስርዓቱ ለውጡን ለመቀነስ በሚረዳ አቅጣጫ ምላሽ እንደሚሰጥ ይደነግጋል።',
          'የኬሚካል ቴርሞዳይናሚክስ የኢንታልፒ (ΔH - ሙቀት)፣ ኢንትሮፒ (ΔS - የስርዓተ-አልበኝነት መጠን) እና የጊብስ ነፃ ኢነርጂ (ΔG = ΔH - TΔS) ፅንሰ-ሀሳቦችን ያጠቃልላል። ΔG ከዜሮ በታች ሲሆን ሂደቱ በራሱ ጊዜ የሚካሄድ (spontaneous) ነው።'
        ],
        keyPoints: [
          'የሊ ሻቴሊየር መርህ፡ ስርዓቱ የተደረገበትን ውጫዊ ለውጥ ይቀለብሳል',
          'የኢኩሊብሪየም ቋሚ Keq = [Products] / [Reactants]',
          'ΔG < 0 (Spontaneous / በራሱ ጊዜ የሚከናወን ሂደት)'
        ],
        flashcards: [
          {
            id: 'c2-fc1',
            front: 'የሊ ሻቴሊየር መርህ (Le Chatelier\'s Principle) ምን ይገልጻል?',
            back: 'በኢኩሊብሪየም ላይ ያለ ስርዓት ላይ ውጫዊ ጫና ሲፈጠር ስርዓቱ ጫናውን በሚያቃልል አቅጣጫ ያዘነብላል።'
          },
          {
            id: 'c2-fc2',
            front: 'ኢንትሮፒ (Entropy - S) ምንን ይለካል?',
            back: 'የአንድ ስርዓት የስርዓተ-አልበኝነት ወይም የዘፈቀደነት መጠን (degree of disorder) ነው።'
          },
          {
            id: 'c2-fc3',
            front: 'ኤግዞተርሚክ (Exothermic) ግብረ-መልስ የ ΔH ምልክቱ ምንድን ነው?',
            back: 'አሉታዊ (ΔH < 0) ነው፣ ምክንያቱም ሙቀት ወደ አካባቢው ይለቃል።'
          },
          {
            id: 'c2-fc4',
            front: 'የጊብስ ነፃ ኢነርጂ ቀመር ምንድን ነው?',
            back: 'ΔG = ΔH - TΔS'
          }
        ],
        quizQuestions: [
          {
            id: 'c2-q1',
            question: 'የአንድ ኬሚካላዊ ሂደት ΔG አሉታዊ (ΔG < 0) ከሆነ ይህ ሂደት፡',
            options: ['በራሱ ጊዜ የሚካሄድ (Spontaneous) ነው', 'በራሱ ጊዜ የማይካሄድ ነው', 'በኢኩሊብሪየም ላይ ነው', 'ፍጥነት የለውም'],
            correctIndex: 0,
            explanation: 'ΔG < 0 ሲሆን ሂደቱ ቴርሞዳይናሚካዊ ተቀባይነት ያለው እና በራሱ ጊዜ የሚካሄድ (spontaneous) ነው።'
          },
          {
            id: 'c2-q2',
            question: 'በ N₂ + 3H₂ ⇌ 2NH₃ (ጋዞች) ስርዓት ላይ ግፊት (Pressure) ቢጨምር ኢኩሊብሪየሙ ወዴት ያዘነብላል?',
            options: ['ወደ ቀኝ (ወደ NH₃ ምርት)', 'ወደ ግራ (ወደ N₂ እና H₂)', 'ምንም ለውጥ አያመጣም', 'ግብረ-መልሱ ይቆማል'],
            correctIndex: 0,
            explanation: 'ግፊት ሲጨምር ስርዓቱ አነስተኛ የጋዝ ሞል ወደሚገኝበት ወደ ቀኝ (4 ሞል ወደ 2 ሞል) ያዘነብላል።'
          },
          {
            id: 'c2-q3',
            question: 'ካታሊስት (Catalyst) በኬሚካላዊ ግብረ-መልስ ውስጥ የሚያበረክተው አስተዋጽኦ ምንድን ነው?',
            options: ['የማነቃቂያ ኢነርጂን (Activation Energy) በመቀነስ ፍጥነት መጨመር', 'የ ΔH ዋጋን መቀየር', 'የምርት መጠንን መጨመር', 'የኢኩሊብሪየም ቋሚን Keq መለወጥ'],
            correctIndex: 0,
            explanation: 'ካታሊስት የአክቲቬሽን ኢነርጂን በመቀነስ ሁለቱንም ወደ ፊት እና ወደ ኋላ ፍጥነቶች በእኩል ያፋጥናል።'
          },
          {
            id: 'c2-q4',
            question: 'የውሃ ወደ በረዶነት መቀየር (Freezing) የኢንትሮፒ (ΔS) ለውጥ ምን ይመስላል?',
            options: ['አሉታዊ (ΔS < 0)', 'አዎንታዊ (ΔS > 0)', 'ዜሮ', 'ወሰን የሌለው'],
            correctIndex: 0,
            explanation: 'ፈሳሽ ወደ ጠጣር ሲቀየር ሞለኪውሎቹ ይበልጥ የተደራጁ ስለሚሆኑ ስርዓተ-አልበኝነቱ (ኢንትሮፒው) ይቀንሳል።'
          }
        ]
      }
    ]
  },

  // 4. ባዮሎጂ (Biology)
  {
    id: 'biology',
    name: 'ባዮሎጂ',
    subName: 'Biology',
    accentColor: '#15803D',
    accentLight: '#F0FDF4',
    accentBorder: '#16A34A',
    accentBadge: '#166534',
    topics: [
      {
        id: 'bio-9-10',
        title: 'የህዋስ (Cell) መዋቅር እና ተግባር',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'የህይወት መሰረታዊ አሃድ እና የኦርጋኔሎች ሚና',
        lessonContent: [
          'ህዋስ (Cell) የማንኛውም ህያው ፍጡር መሰረታዊ መዋቅራዊ እና ተግባራዊ አሃድ ነው። በህዋስ ቲዎሪ መሰረት ሁሉም ህያዋን የተሰሩት ከአንድ ወይም ከበርካታ ህዋሳት ሲሆን፣ አዳዲስ ህዋሳት የሚፈጠሩት ቀደም ሲል ከነበሩት ህዋሳት ክፍፍል ነው።',
          'ህዋሳት በሁለት ይከፈላሉ፡ ፕሮካሪዮቲክ (ግልጽ ኒውክሊየስ የሌላቸው፣ ለምሳሌ ባክቴሪያ) እና ዩካሪዮቲክ (በሜምብሬን የተከበበ ኒውክሊየስ ያላቸው፣ ለምሳሌ የእጽዋትና የእንስሳት ህዋስ)።',
          'በህዋስ ውስጥ ልዩ ልዩ ኦርጋኔሎች ይገኛሉ፡ ማይቶኮንድሪያ የሃይል ማመንጫ (ATP) ነው፣ ክሎሮፕላስት በእጽዋት ውስጥ የፎቶሲንተሲስ ማዕከል ነው፣ ኒውክሊየስ ደግሞ የዘረ-መል መረጃ (DNA) ይዟል።'
        ],
        keyPoints: [
          'ህዋስ የህይወት መሰረታዊ አሃድ ነው',
          'ማይቶኮንድሪያ፡ የህዋስ ሃይል ማመንጫ (Powerhouse of the cell)',
          'የእጽዋት ህዋስ ክሎሮፕላስት እና የህዋስ ግድግዳ (Cell wall) አለው'
        ],
        flashcards: [
          {
            id: 'b1-fc1',
            front: 'የህዋስ የሃይል ማመንጫ ተብሎ የሚጠራው ኦርጋኔል የትኛው ነው?',
            back: 'ማይቶኮንድሪያ (Mitochondria) - ATP ያመነጫል።'
          },
          {
            id: 'b1-fc2',
            front: 'የእጽዋት ህዋስ ከእንስሳት ህዋስ የሚለይባቸው ሁለት አካላት?',
            back: 'የህዋስ ግድግዳ (Cell wall) እና ክሎሮፕላስት (Chloroplast)።'
          },
          {
            id: 'b1-fc3',
            front: 'ፕሮካሪዮት ከዩካሪዮት በምን ይለያል?',
            back: 'ፕሮካሪዮት በሜምብሬን የተከበበ እውነተኛ ኒውክሊየስ የለውም።'
          },
          {
            id: 'b1-fc4',
            front: 'የፕሮቲን ማምረቻ ማዕከል የሆነው የህዋስ አካል የትኛው ነው?',
            back: 'ራይቦዞም (Ribosome) ነው።'
          }
        ],
        quizQuestions: [
          {
            id: 'b1-q1',
            question: 'ፎቶሲንተሲስ (Photosynthesis) የሚካሄደው በየትኛው የህዋስ ኦርጋኔል ውስጥ ነው?',
            options: ['ክሎሮፕላስት (Chloroplast)', 'ማይቶኮንድሪያ', 'ጎልጂ ቦዲ', 'ላይሶዞም'],
            correctIndex: 0,
            explanation: 'ክሎሮፕላስት የፀሐይ ብርሃንን በመጠቀም የኬሚካል ኢነርጂ (ግሉኮስ) ያመርታል።'
          },
          {
            id: 'b1-q2',
            question: 'በህዋስ ውስጥ የዘረመል መረጃን (DNA) የያዘው ዋናው ክፍል የትኛው ነው?',
            options: ['ኒውክሊየስ (Nucleus)', 'ሳይቶፕላዝም', 'ቫኪዩል', 'ሴል ሜምብሬን'],
            correctIndex: 0,
            explanation: 'ኒውክሊየስ የህዋሱን እንቅስቃሴ የሚቆጣጠር እና ክሮሞዞምን የያዘ ዋና ማዕከል ነው።'
          },
          {
            id: 'b1-q3',
            question: 'ከሚከተሉት ውስጥ የፕሮካሪዮቲክ ህዋስ ምሳሌ የሆነው የትኛው ነው?',
            options: ['ባክቴሪያ (Bacteria)', 'የእንጉዳይ ህዋስ', 'የሰው የደም ህዋስ', 'የዛፍ ቅጠል ህዋስ'],
            correctIndex: 0,
            explanation: 'ባክቴሪያዎች ጥንታዊ እና ኒውክሊየስ የሌላቸው ፕሮካሪዮቲክ ፍጥረታት ናቸው።'
          },
          {
            id: 'b1-q4',
            question: 'የህዋስ ግድግዳ (Cell Wall) ዋናው መገንቢያ ንጥረ ነገር ምንድን ነው?',
            options: ['ሴሉሎስ (Cellulose)', 'ግላይኮጅን', 'ኮሌስትሮል', 'ኬራቲን'],
            correctIndex: 0,
            explanation: 'የእጽዋት ህዋስ ግድግዳ ጠንካራ ከሆነው ከሴሉሎስ ፖሊሳክራይድ የተሰራ ነው።'
          }
        ]
      },
      {
        id: 'bio-11-12',
        title: 'ጄኔቲክስ እና የዲኤንኤ (DNA) ስራዎች',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'የዘረ-መል ውርስ ህጎች እና ሞለኪውላር ባዮሎጂ',
        lessonContent: [
          'ጄኔቲክስ የባህሪያት ከአባትና እናት ወደ ልጅ መተላለፍን የሚያጠና ሳይንስ ነው። ግሬጎር ሜንደል የአተር ተክሎችን በማዳቀል የውርስ ህጎችን (የመለያየት እና ራሱን ችሎ የመወረስ ህግጋት) አስቀምጧል።',
          'ዲኤንኤ (DNA) የዘረ-መል መረጃ ተሸካሚ ድርብ ሄሊክስ (double helix) ሞለኪውል ሲሆን፣ የተሰራው ከኒውክሊዮታይዶች ነው። አራቱ የናይትሮጅን ቤዞች አዴኒን (A) ከታይሚን (T) ጋር፣ እንዲሁም ጉዋኒን (G) ከሳይቶሲን (C) ጋር ይጣመራሉ።',
          'የፕሮቲን ውህደት ሁለት ደረጃዎች አሉት፡ ትራንስክሪፕሽን (ከ DNA ወደ mRNA መረጃ መቅዳት) እና ትራንስሌሽን (በራይቦዞም ላይ mRNAን ተርጉሞ አሚኖ አሲዶችን ማጣመር)።'
        ],
        keyPoints: [
          'የቤዝ ማጣመር ህግ፡ A = T እና G ≡ C',
          'ትራንስክሪፕሽን (በኒውክሊየስ) እና ትራንስሌሽን (በራይቦዞም)',
          'ሜንደሊያን ጄኔቲክስ፡ ዶሚናንት እና ሪሴሲቭ አሌሎች'
        ],
        flashcards: [
          {
            id: 'b2-fc1',
            front: 'በዲኤንኤ ውስጥ ከአዴኒን (A) ጋር የሚጣመረው ቤዝ የትኛው ነው?',
            back: 'ታይሚን (Thymine - T) ነው።'
          },
          {
            id: 'b2-fc2',
            front: 'ትራንስክሪፕሽን (Transcription) ምንድን ነው?',
            back: 'ከዲኤንኤ (DNA) መረጃ ተወስዶ መልዕክተኛ አርኤንኤ (mRNA) የሚዘጋጅበት ሂደት ነው።'
          },
          {
            id: 'b2-fc3',
            front: 'የጄኔቲክስ አባት ተብሎ የሚታወቀው ሳይንቲስት ማን ነው?',
            back: 'ግሬጎር ሜንደል (Gregor Mendel) ነው።'
          },
          {
            id: 'b2-fc4',
            front: 'አንድ ኮዶን (Codon) ስንት የኒውክሊዮታይድ ቤዞችን ይይዛል?',
            back: '3 ቤዞች (Triplet code - ለአንድ አሚኖ አሲድ ኮድ ያደርጋል)።'
          }
        ],
        quizQuestions: [
          {
            id: 'b2-q1',
            question: 'በአርኤንኤ (RNA) ውስጥ የታይሚን (T) ምትክ ሆኖ የሚገኘው የናይትሮጅን ቤዝ የትኛው ነው?',
            options: ['ዩራሲል (Uracil - U)', 'አዴኒን', 'ሳይቶሲን', 'ጉዋኒን'],
            correctIndex: 0,
            explanation: 'በአርኤንኤ ሞለኪውል ውስጥ ከታይሚን ይልቅ ዩራሲል (U) ይገኛል።'
          },
          {
            id: 'b2-q2',
            question: 'በሁለት ሄትሮዛይገስ (Aa × Aa) መካከል በሚደረግ ማዳቀል የሪሴሲቭ (aa) የመውጣት እድል ስንት ነው?',
            options: ['25% (1/4)', '50% (1/2)', '75% (3/4)', '100%'],
            correctIndex: 0,
            explanation: 'በፑኔት ካሬ መሰረት ውጤቱ 1 AA : 2 Aa : 1 aa ስለሆነ የ aa እድል 1/4 (25%) ነው።'
          },
          {
            id: 'b2-q3',
            question: 'የዲኤንኤ ድርብ ሄሊክስ መዋቅርን (Double Helix) በ 1953 ያረጋገጡት እነማን ናቸው?',
            options: ['ዋትሰን እና ክሪክ (Watson & Crick)', 'ዳርዊን እና ዋላስ', 'ሜንደል እና ሞርጋን', 'ፓስተር እና ኮክ'],
            correctIndex: 0,
            explanation: 'ጄምስ ዋትሰን እና ፍራንሲስ ክሪክ የዲኤንኤን ባለሁለት ሰንሰለት ቅርፅ አግኝተዋል።'
          },
          {
            id: 'b2-q4',
            question: 'ሚውቴሽን (Mutation) ማለት ምን ማለት ነው?',
            options: ['በዲኤንኤ የቅደም ተከተል ላይ የሚፈጠር ድንገተኛ ለውጥ', 'የህዋስ መደበኛ እድገት', 'የውሃ ብክነት', 'የፕሮቲን መፈጨት'],
            correctIndex: 0,
            explanation: 'ሚውቴሽን በጄኔቲክ መረጃ ቅደም ተከተል ላይ የሚከሰት ድንገተኛ ቋሚ ለውጥ ነው።'
          }
        ]
      }
    ]
  },

  // 5. English
  {
    id: 'english',
    name: 'English',
    subName: 'English Language',
    accentColor: '#0D9488',
    accentLight: '#F0FDFA',
    accentBorder: '#14B8A6',
    accentBadge: '#115E59',
    topics: [
      {
        id: 'eng-9-10',
        title: 'Active and Passive Voice & Verb Tenses',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Mastering Voice and Grammatical Accuracy',
        lessonContent: [
          'In English grammar, voice indicates whether the subject of a sentence performs or receives the action. In the active voice, the subject acts: "The teacher explained the lesson." In the passive voice, the subject is acted upon: "The lesson was explained by the teacher."',
          'The passive voice is formed using an appropriate tense of the auxiliary verb "to be" followed by the past participle of the main verb (Subject + Be + Past Participle). It is especially useful in scientific and academic writing where the action or result matters more than the actor.',
          'Mastering tenses—such as Simple Present, Past Continuous, and Present Perfect—ensures precision in expressing the timing, continuity, and completion of events.'
        ],
        keyPoints: [
          'Active: Subject performs action (e.g. Dawit wrote a letter)',
          'Passive: Subject receives action (e.g. A letter was written by Dawit)',
          'Formula: Form of "to be" + Past Participle (V3)'
        ],
        flashcards: [
          {
            id: 'e1-fc1',
            front: 'What is the passive form of "Abebe painted the house"?',
            back: '"The house was painted by Abebe."'
          },
          {
            id: 'e1-fc2',
            front: 'When is the passive voice preferred?',
            back: 'When the focus is on the action/object, or the agent is unknown/unimportant.'
          },
          {
            id: 'e1-fc3',
            front: 'What is the past participle (V3) of "write"?',
            back: '"Written" (write - wrote - written).'
          },
          {
            id: 'e1-fc4',
            front: 'Change to passive: "They are building a bridge."',
            back: '"A bridge is being built by them."'
          }
        ],
        quizQuestions: [
          {
            id: 'e1-q1',
            question: 'Identify the passive voice sentence:',
            options: [
              'The national exam was prepared by the ministry.',
              'The students prepared for the exam.',
              'The teacher gave us homework.',
              'We solved all the math problems.'
            ],
            correctIndex: 0,
            explanation: '"The exam was prepared..." uses "was + past participle", placing the receiver first.'
          },
          {
            id: 'e1-q2',
            question: 'Complete the sentence: "By the time we arrived, the train _______."',
            options: ['had already left', 'has left', 'was leaving', 'leaves'],
            correctIndex: 0,
            explanation: 'Past perfect ("had left") is used for an action completed before another past event.'
          },
          {
            id: 'e1-q3',
            question: 'What is the correct passive form of: "Shakespeare wrote Hamlet"?',
            options: [
              'Hamlet was written by Shakespeare.',
              'Hamlet is written by Shakespeare.',
              'Hamlet has been written by Shakespeare.',
              'Shakespeare was written by Hamlet.'
            ],
            correctIndex: 0,
            explanation: 'Simple past passive requires "was + written".'
          },
          {
            id: 'e1-q4',
            question: 'Which sentence uses the Present Perfect tense correctly?',
            options: [
              'She has lived in Addis Ababa for five years.',
              'She lived in Addis Ababa since five years.',
              'She is living in Addis Ababa yesterday.',
              'She had live in Addis Ababa.'
            ],
            correctIndex: 0,
            explanation: '"Has lived" with "for five years" correctly denotes an ongoing duration.'
          }
        ]
      },
      {
        id: 'eng-11-12',
        title: 'Conditional Sentences & Discourse Markers',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Advanced Conditionals and Cohesive Writing',
        lessonContent: [
          'Conditional sentences express hypothetical situations and their consequences. There are four main types: Zero (general truths), First (real future possibilities), Second (unreal/hypothetical present), and Third Conditional (unreal past counterfactuals).',
          'Third conditional follows the pattern: "If + had + past participle, would have + past participle" (e.g., "If I had studied harder, I would have passed the exam"). Inverted conditionals allow formal variation: "Had I known, I would have helped."',
          'Discourse markers and linking devices (such as "furthermore," "consequently," "nevertheless," and "in contrast") create coherence and logical flow in academic essays and argumentative discourse.'
        ],
        keyPoints: [
          '3rd Conditional: If + had + V3, would have + V3 (unreal past)',
          '2nd Conditional: If + past simple, would + base verb (unreal present)',
          'Cohesive markers establish logical contrast, addition, and cause-effect'
        ],
        flashcards: [
          {
            id: 'e2-fc1',
            front: 'What does the Third Conditional express?',
            back: 'An impossible hypothetical situation in the past and its imaginary result.'
          },
          {
            id: 'e2-fc2',
            front: 'Complete: "If I were you, I _______ accept the scholarship."',
            back: '"would" (Second Conditional for hypothetical advice).'
          },
          {
            id: 'e2-fc3',
            front: 'What discourse marker shows direct contrast?',
            back: '"However", "Nevertheless", or "On the contrary".'
          },
          {
            id: 'e2-fc4',
            front: 'What is the inverted form of "If she had arrived earlier"?',
            back: '"Had she arrived earlier..."'
          }
        ],
        quizQuestions: [
          {
            id: 'e2-q1',
            question: '"If they _______ the map, they wouldn\'t have gotten lost."',
            options: ['had checked', 'checked', 'have checked', 'would check'],
            correctIndex: 0,
            explanation: 'The third conditional requires "had checked" in the if-clause.'
          },
          {
            id: 'e2-q2',
            question: 'Which connector best indicates a cause-and-effect relationship?',
            options: ['Consequently', 'However', 'In contrast', 'Meanwhile'],
            correctIndex: 0,
            explanation: '"Consequently" means "as a result of", signaling cause and effect.'
          },
          {
            id: 'e2-q3',
            question: '"If it rains tomorrow, we _______ the outdoor match."',
            options: ['will cancel', 'would cancel', 'would have canceled', 'canceled'],
            correctIndex: 0,
            explanation: 'First conditional (real possibility) uses Simple Present + "will + verb".'
          },
          {
            id: 'e2-q4',
            question: 'Choose the most coherent sentence using a discourse marker:',
            options: [
              'The research was demanding; nevertheless, the team achieved remarkable results.',
              'The research was demanding; because, the team achieved results.',
              'The research was demanding; although, they succeeded.',
              'The research was demanding; therefore, it was easy.'
            ],
            correctIndex: 0,
            explanation: '"Nevertheless" appropriately contrasts the high difficulty with the positive outcome.'
          }
        ]
      }
    ]
  },

  // 6. አማርኛ (Amharic)
  {
    id: 'amharic',
    name: 'አማርኛ',
    subName: 'Amharic Literature',
    accentColor: '#D97706',
    accentLight: '#FFFBEB',
    accentBorder: '#F59E0B',
    accentBadge: '#B45309',
    topics: [
      {
        id: 'amh-9-10',
        title: 'የስነ-ጽሁፍ አይነቶች እና የስነ-ቃል ጥናት',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'የስነ-ጽሁፍ ቅርፆችና የቋንቋ ውበት አጠቃቀም',
        lessonContent: [
          'ስነ-ጽሁፍ የሰውን ልጅ አስተሳሰብ፣ ስሜትና ማህበራዊ ህይወት በውብ ቋንቋ አዋዝቶ የሚገልጽ የጥበብ ዘርፍ ነው። ስነ-ጽሁፍ በሁለት ዋና ዋና ክፍሎች ይከፈላል፡ ስነ-ቃል (ቃል በቃል ከትውልድ ወደ ትውልድ የሚተላለፍ) እና ስነ-ጽሁፍ (በፅሁፍ የሰፈረ)።',
          'የስነ-ቃል ዘውጎች መካከል ተረትና ምሳሌ፣ እንቆቅልሽ፣ ሙሾ፣ የሰርግና የጀግንነት ዘፈኖች፣ እና ቀረርቶ ተጠቃሾች ናቸው። እነዚህም የህዝቡን ታሪክ፣ ባህልና ፍልስፍና ይዘው ይቆያሉ።',
          'በተፃፈው ስነ-ጽሁፍ ውስጥ ደግሞ ግጥም፣ ልቦለድ (ረጅም እና አጭር)፣ ተውኔት (ድራማ) እና የህይወት ታሪክ ዋና ዋናዎቹ ናቸው። ገፀ-ባህሪ፣ ጭብጥ፣ ሴራ እና መቼት የልቦለድ መሰረታዊ አላባውያን ናቸው።'
        ],
        keyPoints: [
          'ስነ-ቃል፡ ከአፍ ወደ አፍ የሚተላለፍ ህያው ቅርስ',
          'የልቦለድ አላባውያን፡ ጭብጥ፣ ሴራ፣ ገፀ-ባህሪ፣ መቼትና ግጭት',
          'የግጥም መገለጫዎች፡ ቤት፣ ምት እና ስንኝ'
        ],
        flashcards: [
          {
            id: 'a1-fc1',
            front: 'ስነ-ቃል (Oral Literature) ምንድን ነው?',
            back: 'ከአንደበት ወደ አንደበት፣ ከትውልድ ወደ ትውልድ በቃል የሚተላለፍ ስነ-ጽሁፍ ነው።'
          },
          {
            id: 'a1-fc2',
            front: 'የልቦለድ ድርጊት ቅደም ተከተል ምን ይባላል?',
            back: 'ሴራ (Plot) ይባላል።'
          },
          {
            id: 'a1-fc3',
            front: 'የተውኔት (Drama) ዋና መገለጫ ምንድን ነው?',
            back: 'በተዋናዮች ድርጊትና ንግግር (መድረክ ላይ) የሚቀርብ የስነ-ጽሁፍ አይነት ነው።'
          },
          {
            id: 'a1-fc4',
            front: 'የስነ-ቃል ምሳሌዎችን ጥቀስ?',
            back: 'ተረት፣ እንቆቅልሽ፣ ቀረርቶ፣ ሙሾ፣ ምሳሌያዊ አነጋገሮች።'
          }
        ],
        quizQuestions: [
          {
            id: 'a1-q1',
            question: 'የአንድ ልቦለድ ዋና መልዕክት ወይም ማዕከላዊ ሀሳብ ምን ይባላል?',
            options: ['ጭብጥ (Theme)', 'ሴራ', 'መቼት', 'ገፀ-ባህሪ'],
            correctIndex: 0,
            explanation: 'ጭብጥ ፀሐፊው ለአንባቢያን ሊያስተላልፍ የፈለገው ዋና ማዕከላዊ ቁምነገር ነው።'
          },
          {
            id: 'a1-q2',
            question: 'ከሚከተሉት ውስጥ የስነ-ቃል ዘውግ ያልሆነው የትኛው ነው?',
            options: ['ረጅም ልቦለድ (Novel)', 'ተረትና ምሳሌ', 'እንቆቅልሽ', 'ቀረርቶና ፉከራ'],
            correctIndex: 0,
            explanation: 'ረጅም ልቦለድ በፅሁፍ የሚዘጋጅ የስነ-ፅሁፍ ዘርፍ እንጂ በቃል የሚተላለፍ አይደለም።'
          },
          {
            id: 'a1-q3',
            question: 'የታሪኩ ድርጊት የተፈፀመበት ቦታና ጊዜ ምን ተብሎ ይጠራል?',
            options: ['መቼት (Setting)', 'ሴራ', 'ግጭት', 'ድባብ'],
            correctIndex: 0,
            explanation: 'መቼት የታሪኩን መቼና የት እንደተከናወነ የሚገልጽ አላባ ነው።'
          },
          {
            id: 'a1-q4',
            question: 'የግጥም አንድ መስመር ምን ይባላል?',
            options: ['ስንኝ', 'ሀረግ', 'ቤት', 'ቅኝት'],
            correctIndex: 0,
            explanation: 'የግጥም ነጠላ መስመር ስንኝ ሲባል፣ ስንኞች ተጣምረው ሀረግና ቤት ይመሰርታሉ።'
          }
        ]
      },
      {
        id: 'amh-11-12',
        title: 'የቅኔ እና የሰምና ወርቅ ጥበብ (Wax and Gold Poetics)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'የጥልቅ ንግግር እና የምስጢር ፍቺ ስልቶች',
        lessonContent: [
          'ሰምና ወርቅ የኢትዮጵያ አንጋፋ የስነ-ግጥምና የንግግር ጥበብ ሲሆን፣ የቋንቋን ባለሁለት ገጽታ ውበት ይገልጻል። ሰም ላይ ላዩን የሚታየውና በቀላሉ የሚሰማው ቀጥተኛ ትርጉም ሲሆን፣ ወርቁ ደግሞ ውስጠ-ወይራ የሆነው ጥልቅና የተሰወረው እውነተኛ ፍቺ ነው።',
          'ሰምና ወርቅ ለመፍጠር ህብረ-ቃል (የሰሙና የወርቁ መገናኛ ድልድይ) ቁልፍ ሚና ይጫወታል። ቅኔ ማህበራዊ ሂስን፣ ፍቅርን፣ ፖለቲካዊ መልዕክትን እና መንፈሳዊ ምስጢራትን በጥበብ ለመግለጽ ያገለግላል።',
          'ለምሳሌ፡ "በሬዬን አረደው ያ ክፉ ገበሬ / ስጋውን በላና ሸጠው ቆዳዬን" በሚለው ውስጥ ሰሙ የበሬው ቆዳ መሸጥ ሲሆን፣ ወርቁ ግን የሰውየው ሚስጥር መገለጡ (መጋለጡ) ነው።'
        ],
        keyPoints: [
          'ሰም፡ ግልጽና ውጫዊ ትርጉም (የመጀመሪያው ገጽታ)',
          'ወርቅ፡ ምስጢራዊና ጥልቅ ፍቺ (እውነተኛው መልዕክት)',
          'ህብረ-ቃል፡ ሁለቱን ትርጉሞች የሚያገናኘው ወሳኝ ቃል'
        ],
        flashcards: [
          {
            id: 'a2-fc1',
            front: 'በሰምና ወርቅ ውስጥ "ሰም" ምንድን ነው?',
            back: 'በግልጽ የሚሰማውና በቀላሉ የሚታየው ላይ ላዩ ትርጉም ነው።'
          },
          {
            id: 'a2-fc2',
            front: 'በሰምና ወርቅ ውስጥ "ወርቅ" ምንድን ነው?',
            back: 'በስውር የተደበቀው እውነተኛና ጥልቅ የቅኔው መልዕክት ነው።'
          },
          {
            id: 'a2-fc3',
            front: 'ህብረ-ቃል (Pivot word) ምን ማለት ነው?',
            back: 'ሁለት የተለያዩ ትርጉሞችን (ሰምና ወርቅ) አጣምሮ የያዘው ቁልፍ ቃል ነው።'
          },
          {
            id: 'a2-fc4',
            front: 'ቅኔ በኢትዮጵያ ባህል ውስጥ ምን ፋይዳ አለው?',
            back: 'የአስተሳሰብ ምጥቀትን፣ ፍልስፍናንና ማህበራዊ ሂስን በስውር ጥበብ ለመግለጽ።'
          }
        ],
        quizQuestions: [
          {
            id: 'a2-q1',
            question: 'በሰምና ወርቅ ቅኔ ውስጥ ሰሙንና ወርቁን አገናኝቶ የሚይዘው ቃል ምን ይባላል?',
            options: ['ህብረ-ቃል', 'መድረሻ ቤት', 'ስንኝ', 'አጣቢ ቃል'],
            correctIndex: 0,
            explanation: 'ህብረ-ቃል ሁለቱንም ትርጉሞች በውስጡ የያዘው የቅኔው ቁልፍ መስቀለኛ መንገድ ነው።'
          },
          {
            id: 'a2-q2',
            question: '"ተማሪው መፅሀፉን አነበበው በደንብ / እውቀቱ እንዲሰፋ ይዞት በልብ" ውስጥ ሰም ምንድን ነው?',
            options: ['የቀጥታው ንባብ ድርጊት', 'የተማሪው ምስጢር', 'የመፅሀፉ ዋጋ', 'የፈተና ውጤት'],
            correctIndex: 0,
            explanation: 'ሰም ሁልጊዜ ግልፅ የሆነው ላይ ላዩ ትርጉም (ንባብ) ነው።'
          },
          {
            id: 'a2-q3',
            question: 'የኢትዮጵያ ቅኔ በዋነኝነት የት ነው የሚቀመረውና የሚማረው?',
            options: ['በአብነት (የቅኔ) ትምህርት ቤቶች', 'በዘመናዊ ኮሌጆች ብቻ', 'በውጭ ሀገር', 'በቤተ-መዘክር'],
            correctIndex: 0,
            explanation: 'የኢትዮጵያ ቅኔ በባህላዊ የአብነት ትምህርት ቤቶች ለዘመናት ሲተላለፍ የኖረ ጥበብ ነው።'
          },
          {
            id: 'a2-q4',
            question: 'የሰምና ወርቅ ዋነኛ የስነ-ጽሁፍ ጠቀሜታ ምንድን ነው?',
            options: ['ሀሳብን በውብ፣ ጥልቅና አሳቢ በሆነ መንገድ መግለጽ', 'ቃላትን ማሳጠር ብቻ', 'የፊደል ቁጥር መቀነስ', 'ድምጽን ማጉላት'],
            correctIndex: 0,
            explanation: 'ሰምና ወርቅ የቋንቋን ውበት እና የሰውን ልጅ የአስተሳሰብ ምጥቀት በረቀቀ መንገድ ያሳያል።'
          }
        ]
      }
    ]
  },

  // 7. ማህበራዊ ሳይንስ / ታሪክ (History & Social Studies)
  {
    id: 'social-studies',
    name: 'ማህበራዊ ሳይንስ',
    subName: 'History & Social Studies',
    accentColor: '#B91C1C',
    accentLight: '#FEF2F2',
    accentBorder: '#DC2626',
    accentBadge: '#991B1B',
    topics: [
      {
        id: 'soc-9-10',
        title: 'የጥንታዊ ኢትዮጵያ ስልጣኔዎች እና ንግድ',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'የአክሱም ስልጣኔ፣ ቴክኖሎጂ እና የንግድ መስመሮች',
        lessonContent: [
          'የአክሱም ስልጣኔ በሰሜን ምስራቅ አፍሪካ እና በቀይ ባህር ቀጠና ውስጥ ከነበሩት ታላላቅ ጥንታዊ ስልጣኔዎች አንዱ ነበር። ከአንደኛው እስከ ሰባተኛው ክፍለ ዘመን በነበረው ዘመን አክሱም በግብርና፣ በብረታ ብረት ስራ፣ በድንጋይ ቅርጽ እና በንግድ ከፍተኛ ደረጃ ደርሳ ነበር።',
          'አክሱም የራሷን የሳንቲም መገበያያ የቀረፀች የመጀመሪያዋ የአፍሪካ ስልጣኔ ስትሆን፣ በአዱሊስ ወደብ በኩል ከሮማ፣ ግሪክ፣ ህንድ እና ባይዛንታይን ጋር ሰፊ የባህር እና የየብስ ንግድ ታካሂድ ነበር። ዝሆኖችን፣ ወርቅን፣ የዝሆን ጥርስን እና ቅመማ ቅመሞችን ትልክ ነበር።',
          'የአክሱም ሀውልቶች፣ የውሃ ማቆሪያ ግድቦች እና የሳባና የግዕዝ ፅሁፎች የስልጣኔውን የቴክኖሎጂ እና የኪነ-ህንፃ ጥበብ ጥልቀት ያሳያሉ።'
        ],
        keyPoints: [
          'የአዱሊስ ወደብ የቀይ ባህር ዋና አለምአቀፍ የንግድ ማዕከል ነበር',
          'አክሱም የራሷን የወርቅ፣ የብርና የነሀስ ሳንቲም ቀርጻለች',
          'ሀውልቶቹና ህንፃዎቹ ያለ ሲሚንቶ በጥበብ የተገነቡ ናቸው'
        ],
        flashcards: [
          {
            id: 's1-fc1',
            front: 'የአክሱም ዋናው አለም አቀፍ የወደብ ከተማ ምን ነበረች?',
            back: 'አዱሊስ (Adulis - በቀይ ባህር ዳርቻ)።'
          },
          {
            id: 's1-fc2',
            front: 'በአክሱም ሳንቲም ላይ ምስላቸው የቀረፀው የመጀመሪያው ንጉስ ማን ነው?',
            back: 'ንጉስ እንድቢስ (King Endubis)።'
          },
          {
            id: 's1-fc3',
            front: 'አክሱም ወደ ውጭ ሀገር የምትልካቸው ዋና ዋና ምርቶች ምን ነበሩ?',
            back: 'የዝሆን ጥርስ፣ ወርቅ፣ ዝባድ፣ ከርቤና እጣን።'
          },
          {
            id: 's1-fc4',
            front: 'የአክሱም ስልጣኔ መዳከም ዋና ምክንያት ምን ነበር?',
            back: 'የቀይ ባህር የንግድ መስመር በአረቦች ቁጥጥር ስር መዋልና የወደቦች መዘጋት።'
          }
        ],
        quizQuestions: [
          {
            id: 's1-q1',
            question: 'የአክሱም መንግስት የራሱን ገንዘብ (ሳንቲም) ማተም የጀመረው በስንተኛው መቶ ክፍለ ዘመን ነው?',
            options: ['በ3ኛው መቶ ክፍለ ዘመን ማብቂያ', 'በ10ኛው መቶ ክፍለ ዘመን', 'በ1ኛው ክፍለ ዘመን ቅድመ ልደት', 'በ16ኛው ክፍለ ዘመን'],
            correctIndex: 0,
            explanation: 'በ3ኛው መቶ ክፍለ ዘመን ማብቂያ በንጉስ እንድቢስ ዘመን ሳንቲም መቅረጽ ተጀመረ።'
          },
          {
            id: 's1-q2',
            question: 'የአክሱም ስልጣኔ ከሚከተሉት ጥንታዊ ሃይሎች ከየትኛው ጋር ግንኙነት አልነበረውም?',
            options: ['የኢንካ ስልጣኔ (ደቡብ አሜሪካ)', 'የሮማ ግዛት', 'የባይዛንታይን ግዛት', 'ጥንታዊት ህንድ'],
            correctIndex: 0,
            explanation: 'ኢንካ በደቡብ አሜሪካ የነበረች ሲሆን አክሱም ግን ከሮማ፣ ባይዛንታይንና ህንድ ጋር ትነግድ ነበር።'
          },
          {
            id: 's1-q3',
            question: 'የአክሱም ታላቁ ሀውልት በምን ዓይነት ድንጋይ ነው የተሰራው?',
            options: ['ነጠላ ባዛልት/ግራናይት ድንጋይ (Monolithic)', 'የተጋገረ ጡብ', 'የእብነ በረድ ድብልቅ', 'የሸክላ አፈር'],
            correctIndex: 0,
            explanation: 'የአክሱም ሀውልቶች ከአንድ ወጥ ግራናይት ድንጋይ ተፈልፍለው የተሰሩ አስደናቂ ቅርሶች ናቸው።'
          },
          {
            id: 's1-q4',
            question: 'ክርስትና ወደ አክሱም በይፋ የገባው በየትኛው ንጉስ ዘመነ መንግስት ነበር?',
            options: ['በንጉስ ኢዛና (King Ezana)', 'በንጉስ ካሌብ', 'በንጉስ ገብረ መስቀል', 'በንጉስ እንድቢስ'],
            correctIndex: 0,
            explanation: 'በ4ኛው መቶ ክፍለ ዘመን አጋማሽ በንጉስ ኢዛና ዘመን ክርስትና ይፋዊ የሀገር ሃይማኖት ሆነ።'
          }
        ]
      },
      {
        id: 'soc-11-12',
        title: 'የዘመናዊ ኢትዮጵያ ታሪክ እና የአድዋ ድል (Battle of Adwa)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'የሉዓላዊነት ጥበቃ እና የአድዋ ፀረ-ቅኝ አገዛዝ ድል',
        lessonContent: [
          'የአድዋ ድል (የካቲት 23 ቀን 1888 ዓ.ም / March 1, 1896) መላው የኢትዮጵያ ህዝብ በአንድነት ተባብሮ የጣሊያንን ቅኝ ገዢ ጦር ድል ያደረገበት ታሪካዊ ክስተት ነው። ይህ ድል ለአፍሪካና ለመላው ጥቁር ህዝቦች የነፃነት ፋና ወጊ ሆኗል።',
          'የጦርነቱ መነሻ የውጫሌ ውል አንቀጽ 17 የትርጉም ልዩነት ነበር። የጣሊያንኛው ቅጂ ኢትዮጵያ የውጭ ግንኙነቷን በጣሊያን በኩል ማድረግ "አለባት" ሲል፣ የአማርኛው ግን "ትችላለች" በሚል ሉዓላዊነትን የሚያስከብር ነበር።',
          'ዳግማዊ አፄ ምኒልክ እና እቴጌ ጣይቱ ብጡል ህዝቡን አስተባብረው ወደ አድዋ በመዝመት ዘመናዊ የታጠቀውን የጄኔራል ባራቲየሪን ጦር በአስደናቂ ወታደራዊ ስልት አሸንፈዋል።'
        ],
        keyPoints: [
          'የአድዋ ድል ቀን፡ የካቲት 23 ቀን 1888 ዓ.ም (March 1, 1896)',
          'የውጫሌ ውል አንቀጽ 17 የጦርነቱ ዋና መንስዔ ነበር',
          'ድሉ የጥቁር ህዝቦች የነፃነት ተምሳሌት (ፓን-አፍሪካኒዝም) መሰረት ሆነ'
        ],
        flashcards: [
          {
            id: 's2-fc1',
            front: 'የአድዋ ጦርነት የተካሄደው መቼ ነበር?',
            back: 'የካቲት 23 ቀን 1888 ዓ.ም (March 1, 1896)።'
          },
          {
            id: 's2-fc2',
            front: 'የአድዋ ጦርነት እንዲቀሰቀስ ያደረገው አወዛጋቢው ሰነድ ምን ይባላል?',
            back: 'የውጫሌ ውል አንቀጽ 17 (Article 17 of the Wuchale Treaty)።'
          },
          {
            id: 's2-fc3',
            front: 'የጣሊያንን ጦር በአድዋ የመራው ጄኔራል ማን ነበር?',
            back: 'ጄኔራል ኦሬስቴ ባራቲየሪ (General Oreste Baratieri)።'
          },
          {
            id: 's2-fc4',
            front: 'የአድዋ ድል ለአለም ጥቁር ህዝቦች ያለው ትርጉም ምንድን ነው?',
            back: 'የፀረ-ቅኝ አገዛዝ፣ የነፃነት እና የፓን-አፍሪካኒዝም ተምሳሌት ነው።'
          }
        ],
        quizQuestions: [
          {
            id: 's2-q1',
            question: 'የውጫሌ ውል የተፈረመው በስንት ዓ.ም ነበር?',
            options: ['በ1881 ዓ.ም (1889 G.C.)', 'በ1888 ዓ.ም', 'በ1870 ዓ.ም', 'በ1900 ዓ.ም'],
            correctIndex: 0,
            explanation: 'የውጫሌ ውል የተፈረመው ግንቦት 1881 ዓ.ም በውጫሌ ከተማ ነበር።'
          },
          {
            id: 's2-q2',
            question: 'በአድዋ ጦርነት ወቅት የመቀሌውን የውሃ ምንጭ በመቆጣጠር ወታደራዊ ብልጫ ያስገኘችው መሪ ማን ነበረች?',
            options: ['እቴጌ ጣይቱ ብጡል', 'ንግስት ዘውዲቱ', 'እቴጌ መነን', 'ንግስት እሌኒ'],
            correctIndex: 0,
            explanation: 'እቴጌ ጣይቱ የመቀሌውን ምሽግ የውሃ መስመር በማስከበብ ጣሊያኖች እንዲሸነፉ ወሳኝ ስልት ተጠቅመዋል።'
          },
          {
            id: 's2-q3',
            question: 'ከአድዋ ድል በኋላ ጣሊያን የኢትዮጵያን ሙሉ ነፃነት ያወቀችበት የሰላም ስምምነት የትኛው ነው?',
            options: ['የአዲስ አበባ ስምምነት (1896)', 'የውጫሌ ውል', 'የለንደን ውል', 'የሮማ ስምምነት'],
            correctIndex: 0,
            explanation: 'በጥቅምት 1896 ጣሊያን በአዲስ አበባ ስምምነት የውጫሌን ውል በመሰረዝ የኢትዮጵያን ነፃነት አምናለች።'
          },
          {
            id: 's2-q4',
            question: 'የአድዋ ድል በዓለም አቀፍ ደረጃ ያመጣው ዋናው ተጽዕኖ ምንድን ነው?',
            options: ['የአውሮፓን የበላይነት አፈ-ታሪክ ማፍረስና የፓን-አፍሪካኒዝም መነሳሳት', 'የንግድ መቀነስ', 'የአፍሪካ ሙሉ በሙሉ በቅኝ መያዝ', 'የባህር ወደቦች መዘጋት'],
            correctIndex: 0,
            explanation: 'ድሉ አውሮፓውያን የማይሸነፉ ናቸው የሚለውን የተሳሳተ አመለካከት በመስበር የአፍሪካን የነጻነት ትግል አነሳስቷል።'
          }
        ]
      }
    ]
  },

  // 8. ኢንፎርሜሽን ኮሙኒኬሽን ቴክኖሎጂ (ICT)
  {
    id: 'ict',
    name: 'ICT',
    subName: 'Information Technology',
    accentColor: '#475569',
    accentLight: '#F8FAFC',
    accentBorder: '#64748B',
    accentBadge: '#334155',
    topics: [
      {
        id: 'ict-9-10',
        title: 'የኮምፒውተር ሃርድዌር፣ ሶፍትዌር እና ኔትወርክ',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'የኮምፒውተር ስርዓት እና የኔትወርክ መሰረቶች',
        lessonContent: [
          'የኮምፒውተር ሲስተም በሁለት ዋና ዋና ክፍሎች የተዋቀረ ነው፡ ሃርድዌር (የሚዳሰሱ አካላት - CPU, RAM, Storage, Input/Output) እና ሶፍትዌር (ኮምፒውተሩ የሚሰራባቸው ፕሮግራሞችና መመሪያዎች)።',
          'ሲፒዩ (CPU) የኮምፒውተሩ አንጎል ሲሆን መመሪያዎችን ያሰላል። ራም (RAM) ጊዜያዊ ማስታወሻ ሲሆን ኮምፒውተሩ ሲጠፋ መረጃው ይጠፋል፤ ሮም (ROM) እና ሃርድ ድራይቭ ግን ቋሚ ማከማቻ ናቸው።',
          'የኮምፒውተር ኔትወርክ መሳሪያዎች መረጃና ግብዓት እንዲጋሩ ያስችላል። በስፋታቸው LAN (የአካባቢ ኔትወርክ ለምሳሌ በት/ቤት) እና WAN (ሰፊ ኔትወርክ ለምሳሌ ኢንተርኔት) ይባላሉ።'
        ],
        keyPoints: [
          'CPU፡ ሴንትራል ፕሮሴሲንግ ዩኒት (የኮምፒውተሩ አንጎል)',
          'RAM (ጊዜያዊ ማህደረ-ትውስታ) vs Hard Drive (ቋሚ ማከማቻ)',
          'LAN (Local Area Network) vs WAN (Wide Area Network)'
        ],
        flashcards: [
          {
            id: 'i1-fc1',
            front: 'የኮምፒውተር አእምሮ (Brain) ተብሎ የሚጠራው ክፍል የትኛው ነው?',
            back: 'CPU (Central Processing Unit) ነው።'
          },
          {
            id: 'i1-fc2',
            front: 'RAM እና ROM ልዩነታቸው ምንድን ነው?',
            back: 'RAM ጊዜያዊ (Volatile) ሲሆን፣ ROM ደግሞ ቋሚ (Non-volatile) ማከማቻ ነው።'
          },
          {
            id: 'i1-fc3',
            front: 'LAN ምን ማለት ነው?',
            back: 'Local Area Network (በአንድ የተወሰነ ህንፃ ወይም ክፍል ውስጥ ያለ ኔትወርክ)።'
          },
          {
            id: 'i1-fc4',
            front: 'የኦፕሬቲንግ ሲስተም (OS) ምሳሌዎችን ጥቀስ?',
            back: 'Windows, Linux, macOS, Android, iOS.'
          }
        ],
        quizQuestions: [
          {
            id: 'i1-q1',
            question: 'ከሚከተሉት ውስጥ የኮምፒውተር መረጃ ማስገቢያ (Input Device) የሆነው የትኛው ነው?',
            options: ['ኪቦርድ እና ማውስ (Keyboard & Mouse)', 'ሞኒተር', 'ፕሪንተር', 'ስፒከር'],
            correctIndex: 0,
            explanation: 'ኪቦርድና ማውስ ተጠቃሚው መረጃና ትዕዛዝ ወደ ኮምፒውተሩ እንዲያስገባ ያገለግላሉ።'
          },
          {
            id: 'i1-q2',
            question: '1 ጊጋባይት (1 GB) ከስንት ሜጋባይት (MB) ጋር እኩል ነው?',
            options: ['1,024 MB', '100 MB', '1,000,000 MB', '10 MB'],
            correctIndex: 0,
            explanation: 'በዲጂታል ስሌት 1 GB = 1024 MB ነው።'
          },
          {
            id: 'i1-q3',
            question: 'የኢንተርኔት ድረ-ገጾችን ለመክፈት የምንጠቀምበት ሶፍትዌር ምን ይባላል?',
            options: ['ዌብ ብሮውዘር (Web Browser)', 'ኦፕሬቲንግ ሲስተም', 'አንቲቫይረስ', 'ስፕረድሺት'],
            correctIndex: 0,
            explanation: 'ብሮውዘሮች (Chrome, Edge, Firefox) ድረ-ገጾችን ለማሰስ የሚያገለግሉ ሶፍትዌሮች ናቸው።'
          },
          {
            id: 'i1-q4',
            question: 'የአይፒ አድራሻ (IP Address) ዋና ተግባር ምንድን ነው?',
            options: ['በኔትወርክ ውስጥ ያለን መሳሪያ በልዩነት መለየት', 'የኮምፒውተር ፍጥነት መጨመር', 'ቫይረስ መከላከል', 'የስክሪን ብርሃን ማስተካከል'],
            correctIndex: 0,
            explanation: 'IP Address እያንዳንዱን በኔትወርክ ላይ የተገናኘ መሳሪያ ለይቶ ለማወቅ የሚያገለግል ቁጥር ነው።'
          }
        ]
      },
      {
        id: 'ict-11-12',
        title: 'የመረጃ ቋት (Databases) እና የሳይበር ደህንነት (Cybersecurity)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'ሪሌሽናል ዳታቤዝ እና የዲጂታል ደህንነት ጥበቃ',
        lessonContent: [
          'የመረጃ ቋት (Database) የተደራጀና ተያያዥነት ያለው መረጃን በስርዓት ለማከማቸት፣ ለማሻሻልና ለመፈለግ የሚያስችል ሲስተም ነው። በብዛት የምንጠቀመው Relational Database (RDBMS) መረጃዎችን በሰንጠረዦች (Tables - Rows & Columns) መልክ ያስቀምጣል።',
          'SQL (Structured Query Language) ዳታቤዝን ለማዘዝ የምንጠቀምበት ቋንቋ ሲሆን፣ SELECT፣ INSERT፣ UPDATE እና DELETE መሰረታዊ ትዕዛዞች ናቸው። ፕራይማሪ ኪይ (Primary Key) በእያንዳንዱ ረድፍ ያለን መረጃ በልዩነት ለመለየት ያገለግላል።',
          'የሳይበር ደህንነት (Cybersecurity) ኮምፒውተሮችን፣ ሰርቨሮችን እና ኔትወርኮችን ከተንኮል-አዘል ጥቃቶች (Malware, Phishing, Ransomware) የመጠበቅ ጥበብ ነው። የይለፍ ቃል ጥንካሬ፣ ኢንክሪፕሽን (Encryption) እና ባለ ሁለት ደረጃ ማረጋገጫ (2FA) ወሳኝ የጥበቃ መንገዶች ናቸው።'
        ],
        keyPoints: [
          'SQL፡ SELECT, INSERT, UPDATE, DELETE ትዕዛዞች',
          'Primary Key፡ እያንዳንዱን ሪከርድ በልዩነት የሚለይ መታወቂያ',
          'የሳይበር ደህንነት ምሶሶዎች፡ ሚስጥራዊነት (Confidentiality)፣ ታማኝነት (Integrity) እና ዝግጁነት (Availability)'
        ],
        flashcards: [
          {
            id: 'i2-fc1',
            front: 'በዳታቤዝ ውስጥ ፕራይማሪ ኪይ (Primary Key) ምንድን ነው?',
            back: 'በሰንጠረዥ ውስጥ እያንዳንዱን ረድፍ (Record) በልዩነት የሚለይ የማይደገም መለያ ነው።'
          },
          {
            id: 'i2-fc2',
            front: 'ፊሺንግ (Phishing) ምን ዓይነት የሳይበር ጥቃት ነው?',
            back: 'ተጠቃሚዎችን በማታለል የይለፍ ቃል ወይም የባንክ መረጃ ለመስረቅ የሚላክ ሀሰተኛ መልዕክት ነው።'
          },
          {
            id: 'i2-fc3',
            front: 'ከዳታቤዝ መረጃን ለማውጣት/ለመምረጥ የሚረዳው የ SQL ትዕዛዝ የትኛው ነው?',
            back: 'SELECT ትዕዛዝ (ለምሳሌ፡ SELECT * FROM Students;)'
          },
          {
            id: 'i2-fc4',
            front: 'ኢንክሪፕሽን (Encryption) ምን ማለት ነው?',
            back: 'መረጃ ያልተፈቀደለት ሰው እንዳያነበው ወደ ሚስጥራዊ ኮድ መቀየር ነው።'
          }
        ],
        quizQuestions: [
          {
            id: 'i2-q1',
            question: 'በ SQL ውስጥ አዲስ መረጃ ወደ ሰንጠረዥ ለማስገባት የምንጠቀመው ትዕዛዝ የትኛው ነው?',
            options: ['INSERT INTO', 'SELECT', 'UPDATE', 'CREATE ROW'],
            correctIndex: 0,
            explanation: 'INSERT INTO አዳዲስ ሪከርዶችን ወደ ዳታቤዝ ቴብል ለማስገባት ያገለግላል።'
          },
          {
            id: 'i2-q2',
            question: 'የ CIA Triad በሳይበር ደህንነት ውስጥ ምንን ያመለክታል?',
            options: [
              'Confidentiality, Integrity, Availability',
              'Computer, Internet, Access',
              'Code, Information, Authentication',
              'Cyber, Infrastructure, Algorithm'
            ],
            correctIndex: 0,
            explanation: 'ሚስጥራዊነት (Confidentiality)፣ ትክክለኛነት (Integrity) እና ተደራሽነት (Availability) የደህንነት መሰረቶች ናቸው።'
          },
          {
            id: 'i2-q3',
            question: 'ባለ ሁለት ደረጃ ማረጋገጫ (Two-Factor Authentication - 2FA) ለምን ይጠቅማል?',
            options: [
              'የመለያ ደህንነትን ለማጠናከር ተጨማሪ ማረጋገጫ ኮድ በመጠየቅ',
              'የኢንተርኔት ፍጥነት ለመጨመር',
              'የስልክ ባትሪ ለመቆጠብ',
              'የይለፍ ቃል እንዳያስፈልግ ለማድረግ'
            ],
            correctIndex: 0,
            explanation: '2FA የይለፍ ቃል ቢሰረቅ እንኳን ሁለተኛ ማረጋገጫ ኮድ በመጠየቅ አካውንትን ይጠብቃል።'
          },
          {
            id: 'i2-q4',
            question: 'ፋየርዎል (Firewall) በኔትወርክ ውስጥ ምን ስራ ይሰራል?',
            options: [
              'ገቢና ወጪ የኔትወርክ ትራፊክን በመቆጣጠር ያልተፈቀደ መዳረሻን መከልከል',
              'ኮምፒውተር እንዳይሞቅ ማቀዝቀዝ',
              'የጠፉ ፋይሎችን መመለስ',
              'የኤሌክትሪክ ሃይል ማስተካከል'
            ],
            correctIndex: 0,
            explanation: 'ፋየርዎል የተፈቀደና ያልተፈቀደ የኔትወርክ ግንኙነትን የሚቆጣጠር የደህንነት ጋሻ ነው።'
          }
        ]
      }
    ]
  }
];
