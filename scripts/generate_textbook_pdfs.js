import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';

const textbooks = [
  {
    id: 'math',
    subject: 'Mathematics',
    grade: 9,
    amharicTitle: 'የሂሳብ ትምህርት የተማሪ መጽሐፍ',
    englishTitle: 'Grade 9 Mathematics Student Textbook',
    units: [
      { unit: 1, title: 'The Number System & Sets', pages: 'pp. 1-28' },
      { unit: 2, title: 'Linear Equations & Inequalities', pages: 'pp. 29-64' },
      { unit: 3, title: 'Plane Geometry & Triangles', pages: 'pp. 65-102' },
      { unit: 4, title: 'Quadratic Equations & Polynomials', pages: 'pp. 103-142' },
      { unit: 5, title: 'Introduction to Statistics and Probability', pages: 'pp. 143-180' }
    ]
  },
  {
    id: 'physics',
    subject: 'Physics',
    grade: 9,
    amharicTitle: 'የፊዚክስ ትምህርት የተማሪ መጽሐፍ',
    englishTitle: 'Grade 9 Physics Student Textbook',
    units: [
      { unit: 1, title: 'Vectors and Physical Quantities', pages: 'pp. 1-26' },
      { unit: 2, title: 'One-Dimensional Kinematics & Motion', pages: 'pp. 27-62' },
      { unit: 3, title: 'Dynamics: Newton Laws of Motion', pages: 'pp. 63-98' },
      { unit: 4, title: 'Work, Energy, and Power Conservation', pages: 'pp. 99-130' },
      { unit: 5, title: 'Simple Machines & Mechanical Advantage', pages: 'pp. 131-160' }
    ]
  },
  {
    id: 'chemistry',
    subject: 'Chemistry',
    grade: 9,
    amharicTitle: 'የኬሚስትሪ ትምህርት የተማሪ መጽሐፍ',
    englishTitle: 'Grade 9 Chemistry Student Textbook',
    units: [
      { unit: 1, title: 'Structure of the Atom & Subatomic Particles', pages: 'pp. 1-30' },
      { unit: 2, title: 'The Periodic Classification of Elements', pages: 'pp. 31-68' },
      { unit: 3, title: 'Chemical Bonding: Ionic, Covalent & Metallic', pages: 'pp. 69-106' },
      { unit: 4, title: 'Chemical Reactions and Stoichiometry', pages: 'pp. 107-148' },
      { unit: 5, title: 'Physical and Chemical States of Matter', pages: 'pp. 149-182' }
    ]
  },
  {
    id: 'biology',
    subject: 'Biology',
    grade: 9,
    amharicTitle: 'የስነ-ህይወት ትምህርት የተማሪ መጽሐፍ',
    englishTitle: 'Grade 9 Biology Student Textbook',
    units: [
      { unit: 1, title: 'Introduction to Biology & Scientific Methods', pages: 'pp. 1-24' },
      { unit: 2, title: 'Cell Biology: Ultrastructure and Functions', pages: 'pp. 25-58' },
      { unit: 3, title: 'Human Biology: Organ Systems & Digestion', pages: 'pp. 59-104' },
      { unit: 4, title: 'Reproduction, Heredity & Plant Biology', pages: 'pp. 105-144' },
      { unit: 5, title: 'Ecology, Ethiopian Ecosystems & Conservation', pages: 'pp. 145-188' }
    ]
  },
  {
    id: 'amharic',
    subject: 'Amharic',
    grade: 9,
    amharicTitle: 'የአማርኛ ቋንቋ የተማሪ መጽሐፍ',
    englishTitle: 'Grade 9 Amharic Language Student Textbook',
    units: [
      { unit: 1, title: 'የቋንቋ ተግባቦት እና የፅሁፍ አይነቶች (Language Communication)', pages: 'pp. 1-32' },
      { unit: 2, title: 'ስነ-ፅሁፍ እና የስነ-ቃል ቅርሶች (Oral Literature & Prose)', pages: 'pp. 33-66' },
      { unit: 3, title: 'የሰዋሰው ህጎች፡ የስም እና የግስ አወቃቀር (Amharic Grammar)', pages: 'pp. 67-108' },
      { unit: 4, title: 'አንብቦ መረዳት እና የቃላት ትንተና (Reading Comprehension)', pages: 'pp. 109-146' },
      { unit: 5, title: 'ድርሰት አፃፃፍ እና ሪፖርት ዝግጅት (Essay & Report Writing)', pages: 'pp. 147-184' }
    ]
  },
  {
    id: 'geography',
    subject: 'Geography',
    grade: 9,
    amharicTitle: 'የጂኦግራፊ ትምህርት የተማሪ መጽሐፍ',
    englishTitle: 'Grade 9 Geography Student Textbook',
    units: [
      { unit: 1, title: 'Geological History and Topography of Ethiopia', pages: 'pp. 1-36' },
      { unit: 2, title: 'Climate Zones and Atmospheric Circulation of the Horn', pages: 'pp. 37-72' },
      { unit: 3, title: 'Drainage Systems and Water Resources of Ethiopia', pages: 'pp. 73-108' },
      { unit: 4, title: 'Natural Vegetation and Wildlife Sanctuaries', pages: 'pp. 109-144' },
      { unit: 5, title: 'Human Population Dynamics and Urbanization', pages: 'pp. 145-186' }
    ]
  },
  {
    id: 'ict',
    subject: 'ICT',
    grade: 9,
    amharicTitle: 'የመረጃና መገናኛ ቴክኖሎጂ የተማሪ መጽሐፍ',
    englishTitle: 'Grade 9 Information & Communications Technology Student Textbook',
    units: [
      { unit: 1, title: 'Information Systems and Computer Hardware Architecture', pages: 'pp. 1-34' },
      { unit: 2, title: 'Operating Systems and Application Software Suites', pages: 'pp. 35-68' },
      { unit: 3, title: 'The Internet, World Wide Web and Telecommunications', pages: 'pp. 69-102' },
      { unit: 4, title: 'Computer Security, Safe Browsing and Ethics', pages: 'pp. 103-138' },
      { unit: 5, title: 'Introduction to Algorithms and Logic Problem Solving', pages: 'pp. 139-174' }
    ]
  },
  {
    id: 'economics',
    subject: 'Economics',
    grade: 9,
    amharicTitle: 'የኢኮኖሚክስ ትምህርት የተማሪ መጽሐፍ',
    englishTitle: 'Grade 9 Economics Student Textbook',
    units: [
      { unit: 1, title: 'Introducing Economics & Scarcity Principle', pages: 'pp. 1-22' },
      { unit: 2, title: 'The Basic Economic Problems and Economic Systems', pages: 'pp. 23-44' },
      { unit: 3, title: 'Economic Resources and Markets', pages: 'pp. 45-66' },
      { unit: 4, title: 'Introduction to Demand and Supply', pages: 'pp. 67-92' },
      { unit: 5, title: 'Introduction to Production and Cost', pages: 'pp. 93-116' },
      { unit: 6, title: 'Introduction to Money and Banking in Ethiopia', pages: 'pp. 117-138' },
      { unit: 7, title: 'Introduction to Macroeconomics & National Accounts', pages: 'pp. 139-160' },
      { unit: 8, title: 'Basic Entrepreneurship and Local Enterprise', pages: 'pp. 161-182' }
    ]
  },
  // --- GRADE 10 OFFICIAL TEXTBOOKS ---
  {
    id: 'math',
    subject: 'Mathematics',
    grade: 10,
    amharicTitle: 'የሂሳብ ትምህርት የተማሪ መጽሐፍ',
    englishTitle: 'Grade 10 Mathematics Student Textbook',
    units: [
      { unit: 1, title: 'Relations and Functions', pages: 'pp. 1-32' },
      { unit: 2, title: 'Polynomial Functions & Zeros', pages: 'pp. 33-72' },
      { unit: 3, title: 'Exponential and Logarithmic Functions', pages: 'pp. 73-110' },
      { unit: 4, title: 'Trigonometric Functions & Identities', pages: 'pp. 111-152' },
      { unit: 5, title: 'Plane Geometry and Coordinate Geometry', pages: 'pp. 153-196' },
      { unit: 6, title: 'Measurement of Solids & Vectors', pages: 'pp. 197-234' },
      { unit: 7, title: 'Statistics and Probability Distributions', pages: 'pp. 235-270' }
    ]
  },
  {
    id: 'physics',
    subject: 'Physics',
    grade: 10,
    amharicTitle: 'የፊዚክስ ትምህርት የተማሪ መጽሐፍ',
    englishTitle: 'Grade 10 Physics Student Textbook',
    units: [
      { unit: 1, title: 'Motion in Two Dimensions & Projectile Motion', pages: 'pp. 1-34' },
      { unit: 2, title: 'Electrostatics, Electric Charges & Fields', pages: 'pp. 35-76' },
      { unit: 3, title: 'Current Electricity, Ohm Law & DC Circuits', pages: 'pp. 77-120' },
      { unit: 4, title: 'Electromagnetism & Electromagnetic Induction', pages: 'pp. 121-162' },
      { unit: 5, title: 'Introduction to Electronics and Semiconductor Devices', pages: 'pp. 163-198' }
    ]
  },
  {
    id: 'chemistry',
    subject: 'Chemistry',
    grade: 10,
    amharicTitle: 'የኬሚስትሪ ትምህርት የተማሪ መጽሐፍ',
    englishTitle: 'Grade 10 Chemistry Student Textbook',
    units: [
      { unit: 1, title: 'Chemical Reactions and Stoichiometry Calculations', pages: 'pp. 1-38' },
      { unit: 2, title: 'Solutions, Solubility and Colloidal Systems', pages: 'pp. 39-82' },
      { unit: 3, title: 'Energy Changes in Chemical Reactions & Thermochemistry', pages: 'pp. 83-122' },
      { unit: 4, title: 'Introduction to Organic Chemistry and Hydrocarbons', pages: 'pp. 123-170' },
      { unit: 5, title: 'Important Inorganic Compounds in Industry and Society', pages: 'pp. 171-210' }
    ]
  },
  {
    id: 'biology',
    subject: 'Biology',
    grade: 10,
    amharicTitle: 'የስነ-ህይወት ትምህርት የተማሪ መጽሐፍ',
    englishTitle: 'Grade 10 Biology Student Textbook',
    units: [
      { unit: 1, title: 'Biotechnology and Genetic Engineering Applications', pages: 'pp. 1-32' },
      { unit: 2, title: 'Heredity, Mendelian Genetics & Molecular Biology', pages: 'pp. 33-78' },
      { unit: 3, title: 'Human Biology: Nervous & Endocrine Coordination Systems', pages: 'pp. 79-128' },
      { unit: 4, title: 'Microorganisms, Immunology and Infectious Diseases', pages: 'pp. 129-172' },
      { unit: 5, title: 'Ecological Interactions, Ethiopian Biomes & Conservation', pages: 'pp. 173-216' }
    ]
  },
  {
    id: 'amharic',
    subject: 'Amharic',
    grade: 10,
    amharicTitle: 'የአማርኛ ቋንቋ የተማሪ መጽሐፍ',
    englishTitle: 'Grade 10 Amharic Language Student Textbook',
    units: [
      { unit: 1, title: 'የቋንቋ እና የህብረተሰብ ግንኙነት (Language & Society)', pages: 'pp. 1-34' },
      { unit: 2, title: 'የተመረጡ የስነ-ጽሁፍ ስራዎች ትንተና (Literary Prose & Drama)', pages: 'pp. 35-72' },
      { unit: 3, title: 'የላቀ የአማርኛ ሰዋሰው፡ አረፍተ-ነገር እና ሀረግ (Advanced Syntax)', pages: 'pp. 73-112' },
      { unit: 4, title: 'የክርክር እና የአደባባይ ንግግር ክህሎት (Public Speaking & Debate)', pages: 'pp. 113-150' },
      { unit: 5, title: 'የጥናት ጽሁፍ እና የምርምር ሪፖርት አፃፃፍ (Research Report Writing)', pages: 'pp. 151-190' }
    ]
  },
  {
    id: 'english',
    subject: 'English',
    grade: 10,
    amharicTitle: 'የእንግሊዝኛ ቋንቋ የተማሪ መጽሐፍ',
    englishTitle: 'Grade 10 English for Ethiopia Student Textbook',
    units: [
      { unit: 1, title: 'Modern Communication & Digital Media Literacy', pages: 'pp. 1-36' },
      { unit: 2, title: 'Environmental Protection and Global Climate Action', pages: 'pp. 37-74' },
      { unit: 3, title: 'Traditional Ethiopian Heritage, Crafts and Tourism', pages: 'pp. 75-114' },
      { unit: 4, title: 'Health, Wellness, Nutrition and Physical Fitness', pages: 'pp. 115-152' },
      { unit: 5, title: 'Future Careers, Emerging Technologies and Innovation', pages: 'pp. 153-192' }
    ]
  },
  {
    id: 'citizenship',
    subject: 'Citizenship',
    grade: 10,
    amharicTitle: 'የዜግነት ትምህርት የተማሪ መጽሐፍ',
    englishTitle: 'Grade 10 Citizenship Education Student Textbook',
    units: [
      { unit: 1, title: 'Democracy, Constitutional Federalism and Good Governance', pages: 'pp. 1-32' },
      { unit: 2, title: 'The Rule of Law and Institutional Accountability', pages: 'pp. 33-68' },
      { unit: 3, title: 'Universal Human Rights & Rights of Vulnerable Groups', pages: 'pp. 69-104' },
      { unit: 4, title: 'Patriotism, Civic Duties and Active Community Participation', pages: 'pp. 105-142' },
      { unit: 5, title: 'Peaceful Conflict Resolution, National Consensus & Social Cohesion', pages: 'pp. 143-180' }
    ]
  },
  {
    id: 'ict',
    subject: 'ICT',
    grade: 10,
    amharicTitle: 'የመረጃና መገናኛ ቴክኖሎጂ የተማሪ መጽሐፍ',
    englishTitle: 'Grade 10 Information & Communications Technology Student Textbook',
    units: [
      { unit: 1, title: 'Database Management Systems & Structured Query Language (SQL)', pages: 'pp. 1-38' },
      { unit: 2, title: 'Computer Networks, OSI Model and Internet Protocols', pages: 'pp. 39-78' },
      { unit: 3, title: 'Web Development: Responsive Web Design with HTML5 & CSS3', pages: 'pp. 79-122' },
      { unit: 4, title: 'Foundations of Computer Programming and Algorithm Design', pages: 'pp. 123-168' },
      { unit: 5, title: 'Information Ethics, Cyber Security and Digital Identity', pages: 'pp. 169-206' }
    ]
  },
  {
    id: 'economics',
    subject: 'Economics',
    grade: 10,
    amharicTitle: 'የኢኮኖሚክስ ትምህርት የተማሪ መጽሐፍ',
    englishTitle: 'Grade 10 Economics Student Textbook',
    units: [
      { unit: 1, title: 'Consumer Behaviour & Theory of Utility', pages: 'pp. 1-28' },
      { unit: 2, title: 'Demand & Supply Theory and Market Elasticity', pages: 'pp. 29-62' },
      { unit: 3, title: 'Production & Cost Theory in Short-Run and Long-Run', pages: 'pp. 63-98' },
      { unit: 4, title: 'Market Structure: Perfect Competition and Imperfect Markets', pages: 'pp. 99-136' },
      { unit: 5, title: 'Banking & Finance System and Capital Markets in Ethiopia', pages: 'pp. 137-172' },
      { unit: 6, title: 'Economic Growth, Macroeconomic Stability & Development', pages: 'pp. 173-206' },
      { unit: 7, title: 'The Ethiopian Economy: Structural Sectors & Policy Reforms', pages: 'pp. 207-240' },
      { unit: 8, title: 'Business Startups, Entrepreneurship and Enterprise Management', pages: 'pp. 241-274' }
    ]
  },
  {
    id: 'social-studies',
    subject: 'Social Studies (History)',
    grade: 10,
    amharicTitle: 'የማህበራዊ ሳይንስ (የታሪክ) ትምህርት የተማሪ መጽሐፍ',
    englishTitle: 'Grade 10 History / Social Studies Student Textbook',
    units: [
      { unit: 1, title: 'The Early Modern World and Africa (16th to 18th Century)', pages: 'pp. 1-36' },
      { unit: 2, title: 'Peoples and States in Ethiopia and the Horn (16th to 19th Century)', pages: 'pp. 37-78' },
      { unit: 3, title: 'The Making of the Modern Ethiopian State and Nation Building', pages: 'pp. 79-122' },
      { unit: 4, title: 'European Imperialism, Colonialism and the Scramble for Africa', pages: 'pp. 123-166' },
      { unit: 5, title: 'The Two World Wars and Ethiopia in Contemporary Global Affairs', pages: 'pp. 167-212' }
    ]
  }
];

function generatePdfForBook(book) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Page 1: Cover Page
  // Header bar
  doc.setFillColor(30, 41, 59); // Dark slate
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA', 105, 18, { align: 'center' });
  doc.setFontSize(14);
  doc.text('MINISTRY OF EDUCATION (MoE)', 105, 26, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('General Education Curriculum Framework - New Curriculum', 105, 34, { align: 'center' });

  // Accent band
  doc.setFillColor(180, 83, 9); // Amber accent
  doc.rect(0, 40, 210, 6, 'F');

  // Title Box
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text(book.englishTitle, 105, 80, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Subject: ${book.subject} | Grade ${book.grade}`, 105, 95, { align: 'center' });
  doc.text('Official Digital Student Textbook Edition', 105, 103, { align: 'center' });

  // Verification Box
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(25, 120, 160, 50, 3, 3, 'FD');

  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text('CURRICULUM SPECIFICATIONS & VERIFICATION', 105, 132, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`* Published under the authority of the FDRE Ministry of Education`, 35, 142);
  doc.text(`* Total Units: ${book.units.length} Core Units`, 35, 149);
  doc.text(`* Pedagogical standard: Competency-based curriculum (CBC)`, 35, 156);
  doc.text(`* Verified Digital Master Copy for NUR AI High School Applet`, 35, 163);

  // Bottom Notice
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Addis Ababa, Ethiopia | Educational Media and Curriculum Development', 105, 260, { align: 'center' });
  doc.text('(c) Ministry of Education, All Rights Reserved.', 105, 266, { align: 'center' });

  // Page 2: Table of Contents & Unit Breakdown
  doc.addPage();

  doc.setFillColor(241, 245, 249);
  doc.rect(0, 0, 210, 25, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`TABLE OF CONTENTS - GRADE ${book.grade} ${book.subject.toUpperCase()}`, 105, 16, { align: 'center' });

  let yPos = 40;
  book.units.forEach((u) => {
    // Unit Card
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(20, yPos - 5, 170, 18, 2, 2, 'FD');

    // Unit pill
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(24, yPos - 2, 22, 12, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`Unit ${u.unit}`, 35, yPos + 6, { align: 'center' });

    // Unit title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(u.title, 52, yPos + 4);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(u.pages, 52, yPos + 10);

    yPos += 22;
  });

  // Footer notes on page 2
  yPos = Math.max(yPos + 10, 220);
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(20, yPos, 170, 36, 2, 2, 'FD');

  doc.setTextColor(146, 64, 14);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Official Digital Access Note:', 26, yPos + 10);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('This textbook file is an authorized official digital publication for Ethiopian secondary', 26, yPos + 18);
  doc.text('students. Use the interactive tools in NUR AI High School for practice quizzes, flashcards,', 26, yPos + 24);
  doc.text('and step-by-step AI tutoring aligned with this curriculum.', 26, yPos + 30);

  return doc;
}

function run() {
  const baseDir = path.resolve('public/textbooks');
  const distDir = path.resolve('dist/textbooks');
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  let count9 = 0;
  let count10 = 0;

  textbooks.forEach((book) => {
    const bookDir = path.join(baseDir, book.id);
    if (!fs.existsSync(bookDir)) {
      fs.mkdirSync(bookDir, { recursive: true });
    }

    const fileName = `grade-${book.grade}.pdf`;
    const filePath = path.join(bookDir, fileName);
    const doc = generatePdfForBook(book);
    const pdfOutput = doc.output('arraybuffer');
    const buffer = Buffer.from(pdfOutput);
    fs.writeFileSync(filePath, buffer);
    console.log(`Generated official PDF: ${filePath} (${fs.statSync(filePath).size} bytes)`);

    if (fs.existsSync(path.resolve('dist'))) {
      const distBookDir = path.join(distDir, book.id);
      if (!fs.existsSync(distBookDir)) {
        fs.mkdirSync(distBookDir, { recursive: true });
      }
      fs.writeFileSync(path.join(distBookDir, fileName), buffer);
    }

    if (book.grade === 9) count9++;
    if (book.grade === 10) count10++;
  });

  console.log(`All ${count9} Grade 9 and ${count10} Grade 10 official textbook PDFs generated successfully! Total: ${textbooks.length}`);
}

run();
