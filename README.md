# Philippides Server
Backend service built on Node.js and TypeScript. Namesake owed the historical figure who inspired the Marathon sporting event, as he raced to deliver news of the Greek victory at Marathon.

### Installation
```
clone or fork repo
npm install

create a .env file at the root of the project. Must contain an INACTIVITY_TIMEOUT key with a numerical value (timeout in ms). It will otherwise default to 15 min.

npm run start OR npm run dev (to watch for changes)

optional:
install Prettier extension for automatic formatting.
install Better Comments extension to view the comments in a better format.
```

### Testing
Jest is used for all the test suites. ts-jest is used to avoid the intermediary step of transpiling the files.
```
npm run test
```

### Linting & Type safety
All formatting is handled by Prettier. Additionally, all the strict TS rules are enabled in order to leverage the full might of TypeScript.

### Logging
Logging provided with winston. Custom configuration is used to enable a slightly different layout.

![Alt text](/screenshots/log-print.PNG?raw=true "Log print")

![Alt text](/screenshots/log-console.PNG?raw=true "Log console")