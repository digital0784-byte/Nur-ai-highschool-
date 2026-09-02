import jsPDF from 'jspdf';
import { SubjectTextbook, TextbookUnit } from '../types';

/**
 * Downloads a structured PDF textbook for a subject and grade.
 * Formats units, key terms, worked examples, and review questions cleanly.
 */
export function generateTextbookPdf(
  textbook: SubjectTextbook,
  subjectName: string,
  grade: number
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  const addNewPageIfNeeded = (requiredSpace: number) => {
    if (currentY + requiredSpace > pageHeight - margin) {
      doc.addPage();
      currentY = margin + 10;
      // Header for subsequent pages
      doc.setFontSize(8);
      doc.setTextColor(130, 120, 110);
      doc.text(
        `${subjectName} - Grade ${grade} Student Textbook | FDRE MoE Curriculum`,
        margin,
        12
      );
      doc.setDrawColor(200, 190, 180);
      doc.line(margin, 14, pageWidth - margin, 14);
    }
  };

  // --- COVER / TITLE BANNER ---
  doc.setFillColor(45, 40, 35);
  doc.rect(margin, currentY, contentWidth, 36, 'F');

  doc.setTextColor(245, 238, 225);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(
    `${subjectName.toUpperCase()} - GRADE ${grade}`,
    margin + 6,
    currentY + 12
  );

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(215, 205, 190);
  doc.text(
    'ETHIOPIAN SECONDARY SCHOOL CURRICULUM - STUDENT TEXTBOOK',
    margin + 6,
    currentY + 20
  );
  doc.text(
    `Total Units: ${textbook.totalUnits} Units | Standard Syllabus`,
    margin + 6,
    currentY + 28
  );

  currentY += 44;

  // Overview Description
  doc.setFontSize(10);
  doc.setTextColor(60, 50, 40);
  doc.setFont('helvetica', 'italic');
  const descLines = doc.splitTextToSize(textbook.description, contentWidth);
  doc.text(descLines, margin, currentY);
  currentY += descLines.length * 5 + 6;

  // Table of Contents Box
  addNewPageIfNeeded(35);
  doc.setFillColor(245, 240, 230);
  doc.setDrawColor(190, 180, 165);
  doc.roundedRect(margin, currentY, contentWidth, 8 + textbook.units.length * 6, 2, 2, 'FD');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 35, 30);
  doc.text('TABLE OF CONTENTS', margin + 4, currentY + 6);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  textbook.units.forEach((u, i) => {
    doc.text(
      `• Unit ${u.unitNumber}: ${u.title.replace(/^[^\s]+ [0-9]+፡\s*/, '')}`,
      margin + 6,
      currentY + 12 + i * 6
    );
  });

  currentY += 14 + textbook.units.length * 6;

  // --- UNITS CONTENT ---
  textbook.units.forEach((unit: TextbookUnit) => {
    addNewPageIfNeeded(30);

    // Unit Header Banner
    doc.setFillColor(60, 52, 45);
    doc.rect(margin, currentY, contentWidth, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`UNIT ${unit.unitNumber}: ${unit.title}`, margin + 4, currentY + 8);
    currentY += 16;

    // Unit Summary
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(80, 70, 60);
    const sumLines = doc.splitTextToSize(`Summary: ${unit.summary}`, contentWidth);
    doc.text(sumLines, margin, currentY);
    currentY += sumLines.length * 4.5 + 4;

    // Sections
    unit.sections.forEach((sec) => {
      addNewPageIfNeeded(20);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 25, 20);
      doc.text(sec.title, margin, currentY);
      currentY += 5;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 45, 40);

      sec.content.forEach((paragraph) => {
        addNewPageIfNeeded(15);
        const pLines = doc.splitTextToSize(paragraph, contentWidth);
        doc.text(pLines, margin, currentY);
        currentY += pLines.length * 4.2 + 3;
      });

      // Key Terms
      if (sec.keyTerms && sec.keyTerms.length > 0) {
        addNewPageIfNeeded(20);
        doc.setFillColor(250, 245, 235);
        doc.setDrawColor(210, 200, 185);
        const boxHeight = 6 + sec.keyTerms.length * 9;
        doc.rect(margin, currentY, contentWidth, boxHeight, 'FD');

        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40, 30, 20);
        doc.text('Key Terms & Definitions:', margin + 3, currentY + 5);

        sec.keyTerms.forEach((kt, ki) => {
          doc.setFont('helvetica', 'bold');
          doc.text(`• ${kt.term}: `, margin + 5, currentY + 10 + ki * 9);
          doc.setFont('helvetica', 'normal');
          const defLines = doc.splitTextToSize(kt.definition, contentWidth - 12);
          doc.text(defLines, margin + 5, currentY + 14 + ki * 9);
        });

        currentY += boxHeight + 4;
      }

      // Worked Examples
      if (sec.workedExamples && sec.workedExamples.length > 0) {
        sec.workedExamples.forEach((we) => {
          addNewPageIfNeeded(25);
          doc.setFillColor(240, 246, 242);
          doc.setDrawColor(180, 205, 190);
          
          const qLines = doc.splitTextToSize(`Q: ${we.question}`, contentWidth - 8);
          const sLines = doc.splitTextToSize(`Solution: ${we.solution}`, contentWidth - 8);
          const boxHeight = (qLines.length + sLines.length) * 4.5 + 8;

          doc.rect(margin, currentY, contentWidth, boxHeight, 'FD');

          doc.setFontSize(8.5);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(20, 60, 40);
          doc.text(qLines, margin + 4, currentY + 5);

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(30, 50, 40);
          doc.text(sLines, margin + 4, currentY + 6 + qLines.length * 4.5);

          currentY += boxHeight + 4;
        });
      }
    });

    // Unit Review Questions
    if (unit.unitReviewQuestions && unit.unitReviewQuestions.length > 0) {
      addNewPageIfNeeded(25);
      doc.setFillColor(248, 244, 238);
      doc.setDrawColor(195, 185, 170);
      const qBoxHeight = 8 + unit.unitReviewQuestions.length * 6;
      doc.rect(margin, currentY, contentWidth, qBoxHeight, 'FD');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 40, 20);
      doc.text(`Unit ${unit.unitNumber} Review Questions:`, margin + 4, currentY + 6);

      doc.setFont('helvetica', 'normal');
      unit.unitReviewQuestions.forEach((rq, ri) => {
        doc.text(rq, margin + 6, currentY + 11 + ri * 6);
      });

      currentY += qBoxHeight + 6;
    }

    currentY += 4;
  });

  // Footer on each page
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(140, 130, 120);
    doc.text(
      `FDRE Ministry of Education • Secondary Student Textbook • Page ${p} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // Trigger download
  const safeFilename = `${subjectName.replace(/\s+/g, '_')}_Grade_${grade}_Textbook_MoE.pdf`;
  doc.save(safeFilename);
}
