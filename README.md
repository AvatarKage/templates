`gh repo clone AvatarKage/templates`<br>
`cd templates/<TEMPLATE-NAME>`<br><br>

## web-backend
`npm run init` to install dependencies and complete setup<br>

To start the server, update "domains" in `/config/config.toml` and generate valid SSL files in `/config/ssl`<br>
`npm run start` to run all servers from `/dist`<br>
`npm run dev` to develop all servers from `/src`<br>
`npm run stop` to stop all servers<br>
`npm run sandbox` to test code in `/sandbox`<br><br>
`npm run backup` to backup project to `/dev/backups`<br>
`npm run sync` to sync `/config/config.toml` to `package.json` and `*.ecosystem.config.cjs`, and translate `/config/lang`<br>
`npm run build` to compile `/src` to `/dist`<br>
`npm run clean` to delete `/dist` and `/logs`