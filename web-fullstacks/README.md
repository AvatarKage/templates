## DUE TO AN ONGOING BUG WITH TAILWIND CSS, TO USE DAISYUI, MANUALLY DOWNLOAD THE CSS FILE AND DEFINE IT.

`npm run init` to install dependencies and complete setup<br>

To start the server, update "domains" in `app.config.ts` and generate valid SSL files in `/ssl`<br>
`npm run start` to run all servers from `/dist`<br>
`npm run dev` to develop all servers from `/src`<br>
`npm run stop` to stop all servers<br>
`npm run sandbox --name=main` to test code in `/sandbox/main.test.ts`<br><br>
`npm run backup` to backup project to `/dev/backups`<br>
`npm run sync` to sync `app.config.ts` to `package.json` and `*.ecosystem.config.cjs`, and translate `/src/assets/locales`<br>
`npm run build` to compile `/src` to `/dist`<br>
`npm run clean` to delete `/dist` and `/logs`