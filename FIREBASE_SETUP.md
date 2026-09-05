# Nur AI High School (ኑር AI ሁለተኛ ደረጃ ትምህርት ቤት) - Firebase Configuration

This application integrates Firebase Firestore and Firebase Authentication to provide seamless cloud sync for:
- Student user profiles and grade levels (9-12)
- Teacher profiles with classroom analytics
- Topic completion progress tracking
- Quiz and exam results history
- AI Tutor review reports and certificates

## Environment Configuration
The application automatically reads configuration from `firebase-applet-config.json` or `.env`.

\`\`\`json
{
  "projectId": "ai-studio-912-60302678-31e7-4540-9362-cceeccf0c875"
}
\`\`\`

## Security Rules
Firestore rules (`firestore.rules`) enforce:
- Authenticated students can read and write their own profile and progress records.
- Teachers (`role == 'teacher'`) can view student progress and quiz performance for classroom monitoring.
- Protected access prevents deletion of user records.
