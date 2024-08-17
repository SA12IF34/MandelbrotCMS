### Table of Contents
- [Description](#mandelbrotcms)
- [Parts and their Aspects](#parts-and-their-aspects)
- [Benefits](#benefits)
- [How to Run Locally](#how-to-run-locally)

<br>
<hr>
<br>

## MandelbrotCMS
MandelbrotCMS is a system built from scratch that is meant to help organizaing different aspects of life 
and making them clearer.<br>
I desided to build this project because of:
  - It will rise my experience and improve my skills in exponential way
  - It will be a very good portfolio project
  - I wanted to have my own system and domain in a way I like

<br>
<hr>
<br>

## Parts and their Aspects
### Sessions Manager
Sessions Manager is the first part and the part responsible 
for managing, decomposing, and tracking projects.

<br>

### Learning Tracker
Learning Tracker is the part responsible for listing and tracking courses.

<br>

### Entertainment
This is the part where you can add, track and specialize any entertainment material you want.

<br>

### Missions
MIssions part is where you create daily missions list with some missions, 
and determining a reward for finishing the list from entertainment part.

<br>

### Goals 
In goals part, you can assemble everything, when you add a new goal, 
you can determine the projects and courses related to it and connect them, 
create the goal only missions, and of course add any number of 
entertainment materials for rewarding yourself with some words for you.

<br>

### Notes
It is a simple and normal notes part with features like connecting 
a note with project, course, missionts list, goal or entertainment material, 
and a small canvas for drawing or hand writing.

<br><hr><br>

## Benefits
If you are a developer, you can benefit from this repository by seeing 
how certain feature or functionality is made, taking it's code sneppit, 
or building your own project on top of it's core.

If you are a recruiter or a person who considers me as a candidate to hire 
or to work you your next project, you can benefit from this repo by previewing 
my code's practices, readability, and performance.

<br><hr><br>

## How to Run Locally
- Add `.env` file in the root directory that contains the following keys:
    ```
    SECRET_KEY="django project secret key"
    YOUTUBE_API_KEY="youtube api key from google console"
    MAL_CLIENT_ID="My anime list app client id"
    MAL_CLIENT_SECRET="My anime list app client secret"
    GOOGLE_CLIENT_SECRET="Google client secret for social auth concent screen"
    GOOGLE_CLIENT_ID="Google client id for social auth concent screen"
    GITHUB_CLIENT_ID="Github client id for social auth"
    GITHUB_CLIENT_SECRET="Github client secret for social auth"
    ```

- Add `tokens.json` file in entertainment dir that has the following content:
  ```
  {
  "token_type": "Bearer",
  "expires_in": 2678400,
  "access_token": "access token mal api",
  "refresh_token": "refresh token for mal api"
  }
  ```

- Create a virtual environtment and install required dependecies from requirements.txt with `python/python3 -m pip install -r requirements.txt`

- To render the frontend in django server you need to:
  - run npm install in every frontend part
  - create a `.env.development` file in every part with [these values](#frontend-dev-environment-variables-values)
  - run `vite build --mode development`

- And finally set `DEBUG` to true in settings.py

<br>
.<br>
.<br>
.<br>
.<br>
.<br>
.<br>
<br>

### frontend dev environment variables values
- Sessions Manager: `http://127.0.0.1:8000/sessions_manager/apis/`
- Learning Tracker: `http://127.0.0.1:8000/learning_tracker/apis/`
- Entertainment: `http://127.0.0.1:8000/entertainment/apis/`
- Missions: ```
            VITE_API_URL=http://127.0.0.1:8000/
            VITE_GOOGLE_CLIENT=google_client_id
            VITE_GITHUB_AUTHORIZE=https://github.com/login/oauth/authorize?client_id=CLIENT_ID&amp;redirect_uri=http://127.0.0.1:8000/log-in/&amp;scope=user
            ```
- Goals: `http://127.0.0.1:8000/`
- Notes: ```
         VITE_NOTES_API_URL=http://127.0.0.1:8000/notes/apis/
         VITE_API_BASE_URL=http://127.0.0.1:8000/
         ```
