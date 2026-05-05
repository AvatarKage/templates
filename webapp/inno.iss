[Setup]
AppId=com.example.project
AppName=My App
AppVersion=0.0.1
AppPublisher=Example, LLC.
AppPublisherURL=https://dev.example.com
AppCopyright=Example, LLC.
DefaultDirName={localappdata}\My App
DefaultGroupName=My App
DisableWelcomePage=no
DisableDirPage=no
DisableProgramGroupPage=no
OutputDir=release
OutputBaseFilename=My_App_0.0.1-prealpha-5f67b68_Installer_Windows
Compression=lzma
SolidCompression=yes
WizardStyle=modern
WizardImageFile=public\branding\banner.png
SetupIconFile=public/branding/icon.svg
PrivilegesRequired=admin
CloseApplications=yes
RestartApplications=no
VersionInfoProductName=My App
VersionInfoVersion=0.0.1
VersionInfoTextVersion=0.0.1-prealpha-5f67b68
VersionInfoProductVersion=0.0.1
VersionInfoCompany=Example, LLC.
VersionInfoDescription=This is an example description
VersionInfoCopyright=Example, LLC.
UsePreviousAppDir=no
UsePreviousGroup=no
UsePreviousTasks=no
UsePreviousUserInfo=no

[Files]
Source: "src-tauri\target\x86_64-pc-windows-msvc\release\my-app.exe"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\My App"; Filename: "{app}\my-app.exe";
Name: "{commondesktop}\My App"; Filename: "{app}\my-app.exe"; Tasks: desktopicon;

[Tasks]
Name: "desktopicon"; Description: "Create a &desktop shortcut"; GroupDescription: "Additional icons:"; Flags: unchecked

[Run]
Filename: "{app}\my-app.exe"; Description: "Launch My App"; Flags: nowait postinstall skipifsilent