import { _reportingService as reportingService } from '../services/ReportingService';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';

export default {
  async getReport(req, res) {
    try {
      const {
        reportBrand,
        reportChanel,
        reportType,
        startPeriod,
        endPeriod,
        reportCities,
        reportDeliveryServicesAccounts,
      } = req.body;
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
            reportChanel,
            reportCities,
            reportDeliveryServicesAccounts
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
        case 'Delivery Report':
          report = await reportingService.getDeliveryReport(
            startPeriod,
            endPeriod,
            reportBrand,
            reportChanel
          );
          break;
        case 'Stock Report':
          report = await reportingService.getStockReport(
            startPeriod,
            endPeriod,
            reportBrand,
            reportChanel
          );
          break;
        case 'Channel Order Report':
          report = await reportingService.getChannelOrderReport(
            startPeriod,
            endPeriod,
            reportBrand,
            reportChanel
          );
          break;
        case 'Damage Stock Report':
          report = await reportingService.getDamageStockReport(
            startPeriod,
            endPeriod,
            reportBrand,
            reportChanel
          );
          break;
        case 'Dispatch Report':
          report = await reportingService.getDispatchReport(
            startPeriod,
            endPeriod,
            reportBrand,
            reportChanel
          );
          break;
        case 'Booking Products Value Report':
          report = await reportingService.getBookingProductsValueReport(
            startPeriod,
            endPeriod,
            reportBrand,
            reportChanel,
            reportDeliveryServicesAccounts
          );
          break;
        case 'Order Generation Report':
          report = await reportingService.getOrderGenerationReport(
            startPeriod,
            endPeriod,
            reportBrand,
            reportChanel,
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
