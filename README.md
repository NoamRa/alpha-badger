# Alpha-Badger🦡 - DIY FFmpeg Frontend

[![Alpha-Badger Logo](brand/Alpha_Badger_logo_960x480.png)](https://github.com/NoamRa/alpha-badger#readme)

### **Alpha-Badger🦡** is in alpha stages. Miles to go before I sleep and all that.

---

## What's this? Who is this for?

Some [FFmpeg](https://ffmpeg.org/) capabilities are so niche no UI exist.
With the "do one thing well" philosophy in mind, **Alpha-Badger🦡** is a platform for creating simple user interfaces that abstract complex FFmpeg commands. 
The goal is to enable you to build and deliver a focused, single-purpose app.

Examples:

- Convert video to gif with control on resolution and fps
- Extract alpha channel to separate video
- Batch create a bunch of video clips where each video is half the resolution, composed with with watermark and timecode
- Compare video to baseline - compose original video, baseline, and diff into a single output

## How can I use it?

You can either download [Alpha-Badger🦡 from "release" page](https://github.com/NoamRa/alpha-badger/releases) or checkout the repo and run locally.

## Developing

Alpha-Badger🦡 is built using Electron.

- Start with cloning the repo and `npm install`
- At the moment it's best to run `npm start` after each change
- Use `npm run checks` to see everything is in order. (or individually run `typecheck` or `lint`. No tests yet...)

## Release process
* Commit changes. If the change minor or major, use keywords that will be detected by the [bump github action](https://github.com/phips28/gh-action-bump-version#workflow)
* Open a pull request and see that checks pass
* Merge pull request. Version bumping will happen automatically, updating `package.json` and creating a git tag
* Navigate to [new release page](https://github.com/NoamRa/alpha-badger/releases/new), choose the latest tag, fill in the title and add description
* Github action will build and attach the artifacts to the new release, which [can be found here](https://github.com/NoamRa/alpha-badger/releases/latest)

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
