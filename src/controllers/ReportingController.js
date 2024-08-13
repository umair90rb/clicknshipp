import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";
import { _reportingService as reportingService } from "../services/ReportingService";

export default {
  async getReport(req, res) {
    try {
      const { reportBrand, reportType, startPeriod, endPeriod } = req.body;
      let report;
      switch (reportType) {
        case "Agent Report":
          report = await reportingService.getAgentReport(
            startPeriod,
            endPeriod,
            reportBrand
          );
          break;
        case "Unit Report":
          report = await reportingService.getUnitReport(
            startPeriod,
            endPeriod,
            reportBrand
          );
          break;
        case "Channel Report":
          report = await reportingService.getChannelReport(
            startPeriod,
            endPeriod,
            reportBrand
          );
          break;
        case "Incentive Report":
          report = await reportingService.getIncentiveReport(
            startPeriod,
            endPeriod,
            reportBrand
          );
          break;
      }

      return sendSuccessResponse(
        res,
        200,
        { report, startPeriod, endPeriod, reportBrand, reportType },
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
