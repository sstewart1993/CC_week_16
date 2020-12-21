# Deploying Python Flask app to Heroku. 


### Set up heroku app. 

Log into heroku and create a new app. 

Under resources > Add ons search for Heroku Postgres and add it as a new resource. 

### Set up virtual environment

in terminal at root of application run the following commands:

```bash
python3 -m venv .env

source .env/bin.activate
```

### Install dependencies

```bash
pip3 install flask
pip3 install gunicorn
pip3 install psycopg2
pip3 install psycopg2-binary
```

### Set up requirements and Procfile

```bash
pip3 freeze > requirements.txt

touch Procfile
```

```python
# Procfile

web: gunicorn app:app
```

### Set up link to Heroku via git

```bash
heroku login

git init

git add .

git commit -m "Initial Commit"

heroku git:remote -a <your-app-name> 
```

### Update sql_run.py

Change sql_run.py to connect to heroku database.

```python
import os # ADDED
import psycopg2  
import psycopg2.extras as ext

DATABASE_URL = os.environ['DATABASE_URL'] # ADDED

def run_sql(sql, values = None):
    conn = None
    results = []
    
    try:
        conn=psycopg2.connect(DATABASE_URL, sslmode='require') # MODIFIED
```

### Set up database

Either push a local database up to Heroku

```bash
heroku pg:push <your_local_db>  DATABASE_URL  --app <your-app-name>

```

Or do it manually:

```bash
 heroku pg:psql DATABASE_URL
```

Copy and paste from your SQL file into terminal to create tables.

### Deploy!

```bash
git push heroku master
```