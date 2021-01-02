This project is Shift Handover System for the Aircraft Maintenece Organisation. 
-Features to be Included:
1. Support for Multiple Line station and Multiple Customers
    - Authirized User can add remove Customers/ Station -Implemented
2. Administrative Panel for Station Manager
    - Aprrove/ Request Clearification / Amend Working Hours for Staffs -Implemented
    - Overview of Working Hours / Overtime per User / Station - Implemented
    - Enable/ Disable Check in out methods. -SKIPPED FOR NOW
    - Add Additional Tasks to shift - SKIPPED FOR NOW
    - Set handover email receiving groups
3. Handover Page
    -  include Work perfomed per Customer/ EachAircraft  Staff (times) - Implemented
    -  shift must acknowledge the last Handover and action (Defer / Complete ) on pending tasks before submit - Implmented
    -  BarCode / Password  confirmation of worktime for Each User listed. - Password Confirmation Implmented -Barcode Implementetion Skipped for now
    -  New User can add themself to shift if they are not in the system. - Implemented 
    -  Browse old Handovers per Station - Implemented
    -  Station Info Page (Staffs,costumer,contacts,procedures) -Implemented (Procedure- skipped)
    -  Browse all the open tasks - SKIPPED FOR NOW
6. After each Handover HTML formatted Email will be sent to all receving group set by station Manager
7. Staff Panel 
    - Individual Staff can login  to view/ Edit their working hours / Add clerification - Implemented
    - Request for Approval of time sheet Per Week  or Month -Implemented

# How to use
Station Pages: 
- To start shift reporting/ view reports from previous shift 
    - Login in Station Login Page , select Station and password: stationkey (For: TestStation) 
    - Landing Page will be shift report from previous shift. Each reports contains work times and tasks from previous shifts
        - tasks with label 'action required' has to acted on the current shift
        - If the task has label Action History, tasks was not created on last shift but has been deferred from previous shifts. you can click the label to view the history of that task 
    - To start new reporting, select start new report page, all the tasks with open label will be transferred to this page
    - To add new task select Aircraft if not already selected and enter description. Each new Task should have one of following actions
        - Is Open Task - Meaning task is not completed 
        - Closed - Task is completed
        - Action Required - Task is open ans next shift has to action on it 
    - On alredy existing task - you must close/ defer if action required label. If only Open label then no action is required. You can also add notes to task along with the action

- Each user must signoff from the shift and all the required task must be acted upon before submitting report.
- After each submission if the mailing list is set, email summary of handover will be sent to the mailing list

Signing off from Report:
- Click Add on Staff Section on NewReport Page , Enter StartTime / EndTime / Break . 
Sign Off using Username and Password.
- If the user doesnot have account- select New User -Enter name/email - registration link will be sent to specified email
- If forgot password - select forgot password - Enter email -  password reset link will be sent to email  
In both cases work time will be recorded but approprite remarks will be added to record that the record is not verified with password. 

View old records on 'browse all reports'

View Station Info - Contains BasicInfo / Procedures / CostumerInfo 

Staff Pages
- To login to staff pages select 'Login to personal page' - Enter Credentials and LogIn
- Staff Page will have diffent navigation menu based on user permession labels
- Staff with minimum permission will have three Pages Profile/ Timesheets / Timesheets OVerview
    - Profile - Basic User Profile - Can change password - But other modifications has to be done by authorised staff
    - TimeSheets - Can View/Delete/Add OwnWorkTime records Weekly/Monthly / add remarks / respond to clarification request 
        - Modifying the timesheet here will autoadd the relevent  remarks field 
    - TimeSheet OVerview - Gives the overview of all timesheet records pending/approved totalHours per week/Month
- Staff with more than minimum permission will have above buttons on dropdown menu on right side of the page
    - Staff has 4 permission scopes
        - Station - Add/ Edit 
            - Add can Add/View stations  - Edit will have stations specified which user have edit rights - All stations menu will be availble on Login - Edit Will have ShiftReports Menu available 
        - Timesheet - View/ Sign 
            - view can view timesheets for specified Station - Sign can sign/view for specified stations -ManageTimeSheet Menu Will be available
        - Staff - Edit/Add/View 
            - Edit can Assign Permission to other staff up to his label - All Staffs Menu will be available 
        - Admin 
            - All of above + costumer Edit/Add/View / Delete

Admin Pages
- All Stations 
    - Lists all station Pages / Add 
    - Leads to individual station pages - user with Edit rights can assign/deassign costumers,  Settings options where one can set mailing list for shift reports/ other costumizations
- All Staffs
    - Lists all staffs pages/ Add / Delete / Diasble - depending permission
    - Leads to individual staff Page -(Viewing Self will show limited options) - user with edit rights have EditProfile /  Reset Password / Resend registercode options available 
     - user cannot moduify self regardless permission other than change password
- Manage TimeSheets
    - Shows all timesheet overview for selectedStaff  / stations / durations / status within permission scope
    - Leads to timesheet per user where one can sign / edit / add within permission scope
    - user cannot sign own timesheet regardless permission 
- Costumers
    - Lists all Costumers / Add
    - Leads to costumer page where one can add Aircraft/ Contact / Assign-Deassign Stations / Delete
- Shift Reports 
    - Lists all shift reports within station permission scope 
    
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
|28.11.2020 | 5  | appolo-server-express install/ troubleshoot / deploy to heroku |
|03.12.2020 | 6 | Staff schema changes and corresponding changes on frontend / all stations page and new station add page implemented |
|06.12.2020 | 6 | Refactoring of Staff Component to smaller components (Admin Pages/ Timsheet Overview) nad realted changes / Station info page |
|09.12.2020 | 7 | Costumers    Page / Add / Overview - Station Sub-Menu navigation link|
|13.12.2020 | 8 | Costumer Page Add/Remove Aircrfat/Station/Contact implemented
|14.12.2020 | 5 | Global notification component implmented for staff/ station / costumer pages |
|17.12.2020 | 6 | Station Pages - Add/Remove mailingList/shifts , DeleteStation , Assign Costumers , ResetStationKey Implemneted | 
|21.12.2020 | 6 | Node Mailer Implemented - Staff registration link and timesheet report are now sent to email |
|22.12.2020 | 6 | Permissions for stations and timesheets implemented on backend and frontend / Add more email notoficatiions / Updated report page to include station info / added more details to timesheet signing
|24.12.2020 | 6 | Bug Fixes, Staff / Costumer Permission / Permission panel update |
|25.12.2020 - 02.01.2021 | 15 |Password Reset Page/ Link Implemented | 
||| Task Info Page Implemented
||| Fixed Various Permissions 
||| Studied and implemented mongoose pre/post hook in some modals
||| After new year some some components with date got broken, traced and fixeed those bugs
||| All reports page implemted for administrator
||| Various other bug fixes

