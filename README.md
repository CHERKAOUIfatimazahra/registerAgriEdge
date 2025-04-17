# AgriEdge Registration Management System
## 🛠 Technical Stack

- **Frontend Framework**: React.js
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Styling**: TailwindCSS
- **PDF Generation**: jsPDF with AutoTable
- **CSV Export**: react-csv
- **State Management**: React Context API
- **Notifications**: React-Toastify

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/registerAgriEdge.git
```

2. Install dependencies:
```bash
cd registerAgriEdge
npm install
```

3. Configure environment variables:
Create a `.env` file with your Firebase configuration:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

## 📱 Usage

1. **Authentication**: Log in using admin credentials
2. **View Registrations**: Access the main dashboard to view all registrations
3. **Search & Filter**: Use the search bar to filter registrations
4. **Sort Data**: Click on column headers to sort data
5. **Export Data**: Use PDF or CSV export buttons for data extraction
6. **Pagination**: Navigate through pages of registration data

## 🔐 Security Considerations

- Implemented secure authentication flow
- Protected API endpoints
- Secure data transmission
- Role-based access control
- Environment variable protection