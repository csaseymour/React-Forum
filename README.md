# react-forum
This is a forum I'm building using react(as you guessed) for the front-end and nodejs/express mongodb for the backend.
#
My goal for this project is to create an easy to setup and customizable forum for communities that need one and have no time to build one.
As of right now 10/02/2022 the current state of this project is very unstable and not suitable for commercial use. I'm working out the base
structure for this project and hoping to get a stable working version within the next weeks.
## Setup
if u still wish to clone this project and take a look then follow:
  - git clone https://github.com/csaseymour/react-forum.git
  - cd react-forum
  - npm i
  - cd backend
  - npm i
## Env Variables
create two .env files inside the root directory of the front-end and the backend.

```bash
#BACKEND
MONGODBURL= #mongodb url string
ORIGIN= #front-end ip including port example http://mywebsite.come:3000 can be an ip address
PORT= #port for the backend 
SESSIONSECRET= #please use a random phrase for this as it's what secures the session tokens.
```

```bash
#FRONTEND
VITE_APP_NAME= #FORUM NAME
VITE_APP_API_URL= #BACKEND IP INCLUDING PORT
```
