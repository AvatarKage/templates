`gh repo clone AvatarKage/templates`<br>
`cd templates/<TEMPLATE-NAME>`<br>

It is recommended to install the provided suggested VSC extensions provided.<br><br>

`npm run init` to install dependencies and complete setup<br>

## discord-app
To start the client, update "client" in `app.config.ts` and fill out `.env`<br>
`npm run start` to run client from `/dist`<br>
`npm run dev` to develop client from `/src`<br>
`npm run sandbox --name=main` to test code in `/sandbox/main.test.ts`<br><br>
`npm run backup` to backup project to `/dev/backups`<br>
`npm run sync` to sync `app.config.ts` to all other files<br>
`npm run translate` to translate `/public/locales`<br>
`npm run update` to update all modules<br>
`npm run build` to compile `/src` to `/dist`<br>
`npm run clean` to delete `/dist` and `/logs`

## webapp
`npm run init` to install dependencies and complete setup<br>

To start the server, update "domains" in `app.config.ts` and generate valid SSL files in `/ssl`<br>
`npm run start` to run all servers from `/dist`<br>
`npm run dev` to develop all servers from `/src`<br>
`npm run stop` to stop all servers<br>
`npm run sandbox --name=main` to test code in `/sandbox/main.test.ts`<br><br>
`npm run backup` to backup project to `/dev/backups`<br>
`npm run sync` to sync `app.config.ts` to all other files<br>
`npm run translate` to translate `/public/locales`<br>
`npm run update` to update all modules<br>
`npm run build` to compile `/src` to `/dist`<br>
`npm run clean` to delete `/dist` and `/logs`
