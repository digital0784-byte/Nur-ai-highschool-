import { Subject } from '../types';

export const curriculumTigrinya: Subject[] = [
  // 1. ሒሳብ (Mathematics)
  {
    id: 'math',
    name: 'ሒሳብ',
    subName: 'Mathematics',
    accentColor: '#1D4ED8',
    accentLight: '#EFF6FF',
    accentBorder: '#2563EB',
    accentBadge: '#1E40AF',
    topics: [
      {
        id: 'math-9-10',
        title: 'ኳድራቲክ ማዕረግታት (Quadratic Equations)',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'ናይ ካልኣይ ዲግሪ ማዕረግታት መፍቲሒ ሜላታት',
        lessonContent: [
          'ኳድራቲክ ማዕረግ ዝበሃል ብ ax² + bx + c = 0 መልክዕ ዝግለፅ ኮይኑ፤ a፣ b ከምኡውን c ቀወምቲ ቁፅርታት እዮም (a ≠ 0)። ናይዚ ማዕረግ ዝለዓለ ሓይሊ 2 እዩ።',
          'እዞም ማዕረግታት ንምፍታሕ ሰለስተ ቀንዲ ሜላታት ንጥቀም፡ ብፋክተራይዜሽን፣ ብምሉእ ካሬ ምስራሕ (Completing Square)፣ ከምኡውን ብኳድራቲክ ፎርሙላ x = (-b ± √(b² - 4ac)) / (2a)።',
          'እቲ (b² - 4ac) ዲሰክሪሚናንት (Discriminant) ይበሃል። ዲሰክሪሚናንቱ ካብ ዜሮ ንላዕሊ እንተኾይኑ ክልተ ዝተፈላለዩ ሓቀኛ መልስታት ኣለዉዎ፤ ዜሮ እንተኾይኑ ሓደ መልሲ፤ ካብ ዜሮ ንታሕቲ እንተኾይኑ ድማ ሓቀኛ መልሲ የብሉን።'
        ],
        keyPoints: [
          'ስሩዕ ቀመር፡ ax² + bx + c = 0 (a ≠ 0)',
          'ኳድራቲክ ፎርሙላ፡ x = (-b ± √(b² - 4ac)) / 2a',
          'ዲሰክሪሚናንት D = b² - 4ac ባህሪ መልስታት ይውስን'
        ],
        flashcards: [
          {
            id: 'm1-fc1',
            front: 'ኳድራቲክ ማዕረግ እንታይ እዩ?',
            back: 'ብ ax² + bx + c = 0 ዝፅሓፍ ዝለዓለ ሓይሉ 2 ዝኾነ ናይ ሒሳብ ማዕረግ እዩ።'
          },
          {
            id: 'm1-fc2',
            front: 'ዲሰክሪሚናንት (Discriminant) እንታይ እዩ?',
            back: 'D = b² - 4ac ኮይኑ ቁፅርን ባህርን መልስታት ይሕብር።'
          },
          {
            id: 'm1-fc3',
            front: 'D < 0 እንተኾይኑ ኩነታት መልስታት እንታይ ይኸውን?',
            back: 'እቲ ማዕረግ ዋላ ሓደ ሓቀኛ መልሲ (real root) የብሉን።'
          },
          {
            id: 'm1-fc4',
            front: 'ናይ ኳድራቲክ ፎርሙላ ቀመር እንታይ እዩ?',
            back: 'x = (-b ± √(b² - 4ac)) / (2a)'
          }
        ],
        quizQuestions: [
          {
            id: 'm1-q1',
            question: 'ኣብ ax² + bx + c = 0 ውሽጢ b² - 4ac = 0 እንተኾይኑ እቲ ማዕረግ ክንደይ ሓቀኛ መልስታት ኣለዎ?',
            options: ['ዋላ ሓደ መልሲ የብሉን', 'ሓደ ሓቀኛ መልሲ ጥራሕ', 'ክልተ ዝተፈላለዩ መልስታት', 'ኣርባዕተ መልስታት'],
            correctIndex: 1,
            explanation: 'ዲሰክሪሚናንት ዜሮ ምስ ዝኸውን እቲ ማዕረግ ሓደ ዝተደገመ ሓቀኛ መልሲ ይህልዎ።'
          },
          {
            id: 'm1-q2',
            question: 'ናይ x² - 5x + 6 = 0 መልስታት ኣየኖት እዮም?',
            options: ['x = 2ን x = 3ን', 'x = -2ን x = -3ን', 'x = 1ን x = 6ን', 'x = -1ን x = 5ን'],
            correctIndex: 0,
            explanation: '(x - 2)(x - 3) = 0 ተባሂሉ ብምክፍፋል x = 2 ወይ x = 3 ይኸውን።'
          },
          {
            id: 'm1-q3',
            question: 'ናይ ኳድራቲክ ፈንክሽን ግራፍ እንታይ ቅርፂ ኣለዎ?',
            options: ['ቀጥታዊ መስመር (Linear)', 'ፓራቦላ (Parabola)', 'ክቢ (Circle)', 'ሞገድ (Wave)'],
            correctIndex: 1,
            explanation: 'ናይ ዝኾነ ካልኣይ ዲግሪ ፈንክሽን ግራፍ ቅርፂ ፓራቦላ (Parabola) እዩ።'
          },
          {
            id: 'm1-q4',
            question: 'ኣብ 2x² + 4x - 6 = 0 ውሽጢ ዋጋ a፣ bን cን ብቅደም ተኸተል ክንደይ እዩ?',
            options: ['a=2, b=4, c=-6', 'a=4, b=2, c=6', 'a=2, b=-4, c=6', 'a=1, b=2, c=-3'],
            correctIndex: 0,
            explanation: 'ምስ ስሩዕ ቀመር ax² + bx + c = 0 እንተነፃፅሮ a = 2, b = 4, c = -6 ይኸውን።'
          }
        ]
      },
      {
        id: 'math-11-12',
        title: 'ካልኩለስን ዴሪቫቲቭን (Calculus & Derivatives)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'ናይ ለውጢ ፍጥነትን ዴሪቫቲቭ መሰረታትን',
        lessonContent: [
          'ካልኩለስ ናይ ቀፃሊ ለውጢ መፅናዕቲ እዩ። ናይ ዴሪቫቲቭ ቀንዲ ዕላማ ቅፅበታዊ ናይ ለውጢ ፍጥነትን ኣብ ዝኾነ ነጥቢ ዝስኣል ታንጀንት መስመር ቁልቁለት (Slope) ምሕሳብ እዩ።',
          'ዴሪቫቲቭ ብሊሚት (limit) ዝግለፅ ኮይኑ ቀመሩ ድማ f\'(x) = lim(h→0) [f(x+h) - f(x)] / h እዩ። እዚ መሰረታዊ ሕጊ ዝለዓለን ዝተሓተን ነጥብታት ንምርዳእ የገልግል።',
          'ቀንዲ ናይ ዴሪቫቲቭ ሕግታት ፓወር ሩል d/dx(xⁿ) = n·xⁿ⁻¹፣ ፕሮዳክት ሩልን ቼይን ሩልን (Chain Rule) የጠቓልል።'
        ],
        keyPoints: [
          'ፓወር ሩል (Power Rule)፡ d/dx(xⁿ) = n · xⁿ⁻¹',
          'ጂኦሜትሪያዊ ትርጉም፡ ናይ ታንጀንት መስመር ስሎፕ (Slope)',
          'ናይ ቋሚ ቁፅሪ ዴሪቫቲቭ 0 እዩ'
        ],
        flashcards: [
          {
            id: 'm2-fc1',
            front: 'ዴሪቫቲቭ ብጂኦሜትሪ እንታይ የመልክት?',
            back: 'ኣብቲ ዝተወሃበ ነጥቢ ናይ ዝስኣል ታንጀንት መስመር ስሎፕ (Slope)።'
          },
          {
            id: 'm2-fc2',
            front: 'ናይ f(x) = x⁴ ዴሪቫቲቭ ክንደይ እዩ?',
            back: 'f\'(x) = 4x³ (ብፓወር ሩል መሰረት)።'
          },
          {
            id: 'm2-fc3',
            front: 'ናይ ቋሚ ቁፅሪ (ንኣብነት f(x) = 15) ዴሪቫቲቭ ክንደይ እዩ?',
            back: 'ኩሉ ግዜ 0 (ዜሮ) እዩ።'
          },
          {
            id: 'm2-fc4',
            front: 'ቼይን ሩል (Chain Rule) መዓዝ ንጥቀም?',
            back: 'ዝተደራረቡ ፈንክሽናት f(g(x)) ዴሪቫቲቭ ንምሕሳብ።'
          }
        ],
        quizQuestions: [
          {
            id: 'm2-q1',
            question: 'ናይ f(x) = 3x² + 5x - 7 ዴሪቫቲቭ f\'(x) ክንደይ እዩ?',
            options: ['6x + 5', '3x + 5', '6x - 7', '6x² + 5'],
            correctIndex: 0,
            explanation: 'd/dx(3x²) = 6x፣ d/dx(5x) = 5 ስለዝኾነ f\'(x) = 6x + 5 ይኸውን።'
          },
          {
            id: 'm2-q2',
            question: 'ኣብ f\'(x) = 0 ነጥቢ እቲ ታንጀንት መስመር ከመይ ይኸውን?',
            options: ['ጋድም (Horizontal)', 'ቀጥታዊ (Vertical)', '45 ዲግሪ ዝዘንበለ', 'ኣንፈት የብሉን'],
            correctIndex: 0,
            explanation: 'ስሎፕ ዜሮ ማለት እቲ መስመር ምሉእ ብምሉእ ጋድም (Horizontal) እዩ።'
          },
          {
            id: 'm2-q3',
            question: 'ናይ f(x) = sin(x) ዴሪቫቲቭ እንታይ እዩ?',
            options: ['cos(x)', '-cos(x)', '-sin(x)', 'tan(x)'],
            correctIndex: 0,
            explanation: 'ናይ sin(x) ዴሪቫቲቭ ብቀጥታ cos(x) እዩ።'
          },
          {
            id: 'm2-q4',
            question: 'ቅፅበታዊ ፍጥነት ካብ ናይ ርሕቐት ፈንክሽን s(t) ብኸመይ ይርከብ?',
            options: ['ቀዳማይ ዴሪቫቲቭ ብምውሳድ v(t) = ds/dt', 'ርሕቐትን ግዜን ብምድማር', 'ናይ ፍጥነት ቋሚ ዋጋ', 'ናይ ግዜ ስኩዌር'],
            correctIndex: 0,
            explanation: 'ቅፅበታዊ ፍጥነት ናይ ርሕቐት ቀዳማይ ዴሪቫቲቭ ds/dt እዩ።'
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
        title: 'ናይ ኒውተን ናይ ምንቅስቓስ ሕግታት',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'ናይ ሓይልን ምንቅስቓስን መሰረታዊ መትከላት',
        lessonContent: [
          'ሰር አይዛክ ኒውተን ግዑዛት ኣካላት ብሓይሊ ኣቢሎም ዘርእይዎ ምንቅስቓስ ዝቆፃፀሩ ሰለስተ መሰረታዊ ሕግታት ቀሚሩ። እዚኦም ናይ ክላሲካል መካኒክስ መሰረት እዮም።',
          'ቀዳማይ ሕጊ (Inertia) ዝኾነ ኣካል ደጋዊ ሓይሊ ክሳብ ዘይተፃዕኖ ኣብ ዘለዎ ናይ ዕረፍቲ ወይ ቋሚ ፍጥነት ናይ ምቕፃል ዝንባለ ኣለዎ። ካልኣይ ሕጊ ምቅልጣፍ (a) ምስ ዝተፃዕነ ሓይሊ ብቀጥታ ከምዝመጣጠን የርኢ (F = ma)።',
          'ሳልሳይ ሕጊ ድማ ንነፍሲ ወከፍ ተግባር (Action) ማዕረን ተፃራርን ዝኾነ ግብረ-መልሲ (Reaction) ከምዘሎ የብርህ።'
        ],
        keyPoints: [
          '1ይ ሕጊ፡ ኢነርሺያ (Inertia) - ለውጢ ናይ ምፅዋር ዓቕሚ',
          '2ይ ሕጊ፡ F = ma (ሓይሊ = ግዝፈት × ምቅልጣፍ)',
          '3ይ ሕጊ፡ ድርጊትን ግብረ-መልስን (Action = -Reaction)'
        ],
        flashcards: [
          {
            id: 'p1-fc1',
            front: 'ናይ ኒውተን ቀዳማይ ሕጊ እንታይ ይበሃል?',
            back: 'ናይ ኢነርሺያ ሕጊ (Law of Inertia) ይበሃል።'
          },
          {
            id: 'p1-fc2',
            front: 'ናይ ኒውተን ካልኣይ ሕጊ ቀመር እንታይ እዩ?',
            back: 'F = m · a (ሓይሊ = ግዝፈት × ምቅልጣፍ)።'
          },
          {
            id: 'p1-fc3',
            front: 'ናይ ሓይሊ (Force) መዐቀኒ ኣሃድ እንታይ እዩ?',
            back: 'ኒውተን (Newton - N) ወይ kg·m/s²።'
          },
          {
            id: 'p1-fc4',
            front: 'ናይ ኒውተን ሳልሳይ ሕጊ ኣብነት ሃብ?',
            back: 'ዋናተኛ ነቲ ማይ ንድሕሪት ክደፍኦ ከሎ፣ ማይ ድማ ነቲ ሰብ ንቕድሚት ይደፍኦ።'
          }
        ],
        quizQuestions: [
          {
            id: 'p1-q1',
            question: 'ኣብ 10 kg ግዝፈት ዘለዎ ኣካል 50 N ሓይሊ እንተተፃዒኑ ዝፍጠር ምቅልጣፍ (a) ክንደይ እዩ?',
            options: ['5 m/s²', '500 m/s²', '0.2 m/s²', '40 m/s²'],
            correctIndex: 0,
            explanation: 'a = F / m = 50 N / 10 kg = 5 m/s² ይኸውን።'
          },
          {
            id: 'p1-q2',
            question: 'መኪና ብድንገት ፍሬን ክትሕዝ ከላ ተሳፈርቲ ንቕድሚት ዝድርበዩ ብምንታይ ምክንያት እዩ?',
            options: ['ብኢነርሺያ (Inertia)', 'ናይ ስሕበት ሓይሊ ስለዝወሰኸ', 'ግጭት ስለዝቐነሰ', 'ብናይ ንፋስ ፀቕጢ'],
            correctIndex: 0,
            explanation: 'ተሳፈርቲ ኣብቲ ዝነበርዎ ናይ ምንቅስቓስ ፍጥነት ናይ ምቕፃል ዝንባለ (ኢነርሺያ) ስለዘለዎም እዩ።'
          },
          {
            id: 'p1-q3',
            question: 'ናይ ኒውተን 3ይ ሕጊ ድርጊትን ግብረ-መልስን ዝትግብሩ፡',
            options: ['ኣብ ክልተ ዝተፈላለዩ ኣካላት እዩ', 'ኣብ ሓደ ኣካል ጥራሕ እዩ', 'ብሓደ ኣንፈት እዩ', 'ብግዜ ፍልልይ እዩ'],
            correctIndex: 0,
            explanation: 'Actionን Reactionን ኩሉ ግዜ ኣብ ክልተ ዝተፈላለዩ ኣካላት ማዕረ ኮይኖም ብተፃራሪ ኣንፈት ይትግብሩ።'
          },
          {
            id: 'p1-q4',
            question: 'ሓደ ኣካል ብቋሚ ፍጥነት ይጓዓዝ እንተሃልዩ ዝተፃዕኖ ዝተፃረየ ሓይሊ ክንደይ እዩ?',
            options: ['0 N (ዜሮ)', 'ምስ ግዝፈቱ ማዕረ', 'ምስ ፍጥነቱ ማዕረ', 'መወዳእታ ዘይብሉ'],
            correctIndex: 0,
            explanation: 'ቋሚ ፍጥነት ማለት ምቅልጣፍ (a = 0) ማለት ኮይኑ ዝተፃረየ ሓይሊ 0 N ይኸውን።'
          }
        ]
      },
      {
        id: 'phys-11-12',
        title: 'ኤሌክትሮማግኔቲዝምን ሞገድን',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'ኤሌክትሮማግኔቲክ ኢንዳክሽንን ናይ ሞገድ ባህርያትን',
        lessonContent: [
          'ኤሌክትሮማግኔቲዝም ኣብ ሞንጎ ምንቅስቓስ ዘለዎም ናይ ኤሌክትሪክ ቻርጃትን ማግኔቲክ ሜዳታትን ዘሎ ርክብ ዘፅንዕ ዓውዲ ፊዚክስ እዩ።',
          'ናይ ፋራዳይ ናይ ኢንዳክሽን ሕጊ ከምዝሕብሮ ዝለዋወጥ ማግኔቲክ ፍላክስ ኣብ መተሓላልፊ ውሽጢ ቮልቴጅ (EMF) ይፈጥር። ናይ ሌንዝ ሕጊ ድማ እቲ ዝተፈጠረ ከረንት ነቲ ለውጢ ዝቃወም ምዃኑ የብርህ።',
          'ኤሌክትሮማግኔቲክ ሞገዶች ኣብ ቫኪዩም ውሽጢ ብናይ ብርሃን ፍጥነት (3 × 10⁸ m/s) ይጓዓዙ። ናይ ሞገድ ፍጥነት ቀመር v = f · λ እዩ።'
        ],
        keyPoints: [
          'ፋራዳይ ሕጊ፡ EMF = -N(ΔΦ/Δt)',
          'ሞገድ ቀመር፡ v = f · λ (ፍጥነት = ፍሪኩዌንሲ × ርዝመት ሞገድ)',
          'ኤሌክትሮማግኔቲክ ሞገድ ኣብ ባዶ ቦታ ንምጉዓዝ መተሓላለፊ ኣይደልን'
        ],
        flashcards: [
          {
            id: 'p2-fc1',
            front: 'ናይ ፋራዳይ ናይ ኢንዳክሽን ሕጊ ቀንዲ ሓሳብ እንታይ እዩ?',
            back: 'ዝለዋወጥ ማግኔቲክ ፍላክስ ቮልቴጅ (EMF) ይፈጥር።'
          },
          {
            id: 'p2-fc2',
            front: 'ናይ ብርሃን ፍጥነት ኣብ ቫኪዩም (c) ክንደይ እዩ?',
            back: 'ብግምት 3 × 10⁸ m/s (300,000 km/s)።'
          },
          {
            id: 'p2-fc3',
            front: 'ናይ ፍሪኩዌንሲ (Frequency) መዐቀኒ እንታይ እዩ?',
            back: 'ሄርትዝ (Hertz - Hz) ወይ 1/s እዩ።'
          },
          {
            id: 'p2-fc4',
            front: 'ጀነሬተር ብኸመይ ይሰርሕ?',
            back: 'ብኤሌክትሮማግኔቲክ ኢንዳክሽን መካኒካል ሓይሊ ናብ ኤሌክትሪክ ይቕይር።'
          }
        ],
        quizQuestions: [
          {
            id: 'p2-q1',
            question: 'ርዝመት ሞገዱ 2 ሜትሮን ፍሪኩዌንሲኡ 150 Hz ዝኾነ ሞገድ ፍጥነቱ ክንደይ እዩ?',
            options: ['300 m/s', '75 m/s', '152 m/s', '0.013 m/s'],
            correctIndex: 0,
            explanation: 'v = f · λ = 150 Hz × 2 m = 300 m/s ይኸውን።'
          },
          {
            id: 'p2-q2',
            question: 'ናይ ትራንስፎርመር (Transformer) ቀንዲ ስራሕ እንታይ እዩ?',
            options: ['ናይ AC ቮልቴጅ መጠን ምውሳኽ ወይ ምቕናስ', 'AC ናብ DC ምቕያር', 'ማግኔቲክ ሜዳ ምጥፋእ', 'ቻርጅ ምኽዛን'],
            correctIndex: 0,
            explanation: 'ትራንስፎርመር ብኤሌክትሮማግኔቲክ ኢንዳክሽን ኣቢሉ ናይ AC ቮልቴጅ ይቕይር።'
          },
          {
            id: 'p2-q3',
            question: 'ካብዞም ዝስዕቡ መተሓላለፊ ዝደሊ ሜካኒካል ሞገድ ኣየናይ እዩ?',
            options: ['ናይ ድምፂ ሞገድ (Sound wave)', 'ናይ ራዲዮ ሞገድ', 'ኤክስ-ሬይ (X-ray)', 'ጋማ ሬይ'],
            correctIndex: 0,
            explanation: 'ድምፂ ንምጉዓዝ ብግዲ ቁሳዊ መተሓላለፊ (ኣየር፣ ፈሳሲ፣ ረቂቕ) ይደሊ።'
          },
          {
            id: 'p2-q4',
            question: 'ናይ ሌንዝ ሕጊ ምስ ኣየናይ ናይ ዕቃበ ሕጊ ብቀጥታ ይተኣሳሰር?',
            options: ['ናይ ኢነርጂ ዕቃበ ሕጊ (Conservation of Energy)', 'ናይ ግዝፈት ዕቃበ', 'ናይ ሞመንተም ዕቃበ', 'ናይ ቻርጅ ዕቃበ'],
            correctIndex: 0,
            explanation: 'ናይ ሌንዝ ሕጊ ናይ ኢነርጂ ዕቃበ ሕጊ ከይጥሓስ የረጋግፅ።'
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
        title: 'ቅርፂ ኣተምን ኬሚካላዊ ምትእስሳርን',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'ንኡሳን ቅንጣታትን ዓይነታት ቦንድን',
        lessonContent: [
          'ኣተም ናይ ዝኾነ ቁስ መሰረታዊ መሃነፂ ኮይኑ ፕሮቶን (+ charge)፣ ኒውትሮን (ገለልተኛ) ከምኡውን ኤሌክትሮን (- charge) ይሕዝ።',
          'ኣተማት ዝተረጋግአ ናይ 8 ኤሌክትሮን (Octet Rule) ንምምላእ ይተኣሳሰሩ። ቀንዲ ዓይነታት ቦንድ፡ ኣዮኒክ ቦንድ (ኤሌክትሮን ብምልውዋጥ)፣ ኮቫለንት ቦንድ (ኤሌክትሮን ብምክፋል) ከምኡውን ሜታሊክ ቦንድ እዮም።',
          'ፒሪዮዲክ ሰንጠረዥ ንንጥረ-ነገራት ብመሰረት ናይ ኤሌክትሮን ውቅርን ባህርያቶምን የቐምጦም።'
        ],
        keyPoints: [
          'ኣቶሚክ ቁፅሪ (Z) = ናይ ፕሮቶን ብዝሒ',
          'ናይ ግዝፈት ቁፅሪ (A) = ፕሮቶን + ኒውትሮን',
          'ኣዮኒክ ቦንድ (ኤሌክትሮን ምሃብ/ምቕባል) vs ኮቫለንት ቦንድ (ኤሌክትሮን ምክፋል)'
        ],
        flashcards: [
          {
            id: 'c1-fc1',
            front: 'ኣይሶቶፕስ (Isotopes) እንታይ እዮም?',
            back: 'ማዕረ ፕሮቶን ኮይኑ ዝተፈላለየ ኒውትሮን ዘለዎም ናይ ሓደ ንጥረ-ነገር ኣተማት።'
          },
          {
            id: 'c1-fc2',
            front: 'ናይ ኮቫለንት ቦንድ መግለፂ እንታይ እዩ?',
            back: 'ኣብ ሞንጎ ክልተ ኣተማት ኤሌክትሮን ብምክፋል ዝፍጠር ምትእስሳር።'
          },
          {
            id: 'c1-fc3',
            front: 'ኣሉታዊ (Negative) ቻርጅ ዘለዎ ቅንጣት ኣየናይ እዩ?',
            back: 'ኤሌክትሮን (Electron) እዩ።'
          },
          {
            id: 'c1-fc4',
            front: 'ጨው (NaCl) እንታይ ዓይነት ቦንድ ኣለዎ?',
            back: 'ኣዮኒክ ቦንድ (Ionic bonding)።'
          }
        ],
        quizQuestions: [
          {
            id: 'c1-q1',
            question: 'ናይ ሓደ ኣተም ፕሮቶን 11ን ኒውትሮን 12ን እንተኾይኑ ናይ ግዝፈት ቁፅሩ (Mass Number) ክንደይ እዩ?',
            options: ['23', '11', '12', '1'],
            correctIndex: 0,
            explanation: 'ግዝፈት ቁፅሪ A = 11 + 12 = 23 (ሶዲየም) ይኸውን።'
          },
          {
            id: 'c1-q2',
            question: 'ኣብ ማይ (H₂O) ውሽጢ ዘሎ ቦንድ እንታይ ይበሃል?',
            options: ['ኮቫለንት ቦንድ', 'ኣዮኒክ ቦንድ', 'ሜታሊክ ቦንድ', 'ኑክሌር ቦንድ'],
            correctIndex: 0,
            explanation: 'ማይ ዘይብረታትን ኤሌክትሮን ብምክፋል ስለዝተሰርሐ ኮቫለንት ቦንድ ኣለዎ።'
          },
          {
            id: 'c1-q3',
            question: 'ኦክቴት ሩል (Octet Rule) ክንደይ ናይ ደገ ኤሌክትሮን ንምርካብ ዝግበር ፃዕሪ እዩ?',
            options: ['8', '2', '6', '10'],
            correctIndex: 0,
            explanation: 'ዝተረጋግአ መዋቅር ንምርካብ 8 ናይ ደገ ቫለንስ ኤሌክትሮን ይድለ።'
          },
          {
            id: 'c1-q4',
            question: 'ኣብ ፒሪዮዲክ ቴብል ግሩፕ 1 ዘለዉ ንጥረ-ነገራት እንታይ ተባሂሎም ይፅውዑ?',
            options: ['ኣልካሊ ብረታት (Alkali metals)', 'ሃሎጅናት', 'ኖብል ጋዛት', 'ኣልካላይን መሬት ብረታት'],
            correctIndex: 0,
            explanation: 'ግሩፕ 1 (Li, Na, K...) ኣልካሊ ብረታት ተባሂሎም ይፍለጡ።'
          }
        ]
      },
      {
        id: 'chem-11-12',
        title: 'ኬሚካላዊ ሚዛንን ቴርሞዳይናሚክስን',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'ኬሚካላዊ ምላሽ ፍጥነትን ኢኩሊብሪየምን',
        lessonContent: [
          'ኬሚካላዊ ኢኩሊብሪየም ዝፍጠር ናብ ቅድሚትን ንድሕሪትን ዝካየድ ግብረ-መልሲ ፍጥነት ማዕረ ምስ ዝኸውን እዩ።',
          'ናይ ሊ ሻቴሊየር መርህ (Le Chatelier\'s Principle) ኣብ ሚዛን ዘሎ ስርዓት ጫና (ሙቐት፣ ፀቕጢ ወይ ይሕዝቶ) እንተተገይሩሉ ነቲ ለውጢ ንምጉዳል ምላሽ ከምዝህብ ይሕብር።',
          'ቴርሞዳይናሚክስ ኢንታልፒ (ΔH)፣ ኢንትሮፒ (ΔS) ከምኡውን ጊብስ ፍሪ ኢነርጂ (ΔG = ΔH - TΔS) የጠቓልል። ΔG < 0 እንተኾይኑ እቲ ከይዲ ባዕሉ ዝካየድ (spontaneous) እዩ።'
        ],
        keyPoints: [
          'ሊ ሻቴሊየር መርህ፡ ስርዓቱ ነቲ ደጋዊ ጫና ይቃወም',
          'ኢኩሊብሪየም ቋሚ Keq = [Products] / [Reactants]',
          'ΔG < 0 (Spontaneous / ባዕሉ ዝካየድ ከይዲ)'
        ],
        flashcards: [
          {
            id: 'c2-fc1',
            front: 'ናይ ሊ ሻቴሊየር መርህ እንታይ ይገልፅ?',
            back: 'ኣብ ሚዛን ዘሎ ስርዓት ደጋዊ ጫና ምስዝፍጠር ነቲ ጫና ናብ ዘቃልል ኣንፈት የዘንብል።'
          },
          {
            id: 'c2-fc2',
            front: 'ኢንትሮፒ (Entropy - S) እንታይ ይልክዕ?',
            back: 'ናይ ሓደ ስርዓት ዘይስርዓታውነት (Disorder) መጠን እዩ።'
          },
          {
            id: 'c2-fc3',
            front: 'ኤግዞተርሚክ (Exothermic) ምላሽ ΔH እንታይ እዩ?',
            back: 'ኣሉታዊ (ΔH < 0) እዩ።'
          },
          {
            id: 'c2-fc4',
            front: 'ናይ ጊብስ ፍሪ ኢነርጂ ቀመር እንታይ እዩ?',
            back: 'ΔG = ΔH - TΔS'
          }
        ],
        quizQuestions: [
          {
            id: 'c2-q1',
            question: 'ናይ ሓደ ኬሚካላዊ ከይዲ ΔG ኣሉታዊ (ΔG < 0) እንተኾይኑ እዚ ከይዲ፡',
            options: ['ባዕሉ ዝካየድ (Spontaneous) እዩ', 'ባዕሉ ዘይካየድ እዩ', 'ኣብ ኢኩሊብሪየም እዩ', 'ፍጥነት የብሉን'],
            correctIndex: 0,
            explanation: 'ΔG < 0 ምስ ዝኸውን እቲ ከይዲ ባዕሉ ዝካየድ (spontaneous) እዩ።'
          },
          {
            id: 'c2-q2',
            question: 'ኣብ N₂ + 3H₂ ⇌ 2NH₃ ስርዓት ፀቕጢ እንተወሰኸ ኢኩሊብሪየሙ ናበይ የዘንብል?',
            options: ['ናብ የማን (ናብ NH₃)', 'ናብ ፀጋም (ናብ N₂ እና H₂)', 'ለውጢ የብሉን', 'ግብረ-መልሲ ደው ይብል'],
            correctIndex: 0,
            explanation: 'ፀቕጢ ክውስኽ ከሎ ውሑድ ጋዝ ሞል ናብ ዘለዎ (ናብ የማን) የዘንብል።'
          },
          {
            id: 'c2-q3',
            question: 'ካታሊስት (Catalyst) እንታይ ኣስተዋፅኦ የበርክት?',
            options: ['ኣክቲቬሽን ኢነርጂ ብምቕናስ ፍጥነት ምውሳኽ', 'ዋጋ ΔH ምቕያር', 'ምህርቲ ምውሳኽ', 'Keq ምቕያር'],
            correctIndex: 0,
            explanation: 'ካታሊስት ኣክቲቬሽን ኢነርጂ ብምቕናስ ክልቲኦም ኣንፈታት ብማዕረ የፋጥን።'
          },
          {
            id: 'c2-q4',
            question: 'ማይ ናብ በረድ ክቕየር ከሎ ናይ ኢንትሮፒ (ΔS) ለውጢ እንታይ ይመስል?',
            options: ['ኣሉታዊ (ΔS < 0)', 'ኣወንታዊ (ΔS > 0)', 'ዜሮ', 'ወሰን ዘይብሉ'],
            correctIndex: 0,
            explanation: 'ፈሳሲ ናብ ረቂቕ ክቕየር ከሎ ስርዓታውነቱ ስለዝውስኽ ኢንትሮፒ ይቕንስ።'
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
        title: 'ቅርፅን ተግባርን ህዋስ (Cell Structure)',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'መሰረታዊ ናይ ህይወት ኣሃዱን ኦርጋኔላትን',
        lessonContent: [
          'ህዋስ (Cell) ናይ ዝኾነ ህያው ፍጡር መሰረታዊ መዋቕራውን ተግባራውን ኣሃዱ እዩ። ኩሎም ህያዋን ካብ ህዋሳት ዝተሰርሑ እዮም።',
          'ህዋሳት ኣብ ክልተ ይኽፈሉ፡ ፕሮካሪዮቲክ (ግሉፅ ኒውክሊየስ ዘይብሎም፣ ንኣብነት ባክቴሪያ) ከምኡውን ዩካሪዮቲክ (ብሜምብሬን ዝተኸበበ ኒውክሊየስ ዘለዎም)።',
          'ማይቶኮንድሪያ ናይ ሓይሊ መመንጨዊ (ATP) ክኸውን ከሎ፣ ክሎሮፕላስት ናይ ፎቶሲንተሲስ ማእኸል እዩ፤ ኒውክሊየስ ድማ ናይ ዲኤንኤ (DNA) መኽዘን እዩ።'
        ],
        keyPoints: [
          'ህዋስ መሰረታዊ ናይ ህይወት ኣሃዱ እዩ',
          'ማይቶኮንድሪያ፡ ናይ ህዋስ ሓይሊ መመንጨዊ (Powerhouse)',
          'ናይ ተኽሊ ህዋስ ክሎሮፕላስትን ሴል ዎልን (Cell wall) ኣለዎ'
        ],
        flashcards: [
          {
            id: 'b1-fc1',
            front: 'ናይ ህዋስ ሓይሊ መመንጨዊ መን እዩ?',
            back: 'ማይቶኮንድሪያ (Mitochondria) - ATP የፈልፍል።'
          },
          {
            id: 'b1-fc2',
            front: 'ናይ ተኽሊ ህዋስ ካብ እንስሳ ዝፈልይዎ ክልተ ነገራት?',
            back: 'ሴል ዎል (Cell wall) ከምኡውን ክሎሮፕላስት (Chloroplast)።'
          },
          {
            id: 'b1-fc3',
            front: 'ፕሮካሪዮት ብምንታይ ይፍለ?',
            back: 'ብሜምብሬን ዝተኸበበ ናይ ሓቂ ኒውክሊየስ የብሉን።'
          },
          {
            id: 'b1-fc4',
            front: 'ናይ ፕሮቲን መፍረዪ ማእኸል ኣየናይ እዩ?',
            back: 'ራይቦዞም (Ribosome) እዩ።'
          }
        ],
        quizQuestions: [
          {
            id: 'b1-q1',
            question: 'ፎቶሲንተሲስ (Photosynthesis) ኣብ ኣየናይ ናይ ህዋስ ኦርጋኔል ይካየድ?',
            options: ['ክሎሮፕላስት (Chloroplast)', 'ማይቶኮንድሪያ', 'ጎልጂ ቦዲ', 'ላይሶዞም'],
            correctIndex: 0,
            explanation: 'ክሎሮፕላስት ብርሃን ፀሓይ ተጠቒሙ ግሉኮስ የፍሪ።'
          },
          {
            id: 'b1-q2',
            question: 'ኣብ ህዋስ ውሽጢ ጀነቲክ መረዳእታ (DNA) ሒዙ ዝርከብ ኣየናይ እዩ?',
            options: ['ኒውክሊየስ (Nucleus)', 'ሳይቶፕላዝም', 'ቫኪዩል', 'ሴል ሜምብሬን'],
            correctIndex: 0,
            explanation: 'ኒውክሊየስ ናይ ህዋስ ምንቅስቓስ ዝቆፃፀር ማእኸል እዩ።'
          },
          {
            id: 'b1-q3',
            question: 'ካብዞም ዝስዕቡ ናይ ፕሮካሪዮቲክ ህዋስ ኣብነት ኣየናይ እዩ?',
            options: ['ባክቴሪያ (Bacteria)', 'ናይ እንጉዳይ ህዋስ', 'ናይ ሰብ ደም ህዋስ', 'ናይ ገረብ ቆፅሊ'],
            correctIndex: 0,
            explanation: 'ባክቴሪያ ኒውክሊየስ ዘይብሉ ፕሮካሪዮት እዩ።'
          },
          {
            id: 'b1-q4',
            question: 'ናይ ሴል ዎል (Cell Wall) ቀንዲ መሃነፂ እንታይ እዩ?',
            options: ['ሴሉሎስ (Cellulose)', 'ግላይኮጅን', 'ኮሌስትሮል', 'ኬራቲን'],
            correctIndex: 0,
            explanation: 'ናይ ተኽሊ ሴል ዎል ካብ ሴሉሎስ ፖሊሳክራይድ ዝተሰርሐ እዩ።'
          }
        ]
      },
      {
        id: 'bio-11-12',
        title: 'ጄኔቲክስን ዲኤንኤን (Genetics & DNA)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'ናይ ውርሻ ሕግታትን ሞለኪውላር ባዮሎጂን',
        lessonContent: [
          'ጄኔቲክስ ባህርያት ካብ ወለዲ ናብ ውላድ ዝተሓላለፉሉ መፅናዕቲ እዩ። ግሬጎር ሜንደል ናይ ዓተር ተኽሊ ብምምራሕ ናይ ውርሻ ሕግታት ኣስፊሩ።',
          'ዲኤንኤ (DNA) ድርብ ሄሊክስ (double helix) ኮይኑ ኣዴኒን (A) ምስ ታይሚን (T)፤ ጉዋኒን (G) ድማ ምስ ሳይቶሲን (C) ይጣመር።',
          'ፕሮቲን ምድላው ክልተ ደረጃታት ኣለዎ፡ ትራንስክሪፕሽን (ካብ DNA ናብ mRNA ምቕዳሕ) ከምኡውን ትራንስሌሽን (ኣብ ራይቦዞም ናብ ፕሮቲን ምቕያር)።'
        ],
        keyPoints: [
          'ናይ ቤዝ ጥምረት፡ A = T ከምኡውን G ≡ C',
          'ትራንስክሪፕሽን (ኣብ ኒውክሊየስ)ን ትራንስሌሽን (ኣብ ራይቦዞም)ን',
          'ሜንደሊያን ጄኔቲክስ፡ ዶሚናንትን ሪሴሲቭን ኣሌላት'
        ],
        flashcards: [
          {
            id: 'b2-fc1',
            front: 'ኣብ ዲኤንኤ ምስ ኣዴኒን (A) ዝጣመር ቤዝ ኣየናይ እዩ?',
            back: 'ታይሚን (Thymine - T) እዩ።'
          },
          {
            id: 'b2-fc2',
            front: 'ትራንስክሪፕሽን (Transcription) እንታይ እዩ?',
            back: 'ካብ ዲኤንኤ ሓበሬታ ተወሲዱ mRNA ዝዳለወሉ ከይዲ።'
          },
          {
            id: 'b2-fc3',
            front: 'ኣቦ ጄኔቲክስ ተባሂሉ ዝፍለጥ መን እዩ?',
            back: 'ግሬጎር ሜንደል (Gregor Mendel) እዩ።'
          },
          {
            id: 'b2-fc4',
            front: 'ሓደ ኮዶን (Codon) ክንደይ ቤዞች ይሕዝ?',
            back: '3 ቤዞች (Triplet code)።'
          }
        ],
        quizQuestions: [
          {
            id: 'b2-q1',
            question: 'ኣብ ኣርኤንኤ (RNA) ኣብ ክንዲ ታይሚን (T) ዝርከብ ናይ ናይትሮጅን ቤዝ ኣየናይ እዩ?',
            options: ['ዩራሲል (Uracil - U)', 'ኣዴኒን', 'ሳይቶሲን', 'ጉዋኒን'],
            correctIndex: 0,
            explanation: 'ኣብ RNA ውሽጢ ኣብ ክንዲ ታይሚን ዩራሲል (U) ይርከብ።'
          },
          {
            id: 'b2-q2',
            question: 'ኣብ ሞንጎ ክልተ ሄትሮዛይገስ (Aa × Aa) ኣብ ዝግበር ምውላድ ናይ ሪሴሲቭ (aa) ዕድል ክንደይ እዩ?',
            options: ['25% (1/4)', '50% (1/2)', '75% (3/4)', '100%'],
            correctIndex: 0,
            explanation: 'ውፅኢቱ 1 AA : 2 Aa : 1 aa ስለዝኾነ ናይ aa ዕድል 1/4 (25%) እዩ።'
          },
          {
            id: 'b2-q3',
            question: 'ናይ ዲኤንኤ ድርብ ሄሊክስ ቅርፂ ኣብ 1953 ዘረጋገፁ መን እዮም?',
            options: ['ዋትሰንን ክሪክን (Watson & Crick)', 'ዳርዊንን ዋላስን', 'ሜንደልን ሞርጋንን', 'ፓስተርን ኮክን'],
            correctIndex: 0,
            explanation: 'ጄምስ ዋትሰንን ፍራንሲስ ክሪክን ናይ ዲኤንኤ ድርብ ሰንሰለት ኣረጋጊፆም።'
          },
          {
            id: 'b2-q4',
            question: 'ሚውቴሽን (Mutation) ማለት እንታይ ማለት እዩ?',
            options: ['ኣብ ዲኤንኤ ቅደም ተኸተል ዝፍጠር ድንገታዊ ቋሚ ለውጢ', 'ስሩዕ ናይ ህዋስ ዕቤት', 'ናይ ማይ ምብኻን', 'ናይ ፕሮቲን ምሕቃቕ'],
            correctIndex: 0,
            explanation: 'ሚውቴሽን ኣብ ጀነቲክ መረዳእታ ዝፍጠር ድንገታዊ ለውጢ እዩ።'
          }
        ]
      }
    ]
  },

  // 5. English
  {
    id: 'english',
    name: 'English',
    subName: 'ቋንቋ እንግሊዝ',
    accentColor: '#0D9488',
    accentLight: '#F0FDFA',
    accentBorder: '#14B8A6',
    accentBadge: '#115E59',
    topics: [
      {
        id: 'eng-9-10',
        title: 'Active & Passive Voice and Verb Tenses',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Grammar and Sentence Structures',
        lessonContent: [
          'In English grammar, active voice emphasizes the doer: "The student solved the problem." In passive voice, emphasis is on the action/recipient: "The problem was solved by the student."',
          'Forming passive voice requires the appropriate form of "to be" + Past Participle (V3). It is commonly used in scientific and objective writing.',
          'Mastering tenses (Simple Past, Past Continuous, Present Perfect) ensures accurate expression of time and completion.'
        ],
        keyPoints: [
          'Active: Subject acts (e.g. Almaz baked a cake)',
          'Passive: Subject receives action (e.g. A cake was baked by Almaz)',
          'Formula: "to be" + Past Participle (V3)'
        ],
        flashcards: [
          {
            id: 'e1-fc1',
            front: 'Passive form of "Hagos wrote the essay"?',
            back: '"The essay was written by Hagos."'
          },
          {
            id: 'e1-fc2',
            front: 'When is passive voice used?',
            back: 'When the action/result is more important than the actor.'
          },
          {
            id: 'e1-fc3',
            front: 'What is the past participle of "take"?',
            back: '"Taken" (take - took - taken).'
          },
          {
            id: 'e1-fc4',
            front: 'Passive of "They are fixing the road"?',
            back: '"The road is being fixed."'
          }
        ],
        quizQuestions: [
          {
            id: 'e1-q1',
            question: 'Identify the passive sentence:',
            options: [
              'The examination was prepared carefully.',
              'Students prepared for the exam.',
              'The teacher gave us books.',
              'We solved the questions.'
            ],
            correctIndex: 0,
            explanation: '"Was prepared" uses "be + V3", placing recipient first.'
          },
          {
            id: 'e1-q2',
            question: 'Complete: "When we arrived, the bus _______."',
            options: ['had already left', 'has left', 'was leaving', 'leaves'],
            correctIndex: 0,
            explanation: 'Past Perfect denotes an action completed before another past event.'
          },
          {
            id: 'e1-q3',
            question: 'Passive form of "Leonardo painted the Mona Lisa"?',
            options: [
              'The Mona Lisa was painted by Leonardo.',
              'The Mona Lisa is painted by Leonardo.',
              'The Mona Lisa has painted by Leonardo.',
              'Leonardo was painted by the Mona Lisa.'
            ],
            correctIndex: 0,
            explanation: 'Simple past passive requires "was + painted".'
          },
          {
            id: 'e1-q4',
            question: 'Which sentence uses Present Perfect correctly?',
            options: [
              'They have lived in Mekelle for seven years.',
              'They lived in Mekelle since seven years.',
              'They are living in Mekelle yesterday.',
              'They had live in Mekelle.'
            ],
            correctIndex: 0,
            explanation: '"Have lived" with "for seven years" indicates ongoing duration.'
          }
        ]
      },
      {
        id: 'eng-11-12',
        title: 'Conditionals & Discourse Markers',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Advanced Conditionals and Academic Cohesion',
        lessonContent: [
          'Conditionals describe hypothetical situations. Third conditional deals with unreal past: "If + had + V3, would have + V3" (e.g., "If I had known, I would have attended").',
          'Inversion can be used in formal style: "Had we known..." instead of "If we had known...".',
          'Discourse markers (moreover, consequently, nevertheless, in contrast) build logical links in essays.'
        ],
        keyPoints: [
          '3rd Conditional: If + had + V3, would have + V3 (unreal past)',
          'Inversion: "Had I known..." replaces "If I had known..."',
          'Discourse markers establish clear logical progression'
        ],
        flashcards: [
          {
            id: 'e2-fc1',
            front: 'What does the 3rd Conditional express?',
            back: 'An unreal past situation and its imaginary result.'
          },
          {
            id: 'e2-fc2',
            front: 'Complete: "If I had studied, I _______ passed."',
            back: '"would have" (3rd conditional).'
          },
          {
            id: 'e2-fc3',
            front: 'Give a discourse marker showing contrast.',
            back: '"Nevertheless" or "However".'
          },
          {
            id: 'e2-fc4',
            front: 'Inverted form of "If she had known"?',
            back: '"Had she known..."'
          }
        ],
        quizQuestions: [
          {
            id: 'e2-q1',
            question: '"If they _______ the train, they would have arrived on time."',
            options: ['had caught', 'caught', 'have caught', 'would catch'],
            correctIndex: 0,
            explanation: 'Third conditional requires "had caught" in the if-clause.'
          },
          {
            id: 'e2-q2',
            question: 'Which word signals cause and effect?',
            options: ['Consequently', 'However', 'In contrast', 'Meanwhile'],
            correctIndex: 0,
            explanation: '"Consequently" means as a result.'
          },
          {
            id: 'e2-q3',
            question: '"If the weather is clear tomorrow, we _______ the hike."',
            options: ['will start', 'would start', 'would have started', 'started'],
            correctIndex: 0,
            explanation: 'First conditional pairs present simple with "will + verb".'
          },
          {
            id: 'e2-q4',
            question: 'Choose the best coherent sentence:',
            options: [
              'The test was difficult; nevertheless, the students scored high.',
              'The test was difficult; because, the students scored high.',
              'The test was difficult; although, they scored high.',
              'The test was difficult; therefore, it was easy.'
            ],
            correctIndex: 0,
            explanation: '"Nevertheless" contrasts the difficulty with the high score.'
          }
        ]
      }
    ]
  },

  // 6. ስነ-ፅሑፍን ቋንቋን (Tigrinya & Literature)
  {
    id: 'amharic',
    name: 'ስነ-ፅሑፍ',
    subName: 'ትግርኛን ስነ-ፅሑፍን',
    accentColor: '#D97706',
    accentLight: '#FFFBEB',
    accentBorder: '#F59E0B',
    accentBadge: '#B45309',
    topics: [
      {
        id: 'amh-9-10',
        title: 'ዓይነታት ስነ-ፅሑፍን ስነ-ቓልን',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'ናይ ስነ-ፅሑፍ ቅርፅታትን ናይ ቋንቋ ፅባቐን',
        lessonContent: [
          'ስነ-ፅሑፍ ናይ ደቂ-ሰባት ኣተሓሳስባ፣ ስምዒትን ማሕበራዊ ናብራን ብውቁብ ቋንቋ ዝገልፅ ናይ ጥበብ ዓውዲ እዩ። ኣብ ክልተ ይኽፈል፡ ስነ-ቓል (ብቓል ዝተሓላለፍ) ከምኡውን ስነ-ፅሑፍ (ብፅሑፍ ዝሰፈረ)።',
          'ስነ-ቓል ምስላታት፣ ሕንቅሕንቅሊተይ፣ ሙሾ፣ ናይ መርዓን ጅግንነትን ደርፍታት የጠቓልል።',
          'ፅሑፋዊ ስነ-ፅሑፍ ድማ ግጥሚ፣ ልቦለድ፣ ተዋስኦ (ድራማ) የጠቓልል። ናይ ልቦለድ ቀንዲ ባእታታት ጭብጢ፣ ሴራ፣ ገፀ-ባህርን መቼትን እዮም።'
        ],
        keyPoints: [
          'ስነ-ቓል፡ ካብ ኣፍ ናብ ኣፍ ዝተሓላለፈ ህያው ቅርስ',
          'ናይ ልቦለድ ባእታታት፡ ጭብጢ፣ ሴራ፣ ገፀ-ባህርን መቼትን',
          'ናይ ግጥሚ መለለዪ፡ ቤት፣ ምትን ስንኝን'
        ],
        flashcards: [
          {
            id: 'a1-fc1',
            front: 'ስነ-ቓል (Oral Literature) እንታይ እዩ?',
            back: 'ካብ ወለዶ ናብ ወለዶ ብቓል ዝተሓላለፈ ስነ-ፅሑፍ እዩ።'
          },
          {
            id: 'a1-fc2',
            front: 'ናይ ልቦለድ ፍፃመታት ቅደም ተኸተል እንታይ ይበሃል?',
            back: 'ሴራ (Plot) ይበሃል።'
          },
          {
            id: 'a1-fc3',
            front: 'ናይ ተዋስኦ (Drama) ቀንዲ መለለዪ እንታይ እዩ?',
            back: 'ኣብ መድረኽ ብተዋሳእቲ ዝቐርብ ናይ ስነ-ፅሑፍ ዓይነት እዩ።'
          },
          {
            id: 'a1-fc4',
            front: 'ናይ ስነ-ቓል ኣብነታት ሃብ?',
            back: 'ምስላታት፣ ሕንቅሕንቅሊተይ፣ ቀረርቶ፣ ሙሾ።'
          }
        ],
        quizQuestions: [
          {
            id: 'a1-q1',
            question: 'ናይ ሓደ ልቦለድ ቀንዲ ማእኸላይ ሓሳብ እንታይ ይበሃል?',
            options: ['ጭብጢ (Theme)', 'ሴራ', 'መቼት', 'ገፀ-ባህሪ'],
            correctIndex: 0,
            explanation: 'ጭብጢ እቲ ፀሓፊ ከሕልፎ ዝደለየ ቀንዲ ማእኸላይ ሓሳብ እዩ።'
          },
          {
            id: 'a1-q2',
            question: 'ካብዞም ዝስዕቡ ናይ ስነ-ቓል ዘይኮነ ኣየናይ እዩ?',
            options: ['ነዊሕ ልቦለድ (Novel)', 'ምስላታት', 'ሕንቅሕንቅሊተይ', 'ቀረርቶ'],
            correctIndex: 0,
            explanation: 'ነዊሕ ልቦለድ ብፅሑፍ ዝዳሎ እምበር ብቓል ዝተሓላለፍ ኣይኮነን።'
          },
          {
            id: 'a1-q3',
            question: 'እቲ ታሪኽ ዝተፈፀመሉ ቦታን ግዜን እንታይ ይበሃል?',
            options: ['መቼት (Setting)', 'ሴራ', 'ግጭት', 'ድባብ'],
            correctIndex: 0,
            explanation: 'መቼት መዓዝን ኣበይን ከምዝተፈፀመ የረድእ።'
          },
          {
            id: 'a1-q4',
            question: 'ናይ ግጥሚ ሓደ መስመር እንታይ ይበሃል?',
            options: ['ስንኝ', 'ሓረግ', 'ቤት', 'ቕኝት'],
            correctIndex: 0,
            explanation: 'ናይ ግጥሚ ነፀላ መስመር ስንኝ ይበሃል።'
          }
        ]
      },
      {
        id: 'amh-11-12',
        title: 'ቅኔን ጥበብ ሰምና ወርቅን',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'ዕሙቕ ዝበለ ናይ ቋንቋ ፍልስፍናን ምስጢርን',
        lessonContent: [
          'ሰምና ወርቅ ክልተ ገፅታ ዘለዎ ናይ ግጥምን ዘረባን ጥበብ እዩ። ሰም እቲ ብቐሊሉ ዝስማዕ ግልፂ ትርጉም ክኸውን ከሎ፣ ወርቂ ድማ እቲ ዝተሰወረ ዕሙቕ ትርጉም እዩ።',
          'ሕብረ-ቓል ነቲ ሰምን ወርቅን ዘተኣሳስር ድልድል እዩ። ቅኔ ማሕበራዊ ነቐፌታ፣ ፍቕርን መንፈሳዊ ምስጢራትን ንምግላፅ የገልግል።',
          'እዚ ባህላዊ ጥበብ ኣብ ኢትዮጵያ ንዘመናት ኣብ ኣብነት ኣቢያተ-ትምህርቲ ክምህር ዝፀንሐ ብሉፅ ቅርስና እዩ።'
        ],
        keyPoints: [
          'ሰም፡ ግልፂ ደጋዊ ትርጉም',
          'ወርቂ፡ ምስጢራዊ ዕሙቕ ፍቺ (ናይ ሓቂ መልእኽቲ)',
          'ሕብረ-ቓል፡ ክልቲኦም ትርጉማት ዘተኣሳስር ቃል'
        ],
        flashcards: [
          {
            id: 'a2-fc1',
            front: 'ኣብ ሰምና ወርቅ "ሰም" እንታይ እዩ?',
            back: 'እቲ ብግልፂ ዝስማዕ ናይ ላዕሊ ትርጉም እዩ።'
          },
          {
            id: 'a2-fc2',
            front: 'ኣብ ሰምና ወርቅ "ወርቂ" እንታይ እዩ?',
            back: 'እቲ ብስውር ዝተሓብአ ናይ ሓቂ ዕሙቕ መልእኽቲ።'
          },
          {
            id: 'a2-fc3',
            front: 'ሕብረ-ቓል እንታይ ማለት እዩ?',
            back: 'ክልተ ዝተፈላለዩ ትርጉማት ሒዙ ዘተኣሳስር ቁልፊ ቃል እዩ።'
          },
          {
            id: 'a2-fc4',
            front: 'ቅኔ እንታይ ረብሓ ኣለዎ?',
            back: 'ሓሳባት ብዕሙቕን ብጥበብን ንምግላፅ የገልግል።'
          }
        ],
        quizQuestions: [
          {
            id: 'a2-q1',
            question: 'ኣብ ሰምና ወርቅ ነቲ ሰምን ወርቅን ዘተኣሳስር ቃል እንታይ ይበሃል?',
            options: ['ሕብረ-ቓል', 'መዕፀዊ ቤት', 'ስንኝ', 'ቅኝት'],
            correctIndex: 0,
            explanation: 'ሕብረ-ቓል ክልቲኦም ትርጉማት ዘራኽብ መትረብ እዩ።'
          },
          {
            id: 'a2-q2',
            question: 'እቲ ብቐሊሉ ዝርዳእ ናይ ላዕሊ ትርጉም እንታይ ይበሃል?',
            options: ['ሰም', 'ወርቂ', 'ስንኝ', 'ቤት'],
            correctIndex: 0,
            explanation: 'ሰም እቲ ናይ ላዕሊ ግልፂ ትርጉም እዩ።'
          },
          {
            id: 'a2-q3',
            question: 'ቅኔ ብዋናነት ኣበይ ይምሃርን ይዳሎን?',
            options: ['ኣብ ናይ ኣብነት (ቅኔ) ኣብያተ-ትምህርቲ', 'ኣብ ዘመናዊ ኮሌጃት ጥራሕ', 'ኣብ ወፃኢ ሃገር', 'ኣብ ቤተ-መዘክር'],
            correctIndex: 0,
            explanation: 'ቅኔ ኣብ ባህላዊ ናይ ኣብነት ትምህርትታት ዝዕቀብ ጥበብ እዩ።'
          },
          {
            id: 'a2-q4',
            question: 'ናይ ሰምና ወርቅ ቀንዲ ረብሓ እንታይ እዩ?',
            options: ['ሓሳብ ብዕሙቕን ብጥበባዊ መልክዕን ምግላፅ', 'ቃላት ምሕፃር ጥራሕ', 'ፊደላት ምቕናስ', 'ድምፂ ምዕባይ'],
            correctIndex: 0,
            explanation: 'ሓሳብ ብስሉጥን ብዕሙቕን መገዲ ንምግላፅ የኽእል።'
          }
        ]
      }
    ]
  },

  // 7. ታሪኽን ማሕበራዊ ሳይንስን (History)
  {
    id: 'social-studies',
    name: 'ታሪኽ',
    subName: 'ታሪኽን ማሕበራዊ ሳይንስን',
    accentColor: '#B91C1C',
    accentLight: '#FEF2F2',
    accentBorder: '#DC2626',
    accentBadge: '#991B1B',
    topics: [
      {
        id: 'soc-9-10',
        title: 'ስልጣነ ኣኽሱምን ንግድን',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'ስልጣነ ኣኽሱም፣ ቴክኖሎጂን ናይ ቀይሕ ባሕሪ ንግድን',
        lessonContent: [
          'ስልጣነ ኣኽሱም ኣብ ቀርኒ ኣፍሪቃን ቀይሕ ባሕርን ካብ ዝነበሩ ዓበይቲ ጥንታዊ ስልጣነታት ሓደ እዩ ነይሩ። ካብ ቀዳማይ ክሳብ ሻውዓይ ክፍለ ዘመን ኣብ ሕርሻ፣ ስራሕቲ ብረት፣ ቅርፂ እምንን ንግድን ዝለዓለ ብርኪ በፂሑ ነይሩ።',
          'ኣኽሱም ናይ ባዕላ ሳንቲም ዝቐረፀት ቀዳመይቲ ኣፍሪቃዊት ስልጣነ ኮይና፣ ብወደብ ኣዱሊስ ኣቢላ ምስ ሮማ፣ ግሪክ፣ ህንድን ባይዛንታይንን ሰፊሕ ንግዲ ተካይድ ነይራ። ወርቂ፣ ስኒ ሓርማዝን ቅመማትን ትልእኽ ነይራ።',
          'ሓወልትታት ኣኽሱም፣ ዲማት ማይን ናይ ግእዝ ፅሑፋትን ናይቲ ስልጣነ ዕሙቕ ቴክኖሎጂን ጥበብን የርእዩ።'
        ],
        keyPoints: [
          'ወደብ ኣዱሊስ ናይ ቀይሕ ባሕሪ ዓለምለኸ ናይ ንግዲ ማእኸል ነይራ',
          'ኣኽሱም ናይ ባዕላ ናይ ወርቅን ብሩርን ሳንቲም ቀሪፃ',
          'ሓወልትታት ብዘይ ሲሚንቶ ብሓደ ወጥ እምኒ ዝተሰርሑ እዮም'
        ],
        flashcards: [
          {
            id: 's1-fc1',
            front: 'ናይ ኣኽሱም ቀንዲ ዓለምለኸ ወደብ ከተማ እንታይ ነይራ?',
            back: 'ኣዱሊስ (Adulis - ኣብ ቀይሕ ባሕሪ)።'
          },
          {
            id: 's1-fc2',
            front: 'ኣብ ሳንቲም ኣኽሱም ምስሎም ዘቐረፁ ቀዳማይ ንጉስ መን እዮም?',
            back: 'ንጉስ እንድቢስ (King Endubis)።'
          },
          {
            id: 's1-fc3',
            front: 'ኣኽሱም ናብ ወፃኢ ትልእኮም ዝነበረት ቀንዲ ፍርያት?',
            back: 'ስኒ ሓርማዝ፣ ወርቂ፣ ዝባድ፣ ዕጣን።'
          },
          {
            id: 's1-fc4',
            front: 'ስልጣነ ኣኽሱም ዝደኸመሉ ቀንዲ ምክንያት እንታይ ነይሩ?',
            back: 'ናይ ቀይሕ ባሕሪ ንግዲ መስመር ብዓረባት ምቁፃፅሩን ወደባት ምዕፃውን።'
          }
        ],
        quizQuestions: [
          {
            id: 's1-q1',
            question: 'መንግስቲ ኣኽሱም ናይ ባዕሉ ሳንቲም ምሕታም ዝጀመረ መዓዝ እዩ?',
            options: ['ኣብ መወዳእታ መበል 3ይ ክፍለ ዘመን', 'ኣብ መበል 10ይ ክፍለ ዘመን', 'ኣብ 1ይ ክፍለ ዘመን ቅድመ ልደት', 'ኣብ መበል 16ይ ክፍለ ዘመን'],
            correctIndex: 0,
            explanation: 'ኣብ መበል 3ይ ክፍለ ዘመን ብንጉስ እንድቢስ ዘመን ተጀሚሩ።'
          },
          {
            id: 's1-q2',
            question: 'ስልጣነ ኣኽሱም ምስ ኣየናይ ጥንታዊ ሓይሊ ርክብ ኣይነበሮን?',
            options: ['ስልጣነ ኢንካ (ደቡብ ኣሜሪካ)', 'ናይ ሮማ ግዝኣት', 'ናይ ባይዛንታይን ግዝኣት', 'ጥንታዊት ህንዲ'],
            correctIndex: 0,
            explanation: 'ኢንካ ኣብ ደቡብ ኣሜሪካ ስለዝነበረት ምስ ኣኽሱም ርክብ ኣይነበራን።'
          },
          {
            id: 's1-q3',
            question: 'ናይ ኣኽሱም ዓበይቲ ሓወልትታት ብምንታይ ዓይነት እምኒ ዝተሰርሑ እዮም?',
            options: ['ብሓደ ወጥ ግራናይት እምኒ (Monolithic)', 'ብዝተቓፀለ ጡብ', 'ብእብነ በረድ', 'ብጭቃ'],
            correctIndex: 0,
            explanation: 'ሓወልትታት ኣኽሱም ካብ ሓደ ወጥ እምኒ ዝተቐረፁ ድንቂ ቅርስታት እዮም።'
          },
          {
            id: 's1-q4',
            question: 'ክርስትና ብወግዒ ናብ ኣኽሱም ዝኣተወ ብናይ መን ንጉስ ዘመን እዩ?',
            options: ['ንጉስ ኢዛና (King Ezana)', 'ንጉስ ካሌብ', 'ንጉስ ገብረ መስቀል', 'ንጉስ እንድቢስ'],
            correctIndex: 0,
            explanation: 'ኣብ መበል 4ይ ክፍለ ዘመን ብንጉስ ኢዛና ዘመን ወግዓዊ ሃይማኖት ኮይኑ።'
          }
        ]
      },
      {
        id: 'soc-11-12',
        title: 'ዘመናዊ ታሪኽን ዓወት ዓድዋን (Battle of Adwa)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'ልኡላውነት ምሕላውን ፀረ-መግዛእቲ ዓወት ዓድዋን',
        lessonContent: [
          'ዓወት ዓድዋ (23 የካቲት 1888 ዓ.ም / March 1, 1896) መላእ ህዝቢ ብሓድነት ተላዒሉ ንመግዛእቲ ኢጣልያ ስዕረት ዘስተማቐረሉ ታሪኻዊ ፍፃመ እዩ። እዚ ዓወት ንመላእ ፀለምቲ ህዝብታት ዓለም ናይ ሓርነት ፋና ኮይኑ።',
          'ናይቲ ኲናት መበገሲ ናይ ውዕሊ ውጫሌ ዓንቀፅ 17 ናይ ትርጉም ፍልልይ ነይሩ። ናይ ጣልያንኛ ቅዳሕ ኢትዮጵያ ናይ ወፃኢ ርክባ ብጣልያን ኣቢላ ክትገብር "ኣለዋ" ክብል ከሎ፣ ናይ ኣምሓርኛ ግን "ትኽእል" ብምባል ልኡላውነት ዘኽበረ ነይሩ።',
          'ዳግማዊ ዳግማዊ ምኒልክን እቴጌ ጣይቱን ህዝቢ ኣተሓባቢሮም ናብ ዓድዋ ብምዝማት ንሰራዊት ጄኔራል ባራቲየሪ ብስልቲ ስዒሮምዎ።'
        ],
        keyPoints: [
          'ዕለት ዓወት፡ 23 የካቲት 1888 ዓ.ም (March 1, 1896)',
          'ውዕሊ ውጫሌ ዓንቀፅ 17 ናይቲ ኲናት ቀንዲ መበገሲ ነይሩ',
          'እቲ ዓወት ናይ ፓን-ኣፍሪካኒዝም መሰረት ኮይኑ'
        ],
        flashcards: [
          {
            id: 's2-fc1',
            front: 'ኲናት ዓድዋ መዓዝ ተኻይዱ?',
            back: '23 የካቲት 1888 ዓ.ም (March 1, 1896)።'
          },
          {
            id: 's2-fc2',
            front: 'መበገሲ ኲናት ዓድዋ ዝነበረ ሰነድ እንታይ ይበሃል?',
            back: 'ውዕሊ ውጫሌ ዓንቀፅ 17 (Wuchale Treaty Article 17)።'
          },
          {
            id: 's2-fc3',
            front: 'ንሰራዊት ጣልያን ዝመርሐ ጄኔራል መን ነይሩ?',
            back: 'ጄኔራል ኦሬስቴ ባራቲየሪ (General Oreste Baratieri)።'
          },
          {
            id: 's2-fc4',
            front: 'ዓወት ዓድዋ ንዓለም እንታይ ትርጉም ኣለዎ?',
            back: 'ናይ ፀረ-መግዛእትን ናይ ሓርነትን ዓርማ ኮይኑ።'
          }
        ],
        quizQuestions: [
          {
            id: 's2-q1',
            question: 'ውዕሊ ውጫሌ ዝተፈረመ መዓዝ ነይሩ?',
            options: ['ኣብ 1881 ዓ.ም (1889 G.C.)', 'ኣብ 1888 ዓ.ም', 'ኣብ 1870 ዓ.ም', 'ኣብ 1900 ዓ.ም'],
            correctIndex: 0,
            explanation: 'ውዕሊ ውጫሌ ግንቦት 1881 ዓ.ም ተፈሪሙ።'
          },
          {
            id: 's2-q2',
            question: 'ኣብ ከበባ መቐለ ናይ ማይ መስመር ብምቁፃፅር ወተሃደራዊ ብልጫ ዘምፀአት መራሒት መን እያ?',
            options: ['እቴጌ ጣይቱ ብጡል', 'ንግስቲ ዘውዲቱ', 'እቴጌ መነን', 'ንግስቲ እሌኒ'],
            correctIndex: 0,
            explanation: 'እቴጌ ጣይቱ ናይ መቐለ ማይ ብምኽላስ ጣልያናት ክስነፉ ወሳኒ ስልቲ ተጠቒመን።'
          },
          {
            id: 's2-q3',
            question: 'ድሕሪ ዓድዋ ጣልያን ናይ ኢትዮጵያ ናፅነት ዘረጋገፀትሉ ውዕሊ ኣየናይ እዩ?',
            options: ['ውዕሊ ኣዲስ ኣበባ (1896)', 'ውዕሊ ውጫሌ', 'ውዕሊ ለንደን', 'ውዕሊ ሮማ'],
            correctIndex: 0,
            explanation: 'ጥቅምቲ 1896 ብውዕሊ ኣዲስ ኣበባ ውዕሊ ውጫሌ ተሰሪዙ ናፅነት ተረጋጊፁ።'
          },
          {
            id: 's2-q4',
            question: 'ዓወት ዓድዋ ኣብ ዓለም ዘምፅኦ ቀንዲ ፅልዋ እንታይ እዩ?',
            options: ['ኣውሮጳውያን ኣይስዓሩን ዝብል ኣተሓሳስባ ምፍራስን ምንቅስቓስ ፓን-ኣፍሪካ ምልዕዓልን', 'ንግዲ ምቕናስ', 'ኣፍሪቃ ምሉእ ብምሉእ ብመግዛእቲ ምሓዝ', 'ወደባት ምዕፃው'],
            correctIndex: 0,
            explanation: 'ዓወት ዓድዋ ንመላእ ህዝብታት ኣፍሪቃ ናይ ሓርነት ትብዓት ሂቡ።'
          }
        ]
      }
    ]
  },

  // 8. ቴክኖሎጂ ሓበሬታን ርክብን (ICT)
  {
    id: 'ict',
    name: 'ICT',
    subName: 'ቴክኖሎጂ ሓበሬታ',
    accentColor: '#475569',
    accentLight: '#F8FAFC',
    accentBorder: '#64748B',
    accentBadge: '#334155',
    topics: [
      {
        id: 'ict-9-10',
        title: 'ሃርድዌር፣ ሶፍትዌርን ኔትወርክን',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'ናይ ኮምፒውተር ስርዓትን ኔትወርክ መሰረታትን',
        lessonContent: [
          'ኮምፒውተር ሲስተም ብሃርድዌር (ዝድህሰሱ ኣካላት - CPU, RAM, Storage) ከምኡውን ሶፍትዌር (ናይ ኮምፒውተር ፕሮግራማት) ዝቖመ እዩ።',
          'ሲፒዩ (CPU) ናይ ኮምፒውተር ሓንጎል እዩ። ራም (RAM) ግዚያዊ መዘከርታ ኮይኑ ኮምፒውተር ክጠፍእ ከሎ ዝጠፍእ እዩ፤ ሃርድ ድራይቭ ድማ ቋሚ መኽዘን እዩ።',
          'ኔትወርክ መሳርሕታት ሓበሬታ ክካፈሉ የኽእል። LAN (ናይ ከባቢ ኔትወርክ) ከምኡውን WAN (ሰፊሕ ኔትወርክ - ኢንተርኔት) ተባሂሎም ይኽፈሉ።'
        ],
        keyPoints: [
          'CPU፡ ናይ ኮምፒውተር ሓንጎል',
          'RAM (ግዚያዊ ማህደር) vs Storage (ቋሚ ማህደር)',
          'LAN (Local Network) vs WAN (Wide Network)'
        ],
        flashcards: [
          {
            id: 'i1-fc1',
            front: 'ናይ ኮምፒውተር ሓንጎል (Brain) ዝበሃል ክፍሊ ኣየናይ እዩ?',
            back: 'CPU (Central Processing Unit) እዩ።'
          },
          {
            id: 'i1-fc2',
            front: 'ፍልልይ RAMን ROMን እንታይ እዩ?',
            back: 'RAM ግዚያዊ (Volatile) ክኸውን ከሎ ROM ቋሚ እዩ።'
          },
          {
            id: 'i1-fc3',
            front: 'LAN እንታይ ማለት እዩ?',
            back: 'Local Area Network (ኣብ ሓደ ህንፃ ዘሎ ኔትወርክ)።'
          },
          {
            id: 'i1-fc4',
            front: 'ናይ ኦፕሬቲንግ ሲስተም (OS) ኣብነታት ሃብ?',
            back: 'Windows, Linux, macOS, Android, iOS።'
          }
        ],
        quizQuestions: [
          {
            id: 'i1-q1',
            question: 'ካብዞም ዝስዕቡ ናይ ምእታዊ መሳርሒ (Input Device) ኣየናይ እዩ?',
            options: ['ኪቦርድን ማውስን (Keyboard & Mouse)', 'ሞኒተር', 'ፕሪንተር', 'ስፒከር'],
            correctIndex: 0,
            explanation: 'ኪቦርድን ማውስን ትእዛዝ ናብ ኮምፒውተር ንምእታው የገልግሉ።'
          },
          {
            id: 'i1-q2',
            question: '1 ጊጋባይት (1 GB) ክንደይ ሜጋባይት (MB) እዩ?',
            options: ['1,024 MB', '100 MB', '1,000,000 MB', '10 MB'],
            correctIndex: 0,
            explanation: 'ኣብ ዲጂታል ስሌት 1 GB = 1024 MB እዩ።'
          },
          {
            id: 'i1-q3',
            question: 'ናይ ኢንተርኔት ገፃት ንምኽፋት እንጥቀመሉ ሶፍትዌር እንታይ ይበሃል?',
            options: ['ዌብ ብሮውዘር (Web Browser)', 'ኦፕሬቲንግ ሲስተም', 'ኣንቲቫይረስ', 'ስፕረድሺት'],
            correctIndex: 0,
            explanation: 'ብሮውዘራት (Chrome, Edge, Firefox) ገፃት ኢንተርኔት ንምርኣይ የገልግሉ።'
          },
          {
            id: 'i1-q4',
            question: 'ናይ IP ኣድራሻ ቀንዲ ተግባር እንታይ እዩ?',
            options: ['ኣብ ኔትወርክ ዘሎ መሳርሒ ብፍሉይ ምልላይ', 'ናይ ኮምፒውተር ፍጥነት ምውሳኽ', 'ቫይረስ ምክልኻል', 'ብርሃን ስክሪን ምስትኽኻል'],
            correctIndex: 0,
            explanation: 'IP Address ኣብ ኔትወርክ ዘለዉ መሳርሕታት መፍለዪ ቁፅሪ እዩ።'
          }
        ]
      },
      {
        id: 'ict-11-12',
        title: 'ዳታቤዝን ሳይበር ድሕንነትን (Databases & Cybersecurity)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'ሪሌሽናል ዳታቤዝን ዲጂታል ድሕንነትን',
        lessonContent: [
          'ዳታቤዝ (Database) ዝተወደበ መረዳእታ ብስርዓት ንምኽዛንን ንምፍታሽን የኽእል። RDBMS መረዳእታ ብሰንጠረዥ (Tables - Rows & Columns) የቐምጥ።',
          'SQL (Structured Query Language) ንዳታቤዝ ንምእዛዝ እንጥቀመሉ ቋንቋ ኮይኑ SELECT፣ INSERT፣ UPDATEን DELETEን መሰረታዊ ትእዛዛት እዮም። Primary Key ነፍሲ ወከፍ ረድፍ ብፍሉይ ይፈልይ።',
          'ሳይበር ድሕንነት (Cybersecurity) ኮምፒውተራትን ኔትወርክን ካብ መጥቃዕቲ (Malware, Phishing) ናይ ምክልኻል ጥበብ እዩ።'
        ],
        keyPoints: [
          'SQL፡ SELECT, INSERT, UPDATE, DELETE',
          'Primary Key፡ ነፍሲ ወከፍ ሪከርድ ብፍሉይ ዝፈልይ መፍለዪ',
          'ዓንደ-ሕቖታት ድሕንነት፡ Confidentiality, Integrity, Availability'
        ],
        flashcards: [
          {
            id: 'i2-fc1',
            front: 'ኣብ ዳታቤዝ ፕራይማሪ ኪይ (Primary Key) እንታይ እዩ?',
            back: 'ኣብ ሰንጠረዥ ነፍሲ ወከፍ ረድፍ (Record) ብፍሉይ ዝፈልይ ቁልፊ እዩ።'
          },
          {
            id: 'i2-fc2',
            front: 'ፊሺንግ (Phishing) እንታይ ዓይነት መጥቃዕቲ እዩ?',
            back: 'ተጠቃሚ ብምጥላዕ ናይ ፓስዎርድ ወይ ባንኪ ሓበሬታ ንምስራቕ ዝለኣኽ ናይ ሓሶት መልእኽቲ።'
          },
          {
            id: 'i2-fc3',
            front: 'ካብ ዳታቤዝ መረዳእታ ንምምራፅ ዝሕግዝ ናይ SQL ትእዛዝ ኣየናይ እዩ?',
            back: 'SELECT ትእዛዝ (ንኣብነት፡ SELECT * FROM Students;)።'
          },
          {
            id: 'i2-fc4',
            front: 'ኢንክሪፕሽን (Encryption) ማለት እንታይ ማለት እዩ?',
            back: 'መረዳእታ ዘይተፈቐደሉ ሰብ ከየንብቦ ናብ ምስጢራዊ ኮድ ምቕያር።'
          }
        ],
        quizQuestions: [
          {
            id: 'i2-q1',
            question: 'ሓዱሽ መረዳእታ ናብ ሰንጠረዥ ንምእታው እንጥቀመሉ ናይ SQL ትእዛዝ ኣየናይ እዩ?',
            options: ['INSERT INTO', 'SELECT', 'UPDATE', 'CREATE ROW'],
            correctIndex: 0,
            explanation: 'INSERT INTO ሓደሽቲ ሪከርዳት ናብ ዳታቤዝ ንምእታው የገልግል።'
          },
          {
            id: 'i2-q2',
            question: 'CIA Triad ኣብ ሳይበር ድሕንነት እንታይ የመልክት?',
            options: [
              'Confidentiality, Integrity, Availability',
              'Computer, Internet, Access',
              'Code, Information, Authentication',
              'Cyber, Infrastructure, Algorithm'
            ],
            correctIndex: 0,
            explanation: 'ምስጢራውነት፣ ትክክለኛነትን ተበፃሓይነትን ናይ ድሕንነት መሰረታት እዮም።'
          },
          {
            id: 'i2-q3',
            question: 'Two-Factor Authentication (2FA) እንታይ ይጠቅም?',
            options: [
              'ተወሳኺ መረጋገፂ ኮድ ብምሕታት ናይ ኣካውንት ድሕንነት ንምሕያል',
              'ናይ ኢንተርኔት ፍጥነት ንምውሳኽ',
              'ባትሪ ንምቑጣብ',
              'ፓስዎርድ ከየድሊ ንምግባር'
            ],
            correctIndex: 0,
            explanation: '2FA ፓስዎርድ እንተተሰረቐ እኳ ብካልኣይ ደረጃ ኣካውንት ይሕሉ።'
          },
          {
            id: 'i2-q4',
            question: 'ፋየርዎል (Firewall) ኣብ ኔትወርክ እንታይ ይሰርሕ?',
            options: [
              'ትራፊክ ኔትወርክ ብምቁፃፅር ዘይተፈቐደ መእተዊ ምክልኻል',
              'ኮምፒውተር ከይረስን ምዝሓል',
              'ዝጠፍኡ ፋይላት ምምላስ',
              'ናይ ኤሌክትሪክ ሓይሊ ምስትኽኻል'
            ],
            correctIndex: 0,
            explanation: 'ፋየርዎል ዘይተፈቐደ ናይ ኔትወርክ ርክብ ዝከላኸል ጋሻ እዩ።'
          }
        ]
      }
    ]
  }
];
