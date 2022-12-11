# Creating a new library

Nx documentation about [libraries creation](https://nx.dev/more-concepts/creating-libraries)

## Create the library

Please follow these steps to create your library :

--

From NX Console pluggin, select "generate" then choose the following option: "@nrwl/angular - library" and fill the informations needed (the one required being the library name)

OR

Using your favorite shell, run the command:

```shell
nx generate @nrwl/angular:library my-lib
```

(Switching 'my-lib' with your wanted library's name).

--

We recommend using NX Console plugging as it will already show you all different options and args at disposal, making it easy to specify if you want this library to be publishable, or even to indicate a particular directory without having to know the arguments to provide like --directory=mySpecificDirectory you'll just have to select it from the available options and fill the inputs.

The libraries name must be prepend according to their TYPE:

- feature
- ui
- utils
- data-access

## Make use of Nx tooling on the library

You can directly verify the result of this generation by running "nx dep-graph" and by watching your library displayed on the dependency graph. All nx targets are will be available for your libraries:

- nx lint my-lib
- nx test my-lib
- nx serve my-lib
- ...

### Scope and type your library

One last step required to make sure that your library will be able to make the best use out of NX tooling is to configure its tags: scope and type, for NX to be able to ensure consistency through its projects graph. In your library's folder project.json, at the bottom you'll find a "tags" property, empty by default. Add a scope and a type to it, as follow:

```shell
"tags": ["scope:my-scope", "type:ui"]
```

Please refer to [Coding Rules](./CODING_RULES.md) 's sections "Organizing code with libraries" and "Enforce restrictions in library dependencies" for more detailed explanations.
