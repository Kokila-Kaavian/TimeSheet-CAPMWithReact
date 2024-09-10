namespace timesheet;

entity SSIUserDetails
{
    key EmailId : String(100);
    PersonName : String(100);
    Title : String(100);
    Password: String;
    IsActive: Boolean default true not null;
    ProjectName: String(200);
    SSITimeSheetData : Association to many SSITimeSheetData on SSITimeSheetData.ssiUserDetails = $self;
    SSIProjectDetails : Association to many SSITimeSheetData on SSIProjectDetails.ssiUserDetails = $self;
}

entity SSITimeSheetData
{
    key EntryDate : Date;
    Issue : Integer default 0;
    Enhancement : Integer default 0;
    NewInnovation : Integer default 0;
    Comments : String(500);
    key ssiUserDetails : Association to one SSIUserDetails;
}

entity SSIProjectDetails
{
    key ProjectId: Integer;
    ProjectName: String(100);
    ssiUserDetails : Association to one SSIUserDetails;
}

