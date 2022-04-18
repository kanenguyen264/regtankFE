export const VERSION_1_1_7 = {
  title: "Version 1.1.7 has been released!",
  postedDate: "23/04/2021",
  features: [
    {
      title: "What's New?",
      list: [
        {
          description:
            "The Know Your Business (KYB) function is integrated, enabling due diligence on businesses against a global database and manages important information including the identities of ultimate beneficial ownership (UBO) and shareholders in a single consolidated page. V1.1.7 includes enhancements and minor bug fixes.",
        },
      ],
    },
    {
      title: "New Functions",
      list: [
        { description: "KYB full functionality." },
        { description: "Version display page under Settings." },
      ],
    },
    {
      title: "Enhancements",
      list: [
        { description: "Dashboard/Update UI including KYB." },
        { description: "KYC-KYT/Limit Reference ID to 15 characters." },
        {
          description: "KYC-KYT/Add error message for insufficient credits.",
        },
        { description: "KYC/Update the display for sanctioned person." },
        { description: "KYC/Update the template to import KYC." },
        { description: "Login/Allow special characters." },
        {
          description:
            "Credit/Functionality to refresh display on credit usage.",
        },
        {
          description: "General/Update the support form and email template.",
        },
        {
          description:
            "General/Redirect to the error page when user uses an expired verify link.",
        },
      ],
    },
    {
      title: "Solved bugs",
      list: [
        {
          description:
            "Audit/Uploading CSV with Reference ID does not show case creator.",
        },
        { description: "Dashboard/Fix UI issue on 1280x720 screen." },
        {
          description:
            "Login/Error message not displaying on first failed login attempt.",
        },
        { description: "KYC/Fix issue of system hanging when exporting KYC." },
      ],
    },
  ],
};

export const VERSION_1_1_8 = {
  title: "Version 1.1.8 has been released!",
  postedDate: "09/05/2021",
  features: [
    {
      title: "New Functions",
      list: [
        { description: "KYC/Profile picture review function" },
        {
          description:
            "Staff/Reassign all current tasks to another account when deleting a staff",
        },
      ],
    },
    {
      title: "Enhancements",
      list: [
        {
          description:
            "General/Pop up confirmation for every new screening in KYB, KYC, KYT",
        },
        {
          description: "Staff/Remove the sort functionality for Last accessed",
        },
        {
          description:
            "Audit/Add the filter functionality for the Audit screen",
        },
        { description: "KYC/Update the Advanced filter popup" },
        { description: "KYB/Add the functionality to edit risk level" },
      ],
    },
    {
      title: "Solved bugs",
      list: [
        {
          description:
            "KYT/Uncheck the Check all button after checking risk score",
        },
        {
          description:
            "Case/Cannot create case when adding reference ID for KYT",
        },
        { description: "KYB/Search issue on My KYB screen" },
        { description: "KYC/UI issue when email address is too long " },
      ],
    },
  ],
};

export const VERSION_1_1_9 = {
  title: "Version 1.1.9 has been released!",
  postedDate: "22/05/2021",
  features: [
    {
      title: "New Functions",
      list: [
        { description: "New templates for KYC-KYB-KYT-Case report" },
        { description: "General/ Add functionality for users to enable MFA" },
        {
          description:
            "General/ Add functionality to refresh in-app notification",
        },
        { description: "KYC-KYB-KYT/ New ID format for re-screening cases" },
        {
          description:
            "KYT-KYC/ Add button to refresh for newly imported cases",
        },
        {
          description: "KYT-KYC/ Add functionality to validate imported file",
        },
        { description: "KYB/ Add functionality for KYB re-screening" },
        { description: "KYB/ Implement Exchange API for KYB" },
        {
          description:
            "KYT/ Add functionality to edit Risk score and Risk level",
        },
      ],
    },
    {
      title: "Enhancements",
      list: [
        {
          description:
            "KYC/ Update email notification for KYC re-screening cases",
        },
        {
          description: "KYC/ Change the error message when editing risk score",
        },
        {
          description:
            "KYB/ Change the error message when there are no matching shareholders on the KYB risk assessment page",
        },
        {
          description:
            "Audit/ Update of the audit message when checking KYT transaction history risk score",
        },
      ],
    },
    {
      title: "Solved bugs",
      list: [
        { description: "General/ Fix attachment module issue" },
        { description: "General/ Fix alignment issue in the main menu" },
        {
          description:
            "KYC/ Fix an issue when the notes are duplicated on the KYC Risk Assessment page",
        },
        {
          description:
            "KYC/ Fix the issue of the Last modified date in the Advanced filter",
        },
        {
          description:
            "KYC/ Fix the issue when the photo resolution is too high",
        },
        { description: "KYC/ Fix check all checkbox issue on My KYC page" },
        {
          description:
            "KYT/ Fix check all checkbox issue on the Transaction History list",
        },
        {
          description:
            "KYT/ Fix duplicate entries in the Transaction history list",
        },
        {
          description:
            "Staff/ Fix the issue when deleting 2 staffs with the same name",
        },
        { description: "Staff/ Fix email validation alignment" },
        {
          description:
            "Notification/ Fix clear the re-assign notification issue ",
        },
        {
          description:
            "Case/ Fix the issue when there are special characters in a reference ID",
        },
      ],
    },
  ],
};

export const VERSION_1_1_10 = {
  title: "Version 1.1.10 has been released!",
  postedDate: "05/06/2021",
  features: [
    {
      title: "New Functions",
      list: [
        {
          description:
            "General/ Add functionality to log the user out when inactive for 15 minutes",
        },
        {
          description: "General/ Add version & build number on sign-in page",
        },
        {
          description:
            "Staff/ Add functionality for admin to resend the activation link",
        },
        {
          description:
            "KYC-KYB-KYT/ Email notification once a batch upload is finished",
        },
      ],
    },
    {
      title: "Enhancements",
      list: [
        {
          description:
            "General/ Add functionality to be able to scroll left and right when resizing on a web browser",
        },
        {
          description:
            "KYC-KYB/ Update the text from Ongoing Monitoring to Re-screening",
        },
        {
          description:
            "KYC/ Positive matches detail included in the risk assessment report",
        },
        { description: "KYT/ Add Risk score logic explanation" },
      ],
    },
    {
      title: "Solved bugs",
      list: [
        { description: "KYT/ Fix issue of risk score calculation" },
        { description: "Audit/ Fix issue for the filtering and pagination" },
        { description: "Other minor bugs fixed." },
      ],
    },
  ],
};

export const VERSION_1_1_11 = {
  title: "Version 1.1.11 has been released!",
  postedDate: "19/06/2021",
  features: [
    {
      title: "New Functions",
      list: [
        // { description: "KYC-KYB-KYT/ Implement the new Group list feature" },
        {
          description:
            "KYC-KYB-KYT/ Add functionality to assign multiple entries",
        },
        {
          description:
            "KYC-KYB-KYT/ Add functionality to auto assign any newly created entries",
        },
        { description: "KYB/ Implementation of Batch upload feature" },
        { description: "KYT/ Implementation of ongoing monitoring feature" },
      ],
    },
    {
      title: "Enhancements",
      list: [
        {
          description:
            "KYC-KYB-KYT/ Add loading indicator when generating report",
        },
        {
          description:
            "KYC-KYB-KYT/ Add functionality to restrict assigning to an inactivated account",
        },
        { description: "KYC/ Add Batch upload instructions" },
        {
          description:
            "KYB/ Add functionality to save audit trails when updating KYB Risk Assessment information",
        },
        {
          description:
            "KYT/ Update return message for screening of wallets with no transaction ",
        },
        {
          description:
            "General/ Add functionality to restrict User role from seeing Audit screen",
        },
        {
          description:
            "General/ Add functionality for user to create and login with password with special characters",
        },
        {
          description:
            "Staff/ Remove compulsory requirement for Phone number field",
        },
      ],
    },
    {
      title: "Solved bugs",
      list: [
        {
          description:
            "KYC/ Fix issue that cannot generate report when all the settings are 0 value",
        },
        {
          description:
            "KYC/ Fix issue of displaying wrong UI when connecting to website for first time ",
        },
        {
          description:
            "KYB/ Fix issue when user role accounts cannot see the KYB screen",
        },
        { description: "Other minor bugs fixed." },
      ],
    },
  ],
};

export const VERSION_1_1_12 = {
  title: "Version 1.1.12 has been released!",
  postedDate: "03/07/2021",
  features: [
    {
      title: "New Functions",
      list: [
        {
          description:
            "General/ Enable whitelisting by IP addresses and countries",
        },
        { description: "KYC-KYB-KYT/ Group list function" },
        { description: "KYC/ Escalate function" },
        { description: "KYC/ Approval function" },
        { description: "KYC/ No Match and Positive statuses for KYC" },
        { description: "KYC/ Gender filter for KYC screening" },
        { description: "KYC/ Audit message log for Rescreening functionality" },
        { description: "KYB/ Audit message log for Rescreening functionality" },
      ],
    },
    {
      title: "Enhancements",
      list: [
        {
          description:
            "KYC-KYB-KYT/ Validation for Reference ID to allow email format texts",
        },
        { description: "Audit/ Layout for Audit screen" },
        { description: "Admin/ Credit top-up function" },
      ],
    },
    {
      title: "Solved bugs",
      list: [
        {
          description:
            "KYT/ Non-BTC wallets should not perform Ongoing Monitoring actions",
        },
        {
          description:
            "KYT/ Correct redirection from Case screen to the KYT entry details",
        },
        { description: "Minor UI issues" },
      ],
    },
  ],
};

export const VERSION_1_1_12B = {
  title: "Version 1.1.12b has been released!",
  postedDate: "10/07/2021",
  features: [
    {
      title: "New Functions",
      list: [
        { description: "KYC/ Filter functionality for My KYC" },
        { description: "KYB-KYT/ Approval function" },
        { description: "KYB-KYT/ Escalate function" },
      ],
    },
    {
      title: "Enhancements",
      list: [
        {
          description:
            "General/ Update Alignment for all headers + contents in table",
        },
        {
          description:
            "General/ Implement the pointer for Notification and Profile icons",
        },
        {
          description:
            "Settings/ Add the functionality for Filter level to be flexible ",
        },
        { description: "KYC-KYB-KYT/ Enhance UI for Notes section" },
        {
          description:
            'KYC-KYB-KYT/ Add "Case created by and date time" to all current cases',
        },
        {
          description:
            "KYC/ Add the Approved/Rejected information to the Report",
        },
        {
          description:
            'KYC/ Move "Escalate" and "View Log" buttons to the top of page',
        },
        {
          description:
            "KYT/ Add the error message when screening non-BTC wallet",
        },
      ],
    },
    {
      title: "Solved bugs",
      list: [
        {
          description:
            "Settings/ Hide error message after switch between Country/IP Address in Whitelist",
        },
        {
          description:
            "Settings/ Fix an issue on the Bulk Action of KYC Settings",
        },
        {
          description:
            'Audit/ Change the name of column "Last Modified By" to "Audit Date"',
        },
        {
          description:
            "KYC/ Fix an issue that duplicates the match results when importing/calling by Exchange API",
        },
        {
          description:
            "KYC/ Fix an issue to close the Escalate pop-up when not selecting any user",
        },
        { description: "KYC/ Fix a response issue on Macbook" },
      ],
    },
  ],
};

export const VERSION_1_1_13 = {
  title: "Version 1.1.13 has been released!",
  postedDate: "17/07/2021",
  features: [
    {
      title: "New Functions",
      list: [
        { description: "KYC/ Implement the Ongoing Monitoring feature" },
        {
          description:
            "KYC/ Add the filter for keywords when screening new KYC",
        },
        {
          description:
            "General/ Implement the 2FA option to turn on/off; a system wide option that only admin can access",
        },
      ],
    },
    {
      title: "Enhancements",
      list: [
        {
          description:
            'KYC-KYB/ Remove "Last Modified By" in possible match screen on Screening result screens',
        },
        { description: "KYC/ Update UI for Risk matrix version" },
        { description: "KYC/ Update font size for Status tooltip" },
        {
          description:
            "KYT/ Clear the Wallet Address and Asset fields after screening a new KYT",
        },
        { description: "Case/ Display Cases even if they have no KYC" },
        {
          description:
            "General/ Add an eye icon to password field in login screen",
        },
        {
          description:
            "General/ Implement button and dialog styles to make them consistent across all pages",
        },
      ],
    },
    {
      title: "Solved bugs",
      list: [
        { description: 'KYC/ "Reset" button returns the default MyKYC screen' },
        {
          description:
            "KYT/ Wrong UI is displayed when Wallet Address is clicked",
        },
        {
          description:
            "KYT/ Wrong assignee is displayed when screening new KYT",
        },
        { description: "Audit/ KYB/KYT link returns the wrong screen" },
        { description: "Audit/ Action Type texts" },
        { description: "KYC/ Redirect when viewing Escalate notification" },
      ],
    },
  ],
};

export const VERSION_1_1_14 = {
  title: "Version 1.1.14 has been released!",
  postedDate: "31/07/2021",
  features: [
    {
      title: "New Functions",
      list: [
        {
          description:
            'KYC-KYB-KYT/ Add tooltip for "Copy" icon and "Move to Archive" icon',
        },
        {
          description:
            "KYC-KYT/ Automatically deactivate all Ongoing Monitoring cases in the Archive list",
        },
        { description: "KYT/ Add the My KYT filter function" },
      ],
    },
    {
      title: "Enhancements",
      list: [
        {
          description:
            "KYC-KYB-KYT/ Update the styling for Add New Group List icon",
        },
        { description: "KYC-KYB/ Update the breadcrumb URL" },
        {
          description:
            "KYC/ Disable Ongoing Monitoring if one or more dataset is removed",
        },
        {
          description:
            "KYB/ Change the status of KYB from Pending to No Match/Positive Match",
        },
        {
          description:
            'KYB/ Add the "Rescreening x months" below the Risk Level',
        },
        {
          description:
            "KYT/ Display the Risk Score of the current wallet in the Transaction History",
        },
        {
          description:
            "KYT/ The score field change to a not required field in the Edit score popup ",
        },
        {
          description:
            "KYT-Case/ Missing Add to Archive list icon in MyCase, MyKYT page",
        },
        {
          description:
            'Case/ Update the "Status" column in the Case Detail page to include the new statuses',
        },
        {
          description:
            "General/ Hide the Language switcher and the Top-up Credit function",
        },
      ],
    },
    {
      title: "Solved bugs",
      list: [
        { description: "KYC-KYB/ Fix an issue in the Generate Score button" },
        { description: "KYC-KYT/ Update the Filter button to standard button" },
        {
          description:
            "KYB/ Allow search for Chinese name in KYB Risk Assessment screen",
        },
        {
          description:
            "Audit/ Fix the UI resolution for screens smaller than 1392px",
        },
        { description: 'Case/ Remove sort "Notes" in Case Detail page' },
      ],
    },
  ],
};

export const VERSION_1_1_15 = {
  title: "Version 1.1.15 has been released!",
  postedDate: "15/08/2021",
  features: [
    {
      title: "New Functions",
      list: [
        {
          description:
            "Exchange API/ Email notification trigger to (RegTank) Admin when the Webhook call fails",
        },
        {
          description: "KYC-KYB/ Screening Details Report for Audit",
        },
        { description: "KYC-KYT/ Daily Ongoing Monitoring CSV Report" },
        { description: "KYC/ Customized Blacklist" },
      ],
    },
    {
      title: "Enhancements",
      list: [
        {
          description:
            "Settings/ Display in Audit log any change in the IP Whitelist settings",
        },
        { description: "KYC-KYB-KYT/ Import Functionality for Archive List" },
        {
          description:
            "KYT/ Disable Ongoing Monitoring when a KYT (for which Ongoing Monitoring is previously enabled) is added to Archive List",
        },
        {
          description:
            "Staff/ Discard Unsaved Information from 'Staff' Submenu when 2FA is Disabled",
        },
      ],
    },
    {
      title: "Solved bugs",
      list: [
        {
          description:
            'KYB/ Display "Rescreening X months" below the Risk Level',
        },
        {
          description:
            "KYT/ Filter KYT by Update based on Transaction Monitoring and Score Change Monitoring",
        },
      ],
    },
  ],
};

export const VERSION_1_1_16 = {
  title: "Version 1.1.16 has been released!",
  postedDate: "01/09/2021",
  features: [
    {
      title: "New Functions",
      list: [
        {
          description: "General/ Show number of login failures on web portal",
        },
      ],
    },
    {
      title: "Enhancements",
      list: [
        {
          description: "Exchange API/ Implement the versioning for APIs",
        },
        {
          description:
            "KYC-KYT-KYB/ Auto assign when escalating - update assignee when assignment is escalated",
        },
        {
          description:
            "KYC/ Evidence for KYC Blacklist - Issue an email log as evidence for KYC Blacklist",
        },
        {
          description: "KYB/ Add Filters to MyKYB page",
        },
        {
          description:
            "Case/ Case Statistic Display - Display total number of KYC and KYT screened in the case",
        },
        {
          description: "Improved UI design",
        },
      ],
    },
    {
      title: "Solved bugs",
      list: [
        {
          description:
            "KYC-KYB-KYT/ Group List: Error in displaying group list name",
        },
        {
          description:
            "KYC-KYT/ Edit Risk score - Update the Audit message when editing Risk score without changing the score",
        },
        {
          description:
            'General/ Need to active account before getting password by "forgot password"',
        },
        {
          description:
            "General/ Escalate in-app notification: adding avatar of user and name of the user",
        },
        {
          description:
            "General/ Add a title for tooltip in KYT, Setting General, 2FA",
        },
        {
          description: "Other minor bug fixes",
        },
      ],
    },
  ],
};

export const VERSION_1_1_17 = {
  title: "Version 1.1.17 has been released!",
  postedDate: "15/09/2021",
  features: [
    {
      title: "New Functions",
      list: [
        {
          description: "4 User Access Control Levels by Roles",
        },
        {
          description: "KYC Ongoing Monitoring Tag",
        },
        {
          description: "KYT Ongoing Monitoring Tag",
        },
        {
          description:
            "Users are now able to see KYC/KYB/KYT profiles that have been escalated to an assignee in My KYC / My KYB / My KYT screens",
        },
      ],
    },
    {
      title: "Enhancements",
      list: [
        {
          description:
            "Users can now see any changes to the notes of the profile in the KYC / KYT Risk Assessment page",
        },
      ],
    },
    {
      title: "Solved bugs",
      list: [
        {
          description:
            "Fixed an error where the system incorrectly displays user activity in the audit section when a case is created. Audit showed wrong messages when creating a new Case or screening a new positive KYC match",
        },
        {
          description:
            "API calls with correct authorization keys but with invalid parameter types will now reflect a response from our system telling the user which parameter has an incorrect input",
        },
        {
          description:
            "Users are unable to enable/disable Ongoing Monitoring after KYC screening is initiated",
        },
        {
          description:
            "When the user filters profiles by selecting the Ongoing Monitoring activity filter, it does not return any results",
        },
        {
          description: "Other minor bug fixes",
        },
      ],
    },
  ],
};

export const VERSION_1_1_18 = {
  title: "Version 1.1.18 has been released!",
  postedDate: "29/09/2021",
  features: [
    {
      title: "New Functions",
      list: [
        {
          description:
            "Users will need to resolve the blacklist before generating the risk score for KYC",
        },
        {
          description:
            "The Onboarding System will now be available in the Regtank System. Please contact our account manager for more information",
        },
      ],
    },
    {
      title: "Enhancements",
      list: [
        {
          description:
            "On the KYC ID, users can now see a tag called “OM Updated” to indicate that there are updates on the Ongoing Monitoring for that specific KYC. This tag will disappear within 3 days and reappear if there are new updates",
        },
      ],
    },
    {
      title: "Solved bugs",
      list: [
        {
          description:
            "In KYB, under Ultimate Beneficiary, users were unable to find the KYC records when a valid KYC ID was used for the search",
        },
        {
          description:
            "Users could not toggle on the KYT Ongoing Monitoring when the import is done through a file",
        },
        {
          description:
            "Users could not import a KYT with the same wallet address more than once. Now users are able to see the same wallet address with a unique KYT ID once import has been completed",
        },
        {
          description: "Other minor bugs",
        },
      ],
    },
  ],
};

export const VERSION_1_1_19 = {
  title: "Version 1.1.19 has been released!",
  postedDate: "13/10/2021",
  features: [
    {
      title: "New Functions",
      list: [
        {
          description:
            "The Dow Jones Database for KYC Screening is now available in the Regtank System. Please contact our account manager for more information",
        },
      ],
    },
    {
      title: "Enhancements",
      list: [
        {
          description:
            "The Reference ID shown in the My KYC and My KYT module will now limit up to 10 characters to optimize the spaces in the display",
        },
      ],
    },
    {
      title: "Solved bugs",
      list: [
        {
          description:
            "In the KYT module, when users add a new KYT under the group list, the correct record will be shown",
        },
        {
          description:
            "The UI alignment has been fixed on the audit log after users approve or reject a KYC record",
        },
        {
          description: "Other minor bugs",
        },
      ],
    },
  ],
};

export const VERSION_1_1_20 = {
  title: "Version 1.1.20 has been released!",
  postedDate: "27/10/2021",
  features: [
    {
      title: "New Functions",
      list: [
        {
          description:
            "The Risk Scoring feature for Dow Jones is now available. Users are now able to generate a risk score for individuals after the KYC Screening",
        },
        {
          description:
            "Department List has been released as the next phase of ACL (Access Control Level). Please contact our account manager for more information",
        },
        {
          description:
            "The Reporting Module for KYC is now available. Users can now build customized reports. Please contact our account manager for more information",
        },
      ],
    },
    {
      title: "Enhancements",
      list: [
        {
          description:
            "Notifications received from the Regtank System can now be turned off in the settings feature under General Settings > Email Notifications",
        },
      ],
    },
    {
      title: "Solved bugs",
      list: [
        {
          description:
            'When adding a new blacklist profile, the system will now display the gender "Unspecified" when the user selects this option instead of displaying a dash: " - "',
        },
        {
          description:
            "In the KYB feature, under the notes section, users can now see the notes and attachments that were entered in the exported report",
        },
        {
          description:
            'When users assign a profile to another user on the Screening Results page, the system will now immediately change to the correct name of the assignee instead of changing it to "unassigned"',
        },
        {
          description:
            "In the KYT section, users can get the transaction information of an ETH wallet successfully without getting an error message",
        },
        {
          description: "Other minor bugs",
        },
      ],
    },
  ],
};

export const VERSION_1_1_21 = {
  title: "Version 1.1.21 has been released!",
  postedDate: "10/11/2021",
  features: [
    {
      title: "New Functions",
      list: [
        {
          description:
            "The Reporting Module is now available on the Regtank System. Users can now customize their reports for the KYC/KYB/KYT modules",
        },
        {
          description:
            "Users now have the option to turn off the email notifications from the Regtank System",
        },
      ],
    },
    {
      title: "Enhancements",
      list: [
        {
          description:
            'When users enable Ongoing Monitoring, they are now able to see the tag "OM Updated" below the KYC ID whenever there is a new update',
        },
        {
          description:
            "Users will now only receive email notifications for Blacklist matches whenever there is a new update instead of daily blacklist updates",
        },
      ],
    },
    {
      title: "Solved bugs",
      list: [
        {
          description:
            "In the Blacklist module, under Settings, users can now remove all the categories without receiving any errors",
        },
        {
          description: "Other minor bugs",
        },
      ],
    },
  ],
};

export const VERSION_1_1_22 = {
  title: "Version 1.1.22 has been released!",
  postedDate: "24/11/2021",
  features: [
    {
      title: "New Functions",
      list: [
        {
          description:
            "New functions have been added to the Dow Jones KYC such as users being to Approve, Reject, and Escalate a profile",
        },
        {
          description:
            "The Ongoing Monitoring function has also been added to the Dow Jones KYC feature",
        },
        {
          description:
            "For the Access Control Levels (ACL) feature, the access level of the system’s Root Admin can no longer be changed",
        },
      ],
    },
    {
      title: "Enhancements",
      list: [
        {
          description:
            "Users will now only receive a Blacklist email summary when a there is a match in the system",
        },
      ],
    },
    {
      title: "Solved bugs",
      list: [
        {
          description:
            "In the Acuris My KYC page, profiles that have the Ongoing Monitoring (OM) tag will no longer see the Risk Score",
        },
        {
          description:
            'On the Staff Module, if users have selected to show "100 Results Per Page", they are now able to delete a staff profile without the system resetting to "10 Results Per Page"',
        },
      ],
    },
  ],
};

export const VERSION_1_1_23 = {
  title: "Version 1.1.23 has been released!",
  postedDate: "15/12/2021",
  features: [
    {
      title: "New Functions",
      list: [
        {
          description:
            "New functions have been added to the Dow Jones KYC. Users are now able to use the Archive and Group List function",
        },
        {
          description:
            "The Reporting Module for Dow Jones KYC is now available in the Regtank System",
        },
      ],
    },
    {
      title: "Enhancements",
      list: [
        {
          description:
            "When users enter the country information on the Acuris KYC Screen section, the same country will be reflected on the Risk Scoring results",
        },
      ],
    },
    {
      title: "Solved bugs",
      list: [
        {
          description:
            "Users can now filter KYC profiles without seeing the archived profiles",
        },
        {
          description:
            "Users will be navigated to the correct page when clicking on the “Dow Jones KYC” breadcrumb",
        },
        {
          description: "Other minor bugs",
        },
      ],
    },
  ],
};

export const VERSION_1_1_24 = {
  title: "Version 1.1.24 has been released!",
  postedDate: "06/01/2022",
  features: [
    {
      title: "New Functions",
      list: [
        {
          description:
            "New functions have been added to the Dow Jones KYC. Users can now use the Access Level Functions, Rescreening Feature, and view the Activity Log",
        },
      ],
    },
    {
      title: "Enhancements",
      list: [
        {
          description:
            "In the audit module, users can now search the items using the main activity title such as “Acuris” and “Dow Jones” and display all of the actions under that title",
        },
        {
          description:
            "The statuses of the old Liveness Profiles in the Liveness module will not be updated when there is a change in the settings. The status change will only reflect on the new profiles",
        },
        {
          description:
            "In the Liveness Module, under Personal Information, there is now a “Full Name” field which will be comprised of “Forename”, “Middle name”, and “Surname”",
        },
        {
          description:
            "The blacklist name matching has been enhanced. When searching for a KYC, there will be a blacklist match even with variations in the screened individual's name",
        },
      ],
    },
    {
      title: "Solved bugs",
      list: [
        {
          description:
            "When exporting an individual KYC, the report will now show the correct Rescreening/Ongoing Monitoring status",
        },
        {
          description:
            "In the Reporting Module for Dow Jones, the flags of each country will now be displayed correctly",
        },
        {
          description:
            "In the KYB module, the system will now show the correct tag “Escalate” under the KYB ID",
        },
        {
          description:
            "The text for the Onboarding Liveness page has been optimized",
        },
        {
          description: "Other minor bugs",
        },
      ],
    },
  ],
};

export const VERSION_1_1_25 = {
  title: "Version 1.1.25 has been released!",
  postedDate: "25/01/2022",
  features: [
    {
      title: "New Functions",
      list: [
        {
          description:
            "The blacklist feature has now been implemented for Dow Jones. Users can now create internal blacklist profiles in the Settings for both Dow Jones and Acuris KYC",
        },
        {
          description:
            "Users can now import KYC profiles into the Dow Jones KYC Module",
        },
      ],
    },
    {
      title: "Enhancements",
      list: [
        {
          description:
            "In the Settings section of the Onboarding Liveness Module, the Audit Log will now track when users have changed the percentage of Face Match Similarity",
        },
        {
          description:
            "The system will now automatically generate a risk score when there is no positive match during a KYC Screen",
        },
      ],
    },
    {
      title: "Solved bugs",
      list: [
        {
          description:
            "For the Dow Jones KYC section, under the Reporting Module, users can now see the missing flag icons when users click on the Nationality dropdown section",
        },
        {
          description: "Other minor bugs",
        },
      ],
    },
  ],
};

export const VERSION_1_2_0 = {
  title: "Version 1.2.0 has been released!",
  postedDate: "22/02/2022",
  features: [
    {
      title: "Enhancements",
      list: [
        {
          description:
            "Performance on key pages is improved for a better user experience.",
        },
      ],
    },
  ],
};
