# Todo

merge `src-tauri` into `src`
make `vite.config.ts` include a seperate dist for app and a server to build app React, or create a new file
add `src/integrations/discord` server to `*.ecosystem.config.cjs`
add existing `discord-app` template files to `src/integrations/discord`
add `slashCommands` loader event to `src/integrations/discord`
add `inno.iss` to `dev/syncConfig.ts`
add `src-tauri/Cargo.toml` to `dev/syncConfig.ts`
add `src-tauri/tauri.conf.json` to `dev/syncConfig.ts`
see if Inno can be installed to console so a command `npm run package:windows` can be created
see if Nodemon or a watcher can be added to `app.config.ts` so any updates auto sync
see if commit to GitHub can update metadata.version.build in `app.config.ts` automatically
fix `data/databases` and `data/uploads` not having `DELETE_ME` sent to github or create the folders in init
rename `.env -> .env.example`
rename `ssl/dev.crt -> ssl/dev.crt.example` -> "https://www.cloudflare.com/application-services/products/ssl"
rename `ssl/dev.key -> ssl/dev.key.example` -> "https://www.cloudflare.com/application-services/products/ssl"
rename `ssl/prod.crt -> ssl/prod.crt.example` -> "https://www.cloudflare.com/application-services/products/ssl"
rename `ssl/prod.key -> ssl/prod.key.example` -> "https://www.cloudflare.com/application-services/products/ssl"
replace `.app.config.ts` "avatarka.ge" -> "example.com"