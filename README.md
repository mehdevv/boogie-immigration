# MultiCampus Group Website

## Overview
A modern website for MultiCampus Group with Firebase backend integration for dynamic content management.

## Features
- **Frontend**: Modern, responsive website with Bootstrap 5
- **Backend**: Firebase Firestore for data management
- **Admin Panel**: Secure admin interface for content management
- **Dynamic Content**: Packages and visa images loaded from Firebase
- **Contact Forms**: Integrated contact and booking forms

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Enable Firestore Database

### 2. Configure Firebase
1. Go to Project Settings
2. Add a web app to your project
3. Copy the Firebase config object
4. Replace the placeholder config in `firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Set Up Firestore Rules
In Firebase Console > Firestore Database > Rules, set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to packages and visas
    match /packages/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    match /visas/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Admin collection - only admins can read/write
    match /admins/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == document;
    }
  }
}
```

### 4. Image Management
The system uses image URLs instead of file uploads for better flexibility:
- Copy image URLs from any hosting service (Google Drive, Imgur, etc.)
- Paste the direct image URL in the admin panel
- No need to set up Firebase Storage rules
- Faster and more reliable image loading

### 5. Create Admin User
1. In Firebase Console > Authentication, add a new user with email/password
2. In Firestore, create a document in the `admins` collection:
   - Document ID: The user's UID (from Authentication)
   - Fields: `email` (string), `role` (string) = "admin"

## Admin Panel Access
- **URL**: `/admin/login.html`
- **Hidden Link**: Invisible link in footer (for security)
- **Features**:
  - Manage package cards (add, edit, delete)
  - Manage visa images (add, edit, delete)
  - Add image URLs for packages and visas
  - Real-time content updates

## File Structure
```
├── index.html              # Main homepage
├── about.html              # About page
├── service.html            # Services page
├── contact.html            # Contact page
├── firebase-config.js      # Firebase configuration
├── admin/
│   ├── login.html          # Admin login
│   ├── dashboard.html      # Admin dashboard
│   └── dashboard.js        # Dashboard functionality
├── js/
│   ├── main.js             # Main website JavaScript
│   └── firebase-integration.js # Firebase integration
├── css/                    # Stylesheets
├── img/                    # Images
└── lib/                    # Third-party libraries
```

## Usage

### For Website Visitors
- Browse packages and services
- View visa success gallery
- Contact through forms
- Book services online

### For Administrators
1. Access admin panel via `/admin/login.html`
2. Login with admin credentials
3. Manage content:
   - **Packages**: Add/edit/delete package cards with images and details
   - **Visas**: Add/edit/delete visa success images
4. All changes are reflected immediately on the website

## Security Features
- Admin authentication required for content management
- Firestore security rules prevent unauthorized access
- Admin users stored in separate collection
- URL validation for image links

## Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Libraries**: jQuery, Owl Carousel, WOW.js, Font Awesome

## Deployment
1. Upload all files to your web server
2. Configure Firebase as described above
3. Test admin panel functionality
4. Add initial content through admin panel

## Support
For technical support or questions, contact the development team. 