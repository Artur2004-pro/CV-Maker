const generatePDF = require("../helpers/pdf-generator");

class CVService {
  async handleGenerateCV(payload) {
    const { data, template } = payload;

    if (!data || !template) {
      const err = new Error("Invalid CV payload");
      err.statusCode = 400;
      throw err;
    }

    return generatePDF(data, template);
  }
}

module.exports = new CVService();
