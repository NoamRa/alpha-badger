# Alpha-Badger α🦡- FFmpgeg GUI

## This application is pre alpha. Miles to go before I sleep and all that.

## What's this? Who is this for?

Some FFmpeg capabilities are so niche no UI exist. **Alpha-Badger** is a UI wrapper around FFmpeg where you build the UI and the app handles the rest. Build UI once and you've got a one trick app to deliver.

Let's say you have a bunch of video clips and need to genarate low resolution samples from each + add watermarks and timecode. Create FFmpeg command, build Alpha-Badger UI and it's render away.

## How can I use it?

You can either download [Alpha-Badger from "release" page](https://github.com/NoamRa/alpha-badger/releases) or checkout the repo and run locally.
## To Develop

Alpha-Badger is built using Electron.

- Start with cloning the repo and `npm install`
- At the moment it's best to run `npm start` after each change
- There's also `npm develop` with will watch files, but only works on renderer side of the app
- Use `npm run checks` to see everything is in order. (or individually run `typecheck` or `lint`. No tests yet...)

## Questions?

Feel free to [open an issue](https://github.com/NoamRa/alpha-badger/issues/new) on anything and everything.

## Todo

- [x] Finish MVP API - a use should be able to select file, click render and see when render ends
- [x] Block pushing to main branch + run checks before merge to main (CI)
- [x] Set / save / load FFmpeg binary location
- [x] Basic CD - Build app on merge to main
- [ ] Modular UI
- [ ] UI component library for easy consumption
- [ ] Examples
- [ ] Add tests
