# Car registration

**Functional requirements**
It must be possible to register a new car.

**Business rules**
It should not be possible to register a car with an existing license plate.
The car must be registered by default with availability.
The user responsible for the registration must be an administrator user.

# Car listing

**Functional requirements**
It should be possible to list all available cars.
It should be to possible to list all available cars by category name.
It should be to possible to list all available cars by brand name.
It should be to possible to list all available cars by car name.

**Business rules**
The user does not need to be logged into the system.

# Registration of specification in the car

**Functional requirements**
It should be possible to register a specification to a car.

**Business rules**
It should not be possible to enter a specification for a car that is not registered.
It should not be possible to register an existing specification for the same car.
The user responsible for the registration must be an administrator user.

# Car image registration

**Functional requirements**
It must be possible to register the car image.
It should be possible to list all cars.

**Non-functional requirements**
Use the multer to upload files.

**Business rules**
The user must be able to register more than one image for the same car.The user responsible for the registration must be an administrator user.

# Car rental

**Functional requirements**
It must be possible to register a rental.

**Business rules**
The rent must have a minimum duration of 24 hours.
It should not be possible to register a new rental if there is already an open one for the same user.
It should not be possible to register a new rental if there is already an open one for the same car.
The user must be logged in to the application.
When renting the car status must be updated to unavailable.

# Car return

**Functional requirements**
It must be possible to return the car.

**Business rules**
If the car is returned in less than 24 hours, it must be charged the full daily rate.
When making the return, the car must be released for another rental.
When making the return, the total rent must be calculated.
If the return time is longer than the scheduled delivery time, a fine will be charged proportional to the days of delay.
If there is a fine, it must be added to the total rent.
The user must be logged in to the application.

# User rent listing

**Functional requirements**
It must be possible to search all rentals for the user.

**Business rules**
The user must be logged in to the application.

# Password recovery

**Functional requirements**
It must be possible for the user to recover the password by entering the email.
The user should receive an email with the step-by-step instructions for password recovery.
User must be able to enter a new password.

**Business rules**
The user needs to enter a new password.
Link sent for recovery must expire in 3 hours.
