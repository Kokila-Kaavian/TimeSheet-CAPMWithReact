using { timesheet as ts } from '../db/schema';

@path : '/service/timesheet'
service timeSheetSSI
{
    @odata.draft.enabled
    entity SSIUserDetails as
        projection on ts.SSIUserDetails;

    @odata.draft.enabled
    entity SSITimeSheetData as
        projection on ts.SSITimeSheetData;
}
