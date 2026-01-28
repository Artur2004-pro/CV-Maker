import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    category: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
  }>;
}

class PDFGenerator {
  async generatePDF(cvData: CVData): Promise<void> {
    try {
      // Create the HTML content for the CV
      const cvHTML = this.generateCVHTML(cvData);

      // Create a temporary div to render the CV
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cvHTML;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '210mm';
      tempDiv.style.padding = '20mm';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      document.body.appendChild(tempDiv);

      // Convert HTML to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 170; // A4 width minus margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);

      // Open PDF in new window and also download it
      const filename = `${cvData.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`;
      
      // Generate data URL for opening in new window
      try {
        // Get PDF as data URL
        const pdfDataUrl = pdf.output('dataurlstring');
        
        // Open PDF in new window
        const newWindow = window.open(pdfDataUrl, '_blank');
        
        // If popup was blocked, fallback to download only
        if (!newWindow) {
          console.warn('Popup blocked, downloading PDF instead');
          pdf.save(filename);
        } else {
          // Also trigger download
          pdf.save(filename);
        }
      } catch (error) {
        // Fallback: if opening fails, just download
        console.error('Error opening PDF in new window, downloading PDF:', error);
        pdf.save(filename);
      }

      // Clean up
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  private generateCVHTML(cvData: CVData): string {
    const { personalInfo, experience, education, skills, projects } = cvData;

    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #333;">
        <!-- Header -->
        <header style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
          <h1 style="margin: 0; font-size: 28px; color: #333; font-weight: bold;">${personalInfo.fullName || 'Your Name'}</h1>
          <p style="margin: 8px 0; color: #666; font-size: 14px;">${personalInfo.email || 'email@example.com'} | ${personalInfo.phone || '+1 (555) 123-4567'} | ${personalInfo.location || 'City, State'}</p>
          ${personalInfo.website ? `<p style="margin: 5px 0; color: #666; font-size: 14px;">${personalInfo.website}</p>` : ''}
          ${personalInfo.linkedin ? `<p style="margin: 5px 0; color: #666; font-size: 14px;">LinkedIn: ${personalInfo.linkedin}</p>` : ''}
        </header>

        ${personalInfo.summary ? `
        <!-- Summary -->
        <section style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; color: #333; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; font-weight: bold;">Professional Summary</h2>
          <p style="margin: 0; line-height: 1.6; color: #444; font-size: 14px;">${personalInfo.summary}</p>
        </section>
        ` : ''}

        ${experience.length > 0 ? `
        <!-- Experience -->
        <section style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; color: #333; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; font-weight: bold;">Work Experience</h2>
          ${experience.map(exp => `
            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 5px;">
                <div>
                  <h3 style="margin: 0; font-size: 16px; color: #333; font-weight: bold;">${exp.title}</h3>
                  <p style="margin: 2px 0; font-style: italic; color: #666; font-size: 14px;">${exp.company} | ${exp.location}</p>
                </div>
                <p style="margin: 0; color: #666; font-size: 14px; white-space: nowrap;">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</p>
              </div>
              ${exp.description ? `<p style="margin: 10px 0; line-height: 1.6; color: #444; font-size: 14px;">${exp.description}</p>` : ''}
            </div>
          `).join('')}
        </section>
        ` : ''}

        ${education.length > 0 ? `
        <!-- Education -->
        <section style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; color: #333; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; font-weight: bold;">Education</h2>
          ${education.map(edu => `
            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 5px;">
                <div>
                  <h3 style="margin: 0; font-size: 16px; color: #333; font-weight: bold;">${edu.degree}</h3>
                  <p style="margin: 2px 0; font-style: italic; color: #666; font-size: 14px;">${edu.institution} | ${edu.location}</p>
                  ${edu.gpa ? `<p style="margin: 2px 0; color: #666; font-size: 14px;">GPA: ${edu.gpa}</p>` : ''}
                </div>
                <p style="margin: 0; color: #666; font-size: 14px; white-space: nowrap;">${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}</p>
              </div>
            </div>
          `).join('')}
        </section>
        ` : ''}

        ${skills.length > 0 ? `
        <!-- Skills -->
        <section style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; color: #333; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; font-weight: bold;">Skills</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${skills.map(skill => `
              <span style="background-color: #f5f5f5; padding: 6px 12px; border-radius: 20px; font-size: 13px; color: #333; border: 1px solid #ddd;">
                ${skill.name} (${skill.level})
              </span>
            `).join('')}
          </div>
        </section>
        ` : ''}

        ${projects.length > 0 ? `
        <!-- Projects -->
        <section style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; color: #333; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; font-weight: bold;">Projects</h2>
          ${projects.map(project => `
            <div style="margin-bottom: 20px;">
              <h3 style="margin: 0; font-size: 16px; color: #333; font-weight: bold;">${project.name}</h3>
              <p style="margin: 5px 0; color: #666; font-size: 13px; font-style: italic;">Technologies: ${project.technologies.join(', ')}</p>
              ${project.description ? `<p style="margin: 10px 0; line-height: 1.6; color: #444; font-size: 14px;">${project.description}</p>` : ''}
              ${(project.url || project.github) ? `
                <p style="margin: 5px 0; color: #666; font-size: 13px;">
                  ${project.url ? `<span>Live Demo: ${project.url}</span>` : ''}
                  ${project.url && project.github ? ' | ' : ''}
                  ${project.github ? `<span>GitHub: ${project.github}</span>` : ''}
                </p>
              ` : ''}
            </div>
          `).join('')}
        </section>
        ` : ''}
      </div>
    `;
  }
}

export const pdfGenerator = new PDFGenerator();
