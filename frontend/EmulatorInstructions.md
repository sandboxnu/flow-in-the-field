To use the Firebase emulators, follow these steps:
1. Run `yarn emulate` to start the emulators
2. In a different terminal, run `yarn startlan` to start the app on the local network
3. Profit

These are things to keep in mind when using firebase emulators:

- You must be connected to the same network on your phone and your laptop. The emulators work over lan, so tunneling will also not work.
- Authorization emails are sent to the terminal running the emulators rather than your inbox.
- The command `yarn export` will export all the data from the emulators to the `db/` folder. You can use this to save the data on the emulator so it will be loaded into the emulator on start. NOTE: save files generated on Mac can be used on Windows machines, but save files generated on Windows cannot be used on Mac.
- When running the app in dev mode, the default, the app will automatically try to use the emulators. To use the production database, run the app in production mode. You can do this by toggling to production mode in the expo browser popup and reloading the app.
