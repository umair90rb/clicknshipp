import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";
import { _reportingService as reportingService } from "../services/ReportingService";

export default {
  async agentReport(req, res) {
    try {
      const { reportType, startPeriod, endPeriod } = req.body;
      let report;
      switch (reportType) {
        case "Agent Report":
          report = await reportingService.getAgentReport(
            startPeriod,
            endPeriod
          );
          break;
        case "Unit Report":
          report = await reportingService.getUnitReport(startPeriod, endPeriod);
          break;
      }

      return sendSuccessResponse(
        res,
        200,
        { report, startPeriod, endPeriod },
        "Report fetched successfully"
      );
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },
};
