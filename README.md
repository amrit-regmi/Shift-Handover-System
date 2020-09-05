This project is Shift Handover System for the Aircraft Maintenece Organisation. 
-Features to be Included:
1. Support for Multiple Line station and Multiple Customers
    - Authirized User can add remove Customers/ Station 
2. Administrative Panel for Station Manager
    - Aprrove/ Request Clearification / Amend Working Hours for Staffs
    - Overview of Working Hours / Overtime per User / Station 
    - Enable/ Disable Check in out methods. 
    - Add Additional Tasks to shift
    - Set handover email receiving groups
3. Handover Page
    -  include Work perfomed per Customer/ EachAircraft  Staff (times)
    -  shift must acknowledge the last Handover and action (Defer / Complete ) on pending tasks before submit
    -  BarCode / Password  confirmation of worktime for Each User listed. 
    -  New User can add themself to shift if they are not in the system.
6. After each Handover HTML formatted Email will be sent to all receving group set by station Manager
7. Staff Panel 
    - Individual Staff can login  to view their working hours / Add clerification
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
