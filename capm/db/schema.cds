namespace timesheet;

entity SSIUserDetails
{
    key EmailId : String(100);
    PersonName : String(100);
    Title : String(100);
    Password: String;
    IsActive: ActiveStatus default 'Y';
    SSITimeSheetData : Association to many SSITimeSheetData on SSITimeSheetData.ssiUserDetails = $self;
}

entity SSITimeSheetData
{
    key EntryDate : Date;
    Issue : Integer default 0;
    Enhancement : Integer default 0;
    NewInnovation : Integer default 0;
    Comments : String(100);
    key ssiUserDetails : Association to one SSIUserDetails;
}

type ActiveStatus : String enum {
    Yes = 'Y';
    No = 'N';
}
