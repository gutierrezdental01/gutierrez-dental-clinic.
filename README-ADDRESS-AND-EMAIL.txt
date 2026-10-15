GUTIERREZ DENTAL - ADDRESS AND MAPS UPDATE

Website: The Get Directions button uses the clinic Google Maps place link supplied by the clinic. No unverified Apartment 11 address is shown.

IMPORTANT: Google Apps Script patient emails are NOT controlled by this GitHub ZIP.
To correct those emails, open Apps Script > Receptionist.gs > sendPatientBookingEmail_(b).
Find these old lines in the message array:
  "Apartment 11 Acacia Street",
  "Calendola Village",
  "San Pedro City, Laguna",
Replace the address lines with:
  "Location: Gutierrez Dental Health Clinic, San Pedro, Laguna",
  "Google Maps: https://maps.google.com/maps/place//data=!4m2!3m1!1s0x3397d726549bd2bb:0x8f541fd394a085e9?entry=s",

Save the Apps Script project. For /dev testing saving is enough; to publish changes to /exec, use Deploy > Manage deployments > Edit > New version > Deploy.

This ZIP has no assets folder. Upload the extracted files to the root of your GitHub branch.
