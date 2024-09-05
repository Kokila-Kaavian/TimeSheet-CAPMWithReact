const cds = require("@sap/cds");
const cors = require("cors");

const { weekDates } = require("./handler/calculate-week-dates");

cds.on("bootstrap", async (app) => {
  app.use(cors({ origin: "*" }));

  app.get("/", (req, res) => {
    try {
      // Get the current week dates
      const dates = weekDates();
      
      res.json(dates);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // app.patch("/service/timesheet/SSIUserDetails", async(req, res) => {
  //   try {
  //     // Get the current week dates
  //    console.log({...req});
  //   //  await updateActiveStatus(req.body);
  //     res.json({'message':'updated successfully'});
  //   } catch (err) {
  //     res.status(500).json({ message: err.message });
  //   }
  // });
});
