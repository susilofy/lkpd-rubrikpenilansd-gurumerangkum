import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  Header,
  Footer,
  PageNumber,
} from 'docx';
import { LKPDContent, RubricContent, RecapStudentItem } from '../types';

function sanitizeFilename(text: string): string {
  return text.replace(/[^a-zA-Z0-9_\u00C0-\u017F-]/g, '_').replace(/_+/g, '_').slice(0, 50);
}

export interface ExportLKPDOptions {
  filename?: string;
  includeAnswerKey?: boolean;
}

export async function exportLKPDDocx(
  content: LKPDContent,
  customFilenameOrOptions?: string | ExportLKPDOptions,
  maybeOptions?: ExportLKPDOptions
): Promise<void> {
  let includeAnswerKey = true;
  let filenameStr: string | undefined = undefined;

  if (typeof customFilenameOrOptions === 'string') {
    filenameStr = customFilenameOrOptions;
    if (maybeOptions && typeof maybeOptions.includeAnswerKey === 'boolean') {
      includeAnswerKey = maybeOptions.includeAnswerKey;
    }
  } else if (typeof customFilenameOrOptions === 'object' && customFilenameOrOptions !== null) {
    filenameStr = customFilenameOrOptions.filename;
    if (typeof customFilenameOrOptions.includeAnswerKey === 'boolean') {
      includeAnswerKey = customFilenameOrOptions.includeAnswerKey;
    }
  }

  // Also check if content explicitly defines includeAnswerKey
  if (typeof content.includeAnswerKey === 'boolean') {
    includeAnswerKey = content.includeAnswerKey;
  }

  const doc = createLKPDDocument(content, includeAnswerKey);
  const blob = await Packer.toBlob(doc);
  const filename = filenameStr || `LKPD_Kelas_${sanitizeFilename(content.grade)}_${sanitizeFilename(content.subject)}_${sanitizeFilename(content.topic)}.docx`;
  downloadBlob(blob, filename);
}

export async function exportRubricDocx(
  content: RubricContent,
  recapStudentsOrFilename?: RecapStudentItem[] | string,
  customFilename?: string
): Promise<void> {
  let recapStudents: RecapStudentItem[] | undefined = undefined;
  let filenameStr: string | undefined = undefined;

  if (Array.isArray(recapStudentsOrFilename)) {
    recapStudents = recapStudentsOrFilename;
    filenameStr = customFilename;
  } else if (typeof recapStudentsOrFilename === 'string') {
    filenameStr = recapStudentsOrFilename;
  }

  if (!recapStudents && content.recapStudents) {
    recapStudents = content.recapStudents;
  }

  const doc = createRubricDocument(content, recapStudents);
  const blob = await Packer.toBlob(doc);
  const filename = filenameStr || `Rubrik_Kelas_${sanitizeFilename(content.grade)}_${sanitizeFilename(content.subject)}_${sanitizeFilename(content.topic)}.docx`;
  downloadBlob(blob, filename);
}

export async function exportBothDocx(
  lkpdContent: LKPDContent,
  rubricContent: RubricContent,
  recapStudentsOrFilename?: RecapStudentItem[] | string,
  customFilename?: string
): Promise<void> {
  let recapStudents: RecapStudentItem[] | undefined = undefined;
  let filenameStr: string | undefined = undefined;

  if (Array.isArray(recapStudentsOrFilename)) {
    recapStudents = recapStudentsOrFilename;
    filenameStr = customFilename;
  } else if (typeof recapStudentsOrFilename === 'string') {
    filenameStr = recapStudentsOrFilename;
  }

  if (!recapStudents && rubricContent.recapStudents) {
    recapStudents = rubricContent.recapStudents;
  }

  const doc = createBothDocument(lkpdContent, rubricContent, recapStudents);
  const blob = await Packer.toBlob(doc);
  const filename = filenameStr || `LKPD_dan_Rubrik_Kelas_${sanitizeFilename(lkpdContent.grade)}_${sanitizeFilename(lkpdContent.subject)}_${sanitizeFilename(lkpdContent.topic)}.docx`;
  downloadBlob(blob, filename);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const PRIMARY_COLOR = '1E3A8A'; // Navy Blue 900
const ACCENT_COLOR = '2563EB'; // Royal Blue 600
const LIGHT_BG = 'F1F5F9'; // Slate 100
const BORDER_COLOR = 'CBD5E1'; // Slate 300

function createHeader(title: string) {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: title,
            size: 16,
            color: '64748B',
            font: 'Calibri',
          }),
        ],
      }),
    ],
  });
}

function createFooter() {
  return new Footer({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 60, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: 'Generator LKPD & Rubrik Penilaian SD  |  Kurikulum Merdeka',
                        size: 16,
                        color: '475569',
                        font: 'Calibri',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 40, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({
                        text: 'www.gurumerangkum.com',
                        size: 16,
                        color: '2563EB',
                        bold: true,
                        font: 'Calibri',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function buildLKPDSectionChildren(content: LKPDContent): Paragraph[] {
  const children: (Paragraph | Table)[] = [];

  // Kop / Judul
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: (content.schoolName || 'SEKOLAH DASAR').toUpperCase(),
          bold: true,
          size: 24,
          font: 'Calibri',
          color: PRIMARY_COLOR,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 140 },
      children: [
        new TextRun({
          text: 'LEMBAR KERJA PESERTA DIDIK (LKPD)',
          bold: true,
          size: 28,
          font: 'Calibri',
          color: ACCENT_COLOR,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `Mata Pelajaran: ${content.subject}  |  Kelas / Fase: ${content.grade} (${content.phase})  |  Semester: ${content.semester || '1'}`,
          italics: true,
          size: 20,
          font: 'Calibri',
          color: '334155',
        }),
      ],
    })
  );

  // Identity Table Box
  const identityTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: ACCENT_COLOR },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: ACCENT_COLOR },
      left: { style: BorderStyle.SINGLE, size: 8, color: ACCENT_COLOR },
      right: { style: BorderStyle.SINGLE, size: 8, color: ACCENT_COLOR },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                spacing: { before: 60, after: 60 },
                children: [
                  new TextRun({ text: 'Topik / Materi : ', bold: true, size: 20, font: 'Calibri' }),
                  new TextRun({ text: content.topic, size: 20, font: 'Calibri' }),
                ],
              }),
              new Paragraph({
                spacing: { before: 60, after: 60 },
                children: [
                  new TextRun({ text: 'Alokasi Waktu : ', bold: true, size: 20, font: 'Calibri' }),
                  new TextRun({ text: content.timeAllocation || '2 x 35 menit', size: 20, font: 'Calibri' }),
                ],
              }),
              new Paragraph({
                spacing: { before: 60, after: 60 },
                children: [
                  new TextRun({ text: 'Karakter LKPD : ', bold: true, size: 20, font: 'Calibri' }),
                  new TextRun({ text: content.characterLkpd || 'Individu', size: 20, font: 'Calibri' }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                spacing: { before: 60, after: 60 },
                children: [
                  new TextRun({ text: 'Nama Peserta Didik : ', bold: true, size: 20, font: 'Calibri' }),
                  new TextRun({ text: '......................................................', size: 20, font: 'Calibri', color: '94A3B8' }),
                ],
              }),
              new Paragraph({
                spacing: { before: 60, after: 60 },
                children: [
                  new TextRun({ text: 'Nomor Absen / Kelompok : ', bold: true, size: 20, font: 'Calibri' }),
                  new TextRun({ text: '....................................', size: 20, font: 'Calibri', color: '94A3B8' }),
                ],
              }),
              new Paragraph({
                spacing: { before: 60, after: 60 },
                children: [
                  new TextRun({ text: 'Hari / Tanggal : ', bold: true, size: 20, font: 'Calibri' }),
                  new TextRun({ text: '......................................................', size: 20, font: 'Calibri', color: '94A3B8' }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  children.push(identityTable as any);
  children.push(new Paragraph({ spacing: { after: 180 } }));

  // Helper for Section Heading
  const addSectionHeading = (letter: string, title: string) => {
    children.push(
      new Paragraph({
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: `${letter}. ${title.toUpperCase()}`,
            bold: true,
            size: 22,
            font: 'Calibri',
            color: PRIMARY_COLOR,
          }),
        ],
      })
    );
  };

  // A. TUJUAN PEMBELAJARAN
  addSectionHeading('A', 'Tujuan Pembelajaran');
  if (content.learningObjectives && content.learningObjectives.length > 0) {
    content.learningObjectives.forEach((obj, idx) => {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          indent: { left: 400 },
          children: [
            new TextRun({ text: `${idx + 1}. `, bold: true, size: 20, font: 'Calibri' }),
            new TextRun({ text: obj, size: 20, font: 'Calibri' }),
          ],
        })
      );
    });
  } else {
    children.push(
      new Paragraph({
        spacing: { after: 60 },
        indent: { left: 400 },
        children: [new TextRun({ text: '- Memahami konsep pembelajaran secara mendalam.', size: 20, font: 'Calibri' })],
      })
    );
  }

  // B. PETUNJUK MENGERJAKAN
  addSectionHeading('B', 'Petunjuk Mengerjakan');
  if (content.instructions && content.instructions.length > 0) {
    content.instructions.forEach((inst, idx) => {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          indent: { left: 400 },
          children: [
            new TextRun({ text: `${idx + 1}. `, bold: true, size: 20, font: 'Calibri' }),
            new TextRun({ text: inst, size: 20, font: 'Calibri' }),
          ],
        })
      );
    });
  }

  // C. ALAT DAN BAHAN
  addSectionHeading('C', 'Alat dan Bahan');
  if (content.toolsAndMaterials && content.toolsAndMaterials.length > 0) {
    content.toolsAndMaterials.forEach((tool) => {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          indent: { left: 400 },
          children: [
            new TextRun({ text: '•  ', bold: true, size: 20, font: 'Calibri', color: ACCENT_COLOR }),
            new TextRun({ text: tool, size: 20, font: 'Calibri' }),
          ],
        })
      );
    });
  }

  // D. KEGIATAN PEMBELAJARAN
  addSectionHeading('D', 'Kegiatan Pembelajaran');
  if (content.learningSteps && content.learningSteps.length > 0) {
    content.learningSteps.forEach((step) => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          indent: { left: 400 },
          children: [
            new TextRun({ text: `Langkah ${step.step}: ${step.title}`, bold: true, size: 20, font: 'Calibri', color: ACCENT_COLOR }),
          ],
        }),
        new Paragraph({
          spacing: { after: 80 },
          indent: { left: 600 },
          children: [
            new TextRun({ text: step.description, size: 20, font: 'Calibri' }),
          ],
        })
      );
    });
  }

  // E. TUGAS / AKTIVITAS
  addSectionHeading('E', 'Tugas dan Aktivitas');
  if (content.tasks && content.tasks.length > 0) {
    content.tasks.forEach((task, idx) => {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 60 },
          children: [
            new TextRun({ text: `Aktivitas ${idx + 1} (${task.type}): `, bold: true, size: 20, font: 'Calibri', color: PRIMARY_COLOR }),
            new TextRun({ text: task.prompt, size: 20, font: 'Calibri' }),
          ],
        })
      );

      if (task.instruction) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            indent: { left: 400 },
            children: [
              new TextRun({ text: `Petunjuk: ${task.instruction}`, italics: true, size: 18, font: 'Calibri', color: '475569' }),
            ],
          })
        );
      }

      // If choices exist (Multiple Choice)
      if (task.choices && task.choices.length > 0) {
        task.choices.forEach((choice) => {
          children.push(
            new Paragraph({
              spacing: { after: 40 },
              indent: { left: 600 },
              children: [
                new TextRun({ text: choice, size: 20, font: 'Calibri' }),
              ],
            })
          );
        });
      }

      // If matching pairs exist
      if (task.matchingPairs && task.matchingPairs.length > 0) {
        const matchRows = task.matchingPairs.map(
          (pair) =>
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 45, type: WidthType.PERCENTAGE },
                  children: [new Paragraph({ children: [new TextRun({ text: pair.left, size: 20, font: 'Calibri' })] })],
                }),
                new TableCell({
                  width: { size: 10, type: WidthType.PERCENTAGE },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '---', size: 20, font: 'Calibri' })] })],
                }),
                new TableCell({
                  width: { size: 45, type: WidthType.PERCENTAGE },
                  children: [new Paragraph({ children: [new TextRun({ text: pair.right, size: 20, font: 'Calibri' })] })],
                }),
              ],
            })
        );

        const matchTable = new Table({
          width: { size: 90, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
            left: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
            right: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
            insideVertical: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
          },
          rows: matchRows,
        });
        children.push(matchTable as any);
        children.push(new Paragraph({ spacing: { after: 100 } }));
      }

      // Answer Lines for write-in
      const lines = task.expectedLines || 2;
      for (let l = 0; l < lines; l++) {
        children.push(
          new Paragraph({
            spacing: { after: 50 },
            children: [
              new TextRun({
                text: '.........................................................................................................................................................',
                color: 'CBD5E1',
                size: 18,
                font: 'Calibri',
              }),
            ],
          })
        );
      }
    });
  }

  // F. PERTANYAAN
  addSectionHeading('F', 'Pertanyaan');
  if (content.questions && content.questions.length > 0) {
    content.questions.forEach((q, idx) => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({ text: `${idx + 1}. `, bold: true, size: 20, font: 'Calibri' }),
            new TextRun({ text: q.question, size: 20, font: 'Calibri' }),
            ...(q.hotLevel
              ? [
                  new TextRun({
                    text: ` [${q.hotLevel}]`,
                    bold: true,
                    size: 16,
                    color: q.hotLevel === 'HOTS' ? 'DC2626' : '2563EB',
                    font: 'Calibri',
                  }),
                ]
              : []),
          ],
        }),
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: 'Jawab: .....................................................................................................................................................',
              color: '94A3B8',
              size: 18,
              font: 'Calibri',
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: '            .....................................................................................................................................................',
              color: '94A3B8',
              size: 18,
              font: 'Calibri',
            }),
          ],
        })
      );
    });
  }

  // G. KESIMPULAN
  addSectionHeading('G', 'Kesimpulan');
  children.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: content.conclusionPrompt || 'Berdasarkan serangkaian aktivitas dan penyelidikan yang telah dilakukan di atas, tuliskan kesimpulan pembelajaranmu:',
          size: 20,
          font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: 'Kesimpulan saya: ...........................................................................................................................................',
          color: '94A3B8',
          size: 18,
          font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: '                           ...........................................................................................................................................',
          color: '94A3B8',
          size: 18,
          font: 'Calibri',
        }),
      ],
    })
  );

  // H. REFLEKSI PESERTA DIDIK
  addSectionHeading('H', 'Refleksi Peserta Didik');
  const reflection = content.studentReflection || {
    learnedPrompt: 'Hal yang saya pelajari hari ini:',
    likedPrompt: 'Hal yang paling saya sukai:',
    unclearPrompt: 'Hal yang masih belum saya pahami:',
  };

  const reflectionBox = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: ACCENT_COLOR },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT_COLOR },
      left: { style: BorderStyle.SINGLE, size: 6, color: ACCENT_COLOR },
      right: { style: BorderStyle.SINGLE, size: 6, color: ACCENT_COLOR },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                spacing: { before: 80, after: 60 },
                children: [
                  new TextRun({ text: '1. ' + (reflection.learnedPrompt || 'Hal yang saya pelajari hari ini:'), bold: true, size: 20, font: 'Calibri' }),
                ],
              }),
              new Paragraph({
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: '   ......................................................................................................................................................',
                    color: '94A3B8',
                    size: 18,
                    font: 'Calibri',
                  }),
                ],
              }),
              new Paragraph({
                spacing: { before: 60, after: 60 },
                children: [
                  new TextRun({ text: '2. ' + (reflection.likedPrompt || 'Hal yang paling saya sukai dalam kegiatan ini:'), bold: true, size: 20, font: 'Calibri' }),
                ],
              }),
              new Paragraph({
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: '   ......................................................................................................................................................',
                    color: '94A3B8',
                    size: 18,
                    font: 'Calibri',
                  }),
                ],
              }),
              new Paragraph({
                spacing: { before: 60, after: 60 },
                children: [
                  new TextRun({ text: '3. ' + (reflection.unclearPrompt || 'Hal yang masih belum saya pahami / ingin saya pelajari lebih lanjut:'), bold: true, size: 20, font: 'Calibri' }),
                ],
              }),
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: '   ......................................................................................................................................................',
                    color: '94A3B8',
                    size: 18,
                    font: 'Calibri',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  children.push(reflectionBox as any);

  // Signature lines at bottom
  children.push(
    new Paragraph({ spacing: { before: 300 } }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 60, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Mengetahui,', size: 20, font: 'Calibri' }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Guru Kelas / Mata Pelajaran', size: 20, font: 'Calibri' }),
                  ],
                }),
                new Paragraph({ spacing: { before: 600 } }),
                new Paragraph({
                  children: [
                    new TextRun({ text: '( .................................................... )', bold: true, size: 20, font: 'Calibri' }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: 'Tanda Tangan Peserta Didik', size: 20, font: 'Calibri' }),
                  ],
                }),
                new Paragraph({ spacing: { before: 600 } }),
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: '( .................................................... )', bold: true, size: 20, font: 'Calibri' }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }) as any
  );

  return children as Paragraph[];
}

function buildAnswerKeySectionChildren(content: LKPDContent): (Paragraph | Table)[] {
  const children: (Paragraph | Table)[] = [];

  // Page break so Kunci Jawaban begins on a fresh page for teacher
  children.push(
    new Paragraph({
      pageBreakBefore: true,
      spacing: { before: 120 },
    })
  );

  // Kop Kunci Jawaban
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: (content.schoolName || 'SEKOLAH DASAR').toUpperCase(),
          bold: true,
          size: 24,
          font: 'Calibri',
          color: PRIMARY_COLOR,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: 'KUNCI JAWABAN & PEDOMAN PENSKORAN',
          bold: true,
          size: 26,
          font: 'Calibri',
          color: PRIMARY_COLOR,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: 'PEGANGAN GURU - LEMBAR KERJA PESERTA DIDIK (LKPD)',
          bold: true,
          size: 20,
          font: 'Calibri',
          color: ACCENT_COLOR,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: `Mata Pelajaran: ${content.subject}  |  Kelas / Fase: ${content.grade} (${content.phase})  |  Semester: ${content.semester || '1'}`,
          italics: true,
          size: 20,
          font: 'Calibri',
          color: '334155',
        }),
      ],
    })
  );

  // Info Box / Teacher Guide Summary
  const teacherGuide = content.teacherGuide || {};
  const scoringBox = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: ACCENT_COLOR },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: ACCENT_COLOR },
      left: { style: BorderStyle.SINGLE, size: 8, color: ACCENT_COLOR },
      right: { style: BorderStyle.SINGLE, size: 8, color: ACCENT_COLOR },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                spacing: { before: 60, after: 40 },
                children: [
                  new TextRun({ text: 'Topik / Materi: ', bold: true, size: 20, font: 'Calibri' }),
                  new TextRun({ text: content.topic, size: 20, font: 'Calibri' }),
                ],
              }),
              new Paragraph({
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({ text: 'Sistem Penilaian: ', bold: true, size: 20, font: 'Calibri' }),
                  new TextRun({ text: teacherGuide.scoringSummary || 'Total Skor Maksimal: 100 Poin', size: 20, font: 'Calibri' }),
                ],
              }),
              new Paragraph({
                spacing: { before: 40, after: 60 },
                children: [
                  new TextRun({ text: 'Rumus Nilai Akhir: ', bold: true, size: 20, font: 'Calibri' }),
                  new TextRun({ text: teacherGuide.scoringFormula || 'Nilai = (Total Skor Perolehan / Total Skor Maksimal) x 100', size: 20, font: 'Calibri', color: ACCENT_COLOR }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                spacing: { before: 60, after: 40 },
                children: [
                  new TextRun({ text: 'Catatan Asesmen Formatif Guru: ', bold: true, size: 20, font: 'Calibri' }),
                ],
              }),
              new Paragraph({
                spacing: { before: 20, after: 60 },
                children: [
                  new TextRun({
                    text: teacherGuide.notesForTeacher || 'Kunci jawaban dan kriteria ini digunakan sebagai pedoman memeriksa LKPD siswa. Berikan apresiasi skor penuh apabila nalar konsep siswa tepat meski menggunakan kosakata sendiri.',
                    size: 19,
                    font: 'Calibri',
                    color: '475569',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  children.push(scoringBox as any);
  children.push(new Paragraph({ spacing: { after: 180 } }));

  // Helper for Section Heading
  const addKeyHeading = (letter: string, title: string) => {
    children.push(
      new Paragraph({
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: `${letter}. ${title.toUpperCase()}`,
            bold: true,
            size: 22,
            font: 'Calibri',
            color: PRIMARY_COLOR,
          }),
        ],
      })
    );
  };

  // I. KUNCI JAWABAN TUGAS DAN AKTIVITAS LKPD
  addKeyHeading('I', 'Kunci Jawaban Tugas dan Aktivitas LKPD');

  if (content.tasks && content.tasks.length > 0) {
    const headerRow = new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 8, type: WidthType.PERCENTAGE },
          shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'No', bold: true, color: 'FFFFFF', size: 19, font: 'Calibri' })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 24, type: WidthType.PERCENTAGE },
          shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Bentuk & Soal Tugas', bold: true, color: 'FFFFFF', size: 19, font: 'Calibri' })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Kunci Jawaban & Pembahasan Lengkap', bold: true, color: 'FFFFFF', size: 19, font: 'Calibri' })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 18, type: WidthType.PERCENTAGE },
          shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'Pedoman Skor', bold: true, color: 'FFFFFF', size: 19, font: 'Calibri' })],
            }),
          ],
        }),
      ],
    });

    const taskRows = content.tasks.map((task, idx) => {
      let answerText = task.answerKey || '';
      if (!answerText) {
        if (task.choices && task.choices.length > 0) {
          answerText = `Kunci Pilihan: ${task.choices[0] || 'A'}\nPembahasan: Merupakan konsep dasar yang relevan dengan ${content.topic}.`;
        } else if (task.matchingPairs && task.matchingPairs.length > 0) {
          answerText = `Kunci Pasangan:\n` + task.matchingPairs.map((p, pIdx) => `${pIdx + 1}. ${p.left} -> ${p.right}`).join('\n');
        } else {
          answerText = `Jawaban siswa memuat konsep inti mengenai materi ${content.topic} secara tepat dan sistematis.`;
        }
      }

      const rubricText = task.scoringRubric || 'Skor maksimal: 10 poin (Benar = 10, Sebagian = 5, Salah = 0)';

      return new TableRow({
        children: [
          new TableCell({
            width: { size: 8, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 60, after: 60 },
                children: [new TextRun({ text: `${idx + 1}`, bold: true, size: 19, font: 'Calibri' })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 24, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { before: 60, after: 30 },
                children: [
                  new TextRun({ text: task.type, bold: true, size: 19, font: 'Calibri', color: ACCENT_COLOR }),
                ],
              }),
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: task.prompt.length > 90 ? task.prompt.slice(0, 90) + '...' : task.prompt, size: 18, font: 'Calibri', color: '475569' }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: answerText.split('\n').map((line, lIdx) =>
              new Paragraph({
                spacing: { before: lIdx === 0 ? 60 : 20, after: 40 },
                children: [
                  new TextRun({ text: line, size: 19, font: 'Calibri' }),
                ],
              })
            ),
          }),
          new TableCell({
            width: { size: 18, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { before: 60, after: 60 },
                children: [
                  new TextRun({ text: rubricText, size: 18, font: 'Calibri', color: '334155' }),
                ],
              }),
            ],
          }),
        ],
      });
    });

    const tasksTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 6, color: PRIMARY_COLOR },
        bottom: { style: BorderStyle.SINGLE, size: 6, color: PRIMARY_COLOR },
        left: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
        right: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
        insideVertical: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
      },
      rows: [headerRow, ...taskRows],
    });

    children.push(tasksTable as any);
    children.push(new Paragraph({ spacing: { after: 140 } }));
  }

  // II. KUNCI JAWABAN PERTANYAAN PENDALAMAN (HOTS & LITERASI)
  addKeyHeading('II', 'Kunci Jawaban Pertanyaan Pendalaman (HOTS & Literasi)');
  if (content.questions && content.questions.length > 0) {
    content.questions.forEach((q, idx) => {
      const qAnswer = q.answerKey || `Peserta didik mampu menguraikan argumen berbasis fakta terkait ${content.topic} dan menunjukkan penalaran logis serta contoh kontekstual di lingkungannya.`;

      children.push(
        new Paragraph({
          spacing: { before: 80, after: 30 },
          children: [
            new TextRun({ text: `${idx + 1}. `, bold: true, size: 20, font: 'Calibri' }),
            new TextRun({ text: q.question, bold: true, size: 20, font: 'Calibri' }),
            ...(q.hotLevel
              ? [
                  new TextRun({
                    text: ` [${q.hotLevel}]`,
                    bold: true,
                    size: 17,
                    color: q.hotLevel === 'HOTS' ? 'DC2626' : '2563EB',
                    font: 'Calibri',
                  }),
                ]
              : []),
          ],
        }),
        new Paragraph({
          spacing: { before: 20, after: 40 },
          indent: { left: 400 },
          children: [
            new TextRun({ text: 'Kunci / Ekspektasi Jawaban: ', bold: true, size: 19, font: 'Calibri', color: ACCENT_COLOR }),
            new TextRun({ text: qAnswer, size: 19, font: 'Calibri' }),
          ],
        }),
        new Paragraph({
          spacing: { after: 80 },
          indent: { left: 400 },
          children: [
            new TextRun({
              text: 'Pedoman Penilaian: Skor 10 (Analisis tepat dan mendalam), Skor 5 (Pemahaman cukup/singkat), Skor 0 (Salah/tidak menjawab).',
              italics: true,
              size: 18,
              font: 'Calibri',
              color: '64748B',
            }),
          ],
        })
      );
    });
  }

  // III. CONTOH KESIMPULAN YANG DIHARAPKAN
  addKeyHeading('III', 'Contoh Kesimpulan Pembelajaran yang Diharapkan');
  const expConclusion = teacherGuide.expectedConclusion || `Peserta didik menyimpulkan bahwa penguasaan konsep ${content.topic} sangat penting dan dapat dipraktikkan secara aktif dalam kehidupan sehari-hari.`;
  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: 'Fokus Kesimpulan Peserta Didik: ',
          bold: true,
          size: 20,
          font: 'Calibri',
        }),
        new TextRun({
          text: content.conclusionPrompt || 'Berdasarkan serangkaian aktivitas dan penyelidikan di atas, rumuskan kesimpulanmu.',
          italics: true,
          size: 19,
          font: 'Calibri',
          color: '475569',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: 'Rekomendasi Kunci Kesimpulan: ',
          bold: true,
          size: 20,
          font: 'Calibri',
          color: ACCENT_COLOR,
        }),
        new TextRun({
          text: `"${expConclusion}"`,
          size: 20,
          font: 'Calibri',
        }),
      ],
    })
  );

  // IV. PANDUAN OBSERVASI REFLEKSI SISWA
  addKeyHeading('IV', 'Panduan Penilaian Refleksi Diri Siswa');
  children.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: 'Refleksi dinilai secara formatif untuk memetakan kebutuhan intervensi pembelajaran:',
          size: 19,
          font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 40 },
      indent: { left: 400 },
      children: [
        new TextRun({ text: '• ', bold: true, size: 20, font: 'Calibri', color: ACCENT_COLOR }),
        new TextRun({ text: 'Poin 1 (Hal yang dipelajari): Mengukur daya serap kognitif materi utama oleh siswa.', size: 19, font: 'Calibri' }),
      ],
    }),
    new Paragraph({
      spacing: { after: 40 },
      indent: { left: 400 },
      children: [
        new TextRun({ text: '• ', bold: true, size: 20, font: 'Calibri', color: ACCENT_COLOR }),
        new TextRun({ text: 'Poin 2 (Hal yang disukai): Mengukur minat dan keterlibatan emosional siswa dalam model pembelajaran.', size: 19, font: 'Calibri' }),
      ],
    }),
    new Paragraph({
      spacing: { after: 100 },
      indent: { left: 400 },
      children: [
        new TextRun({ text: '• ', bold: true, size: 20, font: 'Calibri', color: ACCENT_COLOR }),
        new TextRun({ text: 'Poin 3 (Hal yang belum dipahami): Menjadi dasar tindak lanjut remedial atau pengayaan materi guru.', size: 19, font: 'Calibri' }),
      ],
    })
  );

  // Signatures
  children.push(
    new Paragraph({ spacing: { before: 200 } }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 60, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Mengetahui,', size: 20, font: 'Calibri' })],
                }),
                new Paragraph({
                  children: [new TextRun({ text: 'Kepala Sekolah', size: 20, font: 'Calibri' })],
                }),
                new Paragraph({ spacing: { before: 600 } }),
                new Paragraph({
                  children: [new TextRun({ text: '( .................................................... )', bold: true, size: 20, font: 'Calibri' })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: 'Guru Kelas / Mata Pelajaran,', size: 20, font: 'Calibri' })],
                }),
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: (content.teacherName || 'Guru Pengampu'), size: 20, font: 'Calibri' })],
                }),
                new Paragraph({ spacing: { before: 600 } }),
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: `( ${content.teacherName || '....................................................'} )`, bold: true, size: 20, font: 'Calibri' })],
                }),
              ],
            }),
          ],
        }),
      ],
    }) as any
  );

  return children;
}

function buildRubricSectionChildren(content: RubricContent, recapStudentsList?: RecapStudentItem[]): Paragraph[] {
  const children: (Paragraph | Table)[] = [];

  // Kop
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: (content.schoolName || 'SEKOLAH DASAR').toUpperCase(),
          bold: true,
          size: 24,
          font: 'Calibri',
          color: PRIMARY_COLOR,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: 'RUBRIK PENILAIAN KURIKULUM MERDEKA',
          bold: true,
          size: 26,
          font: 'Calibri',
          color: ACCENT_COLOR,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: `Mata Pelajaran: ${content.subject}  |  Kelas / Fase: ${content.grade} (${content.phase})  |  Tugas: ${content.taskType}`,
          italics: true,
          size: 20,
          font: 'Calibri',
          color: '334155',
        }),
      ],
    })
  );

  // Identity Table
  const identityTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: ACCENT_COLOR },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT_COLOR },
      left: { style: BorderStyle.SINGLE, size: 6, color: ACCENT_COLOR },
      right: { style: BorderStyle.SINGLE, size: 6, color: ACCENT_COLOR },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({ text: 'Materi / Topik : ', bold: true, size: 20, font: 'Calibri' }),
                  new TextRun({ text: content.topic, size: 20, font: 'Calibri' }),
                ],
              }),
              new Paragraph({
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({ text: 'Tujuan Pembelajaran : ', bold: true, size: 20, font: 'Calibri' }),
                  new TextRun({ text: content.learningObjective || '-', size: 20, font: 'Calibri' }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({ text: 'Kelas / Fase : ', bold: true, size: 20, font: 'Calibri' }),
                  new TextRun({ text: `${content.grade} (${content.phase})`, size: 20, font: 'Calibri' }),
                ],
              }),
              new Paragraph({
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({ text: 'Semester : ', bold: true, size: 20, font: 'Calibri' }),
                  new TextRun({ text: `Semester ${content.semester || '1'}`, size: 20, font: 'Calibri' }),
                ],
              }),
              new Paragraph({
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({ text: 'Format Penilaian : ', bold: true, size: 20, font: 'Calibri' }),
                  new TextRun({ text: 'Rekapitulasi Kolektif Seluruh Siswa (1 Kelas)', italics: true, size: 20, font: 'Calibri', color: PRIMARY_COLOR }),
                ],
              }),
              new Paragraph({
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({ text: 'Tanggal Pelaksanaan : ', bold: true, size: 20, font: 'Calibri' }),
                  new TextRun({ text: '......................................................', size: 20, font: 'Calibri', color: '94A3B8' }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  children.push(identityTable as any);
  children.push(new Paragraph({ spacing: { after: 180 } }));

  // Matrix Rubric Table
  // Sort scales descending (e.g. 4, 3, 2, 1)
  const scales = [...(content.scaleLabels || [])].sort((a, b) => b.score - a.score);
  const scaleCount = scales.length || 4;

  // Header cells
  const headerCells: TableCell[] = [
    new TableCell({
      width: { size: 6, type: WidthType.PERCENTAGE },
      shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'No', bold: true, size: 18, color: 'FFFFFF', font: 'Calibri' })],
        }),
      ],
    }),
    new TableCell({
      width: { size: 24, type: WidthType.PERCENTAGE },
      shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'Kriteria Penilaian', bold: true, size: 18, color: 'FFFFFF', font: 'Calibri' })],
        }),
      ],
    }),
  ];

  const colWidth = Math.floor(70 / scaleCount);
  scales.forEach((scale) => {
    headerCells.push(
      new TableCell({
        width: { size: colWidth, type: WidthType.PERCENTAGE },
        shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `Skor ${scale.score}`, bold: true, size: 18, color: 'FFFFFF', font: 'Calibri' }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `(${scale.label})`, size: 15, color: 'E2E8F0', font: 'Calibri' }),
            ],
          }),
        ],
      })
    );
  });

  const tableRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: headerCells,
    }),
  ];

  // Data rows
  content.criteria.forEach((crit, index) => {
    const rowCells: TableCell[] = [
      new TableCell({
        width: { size: 6, type: WidthType.PERCENTAGE },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: String(index + 1), bold: true, size: 18, font: 'Calibri' })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 24, type: WidthType.PERCENTAGE },
        children: [
          new Paragraph({
            children: [new TextRun({ text: crit.name, bold: true, size: 18, font: 'Calibri', color: PRIMARY_COLOR })],
          }),
          ...(crit.description
            ? [
                new Paragraph({
                  children: [new TextRun({ text: crit.description, italics: true, size: 16, color: '64748B', font: 'Calibri' })],
                }),
              ]
            : []),
        ],
      }),
    ];

    scales.forEach((scale) => {
      const descText = crit.descriptors?.[scale.score] || '-';
      rowCells.push(
        new TableCell({
          width: { size: colWidth, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [new TextRun({ text: descText, size: 16, font: 'Calibri' })],
            }),
          ],
        })
      );
    });

    tableRows.push(new TableRow({ children: rowCells }));
  });

  const rubricTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: PRIMARY_COLOR },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: PRIMARY_COLOR },
      left: { style: BorderStyle.SINGLE, size: 6, color: PRIMARY_COLOR },
      right: { style: BorderStyle.SINGLE, size: 6, color: PRIMARY_COLOR },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    },
    rows: tableRows,
  });

  children.push(rubricTable as any);
  children.push(new Paragraph({ spacing: { after: 180 } }));

  // Scoring Calculation Guide Box
  const maxScore = content.criteria.length * (scales[0]?.score || 4);

  const scoringBox = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: ACCENT_COLOR },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT_COLOR },
      left: { style: BorderStyle.SINGLE, size: 6, color: ACCENT_COLOR },
      right: { style: BorderStyle.SINGLE, size: 6, color: ACCENT_COLOR },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                spacing: { before: 60, after: 40 },
                children: [
                  new TextRun({ text: 'PEDOMAN PERHITUNGAN NILAI AKHIR (SKOR KE NILAI 0 - 100)', bold: true, size: 18, color: PRIMARY_COLOR, font: 'Calibri' }),
                ],
              }),
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: 'Rumus Penilaian:  ', bold: true, size: 18, font: 'Calibri' }),
                  new TextRun({ text: 'Nilai Akhir = (Total Skor yang Diperoleh / Skor Maksimal) × 100', italics: true, size: 18, color: ACCENT_COLOR, font: 'Calibri' }),
                ],
              }),
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: `Skor Maksimal pada Rubrik ini = ${content.criteria.length} kriteria × ${scales[0]?.score || 4} = ${maxScore}`, size: 18, font: 'Calibri' }),
                ],
              }),
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: 'Kategori Predikat: ', bold: true, size: 18, font: 'Calibri' }),
                  new TextRun({ text: '86 - 100 : Sangat Baik (A)  |  71 - 85 : Baik (B)  |  56 - 70 : Cukup (C)  |  < 56 : Perlu Bimbingan (D)', size: 18, font: 'Calibri' }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  children.push(scoringBox as any);

  // D. TABEL REKAPITULASI PENILAIAN SELURUH SISWA (KOLEKTIF KELAS)
  children.push(
    new Paragraph({
      spacing: { before: 240, after: 80 },
      children: [
        new TextRun({
          text: 'TABEL REKAPITULASI PENILAIAN SELURUH SISWA (KOLEKTIF KELAS)',
          bold: true,
          size: 22,
          color: PRIMARY_COLOR,
          font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: 'Petunjuk: Isikan perolehan skor (1 - 4) setiap peserta didik pada tiap kriteria. Kolom T/R untuk mencatat Tindak Lanjut (T = Tuntas, R = Remedial).',
          italics: true,
          size: 17,
          font: 'Calibri',
          color: '475569',
        }),
      ],
    })
  );

  const numCrit = content.criteria.length || 4;
  const critColWidth = Math.max(5, Math.floor(32 / numCrit));
  const critTotalWidth = critColWidth * numCrit;
  const nameColWidth = Math.max(20, 100 - (4 + 6 + critTotalWidth + 8 + 8 + 7 + 7));

  const recapHeaderCells: TableCell[] = [
    new TableCell({
      width: { size: 4, type: WidthType.PERCENTAGE },
      shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'No', bold: true, size: 16, color: 'FFFFFF', font: 'Calibri' })],
        }),
      ],
    }),
    new TableCell({
      width: { size: 6, type: WidthType.PERCENTAGE },
      shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'Abs', bold: true, size: 16, color: 'FFFFFF', font: 'Calibri' })],
        }),
      ],
    }),
    new TableCell({
      width: { size: nameColWidth, type: WidthType.PERCENTAGE },
      shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'Nama Peserta Didik', bold: true, size: 16, color: 'FFFFFF', font: 'Calibri' })],
        }),
      ],
    }),
  ];

  content.criteria.forEach((_, idx) => {
    recapHeaderCells.push(
      new TableCell({
        width: { size: critColWidth, type: WidthType.PERCENTAGE },
        shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: `K${idx + 1}`, bold: true, size: 16, color: 'FFFFFF', font: 'Calibri' })],
          }),
        ],
      })
    );
  });

  recapHeaderCells.push(
    new TableCell({
      width: { size: 8, type: WidthType.PERCENTAGE },
      shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'Tot Skor', bold: true, size: 16, color: 'FFFFFF', font: 'Calibri' })],
        }),
      ],
    }),
    new TableCell({
      width: { size: 8, type: WidthType.PERCENTAGE },
      shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'Nilai', bold: true, size: 16, color: 'FFFFFF', font: 'Calibri' })],
        }),
      ],
    }),
    new TableCell({
      width: { size: 7, type: WidthType.PERCENTAGE },
      shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'Pred', bold: true, size: 16, color: 'FFFFFF', font: 'Calibri' })],
        }),
      ],
    }),
    new TableCell({
      width: { size: 7, type: WidthType.PERCENTAGE },
      shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'T / R', bold: true, size: 16, color: 'FFFFFF', font: 'Calibri' })],
        }),
      ],
    })
  );

  const recapTableRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: recapHeaderCells,
    }),
  ];

  // Dynamic student rows from state or default 25
  const rawStudents =
    recapStudentsList && recapStudentsList.length > 0
      ? recapStudentsList
      : content.recapStudents && content.recapStudents.length > 0
      ? content.recapStudents
      : [];

  const effectiveStudents: RecapStudentItem[] =
    rawStudents.length > 0
      ? rawStudents
      : Array.from({ length: 25 }, (_, i) => ({
          id: i + 1,
          no: i + 1,
          abs: i < 9 ? `0${i + 1}` : String(i + 1),
          name: '',
          scores: {},
        }));

  const maxScorePerCrit = scales[0]?.score || 4;
  const maxTotalScore = (content.criteria.length || 4) * maxScorePerCrit;

  let studentsWithScoresCount = 0;
  let totalScoreSum = 0;
  let totalPercentageSum = 0;
  let tuntasCount = 0;
  let remedialCount = 0;

  effectiveStudents.forEach((st) => {
    let hasScore = false;
    let earned = 0;
    content.criteria.forEach((_, cIdx) => {
      const v = st.scores ? st.scores[cIdx] : undefined;
      if (typeof v === 'number' && !isNaN(v)) {
        hasScore = true;
        earned += v;
      }
    });
    if (hasScore) {
      studentsWithScoresCount++;
      totalScoreSum += earned;
      const pct = maxTotalScore > 0 ? (earned / maxTotalScore) * 100 : 0;
      totalPercentageSum += pct;
      if (pct >= 71) {
        tuntasCount++;
      } else {
        remedialCount++;
      }
    }
  });

  effectiveStudents.forEach((st, sIdx) => {
    const isEven = sIdx % 2 === 1;
    const bgFill = isEven ? 'F8FAFC' : 'FFFFFF';
    const rowNo = st.no || sIdx + 1;
    const absStr = st.abs || (rowNo < 10 ? `0${rowNo}` : String(rowNo));
    const hasName = Boolean(st.name && st.name.trim());
    const studentName = hasName ? st.name.trim() : '';

    let hasScores = false;
    let totalEarned = 0;
    content.criteria.forEach((_, cIdx) => {
      const v = st.scores ? st.scores[cIdx] : undefined;
      if (typeof v === 'number' && !isNaN(v)) {
        hasScores = true;
        totalEarned += v;
      }
    });

    const finalVal = hasScores && maxTotalScore > 0 ? Math.round((totalEarned / maxTotalScore) * 100) : null;

    let predText = '.....';
    let predColor = 'CBD5E1';
    let followUpChildren: TextRun[] = [
      new TextRun({ text: '[  ]T  [  ]R', size: 13, font: 'Calibri', color: '64748B' }),
    ];

    if (finalVal !== null) {
      if (finalVal >= 86) {
        predText = 'SB (A)';
        predColor = '15803D';
      } else if (finalVal >= 71) {
        predText = 'Baik (B)';
        predColor = '1E3A8A';
      } else if (finalVal >= 56) {
        predText = 'Cukup (C)';
        predColor = 'D97706';
      } else {
        predText = 'PB (D)';
        predColor = 'BE123C';
      }

      if (finalVal >= 71) {
        followUpChildren = [
          new TextRun({ text: 'Tuntas (T)', bold: true, size: 14, font: 'Calibri', color: '15803D' }),
        ];
      } else {
        followUpChildren = [
          new TextRun({ text: 'Remedial (R)', bold: true, size: 14, font: 'Calibri', color: 'BE123C' }),
        ];
      }
    }

    const studentCells: TableCell[] = [
      new TableCell({
        width: { size: 4, type: WidthType.PERCENTAGE },
        shading: { fill: bgFill, type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 20 },
            children: [new TextRun({ text: String(rowNo), size: 16, font: 'Calibri' })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 6, type: WidthType.PERCENTAGE },
        shading: { fill: bgFill, type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 20 },
            children: [new TextRun({ text: absStr, size: 16, font: 'Calibri', color: '64748B' })],
          }),
        ],
      }),
      new TableCell({
        width: { size: nameColWidth, type: WidthType.PERCENTAGE },
        shading: { fill: bgFill, type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            spacing: { before: 20, after: 20 },
            children: [
              hasName
                ? new TextRun({ text: studentName, bold: true, size: 16, font: 'Calibri', color: '1E293B' })
                : new TextRun({ text: '......................................................', size: 16, font: 'Calibri', color: 'CBD5E1' }),
            ],
          }),
        ],
      }),
    ];

    content.criteria.forEach((_, cIdx) => {
      const v = st.scores ? st.scores[cIdx] : undefined;
      const isFilled = typeof v === 'number' && !isNaN(v);
      studentCells.push(
        new TableCell({
          width: { size: critColWidth, type: WidthType.PERCENTAGE },
          shading: { fill: bgFill, type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 20, after: 20 },
              children: [
                isFilled
                  ? new TextRun({ text: String(v), bold: true, size: 16, font: 'Calibri', color: '1E3A8A' })
                  : new TextRun({ text: '.....', size: 16, font: 'Calibri', color: 'CBD5E1' }),
              ],
            }),
          ],
        })
      );
    });

    studentCells.push(
      new TableCell({
        width: { size: 8, type: WidthType.PERCENTAGE },
        shading: { fill: bgFill, type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 20 },
            children: [
              hasScores
                ? new TextRun({ text: String(totalEarned), bold: true, size: 16, font: 'Calibri', color: '1E3A8A' })
                : new TextRun({ text: '.....', size: 16, font: 'Calibri', color: 'CBD5E1' }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 8, type: WidthType.PERCENTAGE },
        shading: { fill: bgFill, type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 20 },
            children: [
              finalVal !== null
                ? new TextRun({ text: String(finalVal), bold: true, size: 16, font: 'Calibri', color: '1E3A8A' })
                : new TextRun({ text: '.....', size: 16, font: 'Calibri', color: 'CBD5E1' }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 7, type: WidthType.PERCENTAGE },
        shading: { fill: bgFill, type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({
                text: predText,
                bold: finalVal !== null,
                size: finalVal !== null ? 14 : 16,
                font: 'Calibri',
                color: predColor,
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 7, type: WidthType.PERCENTAGE },
        shading: { fill: bgFill, type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 20 },
            children: followUpChildren,
          }),
        ],
      })
    );

    recapTableRows.push(new TableRow({ children: studentCells }));
  });

  // Summary row if students are graded
  if (studentsWithScoresCount > 0) {
    const avgScore = (Math.round((totalScoreSum / studentsWithScoresCount) * 10) / 10).toFixed(1);
    const avgPct = (Math.round((totalPercentageSum / studentsWithScoresCount) * 10) / 10).toFixed(1);
    const avgPctNum = Number(avgPct);
    const ketuntasanPct = Math.round((tuntasCount / studentsWithScoresCount) * 100);

    const summaryCells: TableCell[] = [
      new TableCell({
        columnSpan: 3,
        width: { size: 4 + 6 + nameColWidth, type: WidthType.PERCENTAGE },
        shading: { fill: 'EFF6FF', type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 30, after: 30 },
            children: [
              new TextRun({
                text: `RATA-RATA KELAS (${studentsWithScoresCount} Siswa Dinilai):`,
                bold: true,
                size: 15,
                font: 'Calibri',
                color: PRIMARY_COLOR,
              }),
            ],
          }),
        ],
      }),
    ];

    content.criteria.forEach((_, cIdx) => {
      let critSum = 0;
      let critCount = 0;
      effectiveStudents.forEach((st) => {
        const v = st.scores ? st.scores[cIdx] : undefined;
        if (typeof v === 'number' && !isNaN(v)) {
          critSum += v;
          critCount++;
        }
      });
      const critAvg = critCount > 0 ? (Math.round((critSum / critCount) * 10) / 10).toFixed(1) : '-';
      summaryCells.push(
        new TableCell({
          width: { size: critColWidth, type: WidthType.PERCENTAGE },
          shading: { fill: 'EFF6FF', type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 30, after: 30 },
              children: [new TextRun({ text: critAvg, bold: true, size: 15, font: 'Calibri', color: PRIMARY_COLOR })],
            }),
          ],
        })
      );
    });

    summaryCells.push(
      new TableCell({
        width: { size: 8, type: WidthType.PERCENTAGE },
        shading: { fill: 'EFF6FF', type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 30, after: 30 },
            children: [new TextRun({ text: avgScore, bold: true, size: 15, font: 'Calibri', color: PRIMARY_COLOR })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 8, type: WidthType.PERCENTAGE },
        shading: { fill: 'EFF6FF', type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 30, after: 30 },
            children: [new TextRun({ text: avgPct, bold: true, size: 15, font: 'Calibri', color: PRIMARY_COLOR })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 7, type: WidthType.PERCENTAGE },
        shading: { fill: 'EFF6FF', type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 30, after: 30 },
            children: [
              new TextRun({
                text: avgPctNum >= 86 ? 'SB (A)' : avgPctNum >= 71 ? 'Baik (B)' : avgPctNum >= 56 ? 'Cukup (C)' : 'PB (D)',
                bold: true,
                size: 14,
                font: 'Calibri',
                color: PRIMARY_COLOR,
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 7, type: WidthType.PERCENTAGE },
        shading: { fill: 'EFF6FF', type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 30, after: 30 },
            children: [
              new TextRun({
                text: `${ketuntasanPct}% T`,
                bold: true,
                size: 14,
                font: 'Calibri',
                color: ketuntasanPct >= 75 ? '15803D' : 'BE123C',
              }),
            ],
          }),
        ],
      })
    );

    recapTableRows.push(new TableRow({ children: summaryCells }));
  }

  const recapTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: PRIMARY_COLOR },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: PRIMARY_COLOR },
      left: { style: BorderStyle.SINGLE, size: 6, color: PRIMARY_COLOR },
      right: { style: BorderStyle.SINGLE, size: 6, color: PRIMARY_COLOR },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    },
    rows: recapTableRows,
  });

  children.push(recapTable as any);
  children.push(new Paragraph({ spacing: { after: 120 } }));

  // Legend and criteria notes box
  const criteriaNotes = (content.criteria || []).map(
    (c, i) => `K${i + 1} = ${c.name} (Skor Max: ${scales[0]?.score || 4})`
  ).join('  |  ');

  const notesParagraphs: Paragraph[] = [
    new Paragraph({
      spacing: { before: 40, after: 30 },
      children: [
        new TextRun({ text: 'Keterangan Kode Kriteria: ', bold: true, size: 17, font: 'Calibri', color: PRIMARY_COLOR }),
        new TextRun({ text: criteriaNotes, size: 17, font: 'Calibri' }),
      ],
    }),
    new Paragraph({
      spacing: { after: 30 },
      children: [
        new TextRun({ text: 'Keterangan Tindak Lanjut: ', bold: true, size: 17, font: 'Calibri', color: PRIMARY_COLOR }),
        new TextRun({ text: 'T = Tuntas / Pengayaan (Nilai Akhir ≥ 71)   |   R = Remedial / Pendampingan (Nilai Akhir < 71)', size: 17, font: 'Calibri' }),
      ],
    }),
  ];

  if (studentsWithScoresCount > 0) {
    const ketuntasanPct = Math.round((tuntasCount / studentsWithScoresCount) * 100);
    notesParagraphs.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: 'Statistik Hasil Kelas: ', bold: true, size: 17, font: 'Calibri', color: PRIMARY_COLOR }),
          new TextRun({
            text: `Total Dinilai: ${studentsWithScoresCount} Siswa   |   Tuntas: ${tuntasCount} Siswa (${ketuntasanPct}%)   |   Remedial: ${remedialCount} Siswa (${100 - ketuntasanPct}%)`,
            size: 17,
            font: 'Calibri',
            color: '334155',
          }),
        ],
      })
    );
  }

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: ACCENT_COLOR },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: ACCENT_COLOR },
        left: { style: BorderStyle.SINGLE, size: 4, color: ACCENT_COLOR },
        right: { style: BorderStyle.SINGLE, size: 4, color: ACCENT_COLOR },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 100, type: WidthType.PERCENTAGE },
              shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
              children: notesParagraphs,
            }),
          ],
        }),
      ],
    }) as any
  );

  // Signatures
  children.push(
    new Paragraph({ spacing: { before: 240 } }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Mengetahui,', size: 19, font: 'Calibri' })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Kepala Sekolah', bold: true, size: 19, font: 'Calibri' })] }),
                new Paragraph({ spacing: { before: 650 } }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '( .................................................... )', bold: true, size: 19, font: 'Calibri' })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'NIP. ...............................................', size: 17, color: '64748B', font: 'Calibri' })] }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '........................, .............................', size: 19, font: 'Calibri' })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Guru Kelas / Guru Penilai,', bold: true, size: 19, font: 'Calibri' })] }),
                new Paragraph({ spacing: { before: 650 } }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `( ${content.teacherName || '....................................................'} )`, bold: true, size: 19, font: 'Calibri' })],
                }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'NIP. ...............................................', size: 17, color: '64748B', font: 'Calibri' })] }),
              ],
            }),
          ],
        }),
      ],
    }) as any
  );

  return children as Paragraph[];
}

function createLKPDDocument(content: LKPDContent, includeAnswerKey: boolean = true): Document {
  const lkpdChildren = buildLKPDSectionChildren(content);
  const answerKeyChildren = includeAnswerKey ? buildAnswerKeySectionChildren(content) : [];

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        headers: {
          default: createHeader(`LKPD ${content.subject} - Kelas ${content.grade}`),
        },
        footers: {
          default: createFooter(),
        },
        children: [...lkpdChildren, ...answerKeyChildren],
      },
    ],
  });
}

function createRubricDocument(content: RubricContent, recapStudents?: RecapStudentItem[]): Document {
  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        headers: {
          default: createHeader(`Rubrik Penilaian ${content.subject} - Kelas ${content.grade}`),
        },
        footers: {
          default: createFooter(),
        },
        children: buildRubricSectionChildren(content, recapStudents),
      },
    ],
  });
}

function createBothDocument(lkpdContent: LKPDContent, rubricContent: RubricContent, recapStudents?: RecapStudentItem[]): Document {
  const lkpdChildren = buildLKPDSectionChildren(lkpdContent);
  const answerKeyChildren = buildAnswerKeySectionChildren(lkpdContent);
  const rubricChildren = buildRubricSectionChildren(rubricContent, recapStudents);

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        headers: {
          default: createHeader(`LKPD & Rubrik Penilaian - ${lkpdContent.subject} Kelas ${lkpdContent.grade}`),
        },
        footers: {
          default: createFooter(),
        },
        children: [
          ...lkpdChildren,
          ...answerKeyChildren,
          new Paragraph({
            pageBreakBefore: true,
            spacing: { before: 200 },
          }),
          ...rubricChildren,
        ],
      },
    ],
  });
}
