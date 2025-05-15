# Long-Term Care Needs Assessment Application

This full-stack application is designed to collect demographic, health, and financial information to predict a person's long-term care needs and associated costs using a machine learning model. The application features a modern React frontend with a Node.js/Express backend and SQLite database for data persistence.

## Project Structure

```
.
├── client/                     # Frontend React application
│   ├── public/                 # Static assets
│   │   ├── index.html          # HTML template
│   │   └── manifest.json       # Web app manifest
│   └── src/                    # Source code
│       ├── App.jsx             # Main application component
│       ├── index.jsx           # Application entry point
│       ├── index.css           # Global styles with Tailwind imports
│       └── types.ts            # TypeScript type definitions
│
└── server/                     # Backend Node.js/Express application
    ├── src/                    # Source code
    │   ├── index.ts            # Main server entry point
    │   └── reset-database.ts   # Database reset utility
    ├── package.json            # Server dependencies
    └── tsconfig.json           # TypeScript configuration
```

## Technical Implementation

### Frontend (React + Tailwind CSS)

The client-side application uses React with a modular component structure and Tailwind CSS for styling.

#### Key Files:

1. **App.jsx**: The core application component that implements:
   - Form state management using React hooks (`useState`)
   - Form validation for required fields
   - API integration with the backend
   - Conditional rendering for different views (form, submission confirmation, responses list)
   - Responsive layout design using Tailwind CSS

2. **index.jsx**: Application bootstrap file that renders the App component into the DOM

3. **index.css**: Imports Tailwind's utility classes

#### Key Components and Their Functionality:

1. **Form Component**:
   - Collects comprehensive user data across three sections:
     - Demographic information (name, age, gender, marital status, education, living arrangements)
     - Financial information (income, savings, retirement plans)
     - Health information (self-assessment, chronic conditions, daily assistance needs, family history)
   - Implements form validation to ensure data quality
   - Styled with Tailwind CSS for a responsive, modern UI
   - Manages complex form state with React hooks

2. **Response Confirmation**:
   - Displays a confirmation after successful form submission
   - Shows a detailed summary of the submitted information
   - Provides options to submit another response or view all responses

3. **Responses Viewer**:
   - Fetches and displays all submitted responses from the database
   - Presents data in an organized, readable format
   - Implements loading states for better user experience
   - Allows navigation back to the form

### Backend (Node.js + Express + SQLite)

The server-side application provides a RESTful API for the frontend and manages data persistence with SQLite.

#### Key Files:

1. **index.ts**: The main server application that implements:
   - Express server configuration with CORS support
   - SQLite database integration
   - RESTful API endpoints for data operations
   - Database initialization and schema creation

2. **reset-database.ts**: Utility script to reset the database schema when needed

#### Key Features:

1. **RESTful API Endpoints**:
   - `POST /responses`: Accepts and stores form submissions with validation
   - `GET /responses`: Retrieves all stored responses

2. **Database Integration**:
   - Uses SQLite for lightweight, file-based data storage
   - Implements a schema optimized for the assessment data
   - Handles data validation and error management

## Implementation Details

### State Management

The application uses React's built-in state management with hooks to handle:

1. **Form Data**: Tracks all user inputs across multiple form fields
2. **Validation State**: Manages error messages for invalid inputs
3. **Application State**: Controls which view to display (form, confirmation, or responses)
4. **API Integration State**: Handles loading states and API responses

### Data Flow

1. User completes the assessment form
2. Client-side validation checks the data for completeness and format
3. Data is sent to the server via a POST request
4. Server validates the data and stores it in the SQLite database
5. Success response triggers the confirmation view
6. User can view all responses with a GET request to retrieve past submissions

### Form Validation

The application implements several validation strategies:

1. **Required Fields**: Ensures critical data like name, age, and gender are provided
2. **Data Type Validation**: Checks that numeric fields contain valid numbers
3. **Format Validation**: Verifies data is in the expected format
4. **Error Feedback**: Provides clear error messages to guide users

### Styling and UI/UX

The application uses Tailwind CSS for a responsive, modern design:

1. **Responsive Layout**: Adapts to different screen sizes using Tailwind's responsive utilities
2. **Card-Based Design**: Organizes content into clear, separated sections
3. **Accessible Forms**: Implements proper labeling and focus states
4. **Visual Hierarchy**: Uses typography and spacing to guide user attention
5. **Form Organization**: Groups related fields into logical sections

### Database Schema

The SQLite database uses a schema designed to capture all necessary assessment data:

```sql
CREATE TABLE responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT,
  marital_status TEXT,
  education_level TEXT,
  annual_income TEXT,
  savings TEXT,
  health_rating TEXT,
  chronic_conditions TEXT,
  adl_assistance TEXT,
  living_arrangement TEXT,
  retirement_plan TEXT,
  family_history TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Setup and Running the Application

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Reset the database (if needed):
   ```
   npx ts-node src/reset-database.ts
   ```

4. Start the server:
   ```
   npx nodemon src/index.ts
   ```

The server will run on http://localhost:3001

### Frontend Setup

1. In a new terminal, navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The application will open in your browser at http://localhost:3000

## Machine Learning Integration

While this application focuses on data collection, the collected data is designed to feed into a machine learning model that would:

1. Analyze demographic patterns in long-term care needs
2. Correlate financial status with care affordability
3. Use health indicators to predict future care requirements
4. Calculate estimated costs based on all factors

This structured data collection ensures the ML model has high-quality, consistent inputs for accurate predictions. 