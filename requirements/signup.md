# Signup

> ## Sucess Cases

1. ✅ Receives **POST** request on **/api/signup**
2. ✅ Validates all the mandatory fields **name**, **email**, **password** and **passwordConfirmation**
3. ✅ Validates if the **password** and **passwordConfirmation** are the same
4. ✅ Validates if the **email** is valid
5. ❌ **Validates** if the email already exists
6. ✅ Create an **encrypted** password
7. ✅ **Creates** an user account with all the data provided, **replacing** the password for the encrypted one
8. ❌ Generates an **accessToken** with the user's id
9. ❌ **Updates** the user data with the generated token
10. ❌ Returns **200** with the accessToken and the user's name

> ## Exceptions

1. ✅ Returns error **404** if API doesn't exist
2. ✅ Returns error **400** if name, email, password or passwordConfirmation are not provided
3. ✅ Returns error **400** if password e passwordConfirmation aren't the same
4. ✅ Returns error **400** if email is not valid
5. ✅ Returns error **403** if the email already exists
6. ✅ Returns error **500** there is an error creating the encrypted password
7. ✅ Returns error **500** there is an error creating the user account
8. ✅ Returns error **500** there is an error genrating the token
9. ✅ Returns error **500** there is an error updating the user with the generated token
