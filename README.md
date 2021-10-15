# Eternalloneliness
A private Google Drive based file manager for Télécom Paris's students.

## Installation
```bash
npm install
```
Create a `config.json` document in the root directory, containing the password, the mobile password (*d* for right, *g* for left), the token and the credentials of the Google Drive account. Here is a template.
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