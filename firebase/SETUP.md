# Firebase Emulator Setup

The [documentation](https://firebase.google.com/docs/cli#install_the_firebase_cli) overviews instructions
for Windows, Mac, and Linux.

Most likely, you can just do the following in the terminal:
```
yarn install
firebase login
firebase init
```
When asked what features you want to set up for the directory, choose "Firestore" and "Emulators".

For Firestore: \
When asked to associate the directory with a Firebase project choose "Use an existing project", then "FlowInTheField".

For Emulators: \
When asked what features you want to set up for the directory, select "Emulators". \
When asked which emulators to set up, select "Authentication Emulator" and "Firestore Emulator". \
There will be prompts asking what ports you want the emulators, you can choose your own or use defaults. \
You will also be asked if you'd like to use the Emulator UI, select yes and choose a port (or use the default). \
Finally, agree to download the emulators.

Then you can run the emulators:
```
firebase emulators:start
```








