# Sober Sailor ⛵

Sober Sailor is an online drinking game. It's inspiration was that during the lockdown in 2020 the possibilities to meet
with friends and have a little party were very limited (and also make our own version as a mixup of existing games and our own ideas). So we sat down and started planning and programming this game.

## Disclaimer ❗
This game should be used responsibly! We are **not responsible** for any damage caused by this game!

This game might imply by its Art-style, tasks or any other factors that this game needs to be played with alcohol.
This is not the only option to play this and multiple other options may exist.
We want to inform you that you have to obey to local laws according to the consumption of alcohol or other substances,
that may or may not be mentioned in this game. None of the actions mentioned in this game are recommended by the developers of this game!

Any persons or groups that might seem addressed by contents of this app are not actually meant by any of said content.
There is no intention in discriminating people and any associations are coincidental.

## To our future employers 😜
This game might seem like a total waste of time, resources and our talents. And not to forget about the subject it's about, which might seem like "the youth is only thinking about one thing".
But let's have look at it this way: *While programming this game we learned valuable new skills and gathered experience in the
languages and subjects needed for this masterpiece to work*. With our new, improved skillset, we now are really ready for sereous projects. But even though this app might seem useless, it's a lot more fun to learn programming and improving your own abilities on a project you really like and have the will to participate in and that, in conclusion, is all we thought about.

## Issues / Feature Requests
If you should encounter issues with the Web App or any other Apps please report them in the Issues tab [over there](https://github.com/Herobone/Sober-Sailor/issues).
Please report any bug even if you think it's minor, we will work on fixing it and assign them a priority.

When submitting Issues please **describe the problem** exactly and show us **steps how to reproduce** it. *Images, videos or debug logs*
are greatly appreciated. Anything that may help us to solve the problem contributes to a better experience with the app.

### Feature Requests

You can also suggest new Gamemodes, Tasks, Designs and so on. But if you want to see a new feature, please tell us
what it will be about and maybe even some Ideas on the design and how to implement it. Pull request for these features
are warmly welcome.

## Contributing

### IDE setups

This Project is configured to work with [Visual Studio Code](https://code.visualstudio.com/) and
[WebStorm](https://www.jetbrains.com/webstorm/)

#### VSCode
Go to *__File > Open Workspace__* and select the __Sober-Sailor.code-workspace__ file

After that VS Code will show you recommended Extensions. Install these, they will help during development

### Local building

To set up the repository locally you first need to clone it (possibly fork it).
After that you need to install all dependencies. You can do this by typing `npm run install-all` in the root directory.

To use the local emulators and run the database and backend functions you need the [Firebase CLI](https://firebase.google.com/docs/cli).
Install it on your os. After that use `npm run emulators` to build the functions and run the emulators

To run the Web App run `npm start` inside the *client* directory. It will open http://localhost:3000 in your favourite
browser (tested in chrome and firefox)

### Pull requests
Pull requests are very welcome. Please describe as detailed as possible what will be fixed by this request.

Before opening a Pull request please make sure that:
- ESLint throws no Errors (Don't bypass it!)
- Builds succeeds
- Tests pass
- You can play a game (This checks if the renders work and if any logic is broken)

### Translations
Please do not change the translation files directly. If you want to help the translation, you can do this on [Weblate](https://weblate.org/).
[Here](https://hosted.weblate.org/engage/sober-sailor/) you can help us to translate the app
<a href="https://hosted.weblate.org/engage/sober-sailor/">
<img src="https://hosted.weblate.org/widgets/sober-sailor/-/general/open-graph.png" alt="Translation status" />
</a>
