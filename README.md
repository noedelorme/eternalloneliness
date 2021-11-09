# Eternalloneliness
A private file manager for Télécom Paris's students, using the Google Drive's API.

## Installation
```bash
npm install
```
Create a `config.json` document in the root directory, containing the password, the mobile password (*d* for right, *g* for left), the token and the credentials of the Google Drive account. Here is a template:
```json
{
    "pswd": "password",
    "mobilepswd": "ddgg",
    "drivetoken": {},
    "drivecredentials": {}
}
```

## Usage
Use this command to start the application on `localhost:3001`.
```bash
node server.js
```
