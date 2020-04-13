# Sassies-Soulkitchen

Sassies-Soulkitchen is an online webshop for a local Surinam restaurant.\
People can order food from the website and it will be deliverd to the given adres.

The webite is built with Python Django. A simple online template was used for front-end.\
The javascript mainly takes care of the ordering logic like, adding to shopping cart.\
Stripe is used for payments.\
There is currently a beta version running at: https://sassies-soulkitchen.herokuapp.com/. 

## How to use this repo
Download the files by clicking the ```Clone or download``` button.\
You can freely mess around or improve the code.\
When you have some contributions to the files you can make a pull request and i'll take a look at it

## About the files
The static folder contains the files like CSS and JS. It also contains a media folder with admin uploaded images.\
The staticfiles and assets file are the same as static but needed for django and apache.\
The Main folder contains the models and views. And the web folder contains settings and urls.

## Runnnig local
Before you can run make sure you have installed the requirements.txt file!\
This can be simply done by opening your terminal, navigating into the downloaded repo and typing.\
```pip install requirements.txt``` 

When ready to run the application navigate to the root of the application in your terminal.\
And run ```./manage.py runserver```.\
This will run a local server so you can see the result.

Enjoy
