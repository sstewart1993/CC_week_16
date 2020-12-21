# Deploying Java Spring app to Heroku. 


### Set up heroku app. 

Log into heroku and create a new app. 

Under resources > Add ons search for Heroku Postgres and add it as a new resource. 

### Set up Postgres in Java Application

Remove any reference to h2 database in the Java projects pom.xml and replace with the following

```xml
<!-- Pom.xml -->
<dependency>
	<groupId>org.postgresql</groupId>
	<artifactId>postgresql</artifactId>
</dependency>

```

Change the application.properties file to following:


```
spring.datasource.driverClassName=org.postgresql.Driver
spring.datasource.maxActive=10
spring.datasource.maxIdle=5
spring.datasource.minIdle=2
spring.datasource.initialSize=5
spring.datasource.removeAbandoned=true
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.properties.hibernate.enable_lazy_load_no_trans=true
server.servlet.context-path=/api
```



### Set up link to Heroku via git

```bash
heroku login

git init

git add .

git commit -m "Initial Commit"

heroku git:remote -a <your-app-name> 
```


### Deploy!

```bash
git push heroku master
```