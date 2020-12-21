# Deploying React App to Firebase. 


### Set up Firebase project. 

Log into Firebase and create a new project. 

### Change React app to use Heroku back end

- Remove proxy from package.json file. 

- In the request file set up a base url pointing to your Heroku back end url. (i.e.: https://allyspirates.herokuapp.com/api/pirates)

```js

class Request {

    constructor(){
        this.baseUrl = "https://allyspirates.herokuapp.com/api/pirates"
    }
}

```

- Change each fetch to concatonate base url and relative path something like 

```js
fetch(baseUrl + url)
```

### Set up Firebase

```bash
firebase login

firebase init

Select Hosting

Select use an existing project (choose your new project)

Choose `build` as the public directory

Configure as a single-page app (rewrite all urls to /index.html)? `Yes`

Set up automatic builds and deploys with GitHub? `No`

(If it asks to Overwrite any files say `No`)

```

### Create a production build

```bash
npm run build
```

### Deploy!

```bash
git push heroku master
```