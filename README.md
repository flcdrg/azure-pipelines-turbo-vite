# Building a `Turborepo` application with Azure Pipelines

[![Build Status](https://dev.azure.com/gardiner/GitHub%20Builds/_apis/build/status%2Fflcdrg.azure-pipelines-turbo-vite%2Fflcdrg.azure-pipelines-turbo-vite?branchName=main)](https://dev.azure.com/gardiner/GitHub%20Builds/_build/latest?definitionId=64&branchName=main)

An example of using Azure Pipelines to build a [Turborepo](https://turborepo.com) Vite application.

The application uses the [`pnpm`](https://pnpm.io) package manager.

## Overview

The `pnpm` cache location is configured by setting a pipeline variable:

<!-- snippet: pnpm-config-cache -->
<a id='snippet-pnpm-config-cache'></a>
```yml
variables:
  pnpm_config_cache: $(Pipeline.Workspace)/.pnpm-store
```
<sup><a href='/azure-pipelines.yml#L7-L10' title='Snippet source file'>snippet source</a> | <a href='#snippet-pnpm-config-cache' title='Start of snippet'>anchor</a></sup>
<!-- endSnippet -->

With this in place we configure a [Cache@2](https://learn.microsoft.com/azure/devops/pipelines/tasks/reference/cache-v2?view=azure-pipelines&WT.mc_id=DOP-MVP-5001655) task for the pnpm packages:

<!-- snippet: cache-task-pnpm -->
<a id='snippet-cache-task-pnpm'></a>
```yml
- task: Cache@2
  inputs:
    key: 'pnpm | "$(Agent.OS)" | pnpm-lock.yaml'
    path: $(pnpm_config_cache)
    restoreKeys: 'pnpm | "$(Agent.OS)"'
  displayName: Cache pnpm
```
<sup><a href='/azure-pipelines.yml#L13-L20' title='Snippet source file'>snippet source</a> | <a href='#snippet-cache-task-pnpm' title='Start of snippet'>anchor</a></sup>
<!-- endSnippet -->

Adapting the pattern described in the [Turborepo GitHub Actions documentation](https://turborepo.com/docs/guides/ci-vendors/github-actions#remote-caching-with-github-actionscache) we also cache the `.turbo` directory

<!-- snippet: cache-task-turbo -->
<a id='snippet-cache-task-turbo'></a>
```yml
- task: Cache@2
  inputs:
    key: 'turbo | "$(Agent.OS)" | $(Build.SourceVersion)'
    path: .turbo
    restoreKeys: 'turbo | "$(Agent.OS)"'
  displayName: Cache Turbo
```
<sup><a href='/azure-pipelines.yml#L22-L29' title='Snippet source file'>snippet source</a> | <a href='#snippet-cache-task-turbo' title='Start of snippet'>anchor</a></sup>
<!-- endSnippet -->

We are then able to install the correct version of `pnpm` using [`corepack`](https://github.com/nodejs/corepack) and ensure `pnpm` uses the
cached directory for storing packages:

<!-- snippet: corepack-install -->
<a id='snippet-corepack-install'></a>
```yml
- script: |
    corepack enable
    corepack install
    pnpm config set store-dir $(pnpm_config_cache)
  displayName: "Script: corepack install"
```
<sup><a href='/azure-pipelines.yml#L31-L37' title='Snippet source file'>snippet source</a> | <a href='#snippet-corepack-install' title='Start of snippet'>anchor</a></sup>
<!-- endSnippet -->

With this in place we can now install packages and build the application.

<!-- snippet: pnpm-install-build -->
<a id='snippet-pnpm-install-build'></a>
```yml
- script: pnpm install
  displayName: "Script: pnpm install"

- script: pnpm build
  displayName: "Script: pnpm build"
```
<sup><a href='/azure-pipelines.yml#L39-L45' title='Snippet source file'>snippet source</a> | <a href='#snippet-pnpm-install-build' title='Start of snippet'>anchor</a></sup>
<!-- endSnippet -->

The complete pipeline is in [azure-pipelines.yml](azure-pipelines.yml)

You can view the pipeline runs [here](https://dev.azure.com/gardiner/GitHub%20Builds/_build?definitionId=64&_a=summary)

## Original application

The original application was created using:

```sh
pnpm create-turbo@latest -e with-vite
```

## Snippets

Generated using [MarkdownSnippets](https://github.com/SimonCropp/MarkdownSnippets)
