### ShoppingList

Is what the name says. A simple shopping list.

### Requirements

* Maven
* Java 8
* MySQL

### Setup

* Clone the project from Github
* Create a DB
* Create the Spring Security tables for users and authorities

##Users

  <pre>create table users(
      username varchar_ignorecase(50) not null primary key,
      password varchar_ignorecase(50) not null,
      enabled boolean not null);</pre>

##authorities

  <pre>create table authorities (
      username varchar_ignorecase(50) not null,
      authority varchar_ignorecase(50) not null,
      constraint fk_authorities_users foreign key(username) references users(username));
      create unique index ix_auth_username on authorities (username,authority);</pre>

### Configuration

The application.properties contains all required properties for this project. 
You may change the `datasource-url`, `username` and `password`

### Run the Application
Simply navigate to the project directory and execute `mvn spring-boot:run` 