# FYP - Personal Finance Management Application
Note: After setting up the environments, run PostgreSQL and ollama first, then the backend server, then finally the frontend

## Frontend
Note: An iOS or Android simulator is needed. Alternatively, using a mobile phone to scan the QR code after starting the project should also work (Expo Go will be downloaded).

1. Install Node.js
2. Download the folder
3. cd into frontend
4. Run the command 'npm install' to install the needed dependencies
5. Run the command 'npx expo start' to start the project
6. Depending on the IP, the variable API_URL in /frontend/services/api.js may have to be changed

## Backend
Note: Llama 3.2 is used as the LLM in the backend through the ollama library, so ollama has to be downloaded too. After downloading, run the command 'ollama pull llama3.2'.

1. Install python
2. Download the folder
3. cd into backend
4. Create a virtual environment and activate it
5. Run the command 'pip install -r ./requirements.txt'
6. Create a new folder and move the folders 'api' and 'backend_django', and the file 'manage.py' into it
7. cd into the new folder
8. The items in .../backend_django/settings.py may have to be changed (particularly the ALLOWED_HOSTS and DATABASES variable for the IP and database respectively)
9. Make sure PostgreSQL (refer to Database part) is running
10. Make sure ollama is running (refer to the Note)
11. Run the command 'python manage.py runserver 0.0.0.0:8000' to start the server

## Database
Note: PostgreSQL is used for the project but not uploaded.

1. Install PostgreSQL
2. Create a database
3. Modify the settings.py (refer to point 8 in the Backend part)
4. Run the command 'python manage.py makemigrations'
5. Run the command 'python manage.py migrate'
