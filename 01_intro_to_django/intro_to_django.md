# Intro to Django

**Duration: 120 minutes**

## Learning Objectives

- Understand the benefits of using Django
- Understand how Django's architecture relates to MVC
- Set up a basic Django project, with models, an an admin area, and a front-end

## Introduction

Django markets itself as the "web framework for perfectionists with deadlines." Initially developed in the fast-moving world of the newsroom, it allows anyone with knowledge of Python and HTML to build basic applications and APIs very quickly.

Today, we're going to learn about some of Django's killer features, and hopefully you'll see why it's in heavily used across many different sectors.

This tutorial leans heavily on the official [Django Tutorial](https://docs.djangoproject.com/en/2.1/#first-steps). Django's documentation is excellent, and if you want to learn more, it should be your first resource.

### The brief

We're going to make an application that has two models, where one has a foreign key to the other.

#### Record Store
The owner of a Record Store wants an app which will help to keep on top of the store inventory. This is not an app that customers will see, but will be used to check stock levels and see what needs to be ordered soon.

You should be able to add stock, which would have an Artist and Album as well as the quantity available.

### Initial setup

In order to get our application up and running, there are a few steps to follow.

```bash
mkdir record_shop
cd record_shop

python -m venv .env
source .env/bin/activate

pip3 install django
python -m django --version
```

If you're successful, you'll see the latest version of Django displayed. (`3.0` at the time of writing.)

Now that we've set up our environment, our next job is to set up our project.

### Projects and apps

Django has the concept of _projects_ and _apps_.

A **Project** could be a single site. An **app** would contain the individual pieces of functionality that make up the project.

In this case, our project will be the Record Store, and our first app will be `inventory`. We might have other apps for events, contact forms, and any number of other things. Each app is - in theory - self contained and therefore portable between projects.

Let's start our project off.

```bash
django-admin startproject record_store
cd record_store
python manage.py startapp inventory
python manage.py runserver
```

We should also add our inventory app to the INSTALLED_APPS setting.

```python
# record_store/settings.py

INSTALLED_APPS = [
    'inventory',
    # ...
]
```

Great - we've started our project, added an app, and we should see something at our [homepage](http://localhost:8000/) now!

### Models

Let's start working where all great applications start - with the model!

We're going to create two models - one for `Artist`, and one for `Album`.

They're going to look like this:

**Artist**

    - id (Primary Key)
    - name (String)

**Album**

    - id (Primary Key)
    - title (String)
    - year (Integer)
    - stock_level (Integer)
    - artist_id (Foreign Key)

Firstly, let's `ctrl-c` to stop our Django app for the moment.

Before we go any further, let's make sure that Django's default database stuff is ready to go.

```
python manage.py migrate
```

So before we write any code at all, really, we're going to see killer feature number 1: Django allows for test-driven development, even when databases are involved.

We can write tests expecting that instances of models are created, and that they are saved to the database. Django creates a copy of the new database in memory, so your production data is untouched.

Let's start by opening `inventory/tests.py`. We're going to create a test to make sure we can save a new Artist.

```python
# inventory/tests.py

from django.test import TestCase
from inventory.models import *

class AlbumTestCase(TestCase):
    def setUp(self):
        self.artist1 = Artist.objects.create(name = "Bucks Fizz")
        self.album1 = Album.objects.create(title = "Makin' Your Mind Up", year = 1989, stock_level=10, artist = self.artist1)

    def test_artist_saved(self):
        self.assertGreater(self.artist1.pk, 0)

    def test_album_saved(self):
        self.assertGreater(self.album1.pk, 0)

    def test_album_fk(self):
        self.assertEqual(self.album1.artist.pk, self.artist1.pk)
```

Next, we can write our model code:

```python
# inventory/models.py

from django.db import models

class Artist(models.Model):
    name = models.CharField(max_length=255)

class Album(models.Model):
    title = models.CharField(max_length=255)
    year = models.IntegerField()
    stock_level = models.IntegerField()
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
```

Unlike other languages, it's not unusual to put more than one class in a file.

In our terminal, we need to create a _migration_ for our new models - this maps our models to a SQL file that Django can run. It means that we can keep our database changes under version control!

```bash
python manage.py makemigrations inventory
python manage.py migrate
```

And finally, let's make sure our tests pass:

```
python manage.py test
```

### Model API

OK! So we can see from our tests that we can create objects, and pass them in to other objects so that they can be stored as foreign keys.

Since this is happening in our tests, the data is stored in a test database (in memory) and deleted each time the test runs finish. This is a huge benefit for us! But let's store some data for real.

Since each of our model classes inherit from `models.Model`, we get a _load_ of functionality with them, out of the box. Let's play about with it.

By default, Django will use the SQLite database engine, which is great for development purposes. When we want to switch to production, we can easily switch to PostgreSQL, MySQL, or Oracle without changing any of our code. Win!

To open up a Django shell:

```bash
python manage.py shell
```

First we need to import our models to use:

```python
# shell

from inventory.models import *
```

Let's create a new artist object:

```python
# shell

artist1 = Artist(name="Take That")
```

And let's save it to the database:

```python
# shell

artist1.save()
```

We should now have a `pk` - primary key - instance variable on `artist1`. Let's inspect the object:

```python
# shell

artist1.pk
```

We've got a primary key now, looks like it's been saved properly!

> Task: Create a few more artists

```python
# shell

artist2 = Artist(name="Justin Bieber")
artist2.save()

artist3 = Artist(name="Toto")
artist3.save()
```

So we can very easily add items to the database. How do we get them back?

```python
# shell

artists = Artist.objects.all()
artists
```

So `artists` contains a `QuerySet` object. These are like very efficient lists - they don't actually hit the database until we do something with them, for example slice them, or loop over them. If we want to get the first item back, we can just slice the `QuerySet` like a list.

```python
# shell

artists[0]
artists[0].name
artists[0].pk
```

The Django ORM also supports ordering:

```python
# shell

artists_by_name = Artist.objects.order_by("name")
```

Filtering:

```python
# shell

Artist.objects.filter(name__startswith="T")
```

...And many other operations. See the [QuerySet documentation](https://docs.djangoproject.com/en/2.1/ref/models/querysets/) for more details.

Let's go ahead and add an album object.

```python
# shell

album1 = Album(title="Take That And Party", year=1992, stock_level=10, artist=artist1)
album1.save()

album2 = Album(title="Everything Changes", year=1995, stock_level=5, artist=artist1)
album2.save()
```

Just like saving an artist, except we can pass in an instance of an artist for the foreign key.

If we want to get all albums back, it's easy:

```python
# shell

all_albums = Album.objects.all()
```

If we want to get back all albums by Take That, then we can use `filter`:

```python
# shell

take_that_albums = Album.objects.filter(artist__name="Take That")
```

Now that we've seen how easy Django's models are to use, let's look at Django's killer feature: its admin area.

### Setting up the Admin Area

To activate the admin area, let's exit the Django shell (`ctrl-d`) and run:

```
python manage.py createsuperuser
```

This will let us sign in to the admin site in a moment.

Next, we need to register our models so that the admin area can "see" them.

```python
# inventory/admin.py

from django.contrib import admin
from inventory.models import *

admin.site.register(Artist)
admin.site.register(Album)
```

Let's start our server again:

```
python manage.py runserver
```

Go to [the admin area - http://localhost:8000/admin/](http://localhost:8000/admin/) and log in with the details you created previously.

> Instructor note - demo the admin area.

One problem - our models should implement `__str__()` so that the admin area is more usable.

```python
# inventory/models.py

class Artist(models.Model):
    name = models.CharField(max_length=255)

    # ADDED
    def __str__(self):
        return self.name
```

> TASK: Repeat the job for Albums.

```python
# inventory/models.py

    # Added
    def __str__(self):
        return self.title
```

At this point, by writing a couple of classes, and doing some configuration, we've met the MVP of the app we were looking to build. Let's continue, and build a basic front-end for our site. Before we do, though, we should think about the architecture of a Django app.

### Architecture

To make sense of Django, you should be familiar with the [model-view-controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) architectural pattern. Let's recap.

**Model** - The model represents the brains of your application - the business logic, and the domain information that you need to work with.
**View** - The view is usually considered to be the part of the application that the user interacts with. This is normally represented in your apps by HTML, CSS, and JavaScript.
**Controller** - The controller usually handles application routing, pulls data from models, and passes it to the view to be displayed.

The architecture of a Django app will be broadly similar, but there are some key differences to understand. This is such a key point that it is addressed in the [Django FAQ](https://docs.djangoproject.com/en/2.1/faq/general/#django-appears-to-be-a-mvc-framework-but-you-call-the-controller-the-view-and-the-view-the-template-how-come-you-don-t-use-the-standard-names).

Django has the following layers that broadly map to the above:

**Model** - these function as they normally would.
**View** - these are pieces of back-end code that dictate _what_ the user should see
**Controller** - this is considered to be Django itself, along with the developer's specified routing - it routes requests through to the relevant view.
**Template** - we're still using HTML and CSS as usual!

With this in mind, let's look at building a front-end for our app.

## Front-end

In order to configure our front end, we need to carry out a few initial steps.

Firstly, let's tell our Django project that our app wants to set up some views. Our URLs for this app will live at /inventory:

```python
# record_store/urls.py

from django.contrib import admin

# CHANGED
from django.urls import include, path

urlpatterns = [
    # ADDED
    path('inventory/', include('inventory.urls')),
    path('admin/', admin.site.urls),
]
```

Next up, we need to create a the `inventory.urls` package.

```bash
touch inventory/urls.py
```

This file will contain all the URLs that the inventory app will use.

```python
# inventory/urls.py

from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name='index'),
]
```

The `path` function takes three arguments, and it's important that you understand them. The first is the route - an empty string specifies that we will respond to requests at `/`, relative to the parent route - `/inventory`. The second argument is the name of the function that will be called, and the third argument is the _name_ of the route - which is useful for creating links later on.

Finally, for now, let's amend our views module to add the function we've specified.

```python
# inventory/views.py

from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello World! Inventory index!")
```

If we visit http://localhost:8000/inventory, we should see our message.

Let's finish off by using HTML templates within our app.

### Templates

Firstly, we need to tell Django where to look for templates. We're going to have a `templates` folder in the root of our project, so let's tell it to look there.

```python
# record_store/settings.py

TEMPLATES = [
    {
        # ...
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        # ...
    },
]
```

OK! And in the root of our project, let's create a `templates` directory. We'll also create a base template, and an inventory folder to work from:

```bash
mkdir templates
mkdir templates/inventory
touch templates/base.html
touch templates/inventory/index.html
```

### Django Template Syntax

We can use standard HTML output here, with a couple of Django-specific additions.

The Django template syntax is the same as we used for Flask.

If we want to execute a piece of logic, we can use `{% statement %}` syntax:

For example:

```
{% for artist in artists %}
    ...
{% endfor %}
```

If we want to print a variable, we can use double-curly-bracket syntax, like this:

```
{% for artist in artists %}
    {{ artist.name }}
{% endfor %}
```

Before we write our templates, can also look at another powerful Django feature we have seen before, template inheritance.

Template inheritance allows us to provide a base "skeleton" - a parent template - that defines the structure of our site. We would then use child template that override areas of the template that are relevant for any given view.

Let's see it in action:

In `base.html`:

```html
<!-- base.html -->

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>Record Store</title>
</head>
<body>
	{% block content %}

    {% endblock %}
</body>
</html>
```

In `templates/inventory/index.html`, we'll extend the base template - take it's structure - but override the content block.

```html
<!-- templates/inventory/index.html -->

{% extends "base.html" %}

{% block content %}
	<p>Hello from inventory index!</p>
{% endblock %}
```

The last piece of the puzzle is to change our view so that it uses our new template:

```python
# inventory/views.py

from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return render(request, "inventory/index.html")
```

Let's grab all of our artists from the database and display them in the view:

```python
# inventory/views.py

# Added
from inventory.models import *

def index(request):
    # added
    artists = Artist.objects.all()

    # changed
    return render(request, "inventory/index.html", locals())
```

The third argument to `render` would usually be a dictionary of keys and values to pass to the template, but `locals()` is a convenient shortcut that grabs all local variables and puts them in a dictionary for us.

Now, let's change our view so that we're using the artist information pulled from the database.

```html
<!-- templates/inventory/index.html -->

{% extends "base.html" %}

{% block content %}
	{% for artist in artists %}
		<h2>{{ artist.name }}</h2>

		<ul>
			{% for album in artist.album_set.all %}
				<li>{{ album.title }} - {{ album.year }}</li>
			{% endfor %}
		</ul>
	{% endfor %}
{% endblock %}
```

At this point, we would continue to build out our front end as required.

## Summary

Django offers many features that we haven't touched on here. In particular, we can configure the admin interface to a much greater degree. But Django also includes these features amongst others:

- `ModelForm`s - Django can automatically create forms to create and edit your models classes
- Authentication - Django includes a sophisticated authentication system to manage both front-end and admin area users
- Syndication - Django can easily build RSS feeds around your data
- Caching, and compression for performance
- Advanced testing strategies, including mocking requests
