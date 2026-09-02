import { Subject } from '../types';

export const curriculumAmharic: Subject[] = [
  // 1. ሂሳብ (Mathematics)
  {
    id: 'math',
    name: 'ሂሳብ',
    subName: 'Mathematics',
    stream: 'common',
    curriculumBadge: 'አዲሱ ስርዓተ-ትምህርት',
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
        competencies: [
          'የኳድራቲክ እኩልዮሽን መደበኛ ቅርጽ (ax² + bx + c = 0) መለየትና መግለጽ',
          'በፋክተራይዜሽን፣ ሙሉ ካሬ በመስራት እና በኳድራቲክ ፎርሙላ እኩልዮሾችን መፍታት',
          'የዲሰክሪሚናንት (Discriminant) ዋጋን በመጠቀም የመልሶችን አይነትና ብዛት መተንበይ',
          'በገሃዱ አለም የሚያጋጥሙ የቦታና የፍጥነት ስሌቶችን በኳድራቲክ እኩልዮሽ መቅረጽ'
        ],
        practicalActivity: {
          title: 'የፓራቦላ ግራፍ እና የመስመር አቀማመጥ ተግባራዊ ስሌት (Graphing Parabolic Curves)',
          materials: ['የግራፍ ደብተር (Graph Paper)', 'እርሳስና መስመሪያ', 'ሳይንቲፊክ ካልኩሌተር'],
          steps: [
            '1. ለ f(x) = x² - 4x + 3 የተሰኙ የ x ዋጋዎችን (-1, 0, 1, 2, 3, 4, 5) ሰንጠረዥ አዘጋጅ።',
            '2. ተጓዳኝ የ y ዋጋዎችን አስላ። (y = f(x))።',
            '3. ነጥቦቹን በግራፍ ወረቀት ላይ አሳርፍና ለስላሳ የፓራቦላ ኩርባ ሳል።',
            '4. ግራፉ የ x-ዘንግን የሚቆርጥባቸውን ነጥቦች (x-intercepts) ከእኩልዮሹ መልሶች ጋር አነጻጽር።'
          ],
          observation: 'ግራፉ የ x-ዘንግን በ x=1 እና x=3 ላይ ይቆርጣል፤ ይህም (x-1)(x-3)=0 ከሚለው ትክክለኛ መልስ ጋር ይስማማል።'
        },
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
        competencies: [
          'የቅጽበታዊ የለውጥ ፍጥነትን በሊሚት (Limits) ቀመር መግለጽና ማስላት',
          'የፓወር ህግ፣ የብዜት ህግ እና የሰንሰለት ህግን በመጠቀም የተወሳሰቡ ፈንክሽኖች ዴሪቫቲቭ መፈለግ',
          'የፈንክሽኖችን ከፍተኛ (Max) እና ዝቅተኛ (Min) ነጥቦች በማስላት ለኦፕቲማይዜሽን ችግሮች መፍትሄ መስጠት',
          'ካልኩለስን በኢኮኖሚክስ (Marginal Cost/Revenue) እና በፊዚክስ (Velocity/Acceleration) ውስጥ መተግበር'
        ],
        practicalActivity: {
          title: 'የታንጀንት መስመር ቁልቁለት ስሌት እና የዴሪቫቲቭ ተግባራዊ ማረጋገጫ (Tangent Slope Experiment)',
          materials: ['የግራፍ ሶፍትዌር ወይም የግራፍ ደብተር', 'መስመሪያ', 'ስሌት ሰንጠረዥ'],
          steps: [
            '1. f(x) = x² ግራፍ ላይ በ (2, 4) ነጥብ ዙሪያ የሴካንት መስመሮችን ስሎፕ ከ x=2.5, x=2.1, x=2.01 ጋር አስላ።',
            '2. የለውጥ ምጣኔው ወደ ምን ቁጥር እንደሚጠጋ (limit) ተመልከት።',
            '3. በፎርሙላው f\'(2) = 2(2) = 4 መሆኑን አረጋግጥ።'
          ],
          observation: 'የሴካንት መስመሮች ቁልቁለት ወደ 4 እየተቃረበ ይመጣል፤ ይህም የታንጀንቱ ትክክለኛ ስሎፕ 4 መሆኑን በተግባር ያረጋግጣል።'
        },
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
    stream: 'natural',
    curriculumBadge: 'አዲሱ ስርዓተ-ትምህርት',
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
        competencies: [
          'የኒውተንን ሶስት የእንቅስቃሴ ህጎች በዕለት ተዕለት ህይወት ምሳሌዎች ማብራራት',
          'የተጣራ ኃይል (Net Force)፣ ክብደት (Mass) እና ማጣደፍ (Acceleration) ስሌቶችን F = ma በመጠቀም መፍታት',
          'ኢነርሺያን (Inertia) እና የግጭት ኃይልን (Friction) በተግባር መፈተሽ',
          'የድርጊት እና አፀፋ (Action-Reaction) ጥንዶችን በተለያዩ አካላት ላይ መለየት'
        ],
        practicalActivity: {
          title: 'የኒውተን ሁለተኛ ህግ የላብራቶሪ ሙከራ (Investigating F = ma using Trolleys)',
          materials: ['ትንሽ ጋሪ (Dynamic Trolley)', 'የተለያዩ መመጠኛ ክብደቶች (Slotted masses)', 'የጊዜ መለኪያ (Ticker Timer ወይም Stopwatch)', 'ተዳፋት ጠረጴዛ (Frictionless track)'],
          steps: [
            '1. ጋሪውን በጠረጴዛው ላይ አስቀምጠህ በተለያዩ ኃይሎች (1N, 2N, 3N) እንዲጎተት አድርግ።',
            '2. የጋሪውን ማጣደፍ (a) በእያንዳንዱ ሙከራ ላይ ለካ።',
            '3. ኃይል እና ማጣደፍን የሚያሳይ ግራፍ ሳል።'
          ],
          observation: 'በጋሪው ላይ የተጫነው ኃይል በእጥፍ ሲጨምር ማጣደፉም በእጥፍ ይጨምራል፤ ይህም F ከ a ጋር ቀጥታ እንደሚመጣጠን ያረጋግጣል።'
        },
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
        competencies: [
          'የፋራዳይ እና የሌንዝ ህጎችን በመጠቀም የተፈጠረውን የኤሌክትሮሞቲቭ ኃይል (EMF) ማስላት',
          'የሞገድ እኩልዮሽ (v = f·λ) በመጠቀም የብርሃን እና የድምፅ ፍጥነቶችን መተንተን',
          'የትራንስፎርመሮችን የአሰራር ቀመር (Vp/Vs = Np/Ns) በሃይል ማስተላለፊያ ስርዓት ውስጥ መተግበር',
          'የኤሌክትሮማግኔቲክ ስፔክትረምን ክፍሎች እና በህክምናና ኮሙኒኬሽን ውስጥ ያላቸውን ጥቅም መዘርዘር'
        ],
        practicalActivity: {
          title: 'የኤሌክትሮማግኔቲክ ኢንዳክሽን ሙከራ (Faraday\'s Induction with Coils & Magnet)',
          materials: ['የመዳብ ሽቦ መጠምጠሚያ (Solenoid Coil)', 'ኃይለኛ ባር ማግኔት (Bar Magnet)', 'ጋልቫኖሜትር (Sensitive Galvanometer)'],
          steps: [
            '1. የመዳብ ሽቦውን ጫፎች ከጋልቫኖሜትሩ ጋር አገናኝ።',
            '2. ማግኔቱን በፍጥነት ወደ መጠምጠሚያው ውስጥ አስገባና ጋልቫኖሜትሩ የሚያሳየውን እይ።',
            '3. ማግኔቱን ሳይንቀሳቀስ በመጠምጠሚያው ውስጥ አቁመህ ተመልከት።',
            '4. ማግኔቱን በፍጥነት ወደ ውጪ አውጣ።'
          ],
          observation: 'ማግኔቱ ሲንቀሳቀስ ብቻ ጋልቫኖሜትሩ ወደ ግራና ቀኝ ይወዛወዛል፤ ሲቆም ግን ዜሮ ይሆናል። ይህም ከረንት የሚፈጠረው ማግኔቲክ ፍላክስ ሲለወጥ ብቻ መሆኑን ያረጋግጣል።'
        },
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
    stream: 'natural',
    curriculumBadge: 'አዲሱ ስርዓተ-ትምህርት',
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
        competencies: [
          'የአተም ንዑሳን ቅንጣቶች (ፕሮቶን፣ ኒውትሮን፣ ኤሌክትሮን) አቀማመጥ እና ባህሪያትን መለየት',
          'የቦር እና የኳንተም ሜካኒካል ሞዴልን በመጠቀም የኤሌክትሮን ውቅረትን (Electronic Configuration) መጻፍ',
          'በአዮኒክ፣ ኮቫለንት እና ሜታሊክ ትስስር መካከል ያለውን ልዩነት በንጥረ ነገሮች ባህሪ ማብራራት',
          'የፒሪዮዲክ ሰንጠረዥ ወቅታዊ አዝማሚያዎችን (Electronegativity, Ionization Energy) መተንተን'
        ],
        practicalActivity: {
          title: 'የነበልባል ሙከራ ለብረታ ብረት አየኖች (Flame Test for Metal Cations)',
          materials: ['የኒክሮም ሽቦ (Nichrome wire)', 'የቡንሰን በርነር (Bunsen Burner)', 'የተለያዩ የጨው ውህዶች (NaCl, KCl, CuCl₂, CaCl₂)', 'ቀጭን ሃይድሮክሎሪክ አሲድ (Dilute HCl)'],
          steps: [
            '1. ሽቦውን በ HCl በማጠብ በነበልባሉ ላይ አፅዳ።',
            '2. ሽቦውን በ NaCl ጨው ነክረህ በነበልባሉ አናት ላይ አስቀምጥ፤ የሚታየውን ቀለም መዝግብ።',
            '3. ለ KCl (ፖታሲየም) እና CuCl₂ (መዳብ) ሙከራውን ድገም፤ ቀለማቸውን ተመልከት።'
          ],
          observation: 'ሶዲየም ደማቅ ቢጫ ነበልባል፣ ፖታሲየም ሊላክ (ወይን ጠጅ) ነበልባል፣ እንዲሁም መዳብ አረንጓዴ-ሰማያዊ ነበልባል ይፈጥራሉ። ይህም የኤሌክትሮን ኢነርጂ ሽግግርን ያሳያል።'
        },
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
        competencies: [
          'የኢኩሊብሪየም ቋሚን (Kc እና Kp) ከተሰጡ ሞላሪቲዎች ማስላትና መተንበይ',
          'የሊ ሻቴሊየርን መርህ በኢንዱስትሪ ኬሚካል ምርቶች (ለምሳሌ የሃበር ሂደት ለአሞኒያ) ላይ መተግበር',
          'የኢንታልፒ (ΔH)፣ ኢንትሮፒ (ΔS) እና የጊብስ ፍሪ ኢነርጂ (ΔG) ስሌቶችን በመጠቀም የስፖንታኒቲ ሁኔታን መወሰን',
          'የአሲድ-ቤዝ ኢኩሊብሪየም እና የባፈር (Buffer) መፍትሄዎችን ፒኤች (pH) ማስላት'
        ],
        practicalActivity: {
          title: 'የሊ ሻቴሊየር መርህ ተግባራዊ ማረጋገጫ (Testing Le Chatelier\'s Principle with Cobalt Chloride)',
          materials: ['የኮባልት ክሎራይድ መፍትሄ [Co(H₂O)₆]²⁺ (ሮዝ)', 'የተከማቸ ሃይድሮክሎሪክ አሲድ (HCl)', 'የሙቅ ውሃ ባዝን (Hot water bath)', 'የበረዶ ባዝን (Ice bath)', 'የሙከራ ቱቦዎች (Test tubes)'],
          steps: [
            '1. በሙከራ ቱቦ ውስጥ ሮዝ የሆነውን [Co(H₂O)₆]²⁺ መፍትሄ አፍስስ።',
            '2. ጥቂት ጠብታ HCl ጨምር፤ መፍትሄው ወደ ሰማያዊ [CoCl₄]²⁻ ሲቀየር እይ።',
            '3. ቱቦውን በሙቅ ውሃ ውስጥ አስቀምጠው (ሰማያዊነቱ ይጠነክራል)፤ ከዚያም በበረዶ ውሃ ውስጥ አስቀምጠው (ወደ ሮዝ ይመለሳል)።'
          ],
          observation: 'የሙቀት መጨመር ኢንዶተርሚክ የሆነውን ወደ ፊት ግብረ-መልስ (ሰማያዊ) ያበረታታል፤ ቅዝቃዜ ደግሞ ወደ ኋላ (ሮዝ) ይመልሰዋል። ይህም የሊ ሻቴሊየርን መርህ ያረጋግጣል።'
        },
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
    stream: 'natural',
    curriculumBadge: 'አዲሱ ስርዓተ-ትምህርት',
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
        competencies: [
          'የህዋስ ንድፈ-ሀሳብን (Cell Theory) ዋና ዋና መርሆዎች መዘርዘር',
          'በእጽዋት እና እንስሳት ህዋሳት መካከል ያሉትን መዋቅራዊ ልዩነቶች በማይክሮስኮፕ ስር መለየት',
          'የህዋስ ኦርጋኔሎችን (Mitochondria, Chloroplast, Ribosome) ተግባር መግለጽ',
          'በህዋስ ሽፋን በኩል የሚካሄዱ የቁስ ዝውውሮችን (Osmosis, Diffusion, Active Transport) መተንተን'
        ],
        practicalActivity: {
          title: 'የሽንኩርት ልጣጭ ህዋስን በማይክሮስኮፕ መመርመር (Microscopic Examination of Onion Epidermal Cells)',
          materials: ['ቀላል ኮምፓውንድ ማይክሮስኮፕ', 'የሽንኩርት ልጣጭ', 'የአዮዲን መፍትሄ (Iodine stain)', 'የመስታወት ስላይድና ከቨር ስሊፕ (Glass slide & Coverslip)', 'መቆንጠጫ (Forceps)'],
          steps: [
            '1. ከመስታወቱ ስላይድ ላይ አንድ ጠብታ ውሃ አድርግና ቀጭኑን የሽንኩርት ልጣጭ በላዩ ላይ አንጥፍ።',
            '2. አንድ ጠብታ የአዮዲን መፍትሄ ጨምረህ የአየር አረፋ እንዳይገባ በከቨር ስሊፕ በጥንቃቄ ሸፍን።',
            '3. በዝቅተኛ (4x/10x) እና ከዚያም በከፍተኛ (40x) ማጉያ ስር ተመልከት፤ የህዋስ ግድግዳውንና ኒውክሊየሱን ሳል።'
          ],
          observation: 'በአዮዲን ምክንያት ጎልተው የሚታዩ አራት ማዕዘን ቅርፅ ያላቸው የእጽዋት ህዋሶች፣ ወፍራም የህዋስ ግድግዳ እና ደማቅ ክብ ኒውክሊየስ በግልጽ ይታያሉ።'
        },
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
        competencies: [
          'የሜንደልን የውርስ ህጎች (Law of Segregation & Independent Assortment) በፑኔት ካሬ መተንተን',
          'የዲኤንኤ ድርብ ሄሊክስ መዋቅር እና የናይትሮጅን ቤዝ ማጣመር ህግን (A-T, G-C) መተግበር',
          'የፕሮቲን ውህደት ሂደቶችን (Transcription እና Translation) ደረጃ በደረጃ ማስረዳት',
          'የጄኔቲክ ምህንድስና (Genetic Engineering) እና ባዮቴክኖሎጂ በግብርና እና ህክምና ውስጥ ያላቸውን ፋይዳ መገምገም'
        ],
        practicalActivity: {
          title: 'ዲኤንኤን ሙዝ ወይም እንጆሪ በመጠቀም የማውጣት ተግባራዊ ሙከራ (DNA Extraction Experiment)',
          materials: ['የበሰለ ሙዝ ወይም እንጆሪ', 'ፈሳሽ ሳሙና', 'ጨው (NaCl)', 'ቀዝቃዛ ኤታኖል / አልኮል (Chilled 95% Ethanol)', 'የቡና ማጣሪያ ወረቀት ወይም ጨርቅ'],
          steps: [
            '1. ሙዙን በፕላስቲክ ፌስታል ውስጥ ከጨውና ፈሳሽ ሳሙና ጋር በመጨፍለቅ የህዋስ ሽፋኑን ሰባብር።',
            '2. ድብልቁን በማጣሪያ ወረቀት አጥልለህ ወደ ብርጭቆ ውስጥ አፍስስ።',
            '3. ቀዝቃዛ አልኮል በብርጭቆው ጠርዝ በኩል ቀስ አድርገህ ጨምር፤ በሁለቱ ፈሳሾች መገናኛ ላይ የሚፈጠረውን ነጭ ክር መሰል ዲኤንኤ በስንጥር አውጣ።'
          ],
          observation: 'በአልኮሉ ንብርብር ላይ ነጭ፣ የዝልግልግ ክር መልክ ያለው የሙዙ ኑክሊክ አሲድ (DNA) ተንሳፎ በዓይን ይታያል።'
        },
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
    stream: 'common',
    curriculumBadge: 'አዲሱ ስርዓተ-ትምህርት',
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
        competencies: [
          'Transform active sentences into passive voice across various tenses',
          'Apply the passive voice appropriately in scientific and journalistic reporting',
          'Demonstrate correct usage of present perfect and past continuous tenses in context',
          'Write cohesive paragraphs demonstrating grammatical accuracy and varied sentence structure'
        ],
        practicalActivity: {
          title: 'News Report Drafting and Voice Transformation Workshop',
          materials: ['Sample newspaper excerpt', 'Highlighter pens', 'Writing pad'],
          steps: [
            '1. Read a short science report and identify all passive voice constructions.',
            '2. Rewrite an active event description into formal passive voice.',
            '3. Exchange drafts with a peer to verify auxiliary "be" verb agreement with subject.'
          ],
          observation: 'Passive constructions like "A new solar station was inaugurated..." focus reader attention on the achievement rather than the agent.'
        },
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
        competencies: [
          'Construct complex conditional sentences (Zero, First, Second, Third, and Mixed)',
          'Utilize inverted conditionals ("Had I known...") in formal academic discourse',
          'Deploy varied discourse markers (consequently, nevertheless, moreover) for essay cohesion',
          'Analyze rhetorical strategies in persuasive and argumentative texts'
        ],
        practicalActivity: {
          title: 'Debate and Argumentative Speech Construction',
          materials: ['Debate topic prompt cards', 'Discourse marker cheat-sheet', 'Stopwatch'],
          steps: [
            '1. Select a stance on an educational policy topic.',
            '2. Construct a 2-minute argumentative statement incorporating at least two conditional arguments and three formal discourse markers.',
            '3. Present to peers and evaluate adherence to cohesive flow.'
          ],
          observation: 'Using transitions like "Furthermore" and "Had the policy been implemented differently..." enhances rhetorical persuasiveness.'
        },
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
    stream: 'common',
    curriculumBadge: 'አዲሱ ስርዓተ-ትምህርት',
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
        competencies: [
          'የስነ-ቃል ዘውጎችን (ተረት፣ ምሳሌያዊ አነጋገር፣ እንቆቅልሽ፣ ሙሾ) መለየትና ማድነቅ',
          'የልቦለድ አላባውያንን (ጭብጥ፣ ሴራ፣ ገፀ-ባህሪ፣ መቼት) በንባብ ጽሁፍ ውስጥ መተንተን',
          'የግጥም ቅርጾችን፣ ቤት መድፊያዎችን እና ምት መለየት',
          'ባህላዊ እሴቶችን እና የታሪክ አሻራዎችን ከስነ-ቃል መረጃዎች ማመንጨት'
        ],
        practicalActivity: {
          title: 'የአካባቢ የስነ-ቃል ቅርሶች ጥንቅር እና የተውኔት ዝግጅት (Oral Tradition Field Collection)',
          materials: ['የድምጽ መቅረጫ ወይም ደብተር', 'የስነ-ጽሁፍ ማስታወሻ'],
          steps: [
            '1. ከአካባቢው አዋቂዎች 3 ምሳሌያዊ አነጋገሮችን እና 1 አጭር ተረት ሰብስብ።',
            '2. የተሰበሰበውን ተረት ወደ ባለ 2 ገፀ-ባህሪ አጭር መድረክ ተውኔት (Dialogue) ቀይር።',
            '3. በክፍል ውስጥ የተውኔቱን ንባብ በተገቢው የድምጽ ማስተካከያ አቅርብ።'
          ],
          observation: 'ስነ-ቃልን ወደ ተውኔት መቀየር የቋንቋን ተለዋዋጭነትና የገፀ-ባህሪ አሳሳል ክህሎትን ያዳብራል።'
        },
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
        competencies: [
          'የሰምና ወርቅ ጽንሰ-ሀሳብንና የህብረ-ቃልን ወሳኝ ሚና መተንተን',
          'ባህላዊ የቅኔ ስንኞችን ሰምና ወርቅ ለይቶ መተርጎም',
          'የቋንቋ ምስጢራዊና ውበታዊ አጠቃቀምን በማህበራዊ ሂስ ጽሁፎች ውስጥ ማጎልበት',
          'የግዕዝ እና የአማርኛ ቅኔያዊ ቅርሶችን ታሪካዊ ፋይዳ መገምገም'
        ],
        practicalActivity: {
          title: 'የሰምና ወርቅ ግጥም ቅንብር አውደ ጥናት (Wax and Gold Composition Workshop)',
          materials: ['የቅኔ ማመሳከሪያ መጽሐፍ', 'ደብተርና እስክሪብቶ'],
          steps: [
            '1. ባለ ሁለት ትርጉም ያለውን አንድ ህብረ-ቃል ምረጥ (ለምሳሌ፡ "ተከበረ" ወይም "አለቀሰ")።',
            '2. ህብረ-ቃሉን መሰረት በማድረግ ግልጽ ሰም ያለው ባለ ሁለት ስንኝ ግጥም ጻፍ።',
            '3. የጓደኛህን ግጥም አንብበህ የተሰወረውን ወርቅ ፈልገህ አውጣ።'
          ],
          observation: 'ህብረ-ቃሉ በዐውደ-ጽሁፉ ላይ ተመስርቶ አንዱን ቃል ወደ ሁለት ፍጹም የተለያዩ ትርጉሞች የመቀየር ከፍተኛ ምናባዊ ኃይል አለው።'
        },
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
    stream: 'social',
    curriculumBadge: 'አዲሱ ስርዓተ-ትምህርት',
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
        competencies: [
          'የአክሱም ስልጣኔ የፖለቲካ፣ ኢኮኖሚና ቴክኖሎጂ እድገት ደረጃዎችን መተንተን',
          'የቀይ ባህር እና የህንድ ውቅያኖስ ጥንታዊ የንግድ መስመሮችን በካርታ ላይ ማሳየት',
          'የሳንቲም ቀረጻ፣ ሀውልቶች ግንባታ እና የውሃ ማቆሪያ ግድቦችን ኢንጂነሪንግ ማድነቅ',
          'የውጭ ግንኙነቶች እና የአክሱም መዳከም ምክንያቶችን መገምገም'
        ],
        practicalActivity: {
          title: 'የጥንታዊ ንግድ መስመሮች እና የአክሱም ግዛት ታሪካዊ ካርታ ስራ (Historical Map Drawing)',
          materials: ['የአፍሪካ ቀንድ እና መካከለኛው ምስራቅ ረቂቅ ካርታ', 'የቀለም እርሳሶች', 'የታሪክ አትላስ'],
          steps: [
            '1. አዱሊስን፣ አክሱምን፣ እና የቀይ ባህር ወደቦችን በካርታው ላይ ለይተህ ምልክት አድርግ።',
            '2. ከአዱሊስ ወደ ሮማ፣ ህንድ እና ባይዛንታይን የሚወስዱ የባህር መስመሮችን በቀይ ቀለም፣ የየብስ መስመሮችን በአረንጓዴ ቀለም አስምር።',
            '3. ወደ ውጭ የሚላኩ ዋና ዋና የንግድ ቁሳቁሶችን (ዝሆን ጥርስ፣ ወርቅ፣ ከርቤ) በምስል መልክ አስቀምጥ።'
          ],
          observation: 'አክሱም በጂኦግራፊያዊ አቀማመጧ ምክንያት የአለም የንግድ እና የባህል መገናኛ ማዕከል እንደነበረች በካርታው ላይ በግልጽ ይታያል።'
        },
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
        competencies: [
          'የአድዋ ጦርነት ታሪካዊ መንስኤዎችን (የውጫሌ ውል አንቀጽ 17) በሰነድ ማስረጃ መተንተን',
          'የዳግማዊ ምኒልክ እና የእቴጌ ጣይቱ ብጡል ወታደራዊ እና ዲፕሎማሲያዊ ስልቶችን መገምገም',
          'የመላው ኢትዮጵያውያን ህብረት ለአድዋ ድል ያስገኘውን ፋይዳ ማድነቅ',
          'የአድዋ ድል ለአለም አቀፉ የጥቁር ህዝቦች የነጻነት ንቅናቄ (Pan-Africanism) የፈጠረውን ተነሳሽነት ማብራራት'
        ],
        practicalActivity: {
          title: 'የታሪክ ሰነድ ትንተና እና የአድዋ ጦርነት የታክቲክ ሞዴል (Treaty Analysis & Tactical Simulation)',
          materials: ['የውጫሌ ውል የአማርኛ እና የጣሊያንኛ ቅጂዎች ንጽጽር ጽሁፍ', 'የአድዋ ተራሮች ካርታ'],
          steps: [
            '1. በአንቀጽ 17 ላይ "ይችላሉ" እና "ይገባቸዋል (dovere)" የሚሉትን ቃላት የትርጉም ልዩነት መርምር።',
            '2. የጣሊያንን ሶስት አምዶች (Columns) እና የኢትዮጵያን አቀማመጥ በተራሮቹ ካርታ ላይ አስቀምጥ።',
            '3. የእቴጌ ጣይቱ የመቀሌውን የውሃ መስመር የመዝጋት ስልታዊ ውሳኔ ውጤት ተወያዩበት።'
          ],
          observation: 'የቋንቋ ትርጉም ተንኮል እንዴት ወደ ሉዓላዊነት ጥያቄ እንደተቀየረና በወታደራዊ አንድነት እንደተቀለበሰ በግልጽ ይመሰክራል።'
        },
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
    stream: 'common',
    curriculumBadge: 'አዲሱ ስርዓተ-ትምህርት',
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
        competencies: [
          'የኮምፒውተር ሃርድዌር አሃዶችን (CPU, RAM, Storage, I/O) መለየትና ተግባራቸውን መግለጽ',
          'የሲስተም እና አፕሊኬሽን ሶፍትዌሮችን ልዩነት መተንተን',
          'ቀላል የኮምፒውተር ኔትወርክ (LAN) አወቃቀርና የአይፒ አድራሻ (IP Addressing) መርሆዎችን መረዳት',
          'ደህንነቱ የተጠበቀ የኢንተርኔት እና የዲጂታል መሳሪያዎች አጠቃቀምን መተግበር'
        ],
        practicalActivity: {
          title: 'ቀላል የኔትወርክ ግንኙነት እና የአይፒ አድራሻ ማዋቀር (Network Configuration Workshop)',
          materials: ['ኮምፒውተር ከ Command Prompt/Terminal ጋር', 'የኔትወርክ ገመድ (Ethernet Cable)'],
          steps: [
            '1. Command Prompt በመክፈት "ipconfig" (ወይም ifconfig) በመተየብ የኮምፒውተርህን IP እና MAC Address መዝግብ።',
            '2. "ping 8.8.8.8" ወይም የትምህርት ቤቱን ራውተር አይፒ በመፃፍ የኔትወርክ መዘግየትን (Packet Loss & Latency) ተመልከት።',
            '3. በፋይል ኤክስፕሎረር ውስጥ አንድ ፎልደር ለኔትወርክ ተጠቃሚዎች ሼር (Share) አድርግ።'
          ],
          observation: 'ትክክለኛ አይፒ ሲዋቀር መሳሪያዎች መረጃን በከፍተኛ ፍጥነት ያለ ገመድ ወይም በገመድ መለዋወጥ ይችላሉ።'
        },
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
        competencies: [
          'የሪሌሽናል ዳታቤዝ ጽንሰ-ሀሳቦችን (Tables, Primary Key, Foreign Key) መተንተን',
          'መሰረታዊ የ SQL ትዕዛዞችን (SELECT, INSERT, UPDATE, DELETE) በመጠቀም መረጃ ማስተዳደር',
          'የሳይበር ደህንነት ስጋቶችን (Phishing, Ransomware, Social Engineering) መለየት እና መከላከል',
          'የመረጃ ኢንክሪፕሽን (Data Encryption) እና ባለሁለት ደረጃ ማረጋገጫ (2FA) አሰራርን መተግበር'
        ],
        practicalActivity: {
          title: 'የ SQL ዳታቤዝ ሰንጠረዥ እና ኩዌሪ ዝግጅት (Hands-on SQL Database Creation)',
          materials: ['ኮምፒውተር ከ SQLite ወይም የመስመር ላይ SQL Playground ጋር', 'የተማሪዎች መረጃ ናሙና'],
          steps: [
            '1. "CREATE TABLE Students (id INT PRIMARY KEY, name TEXT, grade INT);" የሚለውን ትዕዛዝ አስፈጽም።',
            '2. ሶስት የተማሪዎችን ሪከርዶች በ "INSERT INTO" ትዕዛዝ አስገባ።',
            '3. "SELECT name FROM Students WHERE grade >= 10;" በማለት የተመረጡ ተማሪዎችን ዝርዝር አውጣ።'
          ],
          observation: 'በ SQL አማካኝነት በሺዎች የሚቆጠሩ መረጃዎችን በሰከንዶች ውስጥ ማጣራት፣ መፈለግ እና ማደራጀት ይቻላል።'
        },
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
            question: 'በ SQL ውስጥ አዲስ መረጃ ወደ ሰንጠረዥ ለማስገባት የምንጠቀመው ትዕዛዝ የየትኛው ነው?',
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
  },

  // 9. የዜግነት ትምህርት (Citizenship Education)
  {
    id: 'citizenship',
    name: 'የዜግነት ትምህርት',
    subName: 'Citizenship Education',
    stream: 'social',
    curriculumBadge: 'አዲሱ ስርዓተ-ትምህርት',
    accentColor: '#7C3AED',
    accentLight: '#F5F3FF',
    accentBorder: '#8B5CF6',
    accentBadge: '#6D28D9',
    topics: [
      {
        id: 'cit-9-10',
        title: 'ዴሞክራሲ፣ የህግ የበላይነት እና የዜጎች መብትና ግዴታ',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'የዴሞክራሲያዊ ስርዓት ምሰሶዎች እና ሰብዓዊ መብቶች',
        competencies: [
          'የህገ-መንግስታዊ ዴሞክራሲ መሰረታዊ መርሆዎችን (የህግ የበላይነት፣ ተጠያቂነት፣ ግልጽነት) መተንተን',
          'የሰብዓዊ እና የዴሞክራሲያዊ መብቶችን ልዩነት እና ትስስር መለየት',
          'የዜጎችን ማህበራዊ፣ ኢኮኖሚያዊ እና ፖለቲካዊ ሀላፊነቶች መረዳት',
          'የሰላማዊ ግጭት አፈታት (Peaceful Conflict Resolution) እና የውይይት ባህልን ማዳበር'
        ],
        practicalActivity: {
          title: 'የትምህርት ቤት የክርክር እና የሙግት ችሎት (Mock Democratic Parliament & Debate)',
          materials: ['የህገ-መንግስት ሰነድ አጭር ማጠቃለያ', 'የክርክር አጀንዳ (ለምሳሌ፡ የት/ቤት የዲሲፕሊን ህግ)'],
          steps: [
            '1. ተማሪዎችን ወደ ህግ አውጪ (ተወካዮች) እና ዜጎች መድብ።',
            '2. የቀረበውን የህግ ረቂቅ በዴሞክራሲያዊ መንገድ በመወያየት ማሻሻያ ሀሳብ አቅርብ።',
            '3. በድምጽ ብልጫ በማፅደቅ የውሳኔ አሰጣጥ ሂደቱን ተግብር።'
          ],
          observation: 'ውይይት እና ድርድር የልዩነቶችን መፍትሄ በማምጣት የጋራ ስምምነትን ለመፍጠር ወሳኝ ናቸው።'
        },
        lessonContent: [
          'የዜግነት ትምህርት ዜጎች ስለ መብቶቻቸው፣ ግዴታዎቻቸው እና ስለ ሀገራቸው አስተዳደር ግንዛቤ እንዲኖራቸው የሚያስችል ወሳኝ የትምህርት ዘርፍ ነው።',
          'የህግ የበላይነት (Rule of Law) ማለት ማንም ሰው፣ ባለስልጣንም ሆነ ተራ ዜጋ ከህግ በላይ ሊሆን እንደማይችል እና ሁሉም በህግ ፊት እኩል መሆኑን የሚያረጋግጥ የዴሞክራሲ መሰረት ነው።',
          'ሰብዓዊ መብቶች የተፈጥሮ ጸጋ ሲሆኑ፣ ማንም ሰው በሰውነቱ ብቻ የሚያገኛቸው የማይገፈፉ (Inalienable) መብቶች ናቸው። የዴሞክራሲ መብቶች ደግሞ በህገ-መንግስት ዋስትና የተሰጣቸው የመምረጥ፣ የመመረጥ እና ሀሳብን በነፃነት የመግለጽ መብቶች ናቸው።'
        ],
        keyPoints: [
          'የህግ የበላይነት፡ ማንም ከህግ በላይ አይደለም',
          'ሰብዓዊ መብቶች የማይገፈፉ የተፈጥሮ መብቶች ናቸው',
          'የዜግነት ግዴታዎች፡ ግብር መክፈል፣ ህግ ማክበር እና ሀገርን መጠበቅ'
        ],
        flashcards: [
          {
            id: 'c1-fc1',
            front: 'የህግ የበላይነት (Rule of Law) ምን ማለት ነው?',
            back: 'ሁሉም ዜጎችና ባለስልጣናት ለህግ ተገዢ የሆኑበትና ማንም ከህግ በላይ ያልሆነበት ስርዓት ነው።'
          },
          {
            id: 'c1-fc2',
            front: 'ሰብዓዊ መብቶች እና የዴሞክራሲ መብቶች ልዩነታቸው?',
            back: 'ሰብዓዊ መብት በተፈጥሮ የሚገኝ ሲሆን፣ የዴሞክራሲ መብት ደግሞ በህገ-መንግስት እውቅና የሚያገኝ የፖለቲካ መብት ነው።'
          },
          {
            id: 'c1-fc3',
            front: 'የዴሞክራሲ ዋና ዋና መርሆዎች ምን ምን ናቸው?',
            back: 'የህዝብ ሉዓላዊነት፣ ተጠያቂነት፣ ግልጽነት፣ የብዙሃን ውሳኔ እና የአናሳዎች መብት ጥበቃ።'
          }
        ],
        quizQuestions: [
          {
            id: 'c1-q1',
            question: 'ከሚከተሉት ውስጥ የማይገፈፍ ሰብዓዊ መብት የሆነው የትኛው ነው?',
            options: ['የህይወት የመኖር መብት', 'የመምረጥ መብት', 'የመኪና ማሽከርከር ፈቃድ', 'የንግድ ድርጅት ባለቤት መሆን'],
            correctIndex: 0,
            explanation: 'የህይወት የመኖር መብት የተፈጥሮ እና የማይገፈፍ ሰብዓዊ መብት ነው።'
          },
          {
            id: 'c1-q2',
            question: 'የዜጎች ዋነኛ ህገ-መንግስታዊ ግዴታ የትኛው ነው?',
            options: ['ህገ-መንግስቱንና የሀገሪቱን ህጎች ማክበር', 'ውጭ ሀገር መጓዝ', 'መኪና መግዛት', 'በየቀኑ ዜና መስማት'],
            correctIndex: 0,
            explanation: 'ህግን ማክበር፣ ግብር በወቅቱ መክፈል እና ሀገርን መጠበቅ የዜጎች ዋና ግዴታዎች ናቸው።'
          }
        ]
      },
      {
        id: 'cit-11-12',
        title: 'የመልካም አስተዳደር፣ ፍትህ እና የብዝሃነት አያያዝ',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'ብሄራዊ መግባባት፣ ፌዴራሊዝም እና አለም አቀፍ ግንኙነት',
        competencies: [
          'የመልካም አስተዳደር (Good Governance) አመልካቾችን በህዝባዊ ተቋማት ውስጥ መገምገም',
          'በኢትዮጵያ ውስጥ የብዝሃነትን (ባህላዊ፣ ቋንቋዊ፣ ሃይማኖታዊ) ውበት እና አያያዝ መተንተን',
          'ሙስናን እና ብልሹ አሰራርን የመዋጋት የህግ ማዕቀፎችን መረዳት',
          'የኢትዮጵያን የዲፕሎማሲ ታሪክ እና በአፍሪካ ህብረት ውስጥ ያላትን ሚና መገንዘብ'
        ],
        practicalActivity: {
          title: 'የማህበረሰብ ግጭት አፈታት እና የሽምግልና አስመስሎ መስራት (Community Mediation Simulation)',
          materials: ['የግጭት መነሻ መግለጫ (Case Study)', 'የሽምግልና ደንብ መመሪያ'],
          steps: [
            '1. ተማሪዎችን ወደ ሶስት ቡድን መድብ (ከሳሽ፣ ተከሳሽ እና አደራዳሪ ሽማግሌዎች)።',
            '2. የባህላዊ የኢትዮጵያ ሽምግልና እሴቶችን (እርቅ፣ እውነት፣ ይቅርታ) በመጠቀም የጋራ ስምምነት ፍጠር።',
            '3. የሽምግልናውን ሰነድ በጋራ ፊርማ አጽድቁ።'
          ],
          observation: 'ባህላዊ የግጭት አፈታት ስልቶች ፈጣንና ዘላቂ ማህበራዊ ሰላምን ለማስፈን ትልቅ አቅም አላቸው።'
        },
        lessonContent: [
          'መልካም አስተዳደር (Good Governance) ማለት የመንግስት ስልጣን በግልጽነት፣ በተጠያቂነት፣ በፍትሃዊነት እና በህዝብ ተሳትፎ የሚመራበት አሰራር ነው።',
          'ኢትዮጵያ የበርካታ ብሄር ብሄረሰቦች፣ ባህሎችና እምነቶች መኖሪያ በመሆኗ ብዝሃነትን እንደ ውበትና ጥንካሬ መቀበል ለሀገራዊ አንድነት ወሳኝ ነው።',
          'በአለም አቀፍ መድረክ ኢትዮጵያ የመንግስታቱ ድርጅት (UN) እና የአፍሪካ ህብረት (AU) መስራች በመሆን የፀረ-ቅኝ አገዛዝ እና የቀጣናው ሰላም ጠባቂ ሆና አገልግላለች።'
        ],
        keyPoints: [
          'የመልካም አስተዳደር ምሶሶዎች፡ ግልጽነት፣ ተጠያቂነት እና ፍትሃዊነት',
          'ብዝሃነት የአንድነትና የውበት መሰረት ነው',
          'ኢትዮጵያ የአፍሪካ ህብረት መቀመጫ እና የዲፕሎማሲ ማዕከል ናት'
        ],
        flashcards: [
          {
            id: 'c2-fc1',
            front: 'መልካም አስተዳደር (Good Governance) ምንድን ነው?',
            back: 'የተቋማት አሰራር ግልጽ፣ ተጠያቂ፣ ፍትሃዊ እና ውጤታማ ሆኖ የህዝብን ጥቅም የሚያስቀድምበት ስርዓት ነው።'
          },
          {
            id: 'c2-fc2',
            front: 'የአፍሪካ ህብረት (AU) ዋና መቀመጫ የት ነው?',
            back: 'አዲስ አበባ፣ ኢትዮጵያ።'
          }
        ],
        quizQuestions: [
          {
            id: 'c2-q1',
            question: 'የመልካም አስተዳደር ዋና ጠላት የሆነው የትኛው ነው?',
            options: ['ሙስና እና አድልዎ (Corruption & Nepotism)', 'ግልጽነት', 'የህዝብ ተሳትፎ', 'ተጠያቂነት'],
            correctIndex: 0,
            explanation: 'ሙስና እና አድልዎ ፍትሃዊነትን በማዛባት የተቋማትን ታማኝነት ያጠፋሉ።'
          }
        ]
      }
    ]
  },

  // 10. ጂኦግራፊ (Geography)
  {
    id: 'geography',
    name: 'ጂኦግራፊ',
    subName: 'Geography',
    stream: 'social',
    curriculumBadge: 'አዲሱ ስርዓተ-ትምህርት',
    accentColor: '#0284C7',
    accentLight: '#F0F9FF',
    accentBorder: '#0EA5E9',
    accentBadge: '#0369A1',
    topics: [
      {
        id: 'geo-9-10',
        title: 'የኢትዮጵያ እና የአፍሪካ ቀንድ መልክአ-ምድር',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'የመሬት አቀማመጥ፣ የስምጥ ሸለቆ አፈጣጠር እና የውሃ ሀብት',
        competencies: [
          'የኢትዮጵያን ከፍተኛ እና ዝቅተኛ ቦታዎች (Topography) በካርታ ላይ መለየት',
          'የታላቁን የምስራቅ አፍሪካ ስምጥ ሸለቆ (Rift Valley) አፈጣጠር እና ተፅዕኖ መተንተን',
          'የኢትዮጵያን ዋና ዋና የወንዝ ተፋሰሶች (አባይ፣ አዋሽ፣ ዋቢ ሸበሌ፣ ጊቤ) መዘርዘር',
          'የአየር ንብረት ክልሎችን (በረሃ፣ ቆላ፣ ወይና ደጋ፣ ደጋ፣ ውርጭ) መለየት'
        ],
        practicalActivity: {
          title: 'የኢትዮጵያ እፎይታ እና የወንዞች ተፋሰስ ካርታ ስራ (Topographical & River Basin Mapping)',
          materials: ['የኢትዮጵያ ኮንቱር ካርታ', 'የቀለም እርሳሶች (ቡናማ፣ አረንጓዴ፣ ሰማያዊ)'],
          steps: [
            '1. ከ 1500 ሜትር በላይ የሆኑትን ደጋማ ቦታዎች በቡናማ ቀለም አድምቅ።',
            '2. የስምጥ ሸለቆውን መስመር እና ሀይቆችን (ዝዋይ፣ ሻላ፣ አባያ) ለይተህ አስቀምጥ።',
            '3. ዋና ዋና ወንዞችን እና የሚፈሱበትን አቅጣጫ በቀስት አመልክት።'
          ],
          observation: 'ኢትዮጵያ "የምስራቅ አፍሪካ የውሃ ማማ" በመባል የምትታወቀው ወንዞቿ ወደ ጎረቤት ሀገራት በከፍተኛ መጠን ስለሚፈሱ ነው።'
        },
        lessonContent: [
          'የኢትዮጵያ መልክአ ምድር በተራሮች፣ ሸለቆዎች እና ሜዳማ ቦታዎች የተዋቀረ አስደናቂ ስብጥር አለው። የሀገሪቱ ከፍታ ከዳሎል (125 ሜትር ከባህር ወለል በታች) እስከ ራስ ዳሸን ተራራ (4550 ሜትር ከባህር ወለል በላይ) ይደርሳል።',
          'የምስራቅ አፍሪካ ስምጥ ሸለቆ ሀገሪቱን በሰያፍ ለሁለት የሚከፍል ሲሆን፣ በርካታ ሀይቆችን እና የፍልውሃ ምንጮችን ይዟል።',
          'ኢትዮጵያ 12 ዋና ዋና የወንዝ ተፋሰሶች ያሏት ሲሆን፣ አባይ (Blue Nile)፣ ተከዜ፣ ባሮ፣ አዋሽ እና ዋቢ ሸበሌ ለሀገር ውስጥ እርሻና ለሃይል ማመንጫ ከፍተኛ አስተዋጽኦ ያደርጋሉ።'
        ],
        keyPoints: [
          'ከፍተኛው ቦታ፡ ራስ ዳሸን (4550 ሜትር)፤ ዝቅተኛው፡ ዳሎል (-125 ሜትር)',
          'ኢትዮጵያ "የምስራቅ አፍሪካ የውሃ ማማ" ትባላለች',
          'አምስቱ ባህላዊ የአየር ንብረት ዞኖች፡ በረሃ፣ ቆላ፣ ወይና ደጋ፣ ደጋ እና ውርጭ'
        ],
        flashcards: [
          {
            id: 'g1-fc1',
            front: 'በኢትዮጵያ ከፍተኛው ተራራ የትኛው ነው?',
            back: 'ራስ ዳሸን ተራራ (4,550 ሜትር ከባህር ወለል በላይ)።'
          },
          {
            id: 'g1-fc2',
            front: 'ኢትዮጵያ ለምን "የምስራቅ አፍሪካ የውሃ ማማ" ትባላለች?',
            back: 'በርካታ አለም አቀፍ ወንዞች ከደጋማ ቦታዎቿ ተነስተው ወደ ጎረቤት ሀገራት ስለሚፈሱ።'
          }
        ],
        quizQuestions: [
          {
            id: 'g1-q1',
            question: 'ከሚከተሉት ውስጥ በኢትዮጵያ ዝቅተኛው የመሬት ክፍል የትኛው ነው?',
            options: ['ዳሎል (አፋር ድብልቅ)', 'ባሌ ተራሮች', 'የደብረ ሊባኖስ ገደል', 'የጣና ሀይቅ ዳርቻ'],
            correctIndex: 0,
            explanation: 'ዳሎል ከባህር ጠለል በታች 125 ሜትር ዝቅ ብሎ የሚገኝ እጅግ ሞቃታማ ስፍራ ነው።'
          }
        ]
      }
    ]
  },

  // 11. ግብርና እና አግሮ-ቴክኖሎጂ (Agriculture)
  {
    id: 'agriculture',
    name: 'ግብርና',
    subName: 'Agriculture & Agri-Tech',
    stream: 'natural',
    curriculumBadge: 'አዲሱ ስርዓተ-ትምህርት',
    accentColor: '#16A34A',
    accentLight: '#F0FDF4',
    accentBorder: '#22C55E',
    accentBadge: '#15803D',
    topics: [
      {
        id: 'agr-9-10',
        title: 'ዘመናዊ የሰብል ሳይንስ እና የአፈር ለምነት አያያዝ',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'የአፈር ጤና፣ የመስኖ ቴክኖሎጂ እና የተሻሻሉ ዝርያዎች',
        competencies: [
          'የአፈር አይነቶችን (ሸክላ፣ አሸዋ፣ ለም አፈር) እና የፒኤች (pH) መጠን መለካት',
          'የተፈጥሮ ማዳበሪያ (ኮምፖስት) ዝግጅት እና የአፈር መሸርሸር መከላከያ ስልቶችን መተግበር',
          'ዘመናዊ የመስኖ ዘዴዎችን (ጠብታ መስኖ፣ ረጭ መስኖ) መገምገም',
          'የአየር ንብረት ለውጥን የሚቋቋሙ የሰብል ዝርያዎችን የመምረጥ ክህሎት ማዳበር'
        ],
        practicalActivity: {
          title: 'የተፈጥሮ ማዳበሪያ (ኮምፖስት) ዝግጅት ተግባራዊ ልምምድ (Compost Making Project)',
          materials: ['የደረቁ ቅጠሎች (ካርቦን)', 'አረንጓዴ የእፅዋት ተረፈ-ምርቶች (ናይትሮጅን)', 'ውሃ', 'አፈር'],
          steps: [
            '1. በት/ቤቱ የአትክልት ስፍራ 1 ሜትር በ 1 ሜትር ጉድጓድ ቆፍር።',
            '2. የደረቁ ቅጠሎችንና አረንጓዴ ተረፈ-ምርቶችን በንብርብር (Layer) አስቀምጥ፤ በየመሃሉ አፈርና ውሃ ጨምር።',
            '3. በየሳምንቱ በማገላበጥ ከ 4-6 ሳምንታት በኋላ ጥቁርና ለም ኮምፖስት አዘጋጅ።'
          ],
          observation: 'ኦርጋኒክ ተረፈ-ምርቶች ረቂቅ ተህዋሲያን በሚያካሂዱት መበስበስ ወደ ከፍተኛ የተፈጥሮ ማዳበሪያነት ይቀየራሉ።'
        },
        lessonContent: [
          'ግብርና የኢትዮጵያ ኢኮኖሚ የጀርባ አጥንት ሲሆን፣ ከ 70% በላይ የሚሆነውን የስራ እድል እና አብዛኛውን የውጭ ምንዛሬ ገቢ ያስገኛል።',
          'አፈር ለሰብል ምርታማነት መሰረት ሲሆን፣ አፈሩን ከመሸርሸር መጠበቅ (ለምሳሌ እርከን በመስራት እና ዛፍ በመትከል) ወሳኝ ተግባር ነው።',
          'በአዲሱ ስርዓተ ትምህርት ዘመናዊ የግብርና ቴክኖሎጂዎች ማለትም ጠብታ መስኖ (Drip Irrigation)፣ የተሻሻሉ ምርጥ ዘሮች እና የግሪን ሀውስ (Greenhouse) ቴክኖሎጂዎች ልዩ ትኩረት ተሰጥቷቸዋል።'
        ],
        keyPoints: [
          'ግብርና የኢትዮጵያ ኢኮኖሚ ዋነኛ ምሰሶ ነው',
          'የኮምፖስት ዝግጅት የአፈርን ለምነት በተፈጥሮ መንገድ ይጠብቃል',
          'ዘመናዊ መስኖ በበጋ ወቅትም ቀጣይነት ያለው ምርት ለማግኘት ያስችላል'
        ],
        flashcards: [
          {
            id: 'ag1-fc1',
            front: 'ኮምፖስት (Compost) ምንድን ነው?',
            back: 'ከእፅዋትና እንስሳት ተረፈ-ምርቶች የሚዘጋጅ ኦርጋኒክ የተፈጥሮ ማዳበሪያ ነው።'
          },
          {
            id: 'ag1-fc2',
            front: 'የጠብታ መስኖ (Drip Irrigation) ዋና ጠቀሜታ ምንድን ነው?',
            back: 'ውሃን በቀጥታ ወደ ተክሉ ስር በማድረስ እስከ 70% የውሃ ብክነትን መቆጠብ።'
          }
        ],
        quizQuestions: [
          {
            id: 'ag1-q1',
            question: 'የአፈር መሸርሸርን ለመከላከል በጣም ውጤታማ የሆነው ዘዴ የትኛው ነው?',
            options: ['እርከን መስራትና ዛፎችን መትከል (Terracing & Afforestation)', 'ከመጠን በላይ ማገድ', 'የደን ምንጣሮ', 'ሳር ማቃጠል'],
            correctIndex: 0,
            explanation: 'እርከን መስራት የውሃ ፍጥነትን ይቀንሳል፤ የዛፍ ስሮች ደግሞ አፈርን አጥብቀው ይይዛሉ።'
          }
        ]
      }
    ]
  }
];
