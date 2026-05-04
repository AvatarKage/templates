[Setup]
AppId=com.example.project
AppName=My App
AppVersion=0.0.1
AppPublisher=AvatarKage
AppPublisherURL=https://avatarkage.com
AppCopyright=AvatarKage
DefaultDirName={localappdata}\My App
DefaultGroupName=My App
DisableWelcomePage=no
DisableDirPage=no
DisableProgramGroupPage=no
OutputDir=release
OutputBaseFilename=MyApp_0.0.1-alpha_Installer_Windows
Compression=lzma
SolidCompression=yes
WizardStyle=modern
WizardImageFile=public\branding\banner.png
SetupIconFile=public\branding\icon.ico
PrivilegesRequired=admin
CloseApplications=yes
RestartApplications=no
VersionInfoProductName=My App
VersionInfoVersion=0.0.1
VersionInfoTextVersion=0.0.1-alpha
VersionInfoProductVersion=0.0.1
VersionInfoCompany=AvatarKage
VersionInfoDescription=My App
VersionInfoCopyright=AvatarKage
UsePreviousAppDir=no
UsePreviousGroup=no
UsePreviousTasks=no
UsePreviousUserInfo=no

[Files]
Source: "src-tauri\target\x86_64-pc-windows-msvc\release\example.exe"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\My App"; Filename: "{app}\example.exe";
Name: "{commondesktop}\My App"; Filename: "{app}\example.exe"; Tasks: desktopicon;

[Tasks]
Name: "desktopicon"; Description: "Create a &desktop shortcut"; GroupDescription: "Additional icons:"; Flags: unchecked

[Run]
Filename: "{app}\example.exe"; Description: "Launch My App"; Flags: nowait postinstall skipifsilent