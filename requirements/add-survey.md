# Create Survey

> ## Sucess Cases

1. ✅ Receives a **POST** request on route **/api/surveys**
2. ✅ Checks if the request was made by an **admin**
3. ✅ Validates mandatory data for **question** and **answers**
4. ✅ **Creates** a survey with the provided data
5. ✅ Returns **204**, without data

> ## Exceptions

1. ✅ Returns error **404** if API doesn't exist
2. ✅ Returns error **403** if the user is not an admin
3. ✅ Returns error **400** if the question and answers are not provided by the user
4. ✅ Returns error **500** if an error occurs creating the survey
