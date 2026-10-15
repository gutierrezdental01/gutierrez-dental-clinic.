GUTIERREZ DENTAL HEALTH CLINIC - GITHUB PAGES RELEASE

1. Create a PUBLIC GitHub repository (e.g. gutierrez-dental-clinic).
2. Extract this ZIP, upload the FILES AND FOLDERS inside it (not the ZIP itself) to repository ROOT.
3. Add your 3 photos to assets/ with EXACT filenames:
   gutierrez-logo.jpg
   dr-ronald.jpg
   dr-sean.jpg
4. Settings > Pages > Deploy from branch > main > / (root) > Save.
5. Follow APPS-SCRIPT-NEXT-STEP.txt and deploy a NEW VERSION of your existing Google Apps Script.
6. Check website on phone. Test blocked and available times.

CURRENT LIMITATIONS:
- Patient can see read-only calendar availability AFTER Apps Script JSONP adapter is deployed.
- Booking form PREPARES an email using the patient's own mail app; it does not automatically submit or reserve a slot.
- Receptionist approval, temporary holds, automated email notifications, secure HMO uploads are NOT implemented.
- Do not advertise automated booking until these are built and tested.
- HMO logos are cropped from user-supplied provider posters, not independently verified official HD logos.
- Verify HMO partner activation/coverage before presenting any as confirmed accredited providers.
- Keep Google Calendar private. Do not put passwords, API secrets, or patient documents in GitHub.

UPDATE: HMO directory uses colorful text-only cards, no HMO image assets required.
