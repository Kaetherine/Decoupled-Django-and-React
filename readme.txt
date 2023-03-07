Project Set Up Ipsum & Dolor on Windows 11

1. make sure you have javascript, python and pip installed
2. install django and django rest framework and react-router-dom

python -m pip install Django
pip install djangorestframework
npm install react-router-dom@6
python -m pip install django-cors-headers

3. cd into directory Project_Ipsum_and_dolor/APIProject and start the server

python manage.py runserver

4. cd into directory Project_Ipsum_and_dolor/mysite_react in a new terminal and start the server
npm run dev

5. go to http://localhost:5173/ to the frontend
6. got to http://localhost:8000/api/articles/ to see the django rest api



optional: create user account

7. cd into directory Project_Ipsum_and_dolor/APIProject in a new terminal and run the following command
python manage.py createsuperuser

8. follow the instructions to make your own user account

9. got to http://localhost:8000/admin and log yourself in


