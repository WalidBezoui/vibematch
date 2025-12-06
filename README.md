# Project Title

This is a Next.js project bootstrapped with `create-next-app`. It's a well-structured application ready for team collaboration, featuring a full suite of tools for development, testing, and deployment.

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd <project-directory>
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

## Environment Variables

This project uses environment variables to manage sensitive information and configuration.

1.  Create a `.env.local` file by copying the example file:
    ```bash
    cp .env.example .env.local
    ```
2.  Open `.env.local` and fill in the required values. These are secret keys and should not be committed to Git.

## Available Scripts

In the project directory, you can run the following commands:

### `npm run dev`

Runs the app in development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `.next` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run start`

Starts a Next.js production server.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run test:e2e`

Runs the end-to-end tests using Playwright.

### `npm run test:rules`

Runs the Firestore security rules tests.

## Git Workflow

We use a feature-branching workflow. Please create a new branch for each feature or bugfix you work on.

1.  Create a new branch:
    ```bash
    git checkout -b feature/your-feature-name
    ```
2.  Once your work is complete, push your branch and open a Pull Request for review.
