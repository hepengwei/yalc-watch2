# yalc-watch2

## Why

[Yalc](https://github.com/whitecolor/yalc) is an awesome tool for developing and testing your packages / libraries locally without publishing to npm.

The only thing yalc is currently missing is a way of watching the build output of a library and then automatically pushing that build into the projects you want to test it with.

This can be really helpful when building something like a design system or component library where you want instant feedback in a consuming app.

## What

This very simple package will allow you to monitor an output folder (using [nodemon](https://github.com/remy/nodemon) under the hood) and will automatically call `yalc push` when a change is detected.

The `yalc push` command will _automaticaly_ update all projects where you have previously installed your package locally using the `yalc add your-package-name` command.

> For projects such as [next.js](https://nextjs.org/) or [create-react-app](https://github.com/facebook/create-react-app) this will automatically trigger a live reload of your project.

## How

In your library / package install `yalc-watch2` as a dev dependency:

```
npm i yalc-watch2 -D
```

Add the following confic JSON to your `package.json` and tweak to your liking:

```json
...
"yalcWatch2": {
  "watchFolder": "src",
  "buildWatchCommand": "tsc --watch",
  "extensions": "js,jsx,ts,tsx,png,svg,gif,jpeg,css,less",
  "prePushCommand": "npm run build"
}
...
```

Still in your `package.json` add the following to the `scripts` section:

```json
"scripts": {
  ...
  "yalc-watch2": "yalc-watch2",
  ...
}
```

Now simply run the command:

```
npm run yalc-watch2
```

`yalc-watch2` will start running the configured `buildWatchCommand` and look for changes in your configured `watchFolder`. When a change is detected the `yalc push` command will be executed updating all projects that added your package using `yalc add your-package-name`.

> If you haven't already done so. You need to install your package in the consuming app using the `yalc add your-package-name` for `yalc push` to have any effect.


If the page does not refresh after you modify the component library code, try to modify the webpack.config.json file
```json
{
  ...
  "cache": false,
  ...
}
```
Then delete the node_modules/.cache folder

_Enjoy!_
