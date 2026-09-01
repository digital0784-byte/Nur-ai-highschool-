import { Subject } from '../types';

export const curriculumSomali: Subject[] = [
  // 1. Xisaab (Mathematics)
  {
    id: 'math',
    name: 'Xisaab',
    subName: 'Mathematics (Fasalka 9-12)',
    accentColor: '#1D4ED8',
    accentLight: '#EFF6FF',
    accentBorder: '#2563EB',
    accentBadge: '#1E40AF',
    topics: [
      {
        id: 'math-9-10',
        title: 'Isleegyada Labajibbaaran (Quadratic Equations)',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Hababka Loo Furo Isleegyada Heerka Labaad',
        lessonContent: [
          'Isleegta labajibbaaran waa isleeg heerkeedu yahay 2 oo loo qoro qaabka guud: ax² + bx + c = 0, halkaas oo a, b, iyo c ay yihiin tirooyin dhab ah isla markaana a ≠ 0.',
          'Waxaa jira saddex hab oo aljebra ah oo loo furo: Kala-dhigid (Factoring), Dhammaystirka labajibbaarka (Completing the square), iyo Qaaciddada Guud ee Quadratic-ka: x = (-b ± √(b² - 4ac)) / (2a).',
          'Tirada (b² - 4ac) waxaa loo yaqaannaa Kala-reebe (Discriminant - D). Haddii D > 0, waxay leedahay laba xidid oo dhab ah oo kala duwan; haddii D = 0, waxay leedahay hal xidid oo dhab ah; haddii D < 0, ma laha xidid dhab ah.'
        ],
        keyPoints: [
          'Qaabka Guud: ax² + bx + c = 0 (a ≠ 0)',
          'Qaaciddada: x = (-b ± √(b² - 4ac)) / 2a',
          'Kala-reebaha D = b² - 4ac wuxuu go\'aamiyaa tirada iyo nooca xididdada'
        ],
        flashcards: [
          {
            id: 'm1-fc1',
            front: 'Waa maxay Isleegta Labajibbaaran?',
            back: 'Isleeg heerkeedu yahay 2 oo u qoran qaabka: ax² + bx + c = 0 (a ≠ 0).'
          },
          {
            id: 'm1-fc2',
            front: 'Waa maxay Kala-reebaha (Discriminant)?',
            back: 'D = b² - 4ac, kaas oo muujiya tirada iyo dabeecadda xididdada isleegta.'
          },
          {
            id: 'm1-fc3',
            front: 'Maxaa dhacaya haddii D < 0?',
            back: 'Isleegtu ma laha wax xidid dhab ah (real roots).'
          },
          {
            id: 'm1-fc4',
            front: 'Waa maxay Qaaciddada Quadratic Formula?',
            back: 'x = (-b ± √(b² - 4ac)) / (2a)'
          }
        ],
        quizQuestions: [
          {
            id: 'm1-q1',
            question: 'Haddii b² - 4ac = 0 ee isleegta ax² + bx + c = 0, imisa xidid oo dhab ah ayaa jira?',
            options: ['Hal xidid oo dhab ah oo kaliya', 'Ma laha xidid dhab ah', 'Laba xidid oo kala duwan', 'Afar xidid'],
            correctIndex: 0,
            explanation: 'Markii kala-reebuhu eber yahay, waxay leedahay hal xidid oo dhab ah oo soo noqnoqda.'
          },
          {
            id: 'm1-q2',
            question: 'Waa maxay xididdada isleegta x² - 5x + 6 = 0?',
            options: ['x = 2 iyo x = 3', 'x = -2 iyo x = -3', 'x = 1 iyo x = 6', 'x = -1 iyo x = 5'],
            correctIndex: 0,
            explanation: 'Marka la kala dhigo (x - 2)(x - 3) = 0, waxaan helaynaa x = 2 iyo x = 3.'
          },
          {
            id: 'm1-q3',
            question: 'Waa maxay qaabka joomatari ee garaafka hawsha labajibbaaran?',
            options: ['Baaroboola (Parabola)', 'Xariiq toosan', 'Goobo', 'Silindar'],
            correctIndex: 0,
            explanation: 'Garaafka dhammaan hawlaha heerka labaad waa Baaroboola.'
          },
          {
            id: 'm1-q4',
            question: 'Isleegta 2x² + 4x - 6 = 0, waa maxay qiimaha a, b, iyo c?',
            options: ['a=2, b=4, c=-6', 'a=4, b=2, c=6', 'a=2, b=-4, c=6', 'a=1, b=2, c=-3'],
            correctIndex: 0,
            explanation: 'Marka lala barbar-dhigo ax² + bx + c = 0, waxay noqonayaan a=2, b=4, c=-6.'
          }
        ]
      },
      {
        id: 'math-11-12',
        title: 'Xisaabta Isbeddelka & Kalakicinta (Calculus & Derivatives)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Heerka Isbeddelka Xilliga iyo Aasaaska Kalakicinta',
        lessonContent: [
          'Calculus waa barashada xisaabta ee isbeddelka joogtada ah. Kalakicintu (Derivative) waxay cabbirtaa heerka isbeddelka degdegga ah ee hawl (function) marka loo eego doorsoomaheeda madaxa-bannaan, waxayna joomatari ahaan u taagan tahay dhaadhaca xariiqda taabataha (slope of tangent line).',
          'Qeexidda xadka (Limit): f\'(x) = lim(h→0) [f(x+h) - f(x)] / h. Waxay awood u siisaa falanqaynta dhibcaha ugu sarreeya iyo kuwa ugu hooseeya.',
          'Xeerarka aasaasiga ah waxaa ka mid ah Xeerka Quwadda d/dx(xⁿ) = n·xⁿ⁻¹, Xeerka Isku-dhufashada, iyo Xeerka Silsiladda (Chain Rule).'
        ],
        keyPoints: [
          'Xeerka Quwadda: d/dx(xⁿ) = n · xⁿ⁻¹',
          'Macnaha Joomatari: Dhaadhaca xariiqda taabataha ee qalooca',
          'Kalakicinta tirada joogtada ah (constant) had iyo jeer waa 0'
        ],
        flashcards: [
          {
            id: 'm2-fc1',
            front: 'Muxuu joomatari ahaan u taagan yahay kalakicintu (derivative)?',
            back: 'Dhaadhaca (slope) xariiqda taabataha qalooca dhibicdaas.'
          },
          {
            id: 'm2-fc2',
            front: 'Waa maxay kalakicinta f(x) = x⁴?',
            back: 'f\'(x) = 4x³ (adoo adeegsanaya Xeerka Quwadda).'
          },
          {
            id: 'm2-fc3',
            front: 'Waa maxay kalakicinta tiro joogto ah (sida f(x) = 15)?',
            back: 'Had iyo jeer waa 0 (eber).'
          },
          {
            id: 'm2-fc4',
            front: 'Goorma ayaa la adeegsadaa Chain Rule?',
            back: 'Marka la kalakicinayo hawlo isku dhex jira f(g(x)).'
          }
        ],
        quizQuestions: [
          {
            id: 'm2-q1',
            question: 'Waa maxay kalakicinta f\'(x) ee f(x) = 3x² + 5x - 7?',
            options: ['6x + 5', '3x + 5', '6x - 7', '6x² + 5'],
            correctIndex: 0,
            explanation: 'd/dx(3x²) = 6x, d/dx(5x) = 5, d/dx(-7) = 0, markaa f\'(x) = 6x + 5.'
          },
          {
            id: 'm2-q2',
            question: 'Marka f\'(x) = 0 dhibic qalooca ka mid ah, xariiqda taabatahu waa:',
            options: ['Jiif (Horizontal)', 'Taagan (Vertical)', 'Koor 45 digrii ah', 'Ma jirto'],
            correctIndex: 0,
            explanation: 'Dhaadhaca eberka ahi wuxuu ka dhigan yahay in taabatahu yahay xariiq toosan oo jiif ah.'
          },
          {
            id: 'm2-q3',
            question: 'Waa maxay kalakicinta f(x) = sin(x)?',
            options: ['cos(x)', '-cos(x)', '-sin(x)', 'tan(x)'],
            correctIndex: 0,
            explanation: 'Kalakicinta sin(x) waa cos(x).'
          },
          {
            id: 'm2-q4',
            question: 'Sidee loo helaa xawaaraha degdegga ah (velocity) hawsha masaafada s(t)?',
            options: ['Adoo qaata kalakicinta 1aad v(t) = ds/dt', 'Adoo masaafada ku dhufta wakhtiga', 'Adoo dardarta u qaybiya cufka', 'Adoo labajibbaara wakhtiga'],
            correctIndex: 0,
            explanation: 'Xawaaruhu waa heerka isbeddelka masaafada ee wakhtiga: v(t) = ds/dt.'
          }
        ]
      }
    ]
  },

  // 2. Fiisikis (Physics)
  {
    id: 'physics',
    name: 'Fiisikis',
    subName: 'Physics (Fasalka 9-12)',
    accentColor: '#7C3AED',
    accentLight: '#F5F3FF',
    accentBorder: '#8B5CF6',
    accentBadge: '#6D28D9',
    topics: [
      {
        id: 'phys-9-10',
        title: 'Xeerarka Dhaqdhaqaaqa ee Newton',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Aasaaska Xoogga, Cufka, iyo Dhaqdhaqaaqa',
        lessonContent: [
          'Sir Isaac Newton wuxuu dejiyay saddex xeer oo aasaasi ah oo maamula dhaqdhaqaaqa walxaha iyo saameynta xoogagga.',
          'Xeerka 1aad (Inertia): Walax kasta waxay ku jirtaa xaaladdeeda nasashada ama xawaaraha joogtada ah ee xariiq toosan ilaa xoog dibadeed oo net ahi wax ka beddelo. Xeerka 2aad: Dardartu waxay toos ula saami tahay xoogga, cufkana si rogan (F = ma).',
          'Xeerka 3aad: Ficil kasta wuxuu leeyahay falcelin le\'eg isla markaana ka soo horjeedda oo ku dhacda laba walxood oo kala duwan.'
        ],
        keyPoints: [
          'Xeerka 1aad: Inertia — u adkaysiga isbeddelka xaaladda socodka',
          'Xeerka 2aad: F = m · a (Xoog = cuf × dardar)',
          'Xeerka 3aad: Lammaanaha Ficilka iyo Falcelinta'
        ],
        flashcards: [
          {
            id: 'p1-fc1',
            front: 'Maxaa loo yaqaannaa Xeerka 1aad ee Newton?',
            back: 'Xeerka Inertia-da (Law of Inertia).'
          },
          {
            id: 'p1-fc2',
            front: 'Waa maxay qaaciddada Xeerka 2aad ee Newton?',
            back: 'F = m · a (Xoogga Net = cuf × dardar).'
          },
          {
            id: 'p1-fc3',
            front: 'Waa maxay halbeega Xoogga ee SI-ga?',
            back: 'Newton (N) oo u dhiganta kg·m/s².'
          },
          {
            id: 'p1-fc4',
            front: 'Bixi tusaale ku saabsan Xeerka 3aad ee Newton.',
            back: 'Dabaashu gadaal ayuu biyaha u riixaa, biyahana hore ayay u riixaan dabaasha.'
          }
        ],
        quizQuestions: [
          {
            id: 'p1-q1',
            question: 'Waa maxay dardarta (a) ee ka dhalanaysa xoog 50 N oo lagu dabaqo walax cufkeedu yahay 10 kg?',
            options: ['5 m/s²', '500 m/s²', '0.2 m/s²', '40 m/s²'],
            correctIndex: 0,
            explanation: 'a = F / m = 50 N / 10 kg = 5 m/s².'
          },
          {
            id: 'p1-q2',
            question: 'Maxay rakaabku hore ugu boodaan marka baabuurku si degdeg ah u biriigiyo?',
            options: ['Sababtoo ah Inertia-da socodka', 'Culayska oo kordhay', 'Isku-dhaca oo yaraaday', 'Cadaadiska hawada'],
            correctIndex: 0,
            explanation: 'Jirka rakaabku wuxuu doonayaa inuu sii wado xawaarihii uu ku socday.'
          },
          {
            id: 'p1-q3',
            question: 'Xoogagga ficilka iyo falcelintu waxay mar kasta ku dhacaan:',
            options: ['Laba walxood oo kala duwan', 'Hal walax oo kaliya', 'Isla jihada', 'Waqtiyo kala duwan'],
            correctIndex: 0,
            explanation: 'Ficilka iyo falcelintu waxay isku mar ku dhacaan laba walxood oo is-saameeya.'
          },
          {
            id: 'p1-q4',
            question: 'Haddii walaxi ku socoto xawaare joogto ah oo xariiq toosan ah, waa maxay xoogga guud ee saaran?',
            options: ['0 N (Eber)', 'Le\'eg cufkeeda', 'Le\'eg xawaaraheeda', 'Aad u weyn'],
            correctIndex: 0,
            explanation: 'Xawaaraha joogtada ahi wuxuu muujinayaa dardar a = 0, sidaas darteed F_net = 0 N.'
          }
        ]
      },
      {
        id: 'phys-11-12',
        title: 'Electromagnetism & Mawjadaha (Waves)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Kala-gudbinta Koronto-Magneedka iyo Dabeecadda Mawjadaha',
        lessonContent: [
          'Electromagnetism waa barashada xidhiidhka ka dhexeeya dabaylaha korontada ee socda iyo goobaha magneedka.',
          'Xeerka Faraday ee Induction-ka wuxuu sheegayaa in isbeddelka qulqulka magneedku (magnetic flux) uu koronto (EMF) ka dhalinayo gariiradda. Xeerka Lenz wuxuu sheegayaa in jihada korontadu ka soo horjeeddo isbeddelka sababay.',
          'Mawjadaha koronto-magneedku waxay ku socdaan faaruqa xawaaraha iftiinka (3 × 10⁸ m/s). Xidhiidhka guud ee mawjadaha waa v = f · λ.'
        ],
        keyPoints: [
          'Xeerka Faraday: EMF = -N(ΔΦ/Δt)',
          'Isleegta Mawjadda: v = f · λ (Xawaare = soo-noqnoqosho × dhererka mawjadda)',
          'Mawjadaha koronto-magneedku uma baahna meel la taaban karo oo ay ku dhex maraan'
        ],
        flashcards: [
          {
            id: 'p2-fc1',
            front: 'Muxuu sheegayaa Xeerka Faraday ee Induction-ku?',
            back: 'Isbeddelka qulqulka magneedku wuxuu dhaliyaa xoog koronto (voltage/EMF).'
          },
          {
            id: 'p2-fc2',
            front: 'Waa maxay xawaaraha iftiinka ee faaruqa?',
            back: 'Qiyaastii 3.0 × 10⁸ m/s (300,000 km/s).'
          },
          {
            id: 'p2-fc3',
            front: 'Waa maxay halbeega soo-noqnoqoshada (Frequency)?',
            back: 'Hertz (Hz) ama 1/ilbiriqsi.'
          },
          {
            id: 'p2-fc4',
            front: 'Waa maxay mabda\'a uu ku shaqeeyo koronto-dhaliyuhu (generator)?',
            back: 'Induction-ka koronto-magneedka (tamar farsamo oo loo beddelo koronto).'
          }
        ],
        quizQuestions: [
          {
            id: 'p2-q1',
            question: 'Waa maxay xawaaraha mawjad dhererkeedu yahay 2 m, soo-noqnoqoshadeeduna tahay 150 Hz?',
            options: ['300 m/s', '75 m/s', '152 m/s', '0.013 m/s'],
            correctIndex: 0,
            explanation: 'v = f · λ = 150 Hz × 2 m = 300 m/s.'
          },
          {
            id: 'p2-q2',
            question: 'Waa maxay shaqada ugu weyn ee Transformer-ka?',
            options: ['Kor u qaadista ama dhimista Voltage-ka AC', 'U beddelidda AC una beddelo DC', 'Tirtiridda magneedka', 'Kaydinta korontada'],
            correctIndex: 0,
            explanation: 'Transformer-ku wuxuu beddelaa heerarka voltage-ka AC isagoo adeegsanaya induction.'
          },
          {
            id: 'p2-q3',
            question: 'Midkee ka mid ah kuwan soo socda ayaa ah mawjad farsamo oo u baahan meel ay dhex marto?',
            options: ['Mawjadda Codka (Sound wave)', 'Mawjadaha Raadiyaha', 'X-rays', 'Gamma rays'],
            correctIndex: 0,
            explanation: 'Codku waa mawjad farsamo oo u baahan hawo, biyo ama adke si uu u gudbo.'
          },
          {
            id: 'p2-q4',
            question: 'Xeerka Lenz wuxuu si toos ah uga dhashay xeerkee?',
            options: ['Xeerka Ilaalinta Tamarta (Conservation of Energy)', 'Ilaalinta Cufka', 'Ilaalinta Dabaylaha', 'Ilaalinta Xawaaraha'],
            correctIndex: 0,
            explanation: 'Xeerka Lenz wuxuu xaqiijiyaa in tamartu aysan iska dhalan bilaash.'
          }
        ]
      }
    ]
  },

  // 3. Kimistari (Chemistry)
  {
    id: 'chemistry',
    name: 'Kimistari',
    subName: 'Chemistry (Fasalka 9-12)',
    accentColor: '#C2410C',
    accentLight: '#FFF7ED',
    accentBorder: '#EA580C',
    accentBadge: '#9A3412',
    topics: [
      {
        id: 'chem-9-10',
        title: 'Qaab-dhismeedka Atamka & Is-xidhka Kiimikada',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Qaybaha Atamka iyo Noocyada Xidhadhka Kiimikada',
        lessonContent: [
          'Atamku waa halbeegga dhismaha aasaasiga ah ee maadada, wuxuuna ka kooban yahay bu\' (nucleus) ay ku jiraan borotoono (+ charge) iyo nuyutroono (dhexdhexaad), oo ay ku wareegayaan elektaroono (- charge).',
          'Atamyadu waxay sameeyaan xidhadh kiimikaad si ay u gaadhaan xasilooni (Xeerka Octet - 8 elektaroon): Xidhadhka Ionic (kala-qaadashada elektaroonnada), Xidhadhka Covalent (wadaagista elektaroonnada), iyo Xidhadhka Birta (Metallic bond).',
          'Jadwalka Curiyayaasha (Periodic Table) wuxuu u habeeyaa curiyayaasha iyadoo loo eegayo tiradooda atamka iyo dabeecadahooda.'
        ],
        keyPoints: [
          'Tirada Atamka (Z) = Tirada borotoonnada',
          'Tirada Cufka (A) = Borotoonno + Nuyutroonno',
          'Xidhadhka Ionic (kala-wareejin) vs Covalent (wadaag)'
        ],
        flashcards: [
          {
            id: 'c1-fc1',
            front: 'Waa maxay Isotope-yada (Isotopes)?',
            back: 'Atamyo isku curiye ah oo leh tiro borotoon isku mid ah laakiin nuyutroonno kala duwan.'
          },
          {
            id: 'c1-fc2',
            front: 'Sidee buu u samaysmaa Xidhadhka Covalent-ku?',
            back: 'Marka ay laba atam oo aan bir ahayn wadaagaan lammaane elektaroonno ah.'
          },
          {
            id: 'c1-fc3',
            front: 'Qaybtee atamka ka mid ah ayaa leh charge taban (negative)?',
            back: 'Elektaroonka (Electron).'
          },
          {
            id: 'c1-fc4',
            front: 'Xidhadh noocee ah ayaa ku jira milixda (NaCl)?',
            back: 'Xidhadhka Ionic (Ionic bond).'
          }
        ],
        quizQuestions: [
          {
            id: 'c1-q1',
            question: 'Waa maxay tirada cufka (A) ee atam leh 11 borotoon iyo 12 nuyutroon?',
            options: ['23', '11', '12', '1'],
            correctIndex: 0,
            explanation: 'A = 11 + 12 = 23 (Sodium).'
          },
          {
            id: 'c1-q2',
            question: 'Xidhadh noocee ah ayaa ka dhexeeya Haydarojiinta iyo Oksijiinta biyaha (H₂O)?',
            options: ['Xidhadhka Covalent', 'Xidhadhka Ionic', 'Xidhadhka Birta', 'Xidhadhka Nukliyeerka'],
            correctIndex: 0,
            explanation: 'Biyuhu waxay ka samaysan yihiin wadaagista elektaroonnada ee atamyada aan birta ahayn.'
          },
          {
            id: 'c1-q3',
            question: 'Marka loo eego Xeerka Octet-ka, imisa elektaroon ayay atamyadu rabaan qolka sare?',
            options: ['8', '2', '6', '10'],
            correctIndex: 0,
            explanation: 'Atamyadu waxay doonayaan 8 elektaroon si ay u noqdaan kuwa xasiloon.'
          },
          {
            id: 'c1-q4',
            question: 'Curiyayaasha Kooxda 1aad ee Jadwalka Curiyayaasha maxaa loo yaqaannaa?',
            options: ['Biraha Alkali (Alkali metals)', 'Halogens', 'Gaasaska Sharafta leh', 'Biraha Dhulka'],
            correctIndex: 0,
            explanation: 'Kooxda 1aad (Li, Na, K...) waxaa loo yaqaannaa Biraha Alkali.'
          }
        ]
      },
      {
        id: 'chem-11-12',
        title: 'Isku-dheellitirka Kiimikada & Thermodynamics',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Xawaaraha Falcelinta iyo Tamarta Kiimikada',
        lessonContent: [
          'Isku-dheellitirka kiimikadu wuxuu yimaadaa marka xawaaraha falcelinta hore iyo kan dambe ay isku mid noqdaan nidaam xidhan dhexdiisa.',
          'Mabda\'a Le Chatelier wuxuu sheegayaa in haddii cadaadis, heerkul ama qiyaas wax laga beddelo nidaam isku-dheellitiran, nidaamku u wareegayo jihada yaraynaysa saameyntaas.',
          'Thermodynamics waxay barataa Enthalpy (ΔH), Entropy (ΔS), iyo Tamarta Xorta ah ee Gibbs (ΔG = ΔH - TΔS). Haddii ΔG < 0, falcelintu waxay u dhacdaa si iskeed ah (spontaneous).'
        ],
        keyPoints: [
          'Mabda\'a Le Chatelier: Nidaamku wuxuu ka soo horjeedaa isbeddelka',
          'Joogtada Isku-dheellitirka Keq = [Wax-soo-saarka] / [Fal-galaha]',
          'ΔG < 0 waxay muujisaa falcelin iskeed u socota'
        ],
        flashcards: [
          {
            id: 'c2-fc1',
            front: 'Muxuu sheegayaa Mabda\'a Le Chatelier?',
            back: 'Nidaamka isku-dheellitirani wuxuu ka falceliyaa culayska isagoo yaraynaya saamayntiisa.'
          },
          {
            id: 'c2-fc2',
            front: 'Waa maxay Entropy (S)?',
            back: 'Cabbirka heerka kala-daadsanaanta ama fawdada nidaamka.'
          },
          {
            id: 'c2-fc3',
            front: 'Waa maxay calaamadda ΔH ee falcelinta kulaylka bixisa (Exothermic)?',
            back: 'Waa taban (ΔH < 0).'
          },
          {
            id: 'c2-fc4',
            front: 'Waa maxay qaaciddada Gibbs Free Energy?',
            back: 'ΔG = ΔH - TΔS'
          }
        ],
        quizQuestions: [
          {
            id: 'c2-q1',
            question: 'Falcelinta kiimikadu waxay u dhacdaa si iskeed ah marka ΔG ay tahay:',
            options: ['Taban (ΔG < 0)', 'Togan (ΔG > 0)', 'Eber', 'Aan la garanayn'],
            correctIndex: 0,
            explanation: 'Qiimaha taban ee ΔG wuxuu ka dhigan yahay in falcelintu iskeed u socon karto.'
          },
          {
            id: 'c2-q2',
            question: 'Nidaamka N₂ + 3H₂ ⇌ 2NH₃, kordhinta cadaadisku waxay isku-dheellitirka u wareejisaa:',
            options: ['Xagga midigta (xagga NH₃)', 'Xagga bidixda (xagga N₂ iyo H₂)', 'Waxba iskama beddelo', 'Wuu joogsadaa'],
            correctIndex: 0,
            explanation: 'Cadaadisku wuxuu u wareejiyaa dhinaca leh tiro yar oo mole-yo gaas ah (midigta).'
          },
          {
            id: 'c2-q3',
            question: 'Sidee bay Catalyst-gu u saameysaa falcelinta isku-dheellitiran?',
            options: ['Waxay hoos u dhigtaa tamarta bilowga waxayna kordhisaa xawaaraha labada jiho si siman', 'Waxay beddeshaa Keq', 'Waxay kordhisaa wax-soo-saarka', 'Waxay beddeshaa ΔH'],
            correctIndex: 0,
            explanation: 'Catalyst-gu wuxuu deddejiyaa falcelinta labada jiho iyadoon waxba ka beddelin booska dheellitirka.'
          },
          {
            id: 'c2-q4',
            question: 'Waa maxay calaamadda isbeddelka entropy (ΔS) marka biyuhu baraf noqdaan?',
            options: ['Taban (ΔS < 0)', 'Togan (ΔS > 0)', 'Eber', 'Aad u weyn'],
            correctIndex: 0,
            explanation: 'U wareegidda dareere loona gudbo adke waxay yaraysaa fawdada (ΔS < 0).'
          }
        ]
      }
    ]
  },

  // 4. Bayooloji (Biology)
  {
    id: 'biology',
    name: 'Bayooloji',
    subName: 'Biology (Fasalka 9-12)',
    accentColor: '#15803D',
    accentLight: '#F0FDF4',
    accentBorder: '#16A34A',
    accentBadge: '#166534',
    topics: [
      {
        id: 'bio-9-10',
        title: 'Qaab-dhismeedka iyo Shaqada Unugga (Cell Structure)',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Halbeegga Aasaasiga ah ee Nolosha iyo Qaybaha Unugga',
        lessonContent: [
          'Unuggu waa halbeegga dhismaha iyo shaqada aasaasiga ah ee dhammaan noolaha. Aragtida Unugga (Cell Theory) waxay sheegaysaa in dhammaan nooluhu ka kooban yihiin unugyo, unugyada cusubna ay ka dhashaan kuwo hore u jiray.',
          'Unugyada waxaa loo qaybiyaa: Prokaryotes (aan lahayn bu\' dhab ah, sida bakteeriyada) iyo Eukaryotes (leh bu\' iyo qaybo gaar ah, sida dhirta iyo xoolaha).',
          'Mitochondria waa xarunta tamarta (ATP), Chloroplast waa goobta photosynthesis-ka dhirta, Nucleus-kuna wuxuu kaydiyaa DNA-da.'
        ],
        keyPoints: [
          'Aragtida Unugga: Unuggu waa aasaaska nolosha',
          'Mitochondria: Xarunta Tamarta (Powerhouse)',
          'Unugyada dhirtu waxay leeyihiin Chloroplasts iyo Darbi Unug (Cell wall)'
        ],
        flashcards: [
          {
            id: 'b1-fc1',
            front: 'Qaybtee unugga ka mid ah ayaa loo yaqaannaa "Xarunta Tamarta"?',
            back: 'Mitochondria (waxay soo saartaa ATP).'
          },
          {
            id: 'b1-fc2',
            front: 'Sheeg laba qaybood oo ku jira unugga dhirta balse aan ku jirin kan xoolaha.',
            back: 'Darbiyada Unugga (Cell wall) iyo Chloroplasts.'
          },
          {
            id: 'b1-fc3',
            front: 'Maxay ku kala duwan yihiin Prokaryotes iyo Eukaryotes?',
            back: 'Prokaryotes ma laha bu\' (nucleus) ku xidhan xuub.'
          },
          {
            id: 'b1-fc4',
            front: 'Waa maxay shaqada Ribosomes-ku?',
            back: 'Dhisidda borotiinnada (Protein synthesis).'
          }
        ],
        quizQuestions: [
          {
            id: 'b1-q1',
            question: 'Photosynthesis-ka dhirta cagaaran wuxuu ka dhacaa qaybtee unugga ka mid ah?',
            options: ['Chloroplast', 'Mitochondria', 'Golgi apparatus', 'Lysosome'],
            correctIndex: 0,
            explanation: 'Chloroplasts waxay qabtaan iftiinka qorraxda si ay u soo saaraan gulukoos.'
          },
          {
            id: 'b1-q2',
            question: 'Qaybtee unugga ka mid ah ayaa haysa hiddasidaha (DNA)?',
            options: ['Nucleus', 'Cytoplasm', 'Vacuole', 'Plasma membrane'],
            correctIndex: 0,
            explanation: 'Bu\'da (Nucleus) waxay kaydisaa DNA waxayna hagtaa shaqada unugga.'
          },
          {
            id: 'b1-q3',
            question: 'Midkee ka mid ah kuwan soo socda ayaa ah Prokaryote?',
            options: ['Bakteeriyada (E. coli)', 'Khamiirka (Yeast)', 'Unugyada dhiigga cas', 'Amoeba'],
            correctIndex: 0,
            explanation: 'Bakteeriyadu waa noole fudud oo aan lahayn bu\' ku xidhan xuub.'
          },
          {
            id: 'b1-q4',
            question: 'Waa maxay maadada ugu weyn ee dhisaysa darbiyada unugyada dhirta?',
            options: ['Cellulose', 'Glycogen', 'Cholesterol', 'Keratin'],
            correctIndex: 0,
            explanation: 'Cellulose waxay siisaa adkeysi iyo xoog darbiyada unugyada dhirta.'
          }
        ]
      },
      {
        id: 'bio-11-12',
        title: 'Hiddasidaha & Molikuyuulada DNA (Genetics & DNA)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Qaababka Dhaxalka iyo Dhismaha DNA-da',
        lessonContent: [
          'Genetics waa barashada sida astaamaha looga dhaxlo waalidiinta. Gregor Mendel wuxuu aasaasay xeerarka dhaxalka isagoo tijaabiyay geedka digirta.',
          'DNA (Deoxyribonucleic Acid) waxay leedahay qaab labalaab ah (double helix). Saldhigyada nitrogen-ka: Adenine (A) wuxuu la xidhiidhaa Thymine (T), Guanine (G)-na Cytosine (C).',
          'Samaynta borotiinku waxay martaa Transcription (DNA oo laga qaado mRNA) iyo Translation (mRNA oo loo beddelo borotiin ribosomes-ka dushooda).'
        ],
        keyPoints: [
          'Isku-xidhka: A wuxuu la socdaa T, G wuxuu la socdaa C',
          'Dogma-ta Dhexe: DNA → mRNA (Transcription) → Borotiin (Translation)',
          'Genetics-ka Mendel: Astaamaha awoodda leh (dominant) iyo kuwa daciifka ah (recessive)'
        ],
        flashcards: [
          {
            id: 'b2-fc1',
            front: 'Saldhiggee ayaa la xidhiidha Adenine (A) ee DNA-da?',
            back: 'Thymine (T).'
          },
          {
            id: 'b2-fc2',
            front: 'Waa maxay Transcription?',
            back: 'Samaynta mRNA oo laga soo minguurinayo xogta DNA-da.'
          },
          {
            id: 'b2-fc3',
            front: 'Yaa loo yaqaannaa Aabbaha Genetics-ka?',
            back: 'Gregor Mendel.'
          },
          {
            id: 'b2-fc4',
            front: 'Imisa saldhig ayaa ka kooban hal Codon?',
            back: '3 saldhig (triplet code).'
          }
        ],
        quizQuestions: [
          {
            id: 'b2-q1',
            question: 'Saldhiggee ayaa beddela Thymine (T) ee ku jira RNA-da?',
            options: ['Uracil (U)', 'Adenine (A)', 'Cytosine (C)', 'Guanine (G)'],
            correctIndex: 0,
            explanation: 'RNA waxay leedahay Uracil (U) halkii ay ka lahaan lahayd Thymine.'
          },
          {
            id: 'b2-q2',
            question: 'Isku-tallaabinta laba qof oo heterozygous ah (Aa × Aa), waa maxay fursadda ilmo recessive ah (aa)?',
            options: ['25% (1/4)', '50% (1/2)', '75% (3/4)', '100%'],
            correctIndex: 0,
            explanation: 'Saamiga hiddo-wadaha waa 1 AA : 2 Aa : 1 aa (25% aa).'
          },
          {
            id: 'b2-q3',
            question: 'Yaa daahfuray qaab-dhismeedka double helix ee DNA-da sannadkii 1953?',
            options: ['James Watson iyo Francis Crick', 'Charles Darwin iyo Alfred Wallace', 'Gregor Mendel iyo Thomas Morgan', 'Louis Pasteur iyo Robert Koch'],
            correctIndex: 0,
            explanation: 'Watson iyo Crick waxay soo saareen qaab-dhismeedka double helix ee DNA.'
          },
          {
            id: 'b2-q4',
            question: 'Waa maxay Mutation (Isbeddelka hiddasidaha)?',
            options: ['Isbeddel joogto ah oo ku dhaca taxanaha DNA-da', 'Qaybsanaanta caadiga ah ee unugga', 'Biyo bixid', 'Shiididda cuntada'],
            correctIndex: 0,
            explanation: 'Mutation waa isbeddel lama filaan ah oo ku dhaca koodhka hiddasidaha.'
          }
        ]
      }
    ]
  },

  // 5. Ingiriisi (English)
  {
    id: 'english',
    name: 'English',
    subName: 'Af-Ingiriisi',
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
          'In English, Active Voice focuses on the subject performing the action: "Farah repaired the car." Passive Voice emphasizes the action or object: "The car was repaired by Farah."',
          'Forming the passive voice requires the form of "to be" + Past Participle (V3). It is essential in scientific and formal reports.',
          'Mastering tenses (Simple Past, Past Continuous, Present Perfect) ensures accurate and coherent expression of time.'
        ],
        keyPoints: [
          'Active: Subject acts',
          'Passive: Object receives action (be + V3)',
          'Used for formal and scientific reports'
        ],
        flashcards: [
          {
            id: 'e1-fc1',
            front: 'Change to passive: "Ali scored the goal."',
            back: '"The goal was scored by Ali."'
          },
          {
            id: 'e1-fc2',
            front: 'When is passive voice preferred?',
            back: 'When the action or result is more important than who did it.'
          },
          {
            id: 'e1-fc3',
            front: 'What is the past participle of "break"?',
            back: '"Broken" (break - broke - broken).'
          },
          {
            id: 'e1-fc4',
            front: 'Change to passive: "They are constructing the road."',
            back: '"The road is being constructed."'
          }
        ],
        quizQuestions: [
          {
            id: 'e1-q1',
            question: 'Which of the following sentences is in the Passive Voice?',
            options: [
              'The national stadium was inaugurated yesterday.',
              'The president inaugurated the national stadium.',
              'Citizens celebrated the inauguration.',
              'Everyone arrived early.'
            ],
            correctIndex: 0,
            explanation: '"Was inaugurated" uses the passive "be + V3" structure.'
          },
          {
            id: 'e1-q2',
            question: 'Complete: "By the time the bell rang, the students _______ their test."',
            options: ['had finished', 'have finished', 'finishes', 'was finishing'],
            correctIndex: 0,
            explanation: 'Past Perfect denotes an action completed before another past event.'
          },
          {
            id: 'e1-q3',
            question: 'Passive form of "Guled designed this building":',
            options: [
              'This building was designed by Guled.',
              'This building is designed by Guled.',
              'This building has designed by Guled.',
              'Guled was designed by this building.'
            ],
            correctIndex: 0,
            explanation: 'Simple past passive requires "was + designed".'
          },
          {
            id: 'e1-q4',
            question: 'Select the correct Present Perfect sentence:',
            options: [
              'He has lived in Hargeisa for four years.',
              'He lived in Hargeisa since four years.',
              'He has lived in Hargeisa yesterday.',
              'He is living in Hargeisa last year.'
            ],
            correctIndex: 0,
            explanation: '"Has lived" with "for four years" expresses duration continuing to the present.'
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
          'Conditionals describe hypothetical situations. Third Conditional deals with unreal past events: "If + had + V3, would have + V3".',
          'Inversion can replace if-clauses in formal prose: "Had we known the danger..." instead of "If we had known...".',
          'Discourse markers (moreover, consequently, nevertheless, in contrast) build smooth transitions across paragraphs.'
        ],
        keyPoints: [
          '3rd Conditional: If + had + V3, would have + V3',
          'Inversion: "Had I known..." replaces "If I had known..."',
          'Discourse markers establish clear logical links'
        ],
        flashcards: [
          {
            id: 'e2-fc1',
            front: 'What does the 3rd Conditional express?',
            back: 'Hypothetical past situations that did not actually happen.'
          },
          {
            id: 'e2-fc2',
            front: 'Complete: "If you had revised, you _______ passed."',
            back: '"would have" (3rd conditional).'
          },
          {
            id: 'e2-fc3',
            front: 'Give an example of a contrast discourse marker.',
            back: '"Nevertheless", "However", or "Nonetheless".'
          },
          {
            id: 'e2-fc4',
            front: 'Inverted form of "If she had arrived on time"?',
            back: '"Had she arrived on time..."'
          }
        ],
        quizQuestions: [
          {
            id: 'e2-q1',
            question: '"If the doctor _______ earlier, the patient would have recovered faster."',
            options: ['had arrived', 'arrived', 'have arrived', 'would arrive'],
            correctIndex: 0,
            explanation: 'The third conditional if-clause requires Past Perfect ("had arrived").'
          },
          {
            id: 'e2-q2',
            question: 'Which discourse marker indicates a result or effect?',
            options: ['Consequently', 'However', 'Whereas', 'Nonetheless'],
            correctIndex: 0,
            explanation: '"Consequently" introduces a direct result of a previous statement.'
          },
          {
            id: 'e2-q3',
            question: '"If the flight departs on schedule, we _______ before dusk."',
            options: ['will land', 'would land', 'would have landed', 'landed'],
            correctIndex: 0,
            explanation: 'First conditional uses "will + base verb".'
          },
          {
            id: 'e2-q4',
            question: 'Choose the sentence with correct academic cohesion:',
            options: [
              'The question was difficult; nevertheless, the students answered correctly.',
              'The question was difficult; because, the students answered correctly.',
              'The question was difficult; although, they answered correctly.',
              'The question was difficult; therefore, it was easy.'
            ],
            correctIndex: 0,
            explanation: '"Nevertheless" accurately introduces contrast between difficulty and success.'
          }
        ]
      }
    ]
  },

  // 6. Suugaan iyo Af-Soomaali (Literature)
  {
    id: 'amharic',
    name: 'Suugaan & Af-Soomaali',
    subName: 'Suugaan iyo Af',
    accentColor: '#D97706',
    accentLight: '#FFFBEB',
    accentBorder: '#F59E0B',
    accentBadge: '#B45309',
    topics: [
      {
        id: 'amh-9-10',
        title: 'Noocyada Suugaanta & Dhaqanka Afka (Folklore)',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Suugaanta Afka, Maahmaahyada, iyo Qaabka Sheekada',
        lessonContent: [
          'Suugaantu waa farshaxan lagu cabbiro dareenka, fikirka, iyo nolosha bulshada iyadoo la adeegsanayo hadal qurux badan. Waxay u qaybsantaa: Suugaanta Afka (oo jiilba jiilka kale u gudbiyo) iyo Suugaanta Qoran.',
          'Suugaanta afka waxaa ka mid ah Maahmaahyada, Xujooyinka, Gabayada dhaqanka, Geeraarka, iyo Heesaha hawsha.',
          'Suugaanta qoran waxaa ka mid ah Sheekooyinka (Novels), Riwaayadaha, iyo Gabayada qoran. Qaybaha sheekada waxaa ka mid ah: Dulucda (Theme), Qorshe-sheekeedka (Plot), iyo Jilayaasha.'
        ],
        keyPoints: [
          'Suugaanta Afka: Dhaxal dhaqameed nool oo afka lagu kala qaato',
          'Qaybaha Sheekada: Dulucda, Jilayaasha, Goobta iyo Wakhtiga',
          'Gabayga: Miisaanka, Qaafiyadda, iyo Meerisyada'
        ],
        flashcards: [
          {
            id: 'a1-fc1',
            front: 'Waa maxay Suugaanta Afka (Oral Literature)?',
            back: 'Farshaxanka hadalka ee jiilba jiilka kale afka kaga gudbiyo sida maahmaahyada.'
          },
          {
            id: 'a1-fc2',
            front: 'Maxaa loo yaqaannaa isku xigxiga dhacdooyinka sheekada?',
            back: 'Qorshe-sheekeedka (Plot).'
          },
          {
            id: 'a1-fc3',
            front: 'Maxay ku caan tahay Riwaayaddu (Drama)?',
            back: 'Waa suugaan loogu talagalay in jilayaal ku jilaan masraxa horteeda.'
          },
          {
            id: 'a1-fc4',
            front: 'Bixi tusaalooyin ka mid ah suugaanta afka.',
            back: 'Maahmaahyo, Xujooyin, Geeraar, iyo Heeso dhaqameed.'
          }
        ],
        quizQuestions: [
          {
            id: 'a1-q1',
            question: 'Waa maxay dulucda (Theme) guud ee sheeko?',
            options: ['Fikirka iyo fariinta ugu weyn ee qoraagu gudbinayo', 'Tirada jilayaasha', 'Goobta sheekadu ka dhacday', 'Magaca buugga'],
            correctIndex: 0,
            explanation: 'Dulucdu waa fariinta falsafadeed ee udub-dhexaadka u ah qoraalka.'
          },
          {
            id: 'a1-q2',
            question: 'Midkee ka mid ah kuwan soo socda ayaa ah suugaan qoran oo aan ahayn suugaanta afka?',
            options: ['Buug sheeko dheer ah (Novel)', 'Maahmaahyo', 'Xujooyin', 'Hees hawleed'],
            correctIndex: 0,
            explanation: 'Buugga sheekada dheer waa qoraal daabacan.'
          },
          {
            id: 'a1-q3',
            question: 'Waqtiga iyo goobta ay dhacdooyinka sheekadu ka dhacaan maxaa loo yaqaannaa?',
            options: ['Madal / Deegaan (Setting)', 'Jilayaal', 'Isku dhac', 'Dhammaad'],
            correctIndex: 0,
            explanation: 'Madashu (Setting) waxay qeexaysaa meesha iyo goorta sheekadu dhacday.'
          },
          {
            id: 'a1-q4',
            question: 'Hal xariiq oo ka mid ah gabayga maxaa loo yaqaannaa?',
            options: ['Meeris / Bayt', 'Baaraagaraf', 'Cutub', 'Duluc'],
            correctIndex: 0,
            explanation: 'Xariiqda gabayga waxaa loo yaqaannaa meeris.'
          }
        ]
      },
      {
        id: 'amh-11-12',
        title: 'Sarbeebta & Suugaanta Macnaha Labaad (Wax & Gold Rhetoric)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Falsafadda Sarbeebta iyo Hadalka Qarsoon',
        lessonContent: [
          'Sarbeebta iyo fanka "Wax and Gold" (Sem-ena-Worq) waa farshaxan hadal oo leh laba macne: "Wax" (Muuqaalka hore ee hadalka) iyo "Gold" (Dahabka / Macnaha runta ah ee hoose ee qarsoon).',
          'Waxay adeegsataa erayo leh laba macne si loo gudbiyo dhaleecayn bulsho, falsafad, ama fariimo siyaasadeed iyadoo aan si toos ah loo hadlin.',
          'Waa dhaqan qadiim ah oo kobciya xikmadda, falanqaynta afka, iyo farshaxanka suugaanta heerka sare ah.'
        ],
        keyPoints: [
          'Muuqaalka Hore (Wax): Macnaha dusha sare ee tooska ah',
          'Dahabka (Gold): Fariinta dhabta ah ee hoose',
          'Erayga Furaha ah: Erayga xidhiidhiya labada macne'
        ],
        flashcards: [
          {
            id: 'a2-fc1',
            front: 'Muxuu u taagan yahay "Muuqaalka Hore" (Wax)?',
            back: 'Macnaha dusha sare ee qof kasta si toos ah u maqli karo.'
          },
          {
            id: 'a2-fc2',
            front: 'Muxuu u taagan yahay "Dahabku" (Gold)?',
            back: 'Macnaha dhabta ah ee qarsoon ee qoraagu u jeedo.'
          },
          {
            id: 'a2-fc3',
            front: 'Maxay tahay faa\'iidada sarbeebta noocan ah?',
            back: 'In fariimo qoto dheer iyo dhaleecayn loo gudbiyo si xikmad leh.'
          },
          {
            id: 'a2-fc4',
            front: 'Waa maxay erayga xidhiidhiyaha ah?',
            back: 'Erayga labada macne xambaarsan ee isku xidha labada weji.'
          }
        ],
        quizQuestions: [
          {
            id: 'a2-q1',
            question: 'Macnaha dhabta ah ee hoose ee ku qarsoon sarbeebta maxaa loo yaqaannaa?',
            options: ['Dahabka (Gold / Worq)', 'Muuqaalka Hore (Wax)', 'Qaafiyad', 'Xariiq'],
            correctIndex: 0,
            explanation: 'Dahabku waa fariinta dhabta ah ee qarsoon.'
          },
          {
            id: 'a2-q2',
            question: 'Macnaha tooska ah ee dusha sare maxaa loo yaqaannaa?',
            options: ['Muuqaalka Hore (Wax / Sem)', 'Dahabka (Gold)', 'Meeris', 'Xujo'],
            correctIndex: 0,
            explanation: 'Muuqaalka hore (Wax) waa kan dusha sare kaga yaal fariinta.'
          },
          {
            id: 'a2-q3',
            question: 'Waa maxay faa\'iidada ugu weyn ee sarbeebta iyo hadalka dahsoon?',
            options: ['Gudbinta dhaleecayn iyo fikir qoto dheer si xikmad leh', 'Yaraynta xarfaha kaliya', 'Baabi\'inta tusaalooyinka', 'Kor u qaadidda codka'],
            correctIndex: 0,
            explanation: 'Waxay u oggolaataa qoraaga inuu gudbiyo fariimo xasaasi ah si farshaxanimo leh.'
          },
          {
            id: 'a2-q4',
            question: 'Falanqaynta suugaanta maxaa diiradda lagu saaraa?',
            options: ['Nuxurka, farshaxanka, iyo fariinta qoraalka', 'Tirada bogagga kaliya', 'Qiimaha buugga', 'Midabka daboolka'],
            correctIndex: 0,
            explanation: 'Falanqayntu waxay baartaa tayada faneed iyo nuxurka shaqada suugaaneed.'
          }
        ]
      }
    ]
  },

  // 7. Taariikh iyo Cilmiga Bulshada (History)
  {
    id: 'social-studies',
    name: 'Taariikh',
    subName: 'Taariikh iyo Cilmiga Bulshada',
    accentColor: '#B91C1C',
    accentLight: '#FEF2F2',
    accentBorder: '#DC2626',
    accentBadge: '#991B1B',
    topics: [
      {
        id: 'soc-9-10',
        title: 'Boqortooyadii Aksum & Ganacsiga Badda Cas',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Ilbaxnimadii Aksum, Tiknoolajiyada, iyo Ganacsiga Caalamiga ah',
        lessonContent: [
          'Ilbaxnimadii Aksum waxay ka dhalatay Geeska Afrika intii u dhaxaysay qarnigii 1aad ilaa 8aad CD, waxaana loo tixgelin jiray mid ka mid ah afarta awoodood ee adduunka qadiimka ah oo ay weheliyaan Rome, Persia, iyo China.',
          'Iyadoo adeegsanaysa dekadda Adulis ee Badda Cas, Aksum waxay ganacsi ballaaran la lahayd badda Mediterranean-ka, Carabta, iyo Hindiya, iyadoo dhoofin jirtay dahab, fool maroodi, iyo luubaan.',
          'Aksum waxay ahayd ilbaxnimadii ugu horreysay ee Afrika ka hooseysa Sahara ee samaysata lacagteeda oo dahab iyo qalin ah, waxayna dhistay taallooyin waaweyn oo dhagax kaliya ah.'
        ],
        keyPoints: [
          'Dekadda Adulis: Xarun caalami ah oo ganacsiga Badda Cas',
          'Lacagta: Aksum waxay daabacatay lacagteeda dahabka iyo qalinka ah',
          'Dhismaha: Taallooyin waaweyn oo hal dhagax laga qoray'
        ],
        flashcards: [
          {
            id: 's1-fc1',
            front: 'Waa maxay dekaddii caalamiga ahayd ee boqortooyada Aksum?',
            back: 'Adulis, oo ku taallay xeebta Badda Cas.'
          },
          {
            id: 's1-fc2',
            front: 'Kumaa ahaa boqorkii ugu horreeyay ee Aksum ee daabaca lacag?',
            back: 'Boqor Endubis (dabayaaqadii qarnigii 3aad CD).'
          },
          {
            id: 's1-fc3',
            front: 'Waa maxay waxyaabihii ugu muhiimsanaa ee Aksum dhoofin jirtay?',
            back: 'Dahab, fool maroodi, iyo luubaan.'
          },
          {
            id: 's1-fc4',
            front: 'Maxaa sababay hoos u dhaca Aksum?',
            back: 'Luminta dariiqyada ganacsiga badda iyo xidhitaanka dekadda Adulis.'
          }
        ],
        quizQuestions: [
          {
            id: 's1-q1',
            question: 'Goorma ayay Aksum bilowday daabacaadda lacagteeda gaarka ah?',
            options: ['Dabayaaqadii qarnigii 3aad CD', 'Qarnigii 10aad CD', 'Qarnigii 1aad C.H.', 'Qarnigii 16aad CD'],
            correctIndex: 0,
            explanation: 'Boqor Endubis wuxuu bilaabay lacagta Aksum dabayaaqadii qarnigii 3aad.'
          },
          {
            id: 's1-q2',
            question: 'Boqortooyooyinkee ka mid ah kuwan soo socda ayaan Aksum ganacsi toos ah la lahayn?',
            options: ['Boqortooyadii Inca ee Koonfurta Ameerika', 'Boqortooyadii Roomaanka', 'Boqortooyadii Byzantine', 'Hindiya qadiimka ah'],
            correctIndex: 0,
            explanation: 'Inca waxay ku taallay Koonfurta Ameerika mana lahayn xidhiidh ganacsi.'
          },
          {
            id: 's1-q3',
            question: 'Taallooyinka Aksum waxaa laga qoray dhagax noocee ah?',
            options: ['Dhagax adag oo granite ah oo hal xabbo ah (Monolithic)', 'Lebidh gubtay', 'Dhagax nuurad ah', 'Dhoobo'],
            correctIndex: 0,
            explanation: 'Taallooyinka Aksum waxaa laga qoray dhagax keliya oo granite ah.'
          },
          {
            id: 's1-q4',
            question: 'Berrigii boqorkee ayay diinta Masiixiyaddu noqotay diinta rasmiga ah ee Aksum?',
            options: ['Boqor Ezana (qarnigii 4aad CD)', 'Boqor Kaleb', 'Boqor Endubis', 'Boqor Menelik'],
            correctIndex: 0,
            explanation: 'Boqor Ezana wuxuu qaatay Masiixiyadda qarnigii 4aad CD.'
          }
        ]
      },
      {
        id: 'soc-11-12',
        title: 'Taariikhda Casriga ah & Dagaalkii Adwa (Battle of Adwa)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Ilaalinta Madaxbannaanida iyo Guushii Taariikhiga ahayd ee Adwa',
        lessonContent: [
          'Dagaalkii Adwa (March 1, 1896 / Yekatit 23, 1888 E.C.) wuxuu ahaa guul taariikhi ah oo ciidamada Itoobiya ay si buuxda ugu jabiyeen ciidankii gumeysiga Talyaaniga, iyagoo ilaashaday xornimadooda.',
          'Isqabqabsigu wuxuu ka dhashay Qodobka 17aad ee Heshiiskii Wuchale (1889); nuqulka Talyaaniga wuxuu Itoobiya ka dhigayay maxmiyad Talyaani, halka nuqulka Af-Axmaariga uu xornimo buuxda siinayay xidhiidhka dibadda.',
          'Boqor Menelik II iyo Boqorad Taytu Betul waxay abaabuleen in ka badan 100,000 oo qof, iyagoo jafay ciidankii General Baratieri, taas oo noqotay astaan u taagan xornimada Afrika oo dhan (Pan-Africanism).'
        ],
        keyPoints: [
          'Taariikhda Guusha: March 1, 1896 (Yekatit 23, 1888)',
          'Heshiiskii Wuchale Qodobkiisa 17aad wuxuu ahaa sababta dagaalka',
          'Waxay noqotay astaanta halganka xornimada Afrika ee ka dhanka ah gumeysiga'
        ],
        flashcards: [
          {
            id: 's2-fc1',
            front: 'Goorma ayuu dhacay Dagaalkii Taariikhiga ahaa ee Adwa?',
            back: 'March 1, 1896 (Yekatit 23, 1888 Kalandarka Itoobiya).'
          },
          {
            id: 's2-fc2',
            front: 'Heshiiskee sababay dagaalka Adwa?',
            back: 'Heshiiskii Wuchale (Qodobka 17aad).'
          },
          {
            id: 's2-fc3',
            front: 'Kumaa hoggaaminayay ciidankii duullaanka ee Talyaaniga ee Adwa?',
            back: 'General Oreste Baratieri.'
          },
          {
            id: 's2-fc4',
            front: 'Waa maxay macnaha guusha Adwa u leedahay adduunka?',
            back: 'Waxay caddeysay in Afrikaanku jabin karaan gumeysiga waxayna dhiirrigelisay Pan-Africanism.'
          }
        ],
        quizQuestions: [
          {
            id: 's2-q1',
            question: 'Sannadkee ayaa la saxeexay Heshiiskii Wuchale?',
            options: ['1889 (1881 E.C.)', '1896', '1875', '1905'],
            correctIndex: 0,
            explanation: 'Heshiiskii Wuchale waxaa la saxeexay May 1889.'
          },
          {
            id: 's2-q2',
            question: 'Hoggaamiyehee door weyn ka qaadatay jarista biyaha ciidanka Talyaaniga ee Mekelle?',
            options: ['Boqorad Taytu Betul', 'Boqorad Zewditu', 'Boqorad Menen', 'Boqorad Eleni'],
            correctIndex: 0,
            explanation: 'Boqorad Taytu waxay qorsheysay go\'doominta biyaha Mekelle.'
          },
          {
            id: 's2-q3',
            question: 'Heshiiskee baabi\'iyay Heshiiskii Wuchale isla markaana aqoonsaday xornimada Itoobiya?',
            options: ['Heshiiskii Addis Ababa (October 1896)', 'Heshiiskii London', 'Heshiiskii Rome', 'Heshiiskii Paris'],
            correctIndex: 0,
            explanation: 'Heshiiskii Addis Ababa ee 1896 wuxuu baabi\'iyay Wuchale wuxuuna xaqiijiyay xornimada.'
          },
          {
            id: 's2-q4',
            question: 'Waa maxay saameyntii ugu weynayd ee guusha Adwa ku yeelatay caalamka?',
            options: ['Waxay jabisay aragtida ah inaan reer Yurub la jabin karin waxayna dhiirrigelisay Pan-Africanism', 'Waxay kordhisay gumeysiga', 'Waxay joojisay ganacsiga', 'Waxay xidhay Badda Cas'],
            correctIndex: 0,
            explanation: 'Adwa waxay noqotay tusaale u taagan gobannimada iyo halganka Afrikaanka.'
          }
        ]
      }
    ]
  },

  // 8. Farsamada Warfaafinta & Isgaadhsiinta (ICT)
  {
    id: 'ict',
    name: 'ICT',
    subName: 'Farsamada Warfaafinta',
    accentColor: '#475569',
    accentLight: '#F8FAFC',
    accentBorder: '#64748B',
    accentBadge: '#334155',
    topics: [
      {
        id: 'ict-9-10',
        title: 'Hardware, Software & Shabakadaha (Networks)',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Dhismaha Kumbuyuutarka, Xusuusta, iyo Aasaaska Shabakadaha',
        lessonContent: [
          'Nidaamka kumbuyuutarku wuxuu ka kooban yahay Hardware (qaybaha la taaban karo: CPU, RAM, Qalabka Gelinta/Soo-saarka) iyo Software (barnaamijyada hagaya shaqada).',
          'CPU waa maskaxda kumbuyuutarka. RAM waa xusuus ku-meel-gaadh ah oo xogtu ka lunto marka korontadu baxdo, halka Hard Drive-ku yahay kayd joogto ah.',
          'Shabakadaha kumbuyuutarku waxay awood u siiyaan wadaagista macluumaadka: LAN (Shabakad deegaan gaar ah sida dugsi ama xafiis) iyo WAN (Shabakad ballaaran sida Internet-ka).'
        ],
        keyPoints: [
          'CPU: Maskaxda kumbuyuutarka ee fulisa amarada',
          'RAM (Xusuus ku-meel-gaadh ah) vs Kaydka Joogtada ah (Hard Drive)',
          'LAN (Shabakad maxalli ah) vs WAN (Shabakad ballaaran / Internet)'
        ],
        flashcards: [
          {
            id: 'i1-fc1',
            front: 'Waa maxay qaybta loo yaqaannaa "Maskaxda" Kumbuyuutarka?',
            back: 'CPU (Central Processing Unit).'
          },
          {
            id: 'i1-fc2',
            front: 'Waa maxay farqiga u dhexeeya RAM iyo ROM?',
            back: 'RAM waa ku-meel-gaadh (volatile), ROM-na waa mid joogto ah.'
          },
          {
            id: 'i1-fc3',
            front: 'Maxaa loo soo gaabiyaa LAN?',
            back: 'Local Area Network (Shabakad kooban).'
          },
          {
            id: 'i1-fc4',
            front: 'Bixi tusaalooyin Operating Systems ah.',
            back: 'Windows, Linux, macOS, Android, iyo iOS.'
          }
        ],
        quizQuestions: [
          {
            id: 'i1-q1',
            question: 'Qalabkee ka mid ah kuwan soo socda ayaa ah Qalabka Gelinta (Input Device)?',
            options: ['Keyboard iyo Mouse', 'Shaashadda (Monitor)', 'Printer-ka', 'Speaker-ka'],
            correctIndex: 0,
            explanation: 'Keyboard-ka iyo Mouse-ka waxaa loo adeegsadaa in amarro lagu geliyo kumbuyuutarka.'
          },
          {
            id: 'i1-q2',
            question: '1 Gigabyte (1 GB) waxay le\'eg tahay imisa Megabytes (MB)?',
            options: ['1,024 MB', '100 MB', '1,000,000 MB', '10 MB'],
            correctIndex: 0,
            explanation: 'Xisaabta kumbuyuutarka ee binary-ga 1 GB = 1024 MB.'
          },
          {
            id: 'i1-q3',
            question: 'Barnaamijkee loo adeegsadaa furista bogagga Internet-ka?',
            options: ['Web Browser', 'Operating System', 'Anti-virus', 'Spreadsheet'],
            correctIndex: 0,
            explanation: 'Web Browser-ka (sida Chrome iyo Firefox) waxaa lagu baadhaa bogagga internet-ka.'
          },
          {
            id: 'i1-q4',
            question: 'Waa maxay shaqada cinwaanka IP (IP Address)?',
            options: ['Inuu si gaar ah u aqoonsado qalab kasta oo ku xidhan shabakadda', 'Inuu kordhiyo xawaaraha kumbuyuutarka', 'Inuu tirtiro fayraska', 'Inuu iftiimiyo shaashadda'],
            correctIndex: 0,
            explanation: 'Cinwaanka IP waa aqoonsiga gaarka ah ee qalab kasta ku yeesho shabakadda.'
          }
        ]
      },
      {
        id: 'ict-11-12',
        title: 'Kaydka Xogta & Amniga Internet-ka (Cybersecurity)',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Nidaamka RDBMS, Luqadda SQL, iyo Difaaca Dijitaalka ah',
        lessonContent: [
          'Database waa hab nidaamsan oo xogta loo kaydiyo loona helo. RDBMS waxay xogta ku kaydisaa jadwalro leh safaf (rows) iyo tiirar (columns).',
          'Luqadda SQL waxay maamushaa xogta iyadoo adeegsanaysa amarada: SELECT (soo-saarid), INSERT (gelin), UPDATE (wax ka beddel), iyo DELETE (tirtirid). Primary Key wuxuu si gaar ah u aqoonsadaa saf kasta.',
          'Cybersecurity waxay ka ilaalisaa shabakadaha iyo xogta weerarrada dijitaalka ah (Malware, Phishing). Waxay ku dhisan tahay Saddexda Tiir ee CIA: Qarsoodiga (Confidentiality), Sugnaanta (Integrity), iyo Helitaanka (Availability).'
        ],
        keyPoints: [
          'Amarada SQL: SELECT, INSERT, UPDATE, DELETE',
          'Primary Key: Furaha gaarka ah ee saf kasta oo jadwalka ku jira',
          'Tiirarka Amniga: Confidentiality, Integrity, Availability (CIA)'
        ],
        flashcards: [
          {
            id: 'i2-fc1',
            front: 'Waa maxay Primary Key xagga database-ka?',
            back: 'Tiir si gaar ah oo aan soo noqnoqonayn u aqoonsada saf kasta oo jadwalka ku jira.'
          },
          {
            id: 'i2-fc2',
            front: 'Waa maxay weerarka Phishing-ku?',
            back: 'Fariimo been abuur ah oo lagu khaldo qofka si looga xado furaha ama xogta bangiga.'
          },
          {
            id: 'i2-fc3',
            front: 'Amarkee SQL ah ayaa loo adeegsadaa soo saarista xogta jadwalka?',
            back: 'Amarka SELECT (tusaale: SELECT * FROM Students;).'
          },
          {
            id: 'i2-fc4',
            front: 'Waa maxay Encryption (Qarxinta xogta)?',
            back: 'U beddelidda xogta koodh qarsoon si qof aan fasax u haysani uusan u akhrisan.'
          }
        ],
        quizQuestions: [
          {
            id: 'i2-q1',
            question: 'Amarkee SQL ah ayaa loo adeegsadaa gelinta xog cusub oo jadwalka lagu daro?',
            options: ['INSERT INTO', 'SELECT', 'UPDATE', 'ADD ROW'],
            correctIndex: 0,
            explanation: 'INSERT INTO waxay safaf cusub ku dartaa jadwalka.'
          },
          {
            id: 'i2-q2',
            question: 'Muxuu u taagan yahay CIA Triad xagga amniga xogta?',
            options: [
              'Confidentiality, Integrity, Availability',
              'Computer, Internet, Access',
              'Code, Information, Authentication',
              'Control, Input, Automation'
            ],
            correctIndex: 0,
            explanation: 'Qarsoodiga, Sugnaanta, iyo Helitaanka xogta ayaa ah aasaaska amniga dijitaalka.'
          },
          {
            id: 'i2-q3',
            question: 'Waa maxay faa\'iidada Two-Factor Authentication (2FA)?',
            options: [
              'Waxay u baahan tahay xaqiijin labaad, taas oo ilaalisa akoonka xitaa haddii furuhu lumo',
              'Waxay kordhisaa xawaaraha internet-ka',
              'Waxay kaydisaa baytariga',
              'Waxay meesha ka saartaa baahida loo qabo furaha'
            ],
            correctIndex: 0,
            explanation: '2FA waxay bixisaa lakab labaad oo ammaan ah si looga hortago jabsiga.'
          },
          {
            id: 'i2-q4',
            question: 'Waa maxay shaqada Firewall-ku ku leeyahay shabakadda?',
            options: [
              'Inuu kormeero xogta soo galaysa iyo tan baxaysa uuna xannibo gelitaanka aan fasaxa loo haysan',
              'Inuu qaboojiyo processor-ka',
              'Inuu hagaajiyo hard drive-ka jabay',
              'Inuu xakameeyo korontada'
            ],
            correctIndex: 0,
            explanation: 'Firewall-ku wuxuu u shaqeeyaa sidii gaashaan ilaaliya shabakadda.'
          }
        ]
      }
    ]
  }
];
