This project is Shift Handover System for the Aircraft Maintenece Organisation. 
-Features to be Included:
1. Support for Multiple Line station and Multiple Customers
    - Authirized User can add remove Customers/ Station 
2. Administrative Panel for Station Manager
    - Aprrove/ Request Clearification / Amend Working Hours for Staffs -Implemented
    - Overview of Working Hours / Overtime per User / Station 
    - Enable/ Disable Check in out methods. 
    - Add Additional Tasks to shift
    - Set handover email receiving groups
3. Handover Page
    -  include Work perfomed per Customer/ EachAircraft  Staff (times) - Implemented
    -  shift must acknowledge the last Handover and action (Defer / Complete ) on pending tasks before submit - Implmented
    -  BarCode / Password  confirmation of worktime for Each User listed. - Password Confirmation Implmented -Barcode Implementetion Skipped for now
    -  New User can add themself to shift if they are not in the system. - Implemented 
    -  Browse old Handovers per Station - Implemented
    -  Station Info Page (Staffs,costumer,contacts,procedures)
    -  Browse all the open tasks - SKIPPED FOR NOW
6. After each Handover HTML formatted Email will be sent to all receving group set by station Manager
7. Staff Panel 
    - Individual Staff can login  to view/ Edit their working hours / Add clerification - Implemented
    - Request for Approval of time sheet Per Week  or Month
    
# Work Time Accounting

| Day        | Hours| Tasks Done                          |
| :---------:|:-----| :-----------------------------------|
| 31.01.2020 | 4    | Inital planning and database design |
| 01.09.2020 | 3    | MongoDb Schema Implementation       |       
|            | 3    | GraphQL schema  implemented         |
|            | 3    | Reading on GraphQl modularization   |
| 02.09.2020 | 1    | Got schema to work after structuring|
|            | 2    | Basic Arcraft api functions implemented   |
| 03.09.2020 | 2    | More Arcraft api functions implemented   |
|            | 5    | basic Staff api functions implemented     |
|            | 1    | More work on staff |
| 04.09.2020 | 4    | testing staff api, everything works to this point |
| 05.09.2020 | 3    | Updating to timesheet implemented, study about graphql scaler types |
|            | 3    | Shift Report / task creation functionality works | 
|07.09.2020  | 3    | Started with frontend / landing page layout | 
|10.09.2020  | 6    | Shift Report page and compnents implemented |
|16.09.2020  | 4    | New Report Models implemented |
|16.09.2020  | 2    | Login with station key implemented  |
|19.09.2020  | 4    | New Report Form- studied Formik and FieldArrays |
|19.09.2020  | 5    | More work on New Report Form |
|20.09.2020  | 6    | More Work on New Report Form, form has a nice layout and dynamic fields now work properly |
|22.09.2020  | 3.5  | Date helper and new report front end validation partially complete | 
|24.09.2020  | 5    | Input validations completed , Input Errors now displays nicely Restructring of Forms|
|26.09.2020  | 6    | NewReport form restructering, checkbox behaviours fix, before submit data structuring , staffSignoff Backend, |
|29.09.2020  | 6    | Staff Add/ Remove /Update on reports - verification on Frontend |
|04.10.2020  | 6    | New report submission and project restructering|
|06.10.2020  | 4    | All report view implemented |
|10.10.2020  | 4    | Staff Login Page and Timesheets backend |
|14.10.2020  | 6    | Staff TimeSheet view |
|18.10.2020  | 8    | Staff TimeSheet Add/ Edit Model ClientSide|
|19.10.2020  | 6    | Staff TImeSheet Backend / User Profile View |
|30/31.10.2020  | 10   | Staff Profile View / Edit / Permissions(Partial implemented) / Password Change / Reset
|02.11.2020  | 4    | Permissions backend implemented |
|05.11.2020  | 6    | StaffAdmin View/ Navigation / Url Routing / Bug Fixes |
|11/12.11.2020 | 12 | Timesheet Management Interface backend/ frontend - about 80% complete
|14.11.2020  | 8    | Timesheet Management / All Users/ New User / User Registration Link -complete -pending testing
|28.11.2020 | 5  | appolo-server-express install/ troubleshoot / deploy to heroku 
