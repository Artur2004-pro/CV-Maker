import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { CVData, Template } from '../types/api';

export const generatePDF = async (
  cvData: CVData,
  templateId: string,
  options?: {
    format?: 'A4' | 'Letter';
    margins?: number;
    includePhoto?: boolean;
  }
): Promise<Blob> => {
  // Default options
  const defaultOptions = {
    format: 'A4' as const,
    margins: 20,
    includePhoto: false,
  };

  const finalOptions = { ...defaultOptions, ...options };

  // Create the HTML content for the CV
  const cvHTML = generateCVHTML(cvData, templateId, finalOptions);

  // Create a temporary div to render the CV
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = cvHTML;
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = `${finalOptions.format === 'A4' ? 210 : 216}mm`;
  document.body.appendChild(tempDiv);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: finalOptions.format,
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pdf.internal.pageSize.getWidth() - (finalOptions.margins * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', finalOptions.margins, finalOptions.margins, imgWidth, imgHeight);

    return new Blob([pdf.output('blob')], { type: 'application/pdf' });
  } finally {
    // Clean up
    document.body.removeChild(tempDiv);
  }
};

const generateCVHTML = (cvData: CVData, templateId: string, options: any): string => {
  const { personalInfo, experience, education, skills, languages, certificates } = cvData;

  return `
    <div style="font-family: Arial, sans-serif; padding: ${options.margins}px; max-width: 800px; margin: 0 auto;">
      <!-- Header -->
      <header style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
        <h1 style="margin: 0; font-size: 28px; color: #333;">${personalInfo.firstName} ${personalInfo.lastName}</h1>
        <p style="margin: 5px 0; color: #666;">${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}</p>
        ${personalInfo.website ? `<p style="margin: 5px 0; color: #666;">${personalInfo.website}</p>` : ''}
        ${personalInfo.linkedin ? `<p style="margin: 5px 0; color: #666;">LinkedIn: ${personalInfo.linkedin}</p>` : ''}
        ${personalInfo.github ? `<p style="margin: 5px 0; color: #666;">GitHub: ${personalInfo.github}</p>` : ''}
      </header>

      ${personalInfo.summary ? `
      <!-- Summary -->
      <section style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; color: #333; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Professional Summary</h2>
        <p style="margin: 0; line-height: 1.6; color: #444;">${personalInfo.summary}</p>
      </section>
      ` : ''}

      ${experience.length > 0 ? `
      <!-- Experience -->
      <section style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; color: #333; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Work Experience</h2>
        ${experience.map(exp => `
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0; font-size: 16px; color: #333;">${exp.position}</h3>
            <p style="margin: 5px 0; font-style: italic; color: #666;">${exp.company} | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</p>
            <p style="margin: 10px 0; line-height: 1.6; color: #444;">${exp.description}</p>
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${education.length > 0 ? `
      <!-- Education -->
      <section style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; color: #333; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Education</h2>
        ${education.map(edu => `
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0; font-size: 16px; color: #333;">${edu.degree} in ${edu.field}</h3>
            <p style="margin: 5px 0; font-style: italic; color: #666;">${edu.school} | ${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}</p>
            ${edu.gpa ? `<p style="margin: 5px 0; color: #666;">GPA: ${edu.gpa}</p>` : ''}
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${skills.length > 0 ? `
      <!-- Skills -->
      <section style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; color: #333; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Skills</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          ${skills.map(skill => `
            <span style="background-color: #f0f0f0; padding: 5px 10px; border-radius: 15px; font-size: 14px; color: #333;">
              ${skill.name} (${skill.level})
            </span>
          `).join('')}
        </div>
      </section>
      ` : ''}

      ${languages.length > 0 ? `
      <!-- Languages -->
      <section style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; color: #333; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Languages</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          ${languages.map(lang => `
            <span style="background-color: #f0f0f0; padding: 5px 10px; border-radius: 15px; font-size: 14px; color: #333;">
              ${lang.name} (${lang.proficiency})
            </span>
          `).join('')}
        </div>
      </section>
      ` : ''}

      ${certificates.length > 0 ? `
      <!-- Certificates -->
      <section style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; color: #333; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Certificates</h2>
        ${certificates.map(cert => `
          <div style="margin-bottom: 15px;">
            <h3 style="margin: 0; font-size: 16px; color: #333;">${cert.name}</h3>
            <p style="margin: 5px 0; font-style: italic; color: #666;">${cert.issuer} | ${cert.date}</p>
            ${cert.url ? `<p style="margin: 5px 0; color: #666;">${cert.url}</p>` : ''}
          </div>
        `).join('')}
      </section>
      ` : ''}
    </div>
  `;
};

export const downloadPDF = async (
  cvData: CVData,
  templateId: string,
  filename: string = 'cv.pdf',
  options?: {
    format?: 'A4' | 'Letter';
    margins?: number;
    includePhoto?: boolean;
  }
): Promise<void> => {
  try {
    const pdfBlob = await generatePDF(cvData, templateId, options);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
