namespace timesheet;

using { cuid } from '@sap/cds/common';

entity SSIUserDetails : cuid
{
    PersonName : String(100);
    EmailId : String(100);
    Title : String(100);
    SSITimeSheetData : Association to many SSITimeSheetData on SSITimeSheetData.ssiUserDetails = $self;
}

entity SSITimeSheetData : cuid
{
    EntryDate : Date;
    Issue : Integer;
    Enhancement : Integer;
    NewInnovation : Integer;
    ssiUserDetails : Association to one SSIUserDetails;
    Comments : String(100);
}
