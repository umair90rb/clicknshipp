import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';
import { _reportingService as reportingService } from '../services/ReportingService';

export default {
  async getReport(req, res) {
    try {
      const { reportBrand, reportChanel, reportType, startPeriod, endPeriod } =
        req.body;
      let report;
      switch (reportType) {
        case 'Agent Report':
          report = await reportingService.getAgentReport(
            startPeriod,
            endPeriod,
            reportBrand,
            reportChanel
          );
          break;
        case 'Unit Report':
          report = await reportingService.getUnitReport(
            startPeriod,
            endPeriod,
            reportBrand,
            reportChanel
          );
          break;
        case 'Booking Unit Report':
          report = await reportingService.getBookingUnitReport(
            startPeriod,
            endPeriod,
            reportBrand,
            reportChanel
          );
          break;
        case 'FOC Report':
          report = await reportingService.getFOCReport(
            startPeriod,
            endPeriod,
            reportBrand,
            reportChanel
          );
          break;
        case 'Channel Report':
          report = await reportingService.getChannelReport(
            startPeriod,
            endPeriod,
            reportBrand,
            reportChanel
          );
          break;
        case 'Incentive Report':
          report = await reportingService.getIncentiveReport(
            startPeriod,
            endPeriod,
            reportBrand,
            reportChanel
          );
          break;
      }

      return sendSuccessResponse(
        res,
        200,
        {
          report,
          startPeriod,
          endPeriod,
          reportType,
          reportBrand,
          reportChanel,
        },
        'Report fetched successfully'
      );
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        e
      );
    }
  },
};
