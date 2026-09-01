import { Subject } from '../types';

export const curriculumOromo: Subject[] = [
  // 1. Herrega (Mathematics)
  {
    id: 'math',
    name: 'Herrega',
    subName: 'Mathematics (Kutaa 9-12)',
    accentColor: '#1D4ED8',
    accentLight: '#EFF6FF',
    accentBorder: '#2563EB',
    accentBadge: '#1E40AF',
    topics: [
      {
        id: 'math-9-10',
        title: 'Hiriira Kwoodraatiikii (Quadratic Equations)',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Mala Furmaata Walqixxoo Sadarkaa Lammaffaa',
        lessonContent: [
          'Walqixxoon kwoodraatiikii boca idilee ax² + bx + c = 0 jedhuun barreeffama; bakka a, b fi c lakkoofsota dhugaa ta\'anii fi a ≠ 0 ta\'eetti. Aangoon ol\'aanaan jijjiiramaa 2 dha.',
          'Mala sadiin furuun ni danda\'ama: Faaktaraayizeeshinii (Factorization), Guutuu Iskuweerii (Completing the square), fi Foormulaa Kwoodraatiikii: x = (-b ± √(b² - 4ac)) / (2a).',
          'Hangi (b² - 4ac) Diskiriiminaantii (D) jedhama. D > 0 yoo ta\'e hidda dhugaa lama adda addaa qaba; D = 0 yoo ta\'e hidda dhugaa tokko qofa qaba; D < 0 yoo ta\'e hidda dhugaa hin qabu.'
        ],
        keyPoints: [
          'Boca Idilee: ax² + bx + c = 0 (a ≠ 0)',
          'Foormulaa Kwoodraatiikii: x = (-b ± √(b² - 4ac)) / 2a',
          'Diskiriiminaantiin D = b² - 4ac amala hiddootaa murteessa'
        ],
        flashcards: [
          {
            id: 'm1-fc1',
            front: 'Walqixxoon kwoodraatiikii maali?',
            back: 'Walqixxoo poolinoomiyaalii aangoon isaa ol\'aanaan 2 ta\'e (ax² + bx + c = 0).'
          },
          {
            id: 'm1-fc2',
            front: 'Diskiriiminaantiin (D) maali?',
            back: 'D = b² - 4ac, kan baay\'ina fi akaakuu hiddootaa agarsiisudha.'
          },
          {
            id: 'm1-fc3',
            front: 'Yoo D < 0 ta\'e hiddoonni akkami?',
            back: 'Hiddi dhugaa (real root) hin jiru.'
          },
          {
            id: 'm1-fc4',
            front: 'Foormulaan Kwoodraatiikii maalidha?',
            back: 'x = (-b ± √(b² - 4ac)) / (2a)'
          }
        ],
        quizQuestions: [
          {
            id: 'm1-q1',
            question: 'Yoo b² - 4ac = 0 ta\'e, walqixxichi hidda dhugaa meeqa qaba?',
            options: ['Hidda dhugaa tokko qofa', 'Hidda dhugaa hin qabu', 'Hidda adda addaa lama', 'Hidda afur'],
            correctIndex: 0,
            explanation: 'Diskiriiminaantiin zeeroo yoo ta\'e hidda dhugaa tokko qofa (kan irra deddeebi\'ame) qaba.'
          },
          {
            id: 'm1-q2',
            question: 'Furmaanni x² - 5x + 6 = 0 maalidha?',
            options: ['x = 2 fi x = 3', 'x = -2 fi x = -3', 'x = 1 fi x = 6', 'x = -1 fi x = 5'],
            correctIndex: 0,
            explanation: '(x - 2)(x - 3) = 0 ta\'ee yoo baafamu x = 2 fi x = 3 ta\'a.'
          },
          {
            id: 'm1-q3',
            question: 'Giraafiin faankishinii kwoodraatiikii bifa akkamii qaba?',
            options: ['Paaraabolaa (Parabola)', 'Sarara Qajeelaa', 'Geengoo', 'Sillindara'],
            correctIndex: 0,
            explanation: 'Giraafiin walqixxoo sadarkaa 2ffaa hundi bifa Paaraabolaatiin mul\'ata.'
          },
          {
            id: 'm1-q4',
            question: 'Walqixxoo 2x² + 4x - 6 = 0 keessatti gatiin a, b fi c meeqadha?',
            options: ['a=2, b=4, c=-6', 'a=4, b=2, c=6', 'a=2, b=-4, c=6', 'a=1, b=2, c=-3'],
            correctIndex: 0,
            explanation: 'Boca idilee ax² + bx + c = 0 waliin yoo ilaallu a=2, b=4, c=-6 ta\'a.'
          }
        ]
      },
      {
        id: 'math-11-12',
        title: 'Kaalkularii fi Deriiveetivii (Calculus & Derivatives)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Saffisa Jijjiirama Yeroo fi Hundee Deriiveetivii',
        lessonContent: [
          'Kaalkulasiin qo\'annoo jijjiirama wal-irraa hin cinneedha. Deriiveetiviin saffisa jijjiirama yeroo tokkoo fi dhaabbannaa sarara taanjeentii (slope of tangent line) shallaguuf tajaajila.',
          'Liimiitiin yoo ibsamu: f\'(x) = lim(h→0) [f(x+h) - f(x)] / h dha. Seerri kun qabxiilee ol\'aanoo fi gadi-aanoo (maxima/minima) adda baasuuf gargaara.',
          'Seeronni bu\'uuraa Power Rule d/dx(xⁿ) = n·xⁿ⁻¹, Product Rule, fi Chain Rule faankishinoota walxaxaa shallaguuf oolu.'
        ],
        keyPoints: [
          'Seera Aangoo (Power Rule): d/dx(xⁿ) = n · xⁿ⁻¹',
          'Hiika Ji\'oomeetirii: Dhaabbannaa (Slope) sarara taanjeentii',
          'Deriiveetiviin lakkoofsa dhaabbataa yeroo hunda 0 dha'
        ],
        flashcards: [
          {
            id: 'm2-fc1',
            front: 'Deriiveetiviin ji\'oomeetiriidhaan maal agarsiisa?',
            back: 'Dhaabbannaa (Slope) sarara taanjeentii qabxii sana irratti jiru.'
          },
          {
            id: 'm2-fc2',
            front: 'Deriiveetiviin f(x) = x⁴ meeqadha?',
            back: 'f\'(x) = 4x³ (Power Rule gargaaramuun).'
          },
          {
            id: 'm2-fc3',
            front: 'Deriiveetiviin lakkoofsa dhaabbataa (f(x) = 15) meeqa?',
            back: 'Yeroo hunda 0 (zeeroo) dha.'
          },
          {
            id: 'm2-fc4',
            front: 'Chain Rule yoom fayyadamna?',
            back: 'Faankishinoota wal-keessa jiran (composite functions) f(g(x)) shallaguuf.'
          }
        ],
        quizQuestions: [
          {
            id: 'm2-q1',
            question: 'Deriiveetiviin f(x) = 3x² + 5x - 7 meeqadha?',
            options: ['6x + 5', '3x + 5', '6x - 7', '6x² + 5'],
            correctIndex: 0,
            explanation: 'd/dx(3x²) = 6x, d/dx(5x) = 5, d/dx(-7) = 0 waan ta\'eef 6x + 5 ta\'a.'
          },
          {
            id: 'm2-q2',
            question: 'Bakka f\'(x) = 0 ta\'etti sararri taanjeentii akkam ta\'a?',
            options: ['Dallaa (Horizontal)', 'Dhaabbataa (Vertical)', 'Kofa 45', 'Hin jiru'],
            correctIndex: 0,
            explanation: 'Dhaabbannaan zeeroo ta\'uu jechuun sararichi dalgee (horizontal) dha jechuudha.'
          },
          {
            id: 'm2-q3',
            question: 'Deriiveetiviin f(x) = sin(x) maalidha?',
            options: ['cos(x)', '-cos(x)', '-sin(x)', 'tan(x)'],
            correctIndex: 0,
            explanation: 'Deriiveetiviin sin(x) kallattiin cos(x) ta\'a.'
          },
          {
            id: 'm2-q4',
            question: 'Faankishinii fageenyaa s(t) irraa saffisi battalaa akkamitti argama?',
            options: ['Deriiveetivii 1ffaa fudhachuun v(t) = ds/dt', 'Fageenya yeroon baay\'isuun', 'Saffisa dhiisuun', 'Iskuweerii gochuun'],
            correctIndex: 0,
            explanation: 'Saffisi battalaa deriiveetivii fageenyaati: v(t) = ds/dt.'
          }
        ]
      }
    ]
  },

  // 2. Fiiziksii (Physics)
  {
    id: 'physics',
    name: 'Fiiziksii',
    subName: 'Physics (Kutaa 9-12)',
    accentColor: '#7C3AED',
    accentLight: '#F5F3FF',
    accentBorder: '#8B5CF6',
    accentBadge: '#6D28D9',
    topics: [
      {
        id: 'phys-9-10',
        title: 'Seerota Sochii Niiwutan (Newton\'s Laws)',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Hundee Humna, Hangaa fi Sochii',
        lessonContent: [
          'Seerri Niiwutan sadan sochii qaamolee fi humna gidduu jiru ibsuun bu\'uura mekaaniksii kilasikaalaati.',
          'Seerri 1ffaa (Inarshiyaa): Qaamni tokko humni alaa irratti hin hojjenne yoo ta\'e bakka jirutti tura yookiin saffisa dhaabbataadhaan socho\'uu itti fufa. Seerri 2ffaa: Ariitiin humnatti kallattiin, hangatti immoo garagaltoodhaan wal-simata (F = ma).',
          'Seerri 3ffaa: Gocha hundaaf gocha-deebii (action-reaction) wal-qixa fi faallaa ta\'etu jira.'
        ],
        keyPoints: [
          'Seera 1ffaa: Inarshiyaa — jijjiirama sochii mormuu',
          'Seera 2ffaa: F = m · a (Humna = hanga × ariitii)',
          'Seera 3ffaa: Gocha fi Gocha-deebii qaamolee lama irratti'
        ],
        flashcards: [
          {
            id: 'p1-fc1',
            front: 'Seerri Niiwutan 1ffaan maal jedhama?',
            back: 'Seera Inarshiyaa (Law of Inertia) jedhama.'
          },
          {
            id: 'p1-fc2',
            front: 'Foormulaan Seera Niiwutan 2ffaa maali?',
            back: 'F = m · a (Humna = hanga × ariitii).'
          },
          {
            id: 'p1-fc3',
            front: 'Safartuun humnaa maalidha?',
            back: 'Niiwutan (N) yookiin kg·m/s².'
          },
          {
            id: 'p1-fc4',
            front: 'Fakkeenya Seera 3ffaa Niiwutan kenni.',
            back: 'Dakaa bishaan duubatti dhiibu, bishaanis dakaa gara fuulduraatti dhiiba.'
          }
        ],
        quizQuestions: [
          {
            id: 'p1-q1',
            question: 'Humni 50 N qaama hanga 10 kg qabu irratti yoo hojjete, ariitiin (a) meeqa ta\'a?',
            options: ['5 m/s²', '500 m/s²', '0.2 m/s²', '40 m/s²'],
            correctIndex: 0,
            explanation: 'a = F / m = 50 N / 10 kg = 5 m/s².'
          },
          {
            id: 'p1-q2',
            question: 'Yeroo konkolaataan tasa firiinii qabatu imaltoonni fuulduratti kan kuffifaman maaliifi?',
            options: ['Inarshiyaa (Inertia) irraa kan ka\'e', 'Humni harkisaa waan dabaleef', 'Rukuttan waan xiqqaateef', 'Dhiibbaa qilleensaa'],
            correctIndex: 0,
            explanation: 'Qaamni imaltootaa sochii duraan ture ittuma fufuu waan barbaaduufi.'
          },
          {
            id: 'p1-q3',
            question: 'Gochaa fi Gocha-deebiin (Action & Reaction) kan hojjetan:',
            options: ['Qaamolee lamaan adda addaa irratti', 'Qaama tokko qofa irratti', 'Kallattii tokkoon', 'Yeroo adda addaatti'],
            correctIndex: 0,
            explanation: 'Gochaa fi gocha-deebiin yeroo hunda qaamolee lamaan wal-qunnaman irratti kallattii faallaatiin raawwatu.'
          },
          {
            id: 'p1-q4',
            question: 'Qaamni tokko saffisa dhaabbataadhaan kallattii qajeelaan socho\'aa jiraannaan humni qulqulluun meeqadha?',
            options: ['0 N (Zeeroo)', 'Hanga isaatti qixa', 'Saffisa isaatti qixa', 'Dhuma hin qabu'],
            correctIndex: 0,
            explanation: 'Saffisni dhaabbataa yoo ta\'e ariitiin a = 0 waan ta\'eef F_net = 0 N ta\'a.'
          }
        ]
      },
      {
        id: 'phys-11-12',
        title: 'Elektiroomaagneetizimii fi Dambalii',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Indaakshinii Elektiroomaagneetikii fi Amala Dambalii',
        lessonContent: [
          'Elektiroomaagneetizimiin qunnamtii chaarjiiwwan elektirikii socho\'anii fi dirree maagneetii gidduu jiru qorata.',
          'Seerri Faaraadaay akka ibsutti, jijjiiramni dhangala\'aa maagneetii (magnetic flux) sarara elektirikii keessatti dhiibbaa elektirikii (EMF) uuma. Seerri Leenz immoo kallattii dambalichaa agarsiisa.',
          'Dambaliin elektiroomaagneetikii vaakiyumii keessa saffisa ifaatiin (3 × 10⁸ m/s) deema. Walitti dhufeenyi dambalii v = f · λ dha.'
        ],
        keyPoints: [
          'Seera Faaraadaay: EMF = -N(ΔΦ/Δt)',
          'Foormulaa Dambalii: v = f · λ (Saffisa = deddeebii × dheerina dambalii)',
          'Dambaliin elektiroomaagneetikii meediyaa qaamaa hin barbaadu'
        ],
        flashcards: [
          {
            id: 'p2-fc1',
            front: 'Seerri Indaakshinii Faaraadaay maal jedha?',
            back: 'Jijjiiramni maagneetii EMF (volteejii) sarara keessatti uuma.'
          },
          {
            id: 'p2-fc2',
            front: 'Saffisni ifaa vaakiyumii keessatti meeqadha?',
            back: 'Tilmaamaan 3 × 10⁸ m/s (300,000 km/s).'
          },
          {
            id: 'p2-fc3',
            front: 'Safartuun deddeebii (Frequency) maalidha?',
            back: 'Hertz (Hz) yookiin 1/s dha.'
          },
          {
            id: 'p2-fc4',
            front: 'Jeneraatarri anniisaa akkamii gara elektirikitti jijjiira?',
            back: 'Anniisaa mekaanikaalaa gara anniisaa elektirikitti.'
          }
        ],
        quizQuestions: [
          {
            id: 'p2-q1',
            question: 'Dambaliin dheerinni isaa 2 m fi deddeebiin isaa 150 Hz ta\'e saffisni isaa meeqadha?',
            options: ['300 m/s', '75 m/s', '152 m/s', '0.013 m/s'],
            correctIndex: 0,
            explanation: 'v = f · λ = 150 Hz × 2 m = 300 m/s.'
          },
          {
            id: 'p2-q2',
            question: 'Hojiin bu\'uuraa Tiraanisfoormarii maalidha?',
            options: ['Volteejii AC ol-kaasuu yookiin gadi-buusuu', 'AC gara DC jijjiiruu', 'Maagneetii balleessuu', 'Chaarjii kuusuu'],
            correctIndex: 0,
            explanation: 'Tiraanisfoormariin volteejii jijjiiramaa (AC) gadi buusuuf ykn ol kaasuf gargaara.'
          },
          {
            id: 'p2-q3',
            question: 'Dambaliiwwan armaan gadii keessaa meediyaa kan barbaadu kami?',
            options: ['Dambalii Sagalee (Sound wave)', 'Dambalii Raadiyoo', 'X-ray', 'Gamma ray'],
            correctIndex: 0,
            explanation: 'Sagaleen dambalii mekaanikaalaa waan ta\'eef adeemuuf meediyaa barbaada.'
          },
          {
            id: 'p2-q4',
            question: 'Seerri Leenz seera eegumsaa isa kam irratti hundaa\'a?',
            options: ['Eegumsa Anniisaa (Conservation of Energy)', 'Eegumsa Hangaa', 'Eegumsa Chaarjii', 'Eegumsa Sochii'],
            correctIndex: 0,
            explanation: 'Seerri Leenz eegumsa anniisaa mirkaneessa.'
          }
        ]
      }
    ]
  },

  // 3. Keemistirii (Chemistry)
  {
    id: 'chemistry',
    name: 'Keemistirii',
    subName: 'Chemistry (Kutaa 9-12)',
    accentColor: '#C2410C',
    accentLight: '#FFF7ED',
    accentBorder: '#EA580C',
    accentBadge: '#9A3412',
    topics: [
      {
        id: 'chem-9-10',
        title: 'Caasaa Atamii fi Hidhoo Keemikaalaa',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Kutaa Atamii fi Akaakuu Hidhootaa',
        lessonContent: [
          'Atamiin kutaa ijaarsa waantootaa bu\'uuraati. Niiwukilasiin pirootonii (+ charge) fi niwutironii (chaarjii malee) qaba; elektirooniin (- charge) immoo alaan naanna\'a.',
          'Atamoonni tasgabbaa\'uuf seera okteetii (elektiroonii 8) hordofuun hidhoo uumu: Hidhoo Aayoonikii (elektiroonii kennuu/fudhachuu), Hidhoo Koovaalantii (elektiroonii waloo qooddachuu), fi Hidhoo Meetaliikii.',
          'Gabateen Peeriyoodikii elementoota lakkoofsa atamii fi amala isaaniitiin gurmeessa.'
        ],
        keyPoints: [
          'Lakkoofsa Atamii (Z) = Baay\'ina pirootonii',
          'Lakkoofsa Hangaa (A) = Pirootonii + Niwutironii',
          'Hidhoo Aayoonikii vs. Hidhoo Koovaalantii'
        ],
        flashcards: [
          {
            id: 'c1-fc1',
            front: 'Aayisotooppiin (Isotopes) maali?',
            back: 'Atamoota lakkoofsa pirootonii wal-fakkaataa fi niwutironii adda addaa qaban.'
          },
          {
            id: 'c1-fc2',
            front: 'Hidhoon Koovaalantii akkamitti uumama?',
            back: 'Atamoonni elektiroonota vaalansii waloo qooddachuudhaan.'
          },
          {
            id: 'c1-fc3',
            front: 'Kutaan chaarjii negaatiivii qabu kami?',
            back: 'Elektiroonii (Electron).'
          },
          {
            id: 'c1-fc4',
            front: 'Soogidda (NaCl) keessatti hidhoo akkamiitu jira?',
            back: 'Hidhoo Aayoonikii (Ionic bond).'
          }
        ],
        quizQuestions: [
          {
            id: 'c1-q1',
            question: 'Atamiin pirootonii 11 fi niwutironii 12 qabu lakkoofsi hangaa (A) meeqadha?',
            options: ['23', '11', '12', '1'],
            correctIndex: 0,
            explanation: 'A = Pirootonii (11) + Niwutironii (12) = 23 (Soodiyami).'
          },
          {
            id: 'c1-q2',
            question: 'Bishaan (H₂O) keessatti hidhoo akkamiitu jira?',
            options: ['Hidhoo Koovaalantii', 'Hidhoo Aayoonikii', 'Hidhoo Meetaliikii', 'Hidhoo Niiwukilarii'],
            correctIndex: 0,
            explanation: 'Bishaan atamoota al-sibilaa gidduutti elektiroonii qooddachuun uumama.'
          },
          {
            id: 'c1-q3',
            question: 'Seerri Okteetii atamoonni elektiroonii vaalansii meeqa akka barbaadan ibsa?',
            options: ['8', '2', '6', '10'],
            correctIndex: 0,
            explanation: 'Atamoonni tasgabbaa\'uuf marsaa alaa irratti elektiroonii 8 qabaachuu barbaadu.'
          },
          {
            id: 'c1-q4',
            question: 'Garee 1ffaa gabatee peeriyoodikii keessatti elementoonni jiran maal jedhamu?',
            options: ['Meetala Alkalaayii (Alkali metals)', 'Haaloojinoota', 'Gaasota Kabajamoo', 'Meetala Lafaa'],
            correctIndex: 0,
            explanation: 'Gareen 1ffaa Meetala Alkalaayii (Li, Na, K...) jedhamu.'
          }
        ]
      },
      {
        id: 'chem-11-12',
        title: 'Madaallii Keemikaalaa fi Teermoodaayinaamiiksii',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Saffisa Ri\'aakshinii fi Anniisaa Keemikaalaa',
        lessonContent: [
          'Madaalliin keemikaalaa saffisni ri\'aakshinii gara fuulduraa fi gara duubaa yeroo wal-qixa ta\'u uumama.',
          'Qajeeltoon Li Shaatiliyeer (Le Chatelier\'s Principle) akka ibsutti sirni madaallii irra jiru yoo dhiibbaan (hoo\'a, dhiibbaa, baay\'ina) irratti dabalame madaallicha deebisuuf gara faallaatti siqa.',
          'Teermoodaayinaamiiksiin Entaalpii (ΔH), Eentiropii (ΔS), fi Anniisaa Bilisa Giibsii (ΔG = ΔH - TΔS) qorata. Yoo ΔG < 0 ta\'e ri\'aakshinichi ofumaan raawwatama (spontaneous).'
        ],
        keyPoints: [
          'Qajeeltoo Li Shaatiliyeer: Dhiibbaa alaa mormuu',
          'Dhaabbataa Madaallii Keq = [Products] / [Reactants]',
          'ΔG < 0: Ri\'aakshinii ofumaan deemu (Spontaneous)'
        ],
        flashcards: [
          {
            id: 'c2-fc1',
            front: 'Qajeeltoon Li Shaatiliyeer maal jedha?',
            back: 'Sirni madaallii irratti dhiibbaan dabalame dhiibbaa sana hir\'isuuf of jijjiira.'
          },
          {
            id: 'c2-fc2',
            front: 'Eentiropiin (S) maalidha?',
            back: 'Safartuu bittinaa\'ina (disorder) sirna tokkooti.'
          },
          {
            id: 'c2-fc3',
            front: 'Ri\'aakshinii hoo\'a baasu (Exothermic) keessatti mallattoon ΔH maali?',
            back: 'Negaatiivii (ΔH < 0) dha.'
          },
          {
            id: 'c2-fc4',
            front: 'Foormulaan Anniisaa Giibsii maalidha?',
            back: 'ΔG = ΔH - TΔS'
          }
        ],
        quizQuestions: [
          {
            id: 'c2-q1',
            question: 'Ri\'aakshiniin keemikaalaa tokko ofumaan akka deemuuf (spontaneous) gatiin ΔG maal ta\'uu qaba?',
            options: ['Negaatiivii (ΔG < 0)', 'Poozatiivii (ΔG > 0)', 'Zeeroo', 'Hin beekamu'],
            correctIndex: 0,
            explanation: 'ΔG < 0 yoo ta\'e ri\'aakshinichi anniisaa gahaa qabaatee ofiin deema.'
          },
          {
            id: 'c2-q2',
            question: 'Sirna N₂ + 3H₂ ⇌ 2NH₃ irratti dhiibbaan yoo dabale madaalliin gara kamitti siqa?',
            options: ['Gara mirgaatti (gara NH₃)', 'Gara bitaatti', 'Jijjiirama hin qabu', 'Ni dhaabbata'],
            correctIndex: 0,
            explanation: 'Dhiibbaan yeroo dabalu gara moosii gaasii xiqqaatti (gara mirgaatti) siqa.'
          },
          {
            id: 'c2-q3',
            question: 'Kaataalistiin (Catalyst) ri\'aakshinii keessatti maal godha?',
            options: ['Anniisaa ka\'umsaa hir\'isuun saffisa dabala', 'Gatii Keq jijjiira', 'Oomisha dabala', 'ΔH jijjiira'],
            correctIndex: 0,
            explanation: 'Kaataalistiin anniisaa qabsiisuuf barbaachisu (activation energy) hir\'isa.'
          },
          {
            id: 'c2-q4',
            question: 'Bishaan gara cabbiitti yoo jijjiiramu eentiropiin (ΔS) akkam ta\'a?',
            options: ['Ni hir\'ata (ΔS < 0)', 'Ni dabala (ΔS > 0)', 'Zeeroo ta\'a', 'Waliin dhawa'],
            correctIndex: 0,
            explanation: 'Dhangala\'aan gara jabaatti waan jijjiiramuuf bittinaa\'inni ni xiqqaata.'
          }
        ]
      }
    ]
  },

  // 4. Baayoloojii (Biology)
  {
    id: 'biology',
    name: 'Baayoloojii',
    subName: 'Biology (Kutaa 9-12)',
    accentColor: '#15803D',
    accentLight: '#F0FDF4',
    accentBorder: '#16A34A',
    accentBadge: '#166534',
    topics: [
      {
        id: 'bio-9-10',
        title: 'Caasaa fi Hojii Seelii (Cell Biology)',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Yuuniitii Bu\'uura Lubbuu fi Orgaaneloota',
        lessonContent: [
          'Seeliin yuuniitii ijaarsaa fi dalagaa lubbu qabeeyyii hundaati. Tiyoorin Seelii lubbu qabeeyyiin hundi seelii irraa akka ijaaraman ibsa.',
          'Seelonni bakka lamatti qoodamu: Pirookaariyootota (niiwukilasiin kan hin marfamne, fakkeenyaaf Baakteeriyaa) fi Yuukaariyootota (niiwukilasii fi orgaanelii qaban).',
          'Maaytookondiriyaan buufata anniisaa (ATP) yoo ta\'u, Kilooropilaastiin immoo bakka footoosinteesisii biqiltootaati.'
        ],
        keyPoints: [
          'Tiyooriin Seelii: Seeliin hundee lubbuuti',
          'Maaytookondiriyaa: Buufata Anniisaa (Powerhouse)',
          'Seeliin biqiltootaa Kilooropilaastii fi Dallaa Seelii qaba'
        ],
        flashcards: [
          {
            id: 'b1-fc1',
            front: 'Buufata Anniisaa Seelii (Powerhouse) kan jedhamu kami?',
            back: 'Maaytookondiriyaa (Mitochondria) - ATP oomisha.'
          },
          {
            id: 'b1-fc2',
            front: 'Caasaa seelii biqiltootaa keessatti argamee kan bineensotaa keessatti hin jirre lama?',
            back: 'Dalla Seelii (Cell wall) fi Kilooropilaastii (Chloroplast).'
          },
          {
            id: 'b1-fc3',
            front: 'Pirookaariyootonni maaliin beekamu?',
            back: 'Niiwukilasii meembireeniin marfame hin qaban.'
          },
          {
            id: 'b1-fc4',
            front: 'Bakki pirootiiniin itti ijaaramu kami?',
            back: 'Raayiboosoomii (Ribosome).'
          }
        ],
        quizQuestions: [
          {
            id: 'b1-q1',
            question: 'Biqiltoota keessatti Footoosinteesisiin orgaanelii kam keessatti raawwatama?',
            options: ['Kilooropilaastii (Chloroplast)', 'Maaytookondiriyaa', 'Golgi body', 'Laayisoosoomii'],
            correctIndex: 0,
            explanation: 'Kilooropilaastiin ifa aduutti fayyadamee sukkaara (gluukoosii) oomisha.'
          },
          {
            id: 'b1-q2',
            question: 'Oodeeffannoo jeneetiksii (DNA) seelii yuukaariyootii keessatti kan qabatu kami?',
            options: ['Niiwukilasii (Nucleus)', 'Saayitoopilaazimii', 'Vaakiyoolii', 'Meembireenii'],
            correctIndex: 0,
            explanation: 'Niiwukilasiin kromosoomota fi DNA of keessatti qabata.'
          },
          {
            id: 'b1-q3',
            question: 'Uumamtoota armaan gadii keessaa pirookaariyootii kan ta\'e kami?',
            options: ['Baakteeriyaa (Bacteria)', 'Raacitii (Yeast)', 'Seelii dhiigaa', 'Amoebaa'],
            correctIndex: 0,
            explanation: 'Baakteeriyaan niiwukilasii meembireenii hin qabne dha.'
          },
          {
            id: 'b1-q4',
            question: 'Dallaan seelii biqiltootaa irra caalaa maalirraa ijaarama?',
            options: ['Seeluloosii (Cellulose)', 'Gilaayikoojiinii', 'Koolestroolii', 'Keeraatiinii'],
            correctIndex: 0,
            explanation: 'Seeluloosiin dallaa seelii biqiltootaatiif jabina kenna.'
          }
        ]
      },
      {
        id: 'bio-11-12',
        title: 'Jeneetiksii fi DNA (Genetics & Molecular Biology)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Seera Dhaalaa fi Caasaa DNA',
        lessonContent: [
          'Jeneetiksiin akkaataan amalloonni dhalootaa dhalootatti itti darban qorata. Gireegoor Meendel seera dhaalaa baay\'ee beekamaa uume.',
          'DNA (Deoxyribonucleic Acid) caasaa xaxamaa lama (double helix) qaba. Niwukilootaayidoonni Adeeniin (A) fi Taayimiin (T), Gwaaniniin (G) fi Saayitoosiin (C) walitti hidhatu.',
          'Ijaarsi pirootiinii sadarkaa lama qaba: Tiraaniskiripshinii (DNA irraa mRNA baasuu) fi Tiraanisleshinii (raayiboosoomii irratti pirootiinii ijaaruu).'
        ],
        keyPoints: [
          'Waliiti Hidhamuu: A = T fi G ≡ C',
          'Doogmaa Giddu-galeessaa: DNA → mRNA → Pirootiinii',
          'Jeneetiksii Meendel: Akeeka Dhaalaa fi Alleelota'
        ],
        flashcards: [
          {
            id: 'b2-fc1',
            front: 'DNA keessatti Adeeniin (A) isa kamiin walitti hidhata?',
            back: 'Taayimiin (Thymine - T).'
          },
          {
            id: 'b2-fc2',
            front: 'Tiraaniskiripshiniin maali?',
            back: 'Adeemsa DNA irraa mRNA qopheessuuti.'
          },
          {
            id: 'b2-fc3',
            front: 'Abbaa Jeneetiksii kan jedhamu eenyu?',
            back: 'Gireegoor Meendel (Gregor Mendel).'
          },
          {
            id: 'b2-fc4',
            front: 'Koodooniin (Codon) tokko beezota meeqa qaba?',
            back: 'Beezota 3 (Triplet code).'
          }
        ],
        quizQuestions: [
          {
            id: 'b2-q1',
            question: 'RNA keessatti Taayimiin bakka kan bu\'u kami?',
            options: ['Yuuraasiil (Uracil - U)', 'Adeeniin', 'Saayitoosiin', 'Gwaaniin'],
            correctIndex: 0,
            explanation: 'RNA keessatti Taayimiin hin jiru, bakka isaa Yuuraasiil (U) jiraata.'
          },
          {
            id: 'b2-q2',
            question: 'Wal-fudhannaa heetirozaayigasii (Aa × Aa) keessatti carraan dhaloota riiseesivii (aa) meeqadha?',
            options: ['25% (1/4)', '50% (1/2)', '75% (3/4)', '100%'],
            correctIndex: 0,
            explanation: 'Gabaasa Meendel keessatti 1 AA : 2 Aa : 1 aa waan ta\'eef carraan aa 1/4 (25%) dha.'
          },
          {
            id: 'b2-q3',
            question: 'Bara 1953tti caasaa DNA kan argatan eenyufa\'i?',
            options: ['Waatsanii fi Kiriik (Watson & Crick)', 'Daarwiinii fi Waalaas', 'Meendelii fi Moorgaan', 'Paasteerii fi Kook'],
            correctIndex: 0,
            explanation: 'Jeemsi Waatsanii fi Firaansis Kiriik caasaa double helix DNA argatan.'
          },
          {
            id: 'b2-q4',
            question: 'Miyuteeshiniin (Mutation) maalidha?',
            options: ['Jijjiirama tasaa seensisa DNA keessatti uumamu', 'Guddina seelii idilee', 'Dhabamuu bishaanii', 'Nyaata bullaa\'uu'],
            correctIndex: 0,
            explanation: 'Miyuteeshiniin jijjiirama koodii jeneetiksii dhaabbataa ta\'eedha.'
          }
        ]
      }
    ]
  },

  // 5. Ingiliffa (English)
  {
    id: 'english',
    name: 'Ingiliffa',
    subName: 'Afaan Ingilizii',
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
        lessonTitle: 'Grammar and Sentence Structures',
        lessonContent: [
          'In English, Active Voice focuses on the subject performing the action: "Tolasa wrote a letter." Passive Voice focuses on the action or object: "A letter was written by Tolasa."',
          'Passive voice is created using the form of "to be" + Past Participle (V3). It is essential in scientific and academic writing.',
          'Understanding verb tenses ensures accurate expression of time, sequence, and completed actions.'
        ],
        keyPoints: [
          'Active: Subject acts',
          'Passive: Object receives action (be + V3)',
          'Used for formal and scientific reports'
        ],
        flashcards: [
          {
            id: 'e1-fc1',
            front: 'Change to passive: "Bona built the house."',
            back: '"The house was built by Bona."'
          },
          {
            id: 'e1-fc2',
            front: 'When is passive voice preferred?',
            back: 'When the result or process is more important than who did it.'
          },
          {
            id: 'e1-fc3',
            front: 'Past participle of "write"?',
            back: '"Written" (write - wrote - written).'
          },
          {
            id: 'e1-fc4',
            front: 'Change to passive: "They are painting the school."',
            back: '"The school is being painted."'
          }
        ],
        quizQuestions: [
          {
            id: 'e1-q1',
            question: 'Which of the following is in Passive Voice?',
            options: [
              'The national project was completed on time.',
              'The workers completed the project on time.',
              'We saw the results yesterday.',
              'They will attend the meeting.'
            ],
            correctIndex: 0,
            explanation: '"Was completed" uses "be + V3" structure.'
          },
          {
            id: 'e1-q2',
            question: 'Complete: "Before the teacher entered, the students _______ their assignments."',
            options: ['had finished', 'have finished', 'finishes', 'was finishing'],
            correctIndex: 0,
            explanation: 'Past Perfect denotes an action completed before another past event.'
          },
          {
            id: 'e1-q3',
            question: 'Passive form of "Gada planted these trees":',
            options: [
              'These trees were planted by Gada.',
              'These trees are planted by Gada.',
              'These trees have planted by Gada.',
              'Gada was planted by these trees.'
            ],
            correctIndex: 0,
            explanation: 'Simple past passive requires "were + planted".'
          },
          {
            id: 'e1-q4',
            question: 'Select the correct Present Perfect sentence:',
            options: [
              'She has worked in this hospital for five years.',
              'She worked in this hospital since five years.',
              'She is working here yesterday.',
              'She had worked here now.'
            ],
            correctIndex: 0,
            explanation: '"Has worked" with "for five years" correctly shows duration.'
          }
        ]
      },
      {
        id: 'eng-11-12',
        title: 'Conditionals & Discourse Markers',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Advanced Conditionals and Academic Writing',
        lessonContent: [
          'Conditionals describe possibilities and hypothetical situations. Third Conditional deals with unreal past events: "If + had + V3, would have + V3".',
          'Inversion can be used in academic formal writing: "Had I known..." instead of "If I had known...".',
          'Discourse markers (however, consequently, furthermore, nevertheless) link sentences into logical arguments.'
        ],
        keyPoints: [
          '3rd Conditional: If + had + V3, would have + V3',
          'Inversion: "Had we known..." replaces "If we had known..."',
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
            front: 'Complete: "If you had arrived earlier, you _______ caught the bus."',
            back: '"would have" (3rd conditional).'
          },
          {
            id: 'e2-fc3',
            front: 'Give an example of a contrast discourse marker.',
            back: '"However", "Nevertheless", or "On the contrary".'
          },
          {
            id: 'e2-fc4',
            front: 'Inverted form of "If they had studied"?',
            back: '"Had they studied..."'
          }
        ],
        quizQuestions: [
          {
            id: 'e2-q1',
            question: '"If the student _______ hard, he would have passed the examination."',
            options: ['had studied', 'studied', 'have studied', 'would study'],
            correctIndex: 0,
            explanation: 'Third conditional if-clause requires Past Perfect ("had studied").'
          },
          {
            id: 'e2-q2',
            question: 'Which discourse marker indicates cause and effect?',
            options: ['Consequently', 'Whereas', 'However', 'Nevertheless'],
            correctIndex: 0,
            explanation: '"Consequently" introduces a direct outcome or result.'
          },
          {
            id: 'e2-q3',
            question: '"If it rains tomorrow, we _______ at home."',
            options: ['will stay', 'would stay', 'would have stayed', 'stayed'],
            correctIndex: 0,
            explanation: 'First conditional uses "will + base verb".'
          },
          {
            id: 'e2-q4',
            question: 'Choose the most coherent sentence:',
            options: [
              'The task was challenging; nevertheless, the students succeeded.',
              'The task was challenging; because, they succeeded.',
              'The task was challenging; although, they succeeded.',
              'The task was challenging; therefore, it was easy.'
            ],
            correctIndex: 0,
            explanation: '"Nevertheless" accurately introduces contrast between challenge and success.'
          }
        ]
      }
    ]
  },

  // 6. Afaan Oromoo fi Og-barruu
  {
    id: 'amharic',
    name: 'Afaan Oromoo',
    subName: 'Og-barruu fi Afaan',
    accentColor: '#D97706',
    accentLight: '#FFFBEB',
    accentBorder: '#F59E0B',
    accentBadge: '#B45309',
    topics: [
      {
        id: 'amh-9-10',
        title: 'Akaakuu Og-barruu fi Afoolaa (Literature & Folklore)',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Og-aadaa, Afoolaa fi Caasaa Asoosamaa',
        lessonContent: [
          'Og-barruun miira, ilaalcha fi falaasama dhala namaa afaan miidhagaatiin dhiyeessuudha. Bakka lamatti qoodama: Afoola (afaanin dhalootaa dhalootatti darbu) fi Og-barruu Barreeffamaa.',
          'Afoolli Mammaksa, Hibboo, Geerarsa, Sirba Aadaa fi Weedduu of keessatti qabata.',
          'Og-barruun barreeffamaa immoo Walaloo, Asoosama, fi Diraamaa of keessatti qabata. Caasaaleen asoosamaa Dhaamsa (theme), Seenaa (plot), fi Qooddattoota (characters) dha.'
        ],
        keyPoints: [
          'Afoola: Aadaa fi falaasama afaaniin darbu',
          'Caasaa Asoosamaa: Dhaamsa, Seenaa, Qooddattoota, Yoomessa',
          'Walaloo: Rukkuttaa, Sirna fi Dhangala\'aa jechootaa'
        ],
        flashcards: [
          {
            id: 'a1-fc1',
            front: 'Afoolli maali?',
            back: 'Og-barruu afaaniin dhalootaa dhalootatti darbudha.'
          },
          {
            id: 'a1-fc2',
            front: 'Caasaa asoosamaa keessatti \'Seenaa\' (Plot) maali?',
            back: 'Qindoomina fi tartiiba taateewwan asoosama keessatti raawwatamaniiti.'
          },
          {
            id: 'a1-fc3',
            front: 'Diraamaan maaliin beekama?',
            back: 'Og-barruu waltajjii irratti qooddattootaan agarsiifamudha.'
          },
          {
            id: 'a1-fc4',
            front: 'Fakkeenya afoolaa kenni.',
            back: 'Mammaksa, Hibboo, Geerarsa, fi Weedduu.'
          }
        ],
        quizQuestions: [
          {
            id: 'a1-q1',
            question: 'Dhaamsi (Theme) asoosama tokkoo maalidha?',
            options: ['Ergaa ijoo barreessaan dabarsuu barbaade', 'Tartiiba taateewwanii', 'Bakka seenaan itti raawwate', 'Kutaa diraamaa'],
            correctIndex: 0,
            explanation: 'Dhaamsi ergaa fi yaad-rimee guddaa seenaan sun dabarsuudha.'
          },
          {
            id: 'a1-q2',
            question: 'Kanneen armaan gadii keessaa afoola kan hin taane kami?',
            options: ['Asoosama Dheeraa (Novel)', 'Mammaksa', 'Hibboo', 'Geerarsa'],
            correctIndex: 0,
            explanation: 'Asoosamni dheeraan og-barruu barreeffamaati.'
          },
          {
            id: 'a1-q3',
            question: 'Yeroo fi bakki seenaan asoosamaa itti raawwatu maal jedhama?',
            options: ['Yoomessa (Setting)', 'Qooddattoota', 'Wal-dhabdee', 'Xumura'],
            correctIndex: 0,
            explanation: 'Yoomessi bakka fi yeroo taateen itti raawwate agarsiisa.'
          },
          {
            id: 'a1-q4',
            question: 'Sararri walaloo tokko maal jedhama?',
            options: ['Keeyyata walaloo', 'Ciroo', 'Xumura', 'Ergaa'],
            correctIndex: 0,
            explanation: 'Sararri walaloo keeyyata ykn sarara walaloo jedhama.'
          }
        ]
      },
      {
        id: 'amh-11-12',
        title: 'Madaallii Og-barruu fi Ciigoo (Rhetoric & Poetry)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Falaasama Jechootaa fi Ciigoo (Wax & Gold)',
        lessonContent: [
          'Ciigoon (Wax and Gold) falaasama afaanii fi og-barruu hiika dachaa qabuudha. \'Samiin\' hiika ifatti mul\'atu yoo ta\'u, \'Warqiin\' immoo hiika dhokataa fi gadi fagoo ta\'eedha.',
          'Jechoota qaraa fi dachaatiin dhimmoota hawaasummaa, jaalala, fi siyaasaa ifatti osoo hin taane karaa miidhagaa fi dhokataadhaan ibsuuf oola.',
          'Og-aadaa fi qorannoo afaanii keessatti dandeettii yaada dhiyeessuu fi madaallii og-barruu gabbisuuf gargaara.'
        ],
        keyPoints: [
          'Samii: Hiika gubbaa kan salphaatti mul\'atu',
          'Warqee: Ergaa dhokataa fi gadi fageenya qabu',
          'Ciigoon dandeettii afaanii fi yaada bilchaataa calaqqisa'
        ],
        flashcards: [
          {
            id: 'a2-fc1',
            front: 'Ciigoo keessatti \'Samiin\' maali?',
            back: 'Hiika gubbaatti salphaatti dhagahamuudha.'
          },
          {
            id: 'a2-fc2',
            front: 'Ciigoo keessatti \'Warqiin\' maali?',
            back: 'Ergaa dhokataa fi gadi fagoo ta\'eedha.'
          },
          {
            id: 'a2-fc3',
            front: 'Ciigoon maaliif tajaajila?',
            back: 'Yaada hawaasaa fi qeeqa karaa aartii fi dhokataadhaan dabarsuuf.'
          },
          {
            id: 'a2-fc4',
            front: 'Madaalliin og-barruu maali?',
            back: 'Cimina fi hanqina hojii aartii qorachuudha.'
          }
        ],
        quizQuestions: [
          {
            id: 'a2-q1',
            question: 'Hiikni dhokataan ciigoo keessatti maal jedhama?',
            options: ['Warqee (Gold)', 'Samii (Wax)', 'Walaloo', 'Sarara'],
            correctIndex: 0,
            explanation: 'Warqiin ergaa dhokataa isa dhugaa agarsiisa.'
          },
          {
            id: 'a2-q2',
            question: 'Hiikni ifatti calaqqisu maal jedhama?',
            options: ['Samii (Wax)', 'Warqee (Gold)', 'Hibboo', 'Dhaamsa'],
            correctIndex: 0,
            explanation: 'Samiin hiika gubbaa isa namni salphaatti arguudha.'
          },
          {
            id: 'a2-q3',
            question: 'Faayidaan guddaan ciigoo maalidha?',
            options: ['Qeeqa fi falaasama karaa miidhagaadhaan dabarsuu', 'Afaan dhiphisuu', 'Jechoota gabaabsuu', 'Sagalee ol kaasu'],
            correctIndex: 0,
            explanation: 'Ciigoon dandeettii yaada gadi fagoo karaa aartitiin dabarsuuti.'
          },
          {
            id: 'a2-q4',
            question: 'Madaallii og-barruu keessatti dhimmi xiyyeeffannoo argatu maali?',
            options: ['Qabiyyee, bifa, fi ergaa hojichaa', 'Baay\'ina fuulaa qofa', 'Gatii kitaabaa', 'Bifa maxxansaa'],
            correctIndex: 0,
            explanation: 'Madaalliin qabiyyee fi dandeettii aartii hojichaa sakatta\'a.'
          }
        ]
      }
    ]
  },

  // 7. Seenaa fi Saayinsii Hawaasaa (History)
  {
    id: 'social-studies',
    name: 'Seenaa',
    subName: 'Seenaa fi Saayinsii Hawaasaa',
    accentColor: '#B91C1C',
    accentLight: '#FEF2F2',
    accentBorder: '#DC2626',
    accentBadge: '#991B1B',
    topics: [
      {
        id: 'soc-9-10',
        title: 'Mootummaa Aksum fi Daldala Galaana Diimaa',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Bara Mootummaa Aksum fi Daldala Addunyaa',
        lessonContent: [
          'Mootummaan Aksum Gaafa Afrikaa keessatti jaarraa 1ffaa hanga 8ffaa ALAtti humna guddaa addunyaa ture. Roomaa, Peerishiyaa fi Chaayinaa waliin beekamtii qaba ture.',
          'Buufata doonii Aduulis gargaaramuun Galaana Diimaa irratti daldala bal\'aa gaggeessaa ture. Warqee, ilka arbaa, fi urgooftuu gara Giriik, Roomaa fi Hindiitti ergaa ture.',
          'Aksum saantii mataa ishee warqee fi meetiidhaan kan bocatte yoo ta\'u, siidaawwan dhedheeroo dhagaa tokkorraa bocamanis beekamti.'
        ],
        keyPoints: [
          'Buufata Aduulis: Wiirtuu daldala Galaana Diimaa',
          'Saantii Mataa Ishee: Warqee fi Meetiin bocame',
          'Siidaawwan gurguddoo dhagaa tokkorraa bocaman'
        ],
        flashcards: [
          {
            id: 's1-fc1',
            front: 'Buufanni daldala addunyaa Aksum maal turte?',
            back: 'Aduulis (Adulis - Galaana Diimaa irratti).'
          },
          {
            id: 's1-fc2',
            front: 'Mootiin Aksum saantii jalqaba baase eenyu?',
            back: 'Mootii Endubis (King Endubis).'
          },
          {
            id: 's1-fc3',
            front: 'Meeshaalee Aksum gabaa alatti ergitu keessaa?',
            back: 'Warqee, ilka arbaa, qaruuraa fi urgooftuu.'
          },
          {
            id: 's1-fc4',
            front: 'Sababni Aksum itti dadhabde maali?',
            back: 'Daldalli Galaana Diimaa harkaa bahuu fi buufanni Aduulis cufamuu.'
          }
        ],
        quizQuestions: [
          {
            id: 's1-q1',
            question: 'Mootummaan Aksum saantii mataa ishee yoom maxxansuu jalqabde?',
            options: ['Dhuma Jaarraa 3ffaa ALA', 'Jaarraa 10ffaa', 'Jaarraa 1ffaa Dh.K.D', 'Jaarraa 16ffaa'],
            correctIndex: 0,
            explanation: 'Mootii Endubis bara dhumata jaarraa 3ffaatti saantii jalqabsiise.'
          },
          {
            id: 's1-q2',
            question: 'Mootummaan Aksum kanneen armaan gadii keessaa isa kam waliin daldala hin qabne?',
            options: ['Mootummaa Inkaa (Ameerikaa Kibbaa)', 'Mootummaa Roomaa', 'Mootummaa Baayzaantaayin', 'Hindii'],
            correctIndex: 0,
            explanation: 'Inkaan Ameerikaa Kibbaa waan turteef qunnamtii hin qabne.'
          },
          {
            id: 's1-q3',
            question: 'Siidaawwan Aksum dhagaa akkamiirraa tolfaman?',
            options: ['Dhagaa Giraanaayitii tokkicha irraa (Monolithic)', 'Xuubii irraa', 'Ciddii irraa', 'Suphee irraa'],
            correctIndex: 0,
            explanation: 'Siidaawwan Aksum dhagaa giraanaayitii tokkicha irraa bocaman.'
          },
          {
            id: 's1-q4',
            question: 'Amantiin Kiristaanummaa bara mootii kamiitti amantii biyyaalessaa ta\'e?',
            options: ['Mootii Izaanaa (King Ezana)', 'Mootii Kaaleeb', 'Mootii Gabra Masqal', 'Mootii Endubis'],
            correctIndex: 0,
            explanation: 'Jaarraa 4ffaatti Mootii Izaanaatu amanticha fudhate.'
          }
        ]
      },
      {
        id: 'soc-11-12',
        title: 'Seenaa Ammayyaa fi Injifannoo Adwaa (Battle of Adwa)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Birmadummaa Eegsisuu fi Injifannoo Adwaa',
        lessonContent: [
          'Injifannoon Adwaa (Guraandhala 23, 1888 A.L.I / Bitootessa 1, 1896) injifannoo seena-qabeessa uummanni birmadummaa isaa eegsisuuf waraana koloneeffataa Xaaliyaanii itti mo\'atedha.',
          'Ka\'umsa waraanichaa Waliigaltee Wucaalee Keeyyata 17ture. Afaan Xaaliyaaniitiin Itoophiyaan dhimma alaa Xaaliyaaniin qofa raawwachuu "qabdi" yoo jedhu, Afaan Amaaraatiin garuu "ni dandeessi" jedha ture.',
          'Mootii Minilik II fi Giifti Duree Xaayituu uummata tokkummaadhaan gurmeessuun Adwaa irratti waraana Jeneraal Baaraatyeerii mo\'atan.'
        ],
        keyPoints: [
          'Guyyaa Injifannoo: Bitootessa 1, 1896 (Guraandhala 23, 1888)',
          'Waliigaltee Wucaalee Keeyyata 17 ka\'umsa waraanaa ture',
          'Injifannoon kun mallattoo Pan-Africanism fi bilisummaa uummata gurraachaa ta\'e'
        ],
        flashcards: [
          {
            id: 's2-fc1',
            front: 'Waraanni Adwaa yoom gaggeeffame?',
            back: 'Bitootessa 1, 1896 (Guraandhala 23, 1888 A.L.I).'
          },
          {
            id: 's2-fc2',
            front: 'Sababni waraanichaa waliigaltee maal jedhamu?',
            back: 'Waliigaltee Wucaalee Keeyyata 17.'
          },
          {
            id: 's2-fc3',
            front: 'Waraana Xaaliyaanii Adwaa irratti kan hooggane eenyu?',
            back: 'Jeneraal Ooreestee Baaraatyeerii (General Oreste Baratieri).'
          },
          {
            id: 's2-fc4',
            front: 'Hiikni Injifannoo Adwaa addunyaatiif maali?',
            back: 'Mallattoo qabsoo bilisummaa fi tokkummaa uummata gurraachaa ta\'e.'
          }
        ],
        quizQuestions: [
          {
            id: 's2-q1',
            question: 'Waliigalteen Wucaalee yoom mallattaa\'e?',
            options: ['Bara 1889 (1881 A.L.I)', 'Bara 1896', 'Bara 1875', 'Bara 1900'],
            correctIndex: 0,
            explanation: 'Waliigalteen Wucaalee Caamsaa 1889 mallattaa\'e.'
          },
          {
            id: 's2-q2',
            question: 'Marii fi tarsiimoo lola Maqalee irratti bishaan kukkutuu kan qopheesse eenyu?',
            options: ['Giifti Duree Xaayituu Bixul', 'Nigisti Zawudituu', 'Giifti Manan', 'Ileenii'],
            correctIndex: 0,
            explanation: 'Giifti Duree Xaayituun buufata bishaanii dhowwachuun tarsiimoo waraanaa fidan.'
          },
          {
            id: 's2-q3',
            question: 'Waraana Adwaa booda Xaaliyaaniin birmadummaa kan beekte waliigaltee kamiin?',
            options: ['Waliigaltee Finfinnee (Addis Ababa - 1896)', 'Waliigaltee Wucaalee', 'Waliigaltee Landan', 'Waliigaltee Roomaa'],
            correctIndex: 0,
            explanation: 'Waliigalteen Finfinnee Onkololeessa 1896 Wucaalee haqee birmadummaa mirkaneesse.'
          },
          {
            id: 's2-q4',
            question: 'Dhiibbaan Injifannoon Adwaa addunyaa irratti fide maalidha?',
            options: ['Ilaalcha \'Awurooppaan hin mo\'amtu\' jedhu diiguu fi Pan-Africanism kakaasuu', 'Koloneeffannaa saffisiisuu', 'Daldala cufuu', 'Doowannaa dhowwuu'],
            correctIndex: 0,
            explanation: 'Adwaan uummanni gurraachi koloneeffattoota mo\'uu akka danda\'u addeesse.'
          }
        ]
      }
    ]
  },

  // 8. Saayinsii fi Teeknooloojii Odeeffannoo (ICT)
  {
    id: 'ict',
    name: 'ICT',
    subName: 'Teeknooloojii Odeeffannoo',
    accentColor: '#475569',
    accentLight: '#F8FAFC',
    accentBorder: '#64748B',
    accentBadge: '#334155',
    topics: [
      {
        id: 'ict-9-10',
        title: 'Haardweerii, Sooftiweerii fi Neetwoorkii',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Caasaa Kompiitaraa fi Hundee Neetwoorkii',
        lessonContent: [
          'Sirni kompiitaraa Haardweerii (kutaa qabatamaa - CPU, RAM, Meeshaalee Galtee/Baastee) fi Sooftiweerii (piroogiraamoota hojii geggeessan) irraa ijaarama.',
          'CPU\'n sammuu kompiitaraati. RAM\'n kuusaa yeroo gabaabaa yoo ta\'u yeroo ibsaan badu odeeffannoon ni bada; Hard Drive\'n immoo kuusaa dhaabbataadha.',
          'Neetwoorkiin kompiitaraa meeshaaleen odeeffannoo akka wal-jijjiiran taasisa: LAN (neetwoorkii naannoo tokkoo) fi WAN (neetwoorkii bal\'aa - Intarneetii).'
        ],
        keyPoints: [
          'CPU: Sammuu kompiitaraa ajajoota raawwatu',
          'RAM (Kuusaa yeroo) vs. Hard Drive (Kuusaa Dhaabbataa)',
          'LAN (Local Network) vs. WAN (Wide Network/Internet)'
        ],
        flashcards: [
          {
            id: 'i1-fc1',
            front: 'Sammuu kompiitaraa kan jedhamu kami?',
            back: 'CPU (Central Processing Unit).'
          },
          {
            id: 'i1-fc2',
            front: 'Garaagarummaan RAM fi ROM maali?',
            back: 'RAM\'n yeroof kuusa (volatile), ROM\'n immoo dhaabbataadha.'
          },
          {
            id: 'i1-fc3',
            front: 'LAN jechuun maal jechuudha?',
            back: 'Local Area Network (Neetwoorkii gamoo tokko keessatti diriire).'
          },
          {
            id: 'i1-fc4',
            front: 'Fakkeenya Sirna Hojii (Operating System) kenni.',
            back: 'Windows, Linux, macOS, Android, fi iOS.'
          }
        ],
        quizQuestions: [
          {
            id: 'i1-q1',
            question: 'Meeshaalee armaan gadii keessaa meeshaa galtee (Input Device) kan ta\'e kami?',
            options: ['Kiibordii fi Hantuuttee (Keyboard & Mouse)', 'Moniitara', 'Piriintara', 'Ispiikara'],
            correctIndex: 0,
            explanation: 'Kiibordiin ajaja gara kompiitaraatti galchuuf gargaara.'
          },
          {
            id: 'i1-q2',
            question: 'Giigaabaayitiin 1 (1 GB) Meegaabaayitii (MB) meeqatti qixxeeffama?',
            options: ['1,024 MB', '100 MB', '1,000,000 MB', '10 MB'],
            correctIndex: 0,
            explanation: 'Hundee lakkoofsa kompiitaraa keessatti 1 GB = 1024 MB dha.'
          },
          {
            id: 'i1-q3',
            question: 'Fuula weebsaayitii banuuf sooftiweerii kam fayyadamna?',
            options: ['Weeb Biraawuzarii (Web Browser)', 'Sirna Hojii', 'Anti-virus', 'Ispreedshiitii'],
            correctIndex: 0,
            explanation: 'Biraawuzaroonni (Chrome, Firefox) fuula intarneetii banaa.'
          },
          {
            id: 'i1-q4',
            question: 'Teessoon IP (IP Address) maaliif tajaajila?',
            options: ['Meeshaa neetwoorkii irratti adda baasuuf', 'Saffisa dabaluuf', 'Vaayirasii balleessuuf', 'Ifa sirreessuuf'],
            correctIndex: 0,
            explanation: 'Teessoon IP meeshaa tokko lakkoofsa qulqulluudhaan adda baasa.'
          }
        ]
      },
      {
        id: 'ict-11-12',
        title: 'Kuusaa Deetaa fi Nageenya Saayibarii (Databases & Security)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'RDBMS, Ajajoota SQL, fi Eegumsa Dijitaalaa',
        lessonContent: [
          'Kuusaan Deetaa (Database) deetaa bifa qindaa\'een kuusuu fi sakatta\'uuf tajaajila. RDBMS deetaa gabatee (taawulii - sarara fi dalgee) keessatti qabata.',
          'Afaan SQL ajajoota gurguddoo SELECT (barbaaduu), INSERT (galchuu), UPDATE (fooyyessuu), fi DELETE (haquu) qaba. Primary Key sarara tokko adda baasa.',
          'Nageenyi Saayibarii (Cybersecurity) neetwoorkii fi daataa haleellaa dijitaalaa (Malware, Phishing) irraa eega. Utubaaleen isaa: Confidentiality, Integrity, fi Availability dha.'
        ],
        keyPoints: [
          'Ajajoota SQL: SELECT, INSERT, UPDATE, DELETE',
          'Primary Key: Qulfii reekordii tokko qofa adda baasu',
          'Sadan Nageenyaa (CIA): Confidentiality, Integrity, Availability'
        ],
        flashcards: [
          {
            id: 'i2-fc1',
            front: 'Primary Key\'n kuusaa deetaa keessatti maali?',
            back: 'Qulfii sarara (record) tokko qofa adda baasudha.'
          },
          {
            id: 'i2-fc2',
            front: 'Haleellaan Fiishingii (Phishing) maali?',
            back: 'Ergaa sobaa fayyadamuun paaswoordii ykn lakkoofsa herrega baankii hatuudha.'
          },
          {
            id: 'i2-fc3',
            front: 'Ajajni SQL deetaa barbaaduuf gargaaru kami?',
            back: 'SELECT (fakkeenyaaf: SELECT * FROM Students;).'
          },
          {
            id: 'i2-fc4',
            front: 'Enkiripshiniin (Encryption) maali?',
            back: 'Deetaa gara koodii namni hin barreef eeguudha.'
          }
        ],
        quizQuestions: [
          {
            id: 'i2-q1',
            question: 'Reekordii haaraa gabatee kuusaa deetaatti galchuuf ajaja kam fayyadamna?',
            options: ['INSERT INTO', 'SELECT', 'UPDATE', 'ADD ROW'],
            correctIndex: 0,
            explanation: 'INSERT INTO deetaa haaraa gabateetti dabala.'
          },
          {
            id: 'i2-q2',
            question: 'CIA Triad nageenya saayibarii keessatti maal agarsiisa?',
            options: [
              'Confidentiality, Integrity, Availability',
              'Computer, Internet, Access',
              'Code, Information, Authentication',
              'Control, Input, Automation'
            ],
            correctIndex: 0,
            explanation: 'Iccitii eeguu, qulqullina mirkaneessuu, fi yeroo barbaadame argamuu agarsiisa.'
          },
          {
            id: 'i2-q3',
            question: 'Two-Factor Authentication (2FA) faayidaan isaa maali?',
            options: [
              'Koodii mirkaneessaa dabalataa gaafachuun nageenya heeregaa cimsachuu',
              'Saffisa intarneetii dabaluu',
              'Baatiri qusachuu',
              'Paaswoordii balleessuu'
            ],
            correctIndex: 0,
            explanation: '2FA paaswoordiin yoo hatame illee koodii lammaffaadhaan eegumsa kenna.'
          },
          {
            id: 'i2-q4',
            question: 'Faayirwoolii (Firewall) neetwoorkii keessatti maal hojjeta?',
            options: [
              'Seensa fi baha odeeffannoo to\'achuun haleellaa ittisuu',
              'Kompiitara qabbaneessuu',
              'Faayila bade deebisuu',
              'Elektiriikii to\'achuu'
            ],
            correctIndex: 0,
            explanation: 'Faayirwooliin daangaa neetwoorkii eeguun namoota heyyama hin qabne dhowwa.'
          }
        ]
      }
    ]
  }
];
