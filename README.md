## Banking Application

![Banking App Logo](bankingapp.png)

## Overview
The **Banking Application** is a full-stack web application designed to handle essential banking functions, such as user authentication, transactions between users, and account management. The backend is built using Spring Boot and MySQL, while the frontend is developed with React.

## Features
- User Authentication
- Crediting and debiting users
- Formulating a cash flow statement
- Transactions between users
- Email security notifications

# Banking Application Setup Guide

This guide will walk you through the steps to set up, install dependencies, and run the Banking Application using IntelliJ, MySQL, and React.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) (Ultimate or Community Edition)
- [MySQL](https://dev.mysql.com/downloads/installer/)
- [Node.js](https://nodejs.org/en/download/) (for React frontend)
- [Maven](https://maven.apache.org/install.html) (Optional, if not bundled with IntelliJ)

---

## Step 1: Install and Configure MySQL

1. **Install MySQL**:
    - Download and install MySQL from the [official website](https://dev.mysql.com/downloads/installer/).
    - During the installation, set the root password and make sure you install MySQL Workbench (optional).
  
2. **Create a Database**:
    - Open MySQL Workbench or the MySQL CLI.
    - Create a new database for your Banking Application. Run the following command:
      ```sql
      CREATE DATABASE banking_app;
      ```
  
3. **Configure MySQL to Run on Port 8000**:
    - In your MySQL configuration file (typically `my.ini` or `my.cnf`), find the `[mysqld]` section and change the `port` value to `8000`:
      ```ini
      [mysqld]
      port=8000
      ```
    - Restart your MySQL service for changes to take effect.

4. **Create a User and Grant Privileges**:
    - Run the following SQL to create a new user and grant privileges:
      ```sql
      CREATE USER 'banking_user'@'localhost' IDENTIFIED BY 'password';
      GRANT ALL PRIVILEGES ON banking_app.* TO 'banking_user'@'localhost';
      FLUSH PRIVILEGES;
      ```

---

## Step 2: Set Up the Backend in IntelliJ

1. **Clone the Banking Application Repository**:
    - Open IntelliJ IDEA.
    - Navigate to `File -> New -> Project from Version Control` and clone the Banking Application repository from GitHub.
      ```bash
      git clone https://github.com/your-username/Banking_Application.git
      ```

2. **Install Dependencies (Maven)**:
    - Open the `pom.xml` file from the root of your project in IntelliJ.
    - Click on the **Load Maven Changes** button that appears, or right-click on `pom.xml` and select `Maven -> Reload Project`.
    - This will install all required dependencies defined in the `pom.xml` file.

3. **Configure `application.properties`**:
    - Open the `src/main/resources/application.properties` file and configure the database settings as follows:
      ```properties
      spring.datasource.url=jdbc:mysql://localhost:8000/banking_app
      spring.datasource.username=banking_user
      spring.datasource.password=password
      spring.jpa.hibernate.ddl-auto=update
      ```

4. **Run the Application**:
    - Right-click the `BankingApplication` class in the `src/main/java/com/yourapp` package and select `Run 'BankingApplication'`.
    - The backend should now be running on `http://localhost:8080`.

---

## Step 3: Set Up the Frontend (React)

1. **Install Node.js**:
    - Download and install [Node.js](https://nodejs.org/en/download/).
    - Verify the installation by running the following commands in your terminal:
      ```bash
      node -v
      npm -v
      ```

2. **Navigate to the Frontend Folder**:
    - In your terminal, navigate to the `frontend` directory of the Banking Application:
      ```bash
      cd Banking_Application/frontend
      ```

3. **Install Frontend Dependencies**:
    - Run the following command to install all required dependencies for the React frontend:
      ```bash
      npm install
      ```

4. **Run the React Frontend**:
    - Start the React frontend by running:
      ```bash
      npm start
      ```
    - The React app should now be running on `http://localhost:3000`.

---

## Step 4: Testing and Using the Application

### Running the Backend and Frontend Together

- Make sure the backend is running on `http://localhost:8080` and the frontend on `http://localhost:3000`.
- Navigate to `http://localhost:3000` in your browser to use the Banking Application.
- When you log in or perform any actions, the React frontend will communicate with the Spring Boot backend.

### Common Issues and Fixes
- **Port Conflicts**: Ensure no other services are running on ports 8000 (MySQL), 8080 (backend), or 3000 (frontend).
- **Database Connection Errors**: Double-check your MySQL credentials in `application.properties`.

---

## Step 5: Building for Production (Optional)

If you're ready to deploy the application, follow these steps to build both the backend and frontend for production.

1. **Build the Backend (Maven)**:
    - Run the following Maven command to package the backend:
      ```bash
      mvn clean install
      ```

2. **Build the Frontend (React)**:
    - In the `frontend` directory, run:
      ```bash
      npm run build
      ```

    This will create a `build/` folder with the optimized React app ready for deployment.

---

## Conclusion

You have successfully set up the **Banking Application** using IntelliJ, MySQL, and React. You can now develop, test, and deploy your application.

For any issues, refer to the documentation or seek help from the community.


