#!/usr/bin/env node
"use strict";
import nodemon from "nodemon";
import concurrently from "concurrently";
import chalk from "chalk";
import fs from "fs";
import path from "path";

interface YalcWatchConfig {
  watchFolder: string;
  buildWatchCommand: string;
  extensions: string;
  prePushCommand?: string;
  pushCommandConfig?: string;
}

// Get package.json contents
const packageJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")
);

// Get the yalcWatch2 section
if (packageJson.yalcWatch2) {
  const yalcWatch2: YalcWatchConfig = packageJson.yalcWatch2;

  if (
    yalcWatch2.watchFolder === undefined ||
    yalcWatch2.buildWatchCommand === undefined ||
    yalcWatch2.extensions === undefined
  )
    throw new Error(
      'Invalid yalc watch config: "' + JSON.stringify(yalcWatch2) + '"'
    );

  const exec = `${
    yalcWatch2.prePushCommand ? `${yalcWatch2.prePushCommand} & ` : ""
  }yalc push ${yalcWatch2.pushCommandConfig || "--changed"}`;
  nodemon({
    watch: [yalcWatch2.watchFolder],
    ext: yalcWatch2.extensions,
    exec,
  });

  nodemon
    .on("start", function () {
      console.log(`${chalk.magentaBright("yalc-watch2 has started")}`);
    })
    .on("quit", function () {
      process.exit();
    })
    .on("restart", function (files: any) {
      console.log(
        chalk.blueBright("Found changes in files:", chalk.magentaBright(files))
      );
      console.log(chalk.blueBright("Trying to push new yalc package..."));
    });

  concurrently([yalcWatch2.buildWatchCommand]);
} else {
  console.log(
    chalk.redBright(
      "Error: yalc-watch2 could not find a yalcWatch section in your package.json file, exiting"
    )
  );
}
