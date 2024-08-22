const cds = require("@sap/cds");
const moment = require("moment");

// Intitialize custom logic
class timeSheetSSI extends cds.ApplicationService {
  async init() {
    // Import the entity from 'service.cds'
    const { SSITimeSheetData } = this.entities;

    this.before("*", async (req) => {
      console.log(req.user);
    });

    this.before("READ", SSITimeSheetData, (req) => {
      const firstDateOfMonth = moment().startOf("month").format("YYYY-MM-DD");
      const lastDateOfMonth = moment().endOf("month").format("YYYY-MM-DD");

      const condition = {
        EntryDate: {
          between: new Date(firstDateOfMonth),
          and: new Date(lastDateOfMonth),
        },
      };
      req.query.where(condition);
    });

    this.after("READ", SSITimeSheetData, (data) => {
      console.log(data);
    });

    super.init();
  }
}

module.exports = timeSheetSSI;
