import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Subject, Grade } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  Sparkles,
  Building,
  Atom,
  Zap,
  Shield,
  Users,
  Cpu,
  Layers,
  Boxes,
  Globe,
  Activity,
  ChevronRight,
  ChevronLeft,
  Search,
  Maximize2,
  Info,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Compass,
} from 'lucide-react';

export interface AnimationNode {
  id: string;
  label: string;
  role: string;
  details: string;
  color: string;
  iconName?: string;
}

export interface AnimationStage {
  step: number;
  title: string;
  narration: string;
  activeNodeIds: string[];
  particleFlowLabel: string;
  keyInsight: string;
}

export interface AnimationConceptData {
  title: string;
  conceptName: string;
  category: string;
  overview: string;
  nodes: AnimationNode[];
  stages: AnimationStage[];
  keyTakeaways: string[];
}

interface InteractiveAnimationStudioProps {
  subject: Subject;
  grade: Grade;
  onOpenAITutor?: (chapterTitle: string, mode: 'analysis' | 'chat') => void;
  onExit?: () => void;
}

// Preset animations across key subjects
const PRESET_ANIMATIONS: Record<string, AnimationConceptData> = {
  cell_organization: {
    title: 'የሕዋስ ድርጅታዊ አወቃቀር እና ኦርጋኔሎች (Cellular Organization)',
    conceptName: 'የሕዋስ ድርጅት',
    category: 'Biology (ባዮሎጂ)',
    overview: 'ሕዋስ የህይወት መሰረታዊ አሃድ ሲሆን እያንዳንዱ ኦርጋኔል (የሕዋስ አካል) የተቀናጀ ተግባር በማከናወን ሕዋሱን ህያው ያደርገዋል።',
    nodes: [
      { id: 'nucleus', label: 'ኒውክሊየስ (Nucleus)', role: 'የመቆጣጠሪያ ማዕከል', details: 'የዘረመል መረጃ (DNA) ይይዛል፤ የሕዋስ ስራዎችን በሙሉ ይመራል።', color: '#2563EB', iconName: 'Atom' },
      { id: 'mitochondria', label: 'ማይቶኮንድሪያ (Mitochondria)', role: 'የሃይል ማመንጫ (ATP Powerhouse)', details: 'ሴሉላር ሬስፒሬሽን በማካሄድ ግሉኮስን ወደ ATP ሃይል ይቀይራል።', color: '#DC2626', iconName: 'Zap' },
      { id: 'ribosomes', label: 'ራይቦዞምስ (Ribosomes)', role: 'ፕሮቲን አምራች ፋብሪካ', details: 'በኒውክሊየስ ትዕዛዝ መሰረት አስፈላጊ ኢንዛይሞችንና ፕሮቲኖችን ይገነባል።', color: '#16A34A', iconName: 'Boxes' },
      { id: 'membrane', label: 'ሴል ሜምብሬን (Cell Membrane)', role: 'የውጭ ጠባቂ ሽፋን', details: 'ንጥረ ነገሮች ወደ ውስጥና ውጭ እንዲገቡ እየመረጠ የሚፈቅድ ከፊል አሳላፊ በር ነው።', color: '#D97706', iconName: 'Shield' },
    ],
    stages: [
      { step: 1, title: 'የውጫዊ ሽፋን ጥበቃ እና ንጥረ-ነገር ማጣራት', narration: 'የሕዋስ ሽፋን (Cell Membrane) ሕዋሱን ከውጭ አደጋ ይጠብቃል፤ ጠቃሚ ንጥረ ነገሮችን ያስገባል፤ ቆሻሻን ያስወጣል።', activeNodeIds: ['membrane'], particleFlowLabel: 'ንጥረ-ነገር ማጣራት', keyInsight: 'ከፊል አሳላፊነት (Selective Permeability)' },
      { step: 2, title: 'የኒውክሊየስ የዘረመል መመሪያ እና ትዕዛዝ', narration: 'ኒውክሊየስ የዲኤንኤ መረጃን ወደ mRNA በመቀየር ለፕሮቲን አምራቾች ትዕዛዝ ያስተላልፋል።', activeNodeIds: ['nucleus', 'ribosomes'], particleFlowLabel: 'የዘረመል ትዕዛዝ ፍሰት (mRNA)', keyInsight: 'የመቆጣጠር እና የመምራት ብቃት' },
      { step: 3, title: 'የማይቶኮንድሪያ ሃይል ማመንጨት እና ፕሮቲን ግንባታ', narration: 'ማይቶኮንድሪያ ATP የተባለውን የህይወት ሃይል በማመንጨት ራይቦዞምስ ፕሮቲን እንዲያመርት ጉልበት ይሰጣል።', activeNodeIds: ['mitochondria', 'ribosomes'], particleFlowLabel: 'የATP ሃይል ፍሰት', keyInsight: 'ሴሉላር ሬስፒሬሽን እና የሃይል ውህደት' },
      { step: 4, title: 'የተቀናጀ የሕዋስ ህይወት እና እድገት', narration: 'እነዚህ ክፍሎች በጋራ ተቀናጅተው ሲሰሩ ሕዋሱ ራሱን ያድሳል፣ ይከፋፈላል፣ እድገት ያሳያል።', activeNodeIds: ['nucleus', 'mitochondria', 'ribosomes', 'membrane'], particleFlowLabel: 'የተሟላ የሜታቦሊዝም ዑደት', keyInsight: 'የስርዓታዊ ቅንጅት የበላይነት' },
    ],
    keyTakeaways: [
      'ኒውክሊየስ መረጃን ይይዛል እና ስራዎችን ይመራል።',
      'ማይቶኮንድሪያ ለሁሉም እንቅስቃሴዎች ATP ሃይል ያቀርባል።',
      'ሴል ሜምብሬን የውስጥ እና የውጭ ሚዛንን (Homeostasis) ይጠብቃል።',
    ],
  },
  government_organization: {
    title: 'የመንግስት ድርጅታዊ አወቃቀር እና የስልጣን ክፍፍል (Separation of Powers)',
    conceptName: 'የመንግስት ድርጅታዊ መዋቅር',
    category: 'Citizenship (ዜግነት)',
    overview: 'በዴሞክራሲያዊ ስርዓት ውስጥ የስልጣን አላግባብ መጠቀምን ለመከላከል የመንግስት ስልጣን በሶስት ራሳቸውን በቻሉ ቅርንጫፎች ይከፋፈላል።',
    nodes: [
      { id: 'parliament', label: 'የህዝብ ተወካዮች ም/ቤት (ሕግ አውጪ)', role: 'ህጎችን ያወጣል፣ በጀትን ያፀድቃል', details: 'በህዝብ በቀጥታ የሚመረጡ እንደራሴዎች የህዝቡን ድምጽ በህግ አውጪነት ይወክላሉ።', color: '#2563EB', iconName: 'Building' },
      { id: 'executive', label: 'የሚኒስትሮች ም/ቤት (ሕግ አስፈፃሚ)', role: 'ህጎችን ያስፈጽማል፣ ሀገርን ያስተዳድራል', details: 'በጠቅላይ ሚኒስትሩ የሚመራ ሆኖ የልማት፣ የመከላከያ፣ የትምህርትና ጤና ስራዎችን ይተገብራል።', color: '#16A34A', iconName: 'Shield' },
      { id: 'judiciary', label: 'ጠቅላይ ፍርድ ቤት (ሕግ ተርጓሚ)', role: 'ህግን ይተረጉማል፣ ፍትህን ያሰፍናል', details: 'ነፃ የዳኝነት ስርዓት በማስፈን ህገ-መንግስቱን እና የዜጎችን መብት ያስከብራል።', color: '#9333EA', iconName: 'Compass' },
      { id: 'citizens', label: 'የኢትዮጵያ ዜጎች እና ህዝብ', role: 'የስልጣን ባለቤት እና መራጭ', details: 'የመጨረሻው የስልጣን ምንጭ ህዝብ ሲሆን በዴሞክራሲያዊ ምርጫ ተወካዮቹን ይሰይማል።', color: '#D97706', iconName: 'Users' },
    ],
    stages: [
      { step: 1, title: 'የህዝብ ሉዓላዊነት እና የውክልና ምርጫ', narration: 'ዜጎች በምርጫ ወቅት ድምጻቸውን በመስጠት የህዝብ ተወካዮችን ወደ ፓርላማ ይልካሉ።', activeNodeIds: ['citizens', 'parliament'], particleFlowLabel: 'የዴሞክራሲ ድምጽ ውክልና', keyInsight: 'የስልጣን ባለቤት ህዝብ ነው' },
      { step: 2, title: 'የህግ ማርቀቅ፣ ክርክር እና ማጽደቅ', narration: 'የህዝብ ተወካዮች ምክር ቤት ሀገራዊ አዋጆችን፣ ህጎችንና አመታዊ በጀቶችን መርምሮ ያፀድቃል።', activeNodeIds: ['parliament', 'executive'], particleFlowLabel: 'የፀደቁ አዋጆችና በጀት', keyInsight: 'የህግ የበላይነት መረጋገጥ' },
      { step: 3, title: 'ህጎችን በተግባር ማዋል እና አገልግሎት መስጠት', narration: 'የሕግ አስፈፃሚው አካል ትምህርት ቤቶችን፣ መንገዶችን፣ ጤና ጣቢያዎችን እና የፀጥታ አገልግሎቶችን ለህዝብ ያቀርባል።', activeNodeIds: ['executive', 'citizens'], particleFlowLabel: 'የልማትና አገልግሎት አቅርቦት', keyInsight: 'ተግባራዊ አስተዳደር' },
      { step: 4, title: 'የእርስ በርስ ቁጥጥር እና ሚዛን (Checks & Balances)', narration: 'ፍርድ ቤቶች እና ተቆጣጣሪ ተቋማት ህግ አውጪውም ሆነ አስፈፃሚው በህገ-መንግስቱ ገደብ መስራታቸውን ያረጋግጣሉ።', activeNodeIds: ['judiciary', 'executive', 'parliament'], particleFlowLabel: 'የህገ-መንግስት ቁጥጥርና ፍትህ', keyInsight: 'የስልጣን አላግባብ መጠቀም መከላከል' },
    ],
    keyTakeaways: [
      'የስልጣን ክፍፍል የአንድ ወገን አምባገነንነትን ያስቀራል።',
      'ሶስቱም አካላት የእርስ በርስ ሚዛናቸውን ጠብቀው ይሰራሉ።',
      'ዳኝነት ከማንኛውም ጣልቃ ገብነት ነፃ መሆን አለበት።',
    ],
  },
  atomic_structure: {
    title: 'የአተም ድርጅታዊ አወቃቀር እና የኤሌክትሮን ምህዋር (Atomic Organization)',
    conceptName: 'የአተም ድርጅት',
    category: 'Physics & Chemistry (ፊዚክስ እና ኬሚስትሪ)',
    overview: 'አተም ከፕሮቶን፣ ኒውትሮን እና በዙሪያው ከሚሽከረከሩ ኤሌክትሮኖች የተገነባ የቁስ አካል መሰረታዊ መዋቅር ነው።',
    nodes: [
      { id: 'nucleus', label: 'ኒውክሊየስ (Nucleus: Protons + Neutrons)', role: 'የአተሙ ማዕከላዊ ክብደት', details: 'አዎንታዊ ቻርጅ ያላቸው ፕሮቶኖችና ቻርጅ አልባ ኒውትሮኖች የተሰባሰቡበት ማዕከል ነው።', color: '#DC2626', iconName: 'Atom' },
      { id: 'inner_shell', label: 'የውስጠኛው ምህዋር (K-Shell: 2 Electrons)', role: 'ከፍተኛ የስበት ሃይል ያለው ምህዋር', details: 'ለኒውክሊየስ ቅርብ የሆነው ምህዋር ቢበዛ ሁለት ኤሌክትሮኖችን ብቻ ይይዛል።', color: '#2563EB', iconName: 'Activity' },
      { id: 'outer_shell', label: 'የውጨኛው ምህዋር (Valence Shell)', role: 'የኬሚካላዊ ምላሽ ቁልፍ', details: 'የውጭ ኤሌክትሮኖች በኬሚካላዊ ቦንድ መፈጠር እና ኤሌክትሪክ ማስተላለፍ ውስጥ ይሳተፋሉ።', color: '#16A34A', iconName: 'Zap' },
      { id: 'energy_photon', label: 'የብርሃን ሃይል / ፎቶን (Energy Emission)', role: 'የሃይል ልውውጥ', details: 'ኤሌክትሮን ከከፍተኛ ምህዋር ወደ ዝቅተኛ ሲዘል የብርሃን ሃይል (Photon) ያመነጫል።', color: '#D97706', iconName: 'Sparkles' },
    ],
    stages: [
      { step: 1, title: 'የኒውክሊየስ ጠንካራ ማዕከላዊ ስበት', narration: 'በኒውክሊየስ ውስጥ ያሉት ፕሮቶኖች አዎንታዊ ቻርጅ ስላላቸው ኤሌክትሮኖችን በኤሌክትሮስታቲክ ሃይል ይስባሉ።', activeNodeIds: ['nucleus', 'inner_shell'], particleFlowLabel: 'የኤሌክትሮስታቲክ ስበት', keyInsight: 'የአተም መረጋጋት' },
      { step: 2, title: 'የኤሌክትሮኖች ምህዋራዊ ሽክርክሪት', narration: 'ኤሌክትሮኖች በከፍተኛ ፍጥነት በምህዋራቸው ላይ እየተሽከረከሩ ወደ ኒውክሊየስ ሳይወድቁ ሚዛናቸውን ይጠብቃሉ።', activeNodeIds: ['inner_shell', 'outer_shell'], particleFlowLabel: 'የኤሌክትሮን ሽክርክሪት ፍሰት', keyInsight: 'የኳንተም ሃይል ደረጃዎች' },
      { step: 3, title: 'የኤሌክትሮን መነሳሳት እና የፎቶን ልቀት', narration: 'ውጫዊ ሃይል ሲያገኝ ኤሌክትሮኑ ወደ ላይ ይዘላል፤ ሲመለስ ደግሞ የብርሃን ሞገድ (Photon) ይለቃል።', activeNodeIds: ['outer_shell', 'energy_photon'], particleFlowLabel: 'የፎቶን ሃይል ልቀት', keyInsight: 'የብርሃን እና የጨረር አመነጫጨት' },
      { step: 4, title: 'የኬሚካላዊ ትስስር እና ሞለኪውል ምስረታ', narration: 'የውጭ ኤሌክትሮኖች ከሌሎች አተሞች ጋር በመጋራት ወይም በመለዋወጥ ሞለኪውሎችን (እንደ ውሃ እና ጨው) ይፈጥራሉ።', activeNodeIds: ['outer_shell', 'nucleus'], particleFlowLabel: 'የኬሚካላዊ ቦንድ ፍሰት', keyInsight: 'የቁስ አካላት አፈጣጠር' },
    ],
    keyTakeaways: [
      'ፕሮቶኖች አዎንታዊ፣ ኤሌክትሮኖች አሉታዊ፣ ኒውትሮኖች ቻርጅ አልባ ናቸው።',
      'የአተም ኬሚካላዊ ባህሪ የሚወሰነው በውጭ ኤሌክትሮኖች (Valence Electrons) ነው።',
      'የአተም አብዛኛው ክፍል ባዶ ቦታ ነው።',
    ],
  },
  circulatory_system: {
    title: 'የሰው ልጅ የደም ዝውውር ስርዓት ድርጅት (Circulatory System Organization)',
    conceptName: 'የደም ዝውውር ድርጅት',
    category: 'Biology (ባዮሎጂ)',
    overview: 'ልብ፣ የደም ስሮች እና ደም ተቀናጅተው ኦክስጅን እና ንጥረ ነገሮችን ለሁሉም የሰውነት ህዋሳት ያደርሳሉ፤ ካርቦንዳይኦክሳይድን ያስወግዳሉ።',
    nodes: [
      { id: 'heart', label: 'ልብ (4-Chambered Heart)', role: 'የማያቋርጥ ፓምፕ', details: 'በቀን ከ100,000 ጊዜ በላይ በመምታት ደምን በሰውነት ውስጥ ያሰራጫል።', color: '#DC2626', iconName: 'Activity' },
      { id: 'lungs', label: 'ሳንባ (Lungs - Gas Exchange)', role: 'የኦክስጅን መቀበያና ካርቦን ማስወገጃ', details: 'ካርቦንዳይኦክሳይድን አስወግዶ ደምን በኦክስጅን ያበለጽጋል።', color: '#2563EB', iconName: 'Layers' },
      { id: 'arteries_veins', label: 'ደም ስሮች (Arteries & Veins)', role: 'የደም ማስተላለፊያ ቱቦዎች', details: 'ደም ወሳጅ (Arteries) ኦክስጅን ያለውን ደም ሲያደርሱ፤ ደም መላሽ (Veins) የተጠቀመውን ደም ይመልሳሉ።', color: '#9333EA', iconName: 'Activity' },
      { id: 'cells_tissues', label: 'የሰውነት ህዋሳት እና ቲሹዎች', role: 'ተጠቃሚ ክፍሎች', details: 'ኦክስጅንን እና ግሉኮስን ተጠቅመው ሃይል ያመነጫሉ፤ ቆሻሻን ወደ ደም ያስተላልፋሉ።', color: '#16A34A', iconName: 'Users' },
    ],
    stages: [
      { step: 1, title: 'የሳንባ ደም ማበልጸግ ዑደት (Pulmonary Circulation)', narration: 'ልብ ኦክስጅን አልባውን ደም ወደ ሳንባ ይልካል፤ ሳንባ ውስጥ ካርቦን ወጥቶ ንጹህ ኦክስጅን ይገባል።', activeNodeIds: ['heart', 'lungs'], particleFlowLabel: 'የኦክስጅን ልውውጥ ፍሰት', keyInsight: 'የደም ንፅህና መረጋገጥ' },
      { step: 2, title: 'ንጹህ ደምን በልብ አማካኝነት መርጨት', narration: 'በኦክስጅን የበለጸገው ደም ወደ ግራ የልብ ክፍል ይመጣል፤ ከዚያም በከፍተኛ ግፊት ወደ አኦርታ ደም ወሳጅ ይረጫል።', activeNodeIds: ['heart', 'arteries_veins'], particleFlowLabel: 'የቀይ ደም (Oxygenated) ፍሰት', keyInsight: 'የደም ግፊት እና ስርጭት' },
      { step: 3, title: 'ለህዋሳት ኦክስጅን እና ንጥረ-ነገር ማድረስ', narration: 'ደም ቅምብሮች (Capillaries) ኦክስጅንን እና ምግብን ለጡንቻዎች፣ ለአእምሮ እና ለህዋሳት ያቀርባሉ።', activeNodeIds: ['arteries_veins', 'cells_tissues'], particleFlowLabel: 'የንጥረ-ነገር ማስተላለፍ', keyInsight: 'ሴሉላር አመጋገብ' },
      { step: 4, title: 'ቆሻሻን ሰብስቦ ወደ ልብ መመለስ', narration: 'ደም መላሾች (Veins) ካርቦንዳይኦክሳይድን የያዘውን ደም ወደ ልብ በመመለስ ዑደቱን እንደ አዲስ ያስጀምራሉ።', activeNodeIds: ['cells_tissues', 'heart'], particleFlowLabel: 'የሰማያዊ ደም (Deoxygenated) መመለሻ', keyInsight: 'ቀጣይነት ያለው የህይወት ዑደት' },
    ],
    keyTakeaways: [
      'ልብ ሁለትዮሽ የደም ዝውውር ስርዓት (Double Circulation) አለው።',
      'ቀይ የደም ህዋሶች ሄሞግሎቢን የተባለ ኦክስጅን ተሸካሚ ፕሮቲን ይይዛሉ።',
      'መደበኛ የአካል ብቃት እንቅስቃሴ የደም ስሮች ጤናን ይጠብቃል።',
    ],
  },
  computer_architecture: {
    title: 'የኮምፒውተር ፕሮሰሰር እና የሃርድዌር ድርጅታዊ አወቃቀር (CPU Architecture)',
    conceptName: 'የኮምፒውተር ድርጅታዊ አወቃቀር',
    category: 'Information Technology (አይቲ)',
    overview: 'የቮን ኒውማን (Von Neumann) መዋቅር ኮምፒውተር እንዴት መመሪያዎችን እንደሚያነብ፣ እንደሚያሰላ እና መረጃ እንደሚያስቀምጥ ያብራራል።',
    nodes: [
      { id: 'cu', label: 'የመቆጣጠሪያ ክፍል (Control Unit - CU)', role: 'የትዕዛዝ አስተርጓሚ እና መሪ', details: 'ፕሮግራሞችን ከሜሞሪ ያነባል፣ ይተረጉማል፣ ሌሎች ክፍሎች ምን መስራት እንዳለባቸው ይመራል።', color: '#2563EB', iconName: 'Cpu' },
      { id: 'alu', label: 'የሂሳብና ሎጂክ ክፍል (ALU)', role: 'ስሌት እና ውሳኔ አድራጊ', details: 'መደመር፣ መቀነስ፣ ማወዳደር እና የሎጂክ ስራዎችን በሰከንድ በቢሊዮን ጊዜ ያከናውናል።', color: '#DC2626', iconName: 'Zap' },
      { id: 'ram', label: 'ዋና ሜሞሪ (RAM & Cache)', role: 'ጊዜያዊ መረጃ ማከማቻ', details: 'በአሁኑ ሰዓት በስራ ላይ ያሉ ፕሮግራሞችን እና ዳታዎችን በከፍተኛ ፍጥነት ያቀርባል።', color: '#16A34A', iconName: 'Layers' },
      { id: 'bus', label: 'የመረጃ ማስተላለፊያ መስመር (System Bus & I/O)', role: 'ዳታ አጓጓዥ አውራ ጎዳና', details: 'በሲፒዩ፣ በሜሞሪ እና በመግቢያ/መውጫ መሳሪያዎች መካከል ቢቶችን ያጓጉዛል።', color: '#D97706', iconName: 'Activity' },
    ],
    stages: [
      { step: 1, title: 'ትዕዛዝ መውሰድ (Fetch Phase)', narration: 'የመቆጣጠሪያ ክፍሉ (CU) የሚቀጥለውን የፕሮግራም ትዕዛዝ ከ RAM ሜሞሪ ውስጥ ያወጣል።', activeNodeIds: ['cu', 'ram'], particleFlowLabel: 'የትዕዛዝ ቢቶች ፍሰት', keyInsight: 'Fetch Instruction' },
      { step: 2, title: 'ትዕዛዝ መተርጎም (Decode Phase)', narration: 'CU ትዕዛዙ ምን አይነት ስሌት እንደሆነ ተርጉሞ አስፈላጊውን ዳታ ያዘጋጃል።', activeNodeIds: ['cu'], particleFlowLabel: 'የትርጉም ሲግናል', keyInsight: 'Instruction Decoding' },
      { step: 3, title: 'ስሌት ማከናወን (Execute Phase)', narration: 'የሂሳብ ክፍሉ (ALU) ትክክለኛውን የሂሳብ ወይም የሎጂክ ስሌት በሰከንድ ቅጽበት ያጠናቅቃል።', activeNodeIds: ['alu', 'cu'], particleFlowLabel: 'የስሌት ሂደት', keyInsight: 'Mathematical Execution' },
      { step: 4, title: 'ውጤት መመዝገብ (Store Phase)', narration: 'የተገኘው ውጤት ወደ ሬጂስተር ወይም ወደ RAM ሜሞሪ ተመልሶ ይቀመጣል፤ ለተጠቃሚው በስክሪን ይቀርባል።', activeNodeIds: ['alu', 'ram', 'bus'], particleFlowLabel: 'የውጤት መረጃ ፍሰት', keyInsight: 'Write Back & Display' },
    ],
    keyTakeaways: [
      'የሲፒዩ ፍጥነት በጊጋኸርትዝ (GHz) ይለካል (በቢሊዮን ዑደቶች በሰከንድ)።',
      'Fetch-Decode-Execute የኮምፒውተር መሰረታዊ የስራ ዑደት ነው።',
      'ካሽ (Cache) ሜሞሪ ሲፒዩ መረጃን በፈጣን ፍጥነት እንዲያገኝ ያግዛል።',
    ],
  },
};

export const InteractiveAnimationStudio: React.FC<InteractiveAnimationStudioProps> = ({
  subject,
  grade,
  onOpenAITutor,
  onExit,
}) => {
  const { language, t } = useLanguage();

  // Selected preset key or custom animation data
  const [selectedKey, setSelectedKey] = useState<string>('cell_organization');
  const [currentAnimation, setCurrentAnimation] = useState<AnimationConceptData>(
    PRESET_ANIMATIONS.cell_organization
  );

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isSpeechMuted, setIsSpeechMuted] = useState<boolean>(false);
  const [activeNodeDetails, setActiveNodeDetails] = useState<AnimationNode | null>(null);

  // Custom AI Search Query
  const [searchTopic, setSearchTopic] = useState<string>('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Canvas / SVG animation frame reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Active Stage
  const activeStage = currentAnimation.stages[currentStageIndex] || currentAnimation.stages[0];

  // Stop current speech
  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Speak narration
  const speakStageNarration = (text: string) => {
    if (isSpeechMuted) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackSpeed * 0.95;
      utterance.pitch = 1.0;
      // If language is English or text is mostly Latin, set en-US, otherwise fallback to am/en
      if (language === 'en') {
        utterance.lang = 'en-US';
      }
      window.speechSynthesis.speak(utterance);
      speechRef.current = utterance;
    }
  };

  // Handle Stage Change
  const goToStage = (index: number) => {
    const clamped = Math.max(0, Math.min(currentAnimation.stages.length - 1, index));
    setCurrentStageIndex(clamped);
    const targetStage = currentAnimation.stages[clamped];
    if (targetStage) {
      speakStageNarration(targetStage.narration);
    }
  };

  // Play / Pause timer effect
  useEffect(() => {
    if (isPlaying) {
      const stageDuration = (8000 / playbackSpeed);
      timerRef.current = setTimeout(() => {
        if (currentStageIndex < currentAnimation.stages.length - 1) {
          goToStage(currentStageIndex + 1);
        } else {
          // Loop back to beginning or pause
          goToStage(0);
        }
      }, stageDuration);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      stopSpeech();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStageIndex, playbackSpeed, currentAnimation]);

  // When animation changes, reset to step 0
  useEffect(() => {
    setCurrentStageIndex(0);
    setIsPlaying(false);
    setActiveNodeDetails(null);
    stopSpeech();
  }, [currentAnimation]);

  // Handle Preset Click
  const handleSelectPreset = (key: string) => {
    setSelectedKey(key);
    if (PRESET_ANIMATIONS[key]) {
      setCurrentAnimation(PRESET_ANIMATIONS[key]);
    }
  };

  // Handle Custom AI Organization Generator
  const handleGenerateCustomAnimation = async (topicToGenerate?: string) => {
    const targetQuery = topicToGenerate || searchTopic;
    if (!targetQuery.trim()) return;

    setIsGeneratingCustom(true);
    setGenerationError(null);
    setIsPlaying(false);
    stopSpeech();

    try {
      const res = await fetch('/api/ai/generate-animation-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetQuery,
          subjectName: subject.name,
          grade,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.animationData && Array.isArray(data.animationData.stages)) {
          setCurrentAnimation(data.animationData);
          setSelectedKey('custom');
        } else {
          throw new Error('Invalid animation data format');
        }
      } else {
        throw new Error('Generation failed');
      }
    } catch (err: any) {
      console.warn('AI animation generation fallback:', err);
      setGenerationError('በመስመር ላይ ችግር ምክንያት ከመደበኛ መረጃ ቋት ተዘጋጅቷል።');
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  // Icon Resolver
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Building':
        return <Building className="w-5 h-5" />;
      case 'Atom':
        return <Atom className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'Shield':
        return <Shield className="w-5 h-5" />;
      case 'Users':
        return <Users className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'Layers':
        return <Layers className="w-5 h-5" />;
      case 'Boxes':
        return <Boxes className="w-5 h-5" />;
      case 'Activity':
        return <Activity className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Exit Button */}
      <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center border border-[#38332D] text-white"
              style={{ backgroundColor: '#2563EB' }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-serif-ethiopic text-[#1E1B18]">
                  የአኒሜሽን ቪዲዮ እና የድርጅት/ስርዓት ምስላዊ ማስመሰያ (Animation Studio)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Interactive 2D/3D Sim
                </span>
              </div>
              <p className="text-xs text-[#5A5143] font-serif-ethiopic">
                የማንኛውንም ድርጅት፣ የሕዋስ፣ የመንግስት፣ የሰውነት ስርዓት ወይም ሳይንሳዊ ሂደት አሰራር በቪዲዮ አኒሜሽን ደረጃ በደረጃ ይረዱ
              </p>
            </div>
          </div>

          {/* Header Action: Exit Button */}
          {onExit && (
            <button
              onClick={onExit}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#8B261E] hover:bg-[#721F18] text-white text-xs font-bold font-serif-ethiopic shadow-xs cursor-pointer border border-[#5E1610] self-start md:self-auto"
              title="ከአኒሜሽን ውጣ / ወደ ዋናው ትምህርት ተመለስ (Exit Animation)"
            >
              <span>መውጫ / ውጣ (Exit)</span>
            </button>
          )}
        </div>

        {/* AI Custom Organization / Concept Search Bar */}
        <div className="pt-2 border-t border-[#38332D]/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8A7E6C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTopic}
              onChange={(e) => setSearchTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustomAnimation()}
              placeholder="የሚፈልጉትን ድርጅት ወይም ስርዓት ይጻፉ (ለምሳሌ: የኢትዮጵያ ንግድ ባንክ አወቃቀር፣ የዲኤንኤ አወቃቀር፣ የፎቶሲንተሲስ ዑደት...)"
              className="w-full bg-[#EDE6D4] border border-[#38332D] rounded-lg pl-9 pr-3 py-2 text-xs text-[#1E1B18] font-serif-ethiopic focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <button
            onClick={() => handleGenerateCustomAnimation()}
            disabled={isGeneratingCustom || !searchTopic.trim()}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold font-serif-ethiopic rounded-lg border border-[#1E40AF] shadow-xs cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            {isGeneratingCustom ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>አኒሜሽን በመስራት ላይ...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>በአኒሜሽን አስመስል (Simulate)</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Suggestion Topic Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-bold text-[#6B6150] whitespace-nowrap">ፈጣን ምሳሌዎች:</span>
          {[
            { label: '🧬 የሕዋስ ድርጅት (Cell Org)', key: 'cell_organization' },
            { label: '🏛️ የመንግስት ስልጣን ክፍፍል', key: 'government_organization' },
            { label: '⚛️ የአተም እና ኤሌክትሮን ምህዋር', key: 'atomic_structure' },
            { label: '❤️ የልብና ደም ዝውውር ስርዓት', key: 'circulatory_system' },
            { label: '💻 የኮምፒውተር ፕሮሰሰር (CPU)', key: 'computer_architecture' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleSelectPreset(item.key)}
              className={`px-2.5 py-1 rounded-full text-xs font-serif-ethiopic font-bold whitespace-nowrap transition-all border cursor-pointer ${
                selectedKey === item.key
                  ? 'bg-[#1E1B18] text-[#FAF6EC] border-[#1E1B18]'
                  : 'bg-[#EDE6D4] text-[#423A2F] border-[#38332D]/30 hover:bg-[#E3DAC4]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Interactive Animation Canvas / Video Simulation */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#121110] border-[2px] border-[#38332D] rounded-xl shadow-[4px_4px_0px_0px_#38332D] p-4 sm:p-6 text-white space-y-4 relative overflow-hidden">
            {/* Stage Title and Progress Counter */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center">
                  {activeStage.step}
                </span>
                <h3 className="text-sm sm:text-base font-bold font-serif-ethiopic text-amber-200">
                  {activeStage.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span>ደረጃ {activeStage.step} ከ {currentAnimation.stages.length}</span>
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[10px]">
                  {currentAnimation.category}
                </span>
              </div>
            </div>

            {/* Visual Animated Diagram & Interactive Nodes Stage */}
            <div className="relative min-h-[300px] sm:min-h-[340px] bg-neutral-950/80 rounded-xl border border-neutral-800 p-4 flex flex-col justify-between overflow-hidden">
              {/* Animated particle flow banner */}
              <div className="flex items-center justify-between z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/90 border border-blue-600/50 text-[11px] text-blue-300">
                  <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  <span>ንቁ ፍሰት: <strong>{activeStage.particleFlowLabel}</strong></span>
                </div>

                <div className="text-[11px] font-mono text-amber-400/90 bg-amber-950/40 px-2.5 py-1 rounded border border-amber-500/30">
                  💡 {activeStage.keyInsight}
                </div>
              </div>

              {/* Dynamic Animated Nodes Display */}
              <div className="my-auto py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 z-10">
                {currentAnimation.nodes.map((node) => {
                  const isActive = activeStage.activeNodeIds.includes(node.id);
                  const isInspected = activeNodeDetails?.id === node.id;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setActiveNodeDetails(node)}
                      className={`relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        isActive
                          ? 'bg-neutral-900/90 shadow-[0_0_15px_rgba(37,99,235,0.35)] scale-[1.03]'
                          : 'bg-neutral-900/40 opacity-70 hover:opacity-100'
                      } ${
                        isInspected ? 'ring-2 ring-amber-400' : ''
                      }`}
                      style={{
                        borderColor: isActive ? node.color : '#332E27',
                      }}
                    >
                      {/* Active glowing indicator */}
                      {isActive && (
                        <span
                          className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping opacity-75"
                          style={{ backgroundColor: node.color }}
                        />
                      )}

                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: node.color }}
                        >
                          {getIcon(node.iconName)}
                        </div>
                        <span className="text-xs font-bold font-serif-ethiopic text-neutral-100 leading-tight">
                          {node.label}
                        </span>
                      </div>

                      <div className="text-[11px] font-serif-ethiopic text-neutral-400 line-clamp-2">
                        {node.role}
                      </div>

                      <div className="pt-1 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400">
                        <span>{isActive ? '🟢 ንቁ (Active)' : '⚪ ተጠባባቂ'}</span>
                        <span className="text-amber-300 underline">ዝርዝር እይ</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step Progress Dots */}
              <div className="flex items-center justify-center gap-2 pt-2 z-10">
                {currentAnimation.stages.map((st, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToStage(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentStageIndex === idx
                        ? 'w-8 bg-amber-400'
                        : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                    }`}
                    title={`ደረጃ ${idx + 1}: ${st.title}`}
                  />
                ))}
              </div>
            </div>

            {/* Synchronized Voice & Text Narration Box */}
            <div className="bg-neutral-900/90 rounded-xl border border-neutral-700 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  የድምጽና ምስል ማብራሪያ (Spoken Narration)
                </span>
                <span className="text-[11px] font-mono">የፍጥነት መጠን: {playbackSpeed}x</span>
              </div>
              <p className="text-xs sm:text-sm font-serif-ethiopic text-neutral-200 leading-relaxed">
                {activeStage.narration}
              </p>
            </div>

            {/* Video & Playback Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs shadow-xs cursor-pointer transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>አቁም (Pause)</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>አጫውት (Play)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => goToStage(currentStageIndex - 1)}
                  disabled={currentStageIndex === 0}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-40 cursor-pointer"
                  title="የቀደመው ደረጃ"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => goToStage(currentStageIndex + 1)}
                  disabled={currentStageIndex === currentAnimation.stages.length - 1}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-40 cursor-pointer"
                  title="ቀጣይ ደረጃ"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => goToStage(0)}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                  title="እንደገና ከጅምሩ ጀምር"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed and Voice Mute Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSpeechMuted(!isSpeechMuted)}
                  className={`p-2 rounded-lg border text-xs cursor-pointer ${
                    isSpeechMuted
                      ? 'bg-red-950/60 border-red-800 text-red-300'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-200'
                  }`}
                  title={isSpeechMuted ? 'ድምጽ አብራ (Unmute Voice)' : 'ድምጽ አጥፋ (Mute Voice)'}
                >
                  {isSpeechMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <div className="flex items-center gap-1 bg-neutral-800 rounded-lg p-1 border border-neutral-700 text-xs">
                  {[0.75, 1, 1.25, 1.5].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono cursor-pointer ${
                        playbackSpeed === spd
                          ? 'bg-amber-400 text-neutral-950'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Inspected Node Detail Drawer */}
          {activeNodeDetails && (
            <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-5 shadow-xs space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center text-white"
                    style={{ backgroundColor: activeNodeDetails.color }}
                  >
                    {getIcon(activeNodeDetails.iconName)}
                  </div>
                  <h4 className="text-sm font-bold font-serif-ethiopic text-[#1E1B18]">
                    {activeNodeDetails.label}
                  </h4>
                </div>
                <button
                  onClick={() => setActiveNodeDetails(null)}
                  className="text-xs text-[#6B6150] hover:text-[#1E1B18] cursor-pointer"
                >
                  ✕ ዝጋ
                </button>
              </div>
              <p className="text-xs font-bold text-amber-900 font-serif-ethiopic bg-amber-50 p-2 rounded border border-amber-200">
                ዋና ተግባር: {activeNodeDetails.role}
              </p>
              <p className="text-xs sm:text-sm text-[#423A2F] font-serif-ethiopic leading-relaxed">
                {activeNodeDetails.details}
              </p>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Organization Hierarchy & Key Takeaways */}
        <div className="lg:col-span-4 space-y-4">
          {/* Overview Card */}
          <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#665C4D] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#2563EB]" />
              ስለዚህ ድርጅታዊ አወቃቀር
            </h4>
            <h3 className="text-sm font-bold font-serif-ethiopic text-[#1E1B18]">
              {currentAnimation.title}
            </h3>
            <p className="text-xs text-[#423A2F] font-serif-ethiopic leading-relaxed">
              {currentAnimation.overview}
            </p>

            {/* Ask AI deep dive */}
            <button
              onClick={() => onOpenAITutor?.(currentAnimation.title, 'chat')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#1E1B18] hover:bg-[#38332D] text-[#FAF6EC] text-xs font-bold font-serif-ethiopic shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ስለዚህ አወቃቀር AI መምህርን ጠይቅ</span>
            </button>
          </div>

          {/* Interactive Steps List */}
          <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 shadow-xs space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#665C4D]">
              የአኒሜሽን ደረጃዎች (Stages)
            </h4>
            <div className="space-y-1.5">
              {currentAnimation.stages.map((st, i) => {
                const isCurrent = currentStageIndex === i;
                return (
                  <button
                    key={i}
                    onClick={() => goToStage(i)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-serif-ethiopic transition-all flex items-center justify-between gap-2 border cursor-pointer ${
                      isCurrent
                        ? 'bg-[#2E6B4A] text-white border-[#1D4A32] font-bold shadow-xs'
                        : 'bg-[#EDE6D4] text-[#423A2F] border-[#38332D]/30 hover:bg-[#E3DAC4]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCurrent ? 'bg-white text-[#2E6B4A]' : 'bg-[#38332D] text-white'
                      }`}>
                        {st.step}
                      </span>
                      <span className="truncate max-w-[180px]">{st.title}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 shadow-xs space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#665C4D] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              ዋና ዋና የመማሪያ ፍሬ-ነገሮች
            </h4>
            <ul className="space-y-1.5 text-xs text-[#3D352B] font-serif-ethiopic">
              {currentAnimation.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-[#2563EB] font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
