# Prerequisites
* [nvm](https://github.com/nvm-sh/nvm)
* npm
  * Ubuntu: `sudo apt update && sudo apt install nodejs npm`
  * Mac: `brew update && brew install node`

# Before you run
Always `nvm use && npm install` after pulling to ensure all necessary packages are added

# Available scripts
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run lint:fix`

Runs `prettier` to format the styling of the `src/` repository
