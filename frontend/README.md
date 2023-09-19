# Flow in the Field

## Clone Repository & Download Expo Go

First, you will need to clone this repository onto your local computer. 
Navigate to https://github.com/sandboxnu/flow-in-the-field and follow GitHub's [guide](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) for doing so. \
You will also need an editor to view the code, a great free option is [Visual Studio Code](https://code.visualstudio.com/).

Next, you will need to download [Expo Go](https://expo.dev/expo-go) to your mobile device. 
This app will allow you to run the dev app on your mobile device.

## Download Packages 

Next, you will need begin setting up the repo using your command line. 
You can use the terminal in your editor, or use the one provided by your OS.

To run this application, you will need `node` and `yarn`. [
Homebrew](https://brew.sh/) is an easy way to install these packages for MacOS. 
If not already downloaded, the site provides steps to do so.
- Details on downloading `node` [here](https://formulae.brew.sh/formula/node). 
- Details on downloading `yarn` [here](https://formulae.brew.sh/formula/yarn#default).

## Install Dependencies

Next, ensure that you are in the `frontend` directory, then install project dependencies using the command:

`yarn install`

Now that the dependencies are installed, you can run the app off your local computer.

## Run in Dev Mode

To run the app in development mode, we use an emulator. To start the emulator, use the command:

`yarn run emulate`

Upon its success, you will be able to view an emulated Firebase console at http://localhost:4000/.

Note that if you register a new account while using the emulator, 
the email verification link will be logged in the terminal where you have run `yarn emulate`. 
Clicking through the link should successfully verify your account.

With the emulator successfully running, open a new terminal tab and start the app using the command:

`yarn run startlan`

After running this command, a QR code should appear in your terminal. 
Use your mobile device to scan the QR code. It should result in the Expo Go app opening and downloading your code.
Ensure that your laptop and mobile device are using the same wifi.

## Run in Prod Mode

To run the app with connection to the production database, you can use command:

`yarn start`

Warning: activity in this mode will change the prod database. \
The QR code created will be shareable across different wifi networks.


## Changing Variables

To change number of words available to be assigned to participants (ie. 2, 4, 8), 
go the function `getRandomPairing` in  `frontend/src/utils/utils.ts`. \
First, edit the constant `let choice = Math.floor(Math.random() * 3);` to match the desired number of options. \
Then, edit the `switch` statement so the `case`s return the desired options for number of words.

To change the game types available to be assigned to participants (ie. pairing, selecting),
go to the function `getRandomGameType` in `frontend/src/utils/utils.ts`. \
To remove an option, remove the option from the constant `gameTypes`.

To change the consent text or compensation, use the Admin screen in-app.

