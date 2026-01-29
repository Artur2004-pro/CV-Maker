module.exports = function renderTemplate(data, templateKey) {
  switch (templateKey) {
    case "modern":
      return `
        <html>
          <head>
            <style>
              body { font-family: sans-serif; padding: 2rem; }
              h1 { color: #333; }
              p { margin: 0.5rem 0; }
              .skills span { margin-right: 0.5rem; }
            </style>
          </head>
          <body>
            <h1>${data.firstName} ${data.lastName}</h1>
            <p>Email: ${data.email}</p>
            <p>Phone: ${data.phone}</p>
            <p>Summary: ${data.summary}</p>
            <div class="skills">${data.skills.map((s) => `<span>${s}</span>`).join("")}</div>
          </body>
        </html>
      `;
    case "corporate":
      return `
        <html>
          <head>
            <style>
              body { font-family: Arial; padding: 3rem; background: #f3f4f6; }
              h1 { color: #111; border-bottom: 2px solid #111; padding-bottom: 0.5rem; }
            </style>
          </head>
          <body>
            <h1>${data.firstName} ${data.lastName}</h1>
            <p>Email: ${data.email}</p>
            <p>Phone: ${data.phone}</p>
            <p>Summary: ${data.summary}</p>
            <p>Education: ${data.education}</p>
            <div>Skills: ${data.skills.join(", ")}</div>
          </body>
        </html>
      `;
    default:
      throw new Error("Template not found");
  }
};
