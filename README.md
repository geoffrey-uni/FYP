# FYP

## Frontend
Note: An iOS or Android simulator is needed. Alternatively, using a mobile phone to scan the QR code after starting the project should also work (Expo Go will be downloaded).

1. Install Node.js
2. Download the folder
3. cd into frontend
4. Run the command 'npm install' to install the needed dependencies
5. Run the command 'npx expo start' to start the project

## Backend
Note: Llama 3.2 is used as the LLM in the backend through the ollama library, so ollama has to be downloaded too. After downloading, run the command 'ollama pull llama3.2'.

1. Install python
2. Download the folder
3. cd into backend
4. Create a virtual environment and activate it
5. Run the command 'pip install -r ./requirements.txt'
6. cd into backend_django
7. Run the command 'python manage.py runserver 0.0.0.0:8000' to start the server

## Database
Note: PostgreSQL is used for the project but not uploaded.

1. Install PostgreSQL
2. After running the backend server once, stop it
3. Run the command 'python manage.py makemigrations'
4. Run the command 'python manage.py migrate'
