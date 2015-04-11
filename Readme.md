### ShoppingList

Is what the name says. A simple shopping list. 
The Frontend is an AngularJS-App and the Backend is a Spring Boot Application.

### Requirements

* Maven
* Java 8

### Setup

* Clone the project from Github
* Create a DB-Schema and a User with Read and Write Privileges
* Set the properties in src/main/resources/application.properties

## Properties

The application.properties contains all required properties for this project. 
You may change:
* spring.datasource.url
* spring.datasource.username
* spring.datasource.password


### Run the Application
Simply navigate to the project directory and execute `mvn spring-boot:run` 