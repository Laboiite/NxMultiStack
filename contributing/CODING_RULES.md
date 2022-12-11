# Coding rules

This document is an opinionated guide to syntax, conventions, and application structure.

It is based on our own experience and also best recommendations from [Nx](https://nx.dev/more-concepts/monorepo-nx-enterprise), [Ngrx](https://ngrx.io/) and [Angular](https://angular.io).

This set of rules follows the same wording as the [Angular coding style guide](https://angular.io/guide/styleguide):

**Do** - _is one that should always be followed. Always might be a bit too strong of a word. Guidelines that literally should always be followed are extremely rare. On the other hand, you need a really unusual case for breaking a Do guideline._

**Consider** - _guidelines should generally be followed. If you fully understand the meaning behind the guideline and have a good reason to deviate, then do so. Please strive to be consistent._

**Avoid** - _indicates something you should almost never do. Code examples to avoid have an unmistakable red header._

**Why?** - _gives reasons for following the previous recommendations._

## Smart vs dumb components

- Consider using the smart vs dumb component pattern.
- Do create smart components that pipe data to child dumb components
- Do create smart components that respond to events emitted by the child dumb components
- Do create dumb components without any dependencies to the store
- Consider creating dumb components with very little or no business logic.
- Do create dumb components relying only on Inputs/Outputs to communicate with parents.

## Organizing code with libraries

- Do describe a lib or an app in its project.json with the two basic classifiers: "scope", "type".
  - e.g: "tags": ["scope:angular-app-a", "type:app"]
- Consider creating a custom classifiers only if really needed.
- Do name the main module of a lib with the full path.
  - Why? This is the way that the CLI creates the modules
  - e.g.: _libs/foo/bar_ would have the module filename as _foo-bar.module.ts_

### Scope

Scope relates to a logical grouping, business use-case, or domain.

- Do use folder structure to denote a scope
- Do use tags to denote a scope

### Type

Type relates to the contents of the library and indicates its purpose and usage.

- Do use tags and prefixes to denote a type
- Do use only one of the five basic types: app, data-access, feature, ui, util
- Don't organize by file type
- Do organize by domain including all related files together

#### Data-access libraries

- Do use a data-access libraries for services interacting with a back-end system.
- Do use a data-access libraries for code related to State management.
- Do follow this naming convention: **data-access** (if nested) or **data-access-\*** (e.g. data-access-timesheet)

#### Feature libraries

- Do use a feature library to implement smart UI (with injected services) for specific business use cases or pages in an application.
- Consider using .forRoot in apps only
- Do follow this naming convention: **feature** (if nested) or **feature-\*** (e.g. feature-manager-view)

#### UI libraries

- Do use a ui library only for dumb components
- Don't connect a ui component with the store
- Do communicate with parents via Inputs/Outputs
- Consider not injecting services into these components
  - Why? All the data they need should come from Inputs
- Do follow this naming convention: **ui** (if nested) or **ui-\*** (e.g. ui-deprecated-indicator)

#### Utilities libraries

- Consider using a utility library for common utilities and services used by many libs and apps.
  - "Consider" because sometimes a simple util file is enough (e.g. transformFromObjToInput.util.ts )
- Consider to not use NgModule if not need
  - Why? Some libraries are simply a collection of utilities or pure functions
- Do follow this naming convention: **util** (if nested) or **util-\*** (e.g. util-map)

### Grouping folders

The purpose of these folders is to help with organizing by scope.

- Do group together libraries which are usually updated together.
  - Why? It helps with minimizing the amount of time a developer spends navigating the folder tree to find the right file.

### Barrel file

- Do create a barrel file for each lib
  - Why? It contains the public API to interact with the library and we should ensure that any entities that we want to expose are exported in it.
- Do name this barrel file index.ts
  - Why? By convention and for consistency across this repo.
- Do import specific entities from the barrel instead of \*

### Relative paths vs workspace alias

- Do use relative paths to import from inside the current lib
- Do use workspace alias to import from outside the current lib

### Documenting libraries

- Consider creating a README file for shared libraries
  - Why? It helps other developers to identify the library's purpose

## Enforcing quality and consistency

Nx contains a few tools to help with maintaining consistency across the code-base and to ensure the code quality.

### Enforce a single version policy

A single package.json ensures that all apps and libs use the same dependency versions.

- Do use only one package.json across the entire workspace
  - Why? It eases the sharing of code across the organization.
  - Why? It ensures that no security vulnerabilities remain unfixed.
  - Why? It helps developers move between projects.
- Do keep all libs and apps in only one repo.
  - Why? it avoids having previous versions of a lib unless we are not up-to-date with our target branch.
- Don't use Lerna or yarn workspaces
  - Why? It introduces some overhead to manage these.
- Don't use git submodules (To be discussed, RFC will be presented soon)
  - Why? It introduces complexity and increase likelihood of mismatched SHAs for the submodules in the workspace.

### Ensure consistency in code formatting

Anything that can be automated should be automated. One of those things is code formatting. That's why Nx comes with built-in support for Prettier.

- Do format your code using automation before a Pull Request
  - Why? A large diff that contains whitespace changes makes it difficult to discern the actual code changes from the formatting changes.
  - Why? This is worse if developers have different local settings and keep committing the same changes back-and-forth.

We did implemented a pre-commit hook that automatically runs the nx format command, to ensure this consistency.

- Avoid running bypass arguments to skip this pre-commit hook!

### Enforce restrictions in library dependencies

When there are many teams and many libs it can lead to confusion about which libs should depend on others.

- Do ensure an app specific lib doesn't depend on a lib from another app. (e.g. angular-app-a-ui should not depend on a react-app-a-ui lib)
- Do ensure a shared lib doesn't depend on an app-specific lib.
- Do ensure a lib doesn't depend on an app.
- Do ensure a lib does not have circular dependencies.
- Do ensure a lib that lazy loads another lib doesn't import it directly.
- Do ensure a lib of type data-access only depends on libs of type: data-access, util.
- Do ensure a lib of type feature only depends on libs of type: util, ui.
- Do ensure a lib of type ui only depends on libs of type: ui, util.
- Do ensure a lib of type util only depends on libs of type: util.

Those restrictions are listed as rules in our main .eslintrc.json as rules for Nx "enforce-module-boundaries". Linter will raise an error if there are not followed.

### Workspace Schematics

Schematics offer a way to execute scripts against your workspace via the CLI

- Consider using a built-in Nx schematics for creating: apps, libs, ngrx.
  - Why? It abstracts away some of the boilerplate.
- Consider creating your own schematics to promote a pattern.
  - Why? It helps with making our code consistent across all projects.

---

### Interfaces vs Type Aliases

When declaring types for objects, use **interfaces** instead of a **type alias** for the object literal expression.

- Do use **interfaces** instead of a **type alias**.
- Consider using a **type alias** only when there is a specific feature that only a type alias provides.
  - Why? Although the two are becoming more similar, there are some differences and the performance benefits of using interfaces over type aliases as explained in these [article1](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces), [article2](https://ncjamieson.com/prefer-interfaces/).
  - Why? This will allow us to have consistency across our apps and avoid us mixing both in our code base.

**Consider**

```
interface User {
  firstName: string;
  lastName: string;
}
```

**Avoid**

```
type User = {
  firstName: string,
  lastName: string,
}
```

Consider using a Type Alias only in the following cases:

- Primitive types

```
type AString = string;
```

- Tuples

```
type MyTuple = [ string, number ];
```

- Intersection

```
type Name = {
  name: string
};

type Age = {
  age: number
};

type Person = Name & Age;
```

- Unions

```
type Man = {
  name: string
};

type Woman = {
  name: string
};

type Person = Man | Woman;
```

- Mapped Properties

```
type MyConfig<T> = { [Property in keyof T]: string};
```

---
