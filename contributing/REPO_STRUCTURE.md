# Repository's structure

We should follow a similar architecture as the one described by [NX's guidelines](https://nx.dev/more-concepts/monorepo-nx-enterprise) but taking into account our experience and making adjustments if needed.
Another piece of documentation about [NX workspaces structure](https://nx.dev/more-concepts/applications-and-libraries).

## Folder structure

Could be a cool feature to automatically generate an nx dep-graph when building, to be investigated.

```
NxMultiStack/
├── apps/
│   ├── angular-app-a/
│   ├── react-app-a/
│   ├── .../
│   ├── portal/
│   └── nest-backend/
├── libs/
│   └── angular-app-a/
│   └── portal/
│   └── .../
│   └── shared/
├── tools/
├── nx.json
├── package.json
└── tsconfig.base.json
```

[/apps/](apps) contains the repository's applications

[/libs/](libs) contains the repository's libraries (shared or app-specific depending on the tags)

[/tools/](tools) contains scripts and configuration files

[/nx.json](nx.json) nx configuration file

[/jest.config.ts](jest.config.ts) Jest testing framework configuration file

[/package.json](package.json) npm configuration file that allows to identify the project as well as handle the project's dependencies and its metadata

[/tsconfig.base.json](tsconfig.base.json) specifies the root files, and the compiler options required to compile the project
