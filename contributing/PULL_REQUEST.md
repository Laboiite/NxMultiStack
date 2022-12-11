# PR guidelines

This file is explaining conventions for pushing code to NxMultiStack main's branch.

We try to follow guidelines and principles from [MinimumCD](https://minimumcd.org/minimumcd/).
The general PR workflow is inspired from the [Short-lived feature branches](https://trunkbaseddevelopment.com/short-lived-feature-branches/) principle of the [trunk based development](https://trunkbaseddevelopment.com/5-min-overview/).

We also aplly the [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. Please find in the sections below how to apply it in NxMultiStack.

## Branch naming format

Because branches are supposed to be transient there is no need for many naming conventions. Just follow this format:

```shell
type-subject
```

- type must follow [this convention](#type).
- subject must be short and descriptive.

### Valid branch name examples

```shell
feat-sauth-tokens
```

```shell
fix-too-many-refresh
```

```shell
perf-ci-improve-caching
```

## Commit message

We have very precise rules over how our git commit messages can be formatted. This leads to more readable messages that are easy to follow when looking through the project history.

### Format

```shell
type(scope): subject
<BLANK LINE>
body
```

Or

```shell
type(ticketNumber/scope): subject
<BLANK LINE>
body
```

- type must follow [this convention](#type).
- ticketNumber must follow [this convention](#ticketNumber).
- scope must follow [this convention](#scope).
- subject must follow [this convention](#subject).

### Valid commit message examples

```shell
feat(angular-app-a): use mat-icon-button instead of a raised-button

As we want to display an icon instead of a regular button, changing it
Adapting our material module imports

```

```shell
fix(portal): Fixing typo in title

Fixing title, it was missing an "s"
```

```shell
style: use single quotes

All double quotes are replaced by single quotes in .ts files
```

## Pull Request naming format

A pull request title must follow this format:

```shell
type(scope): subject
```

OR

```shell
type(ticketNumber/scope): subject
```

- type must follow [this convention](#type).
- ticketNumber must follow [this convention](#ticketNumber).
- scope must follow [this convention](#scope).
- subject must follow [this convention](#subject).

### Valid PR title examples

```shell
refactor(auth): change token ttl
```

```shell
feat(ABC-123/angular-app-a): add an ExampleComponent
```

```shell
style: merge all scss mixins into one
```

## Naming convention - type, (ticketNumber), scope and subject

### Type

The type must be one of the following, always written in lower case:

- build - changes that affect the build system
- doc - changes in documentation
- feat - adding or updating a feature
- fix - fixing bug
- perf - changes to improve performance
- refactor - changes to implementation without changes to functionality
- style - changes that do not affect the meaning of the code
- test - adding or updating unit tests
- e2e - adding or updating e2e tests

### ticketNumber

The ticketNumber can be used to have an automatic link between our merge request and our ticket's tooling system (JIRA / VSTS / ...) if we have such a mechanism:

- ticketNumber is for example "ABC-123"

### Scope

The scope could be anything specifying place of the changes. All the characters are in lowercase. The scope can be omitted if the commit relates to multiple project. Here is a non exhaustive list:

- auth
- repo-docs
- angular-app-a
- react-app-a
- nest-backend
- angular-app-a-home
- shared-perimeters

### Subject

The subject must contain a short description of the changes. If possible, no more than 5 words in lower case. Use hyphens to separate words.

## Code review

Please read [Coding rules guidelines](./CODING_RULES)
