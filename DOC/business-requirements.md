1. Overview
Q: What is the product or feature?
A: Workplace behavioural assessment tool  
Q: What is its main purpose?
A: It serves as a tool for HR to assess the shortlisted candidates and match with Hiring Manager’s job behavioural demands. 
Q: Who is the end user?
A: End user is HR personnel/ talent acquisition
2. Goals and Success Criteria
Q: What are the main objectives?
A: To assist the HR to see beyond resume, HR and hiring manager can see the workplace behavioural insights to making an informed decision.
Q: What does “success” look like for this build?
A: The ability to complete transactions, provide accurate report, accurate credit deductions, and seamless experience
3. Platform / Environment
Q: Is it a web app, mobile app (iOS, Android), desktop software, embedded system, etc.?
A: it’s a website
Q: Are there existing systems it needs to integrate with?
A: The ability to download the report in answers in excel format. So I can generate the report manually through my excel file. 
4. User Roles & Permissions
Q: Who are the different users (e.g., admin, customer, guest)?
A: Admin, HR and hiring manager
Q: What can each role do?
A: Admin: can invite/remove roles, purchase credits, manage billings, download invoices, download reports
HR: invite candidates to do assessments, invite hiring managers to do assessments, download reports
Hiring manager: View and download reports.
5. Core Features / Functionality
A: 
User registration
I.	User can only register using company email addresses, no personal emails can be registered. Use SSO for the login. 
II.	Detail required: company email, company name, company website
III.	Email verification must be done before the user can login for the first time. 
b. Free credits
I.	Upon successful registration and verification, user will get 10 credits as trial.
II.	If there’s another user with the same email suffix registered before this, the 10 credits is not applicable for the second user with the same email suffix. 
c. Payment plans
There are 4 types of plans:
I.	On demand: 1 credit, email support only, 3 business days response, no credits rollover, price: RM99
II.	Steady: 5 credits/month, email support only, 48 hours response, maximum 5 credits rollover, RM289/month or RM3,326.4/year
III.	Growth: 15 credits/month, priority email, 24 hours response, max 30 credits rollover, RM742/month or RM8,553.6/year
IV.	Scale: 30 credits/month, dedicated support, 12 hours response, max 90 credits rollover, RM1260/month or RM14,256/year
d. Purchase credits
I.	User can choose plans from the dashboard (product page). 
II.	User can choose payment cycle; monthly or yearly.
III.	For monthly, payment can only be made through credit cards.
IV.	For annual payment, invoice and bank in is possible as an option.
V.	Upon receiving the payment, we can approve the credits and user can start straight away. 
User can upgrade anytime, pro rate calculation based on the contract period. E.g. if user purchase Growth plan on 1st Jan 2025 and paid annually, the user can upgrade next month, 1st Feb based on the following formula: 
I.	Prorate the amount required for the upgrade plan: 14256/365*334=13045.22
II.	78Prorate the amount used in the current plan: 8553.6/365*31=726.47
III.	Calculate the paid balance of growth: 8553.6-726.47=7827.13
IV.	Calculate the upgrade vs paid difference: 13045.22 – 7827.13 =5218.09
V.	Total cost requirement for upgrade is 5218.09
Plan downgrade: Downgrade can be initiated anytime but it only reflects by the end of the cycle. No refund. 
e. Number of users in a dashboard. 
I.	On demand: 2 users
II.	Steady: 4 users 
III.	Growth: 8 users
IV.	Scale: 20 users
V.	There’s no limit on the hiring manager roles
f. Assessment Invite links
I.	HR must create a role to hire. To create one, HR have to fill up the role, job level, and function. Once created, a new folder is created and an unique code is created. After that, the option to send assessment to hiring manager will appear. Then HR can send link to hiring manager to perform the assessment. Upon completion, another option to send invite candidates to do assessment will appear.
II.	HR must invite the hiring manager to perform a role behavioural assessment. The hiring manager must complete the assessment before the HR can start inviting the candidates to perform the assessment. 
III.	Upon completion, HR can invite the candidates to perform the assessment by keying in their name and email addresses. A copy of report will be sent to the user (checked box by default, HR can choose not to share the report)
IV.	Invite link is unique, link can only be used once and will be disabled upon completion/submission by the candidate
g. Report
Report is manually generated, there need to have a folder for us to upload the report to the right company, HR and position, so the HR and hiring manager can view and download the correct reports without messing up.  
h. Share link
User can copy link and share it with anyone who wishes to view or see. 
i. Credits
Each invitation will deduct a credit, and the successful completion of the candidate assessment will deduct the credit permanently from the pool. 
If candidate did not complete the assessment within 2 weeks, link will expire and credit will refund. 
6. User Interface (UI) / Screens
A: On the dashboard, it has:
•	Manage account (admin only)
o	Edit company information
o	Billing information
o	Manage plans
o	Manage users
•	Roles (admin, HR)
o	Add role button
o	List of roles
o	Within each role when enter the folder
	Invite hiring manager button
	Invite candidates
	Name of the hiring manager
	Details of the hiring roles
	Behavioural demand (result from the hiring manager’s assessment)
	List of invitees and download button (when ready)
•	Specific roles (folder) (admin, hr, hiring manager)
o	Name of the hiring manager
o	Details of the hiring roles
o	Behavioural demand (result from the hiring manager’s assessment)
o	List of invitees and download button (when ready)
7. Security & Privacy
A: PDPA required, data encryption, basic good practice for security
8. Performance Requirements
Q: Any expectations around speed, scalability, etc.?
A: mobile friendly (good speed in mobile version for candidate and hiring manage to perform assessment smoothly) 
In future, there will be other types of assessment included. 
9. Testing & QA
Q: How will this be tested?
A: Manually by the team.
10. Milestones & Timeline (if applicable)
Q: Phases of development (MVP, Alpha, Beta, etc.)
A: MVP

