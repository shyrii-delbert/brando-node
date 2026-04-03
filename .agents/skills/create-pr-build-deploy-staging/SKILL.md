---
name: create-pr-build-deploy-staging
description: Use when working in this repository and the user wants the current changes pushed as a pull request, then wants GitHub Actions Docker image build to finish successfully before deploying to the Staging environment.
---

# Create PR, Build, and Deploy Staging

## Overview

This skill handles the repo-specific release flow for `brando-node`:
create or update a feature branch, push it, create a PR, manually trigger Docker image CI, wait for it to finish, then deploy to `Staging`.

The goal is to give the user one clean, end-to-end operation with explicit links and final status.

## When to Use

Use this skill only in this repository, where these workflows already exist:

- `.github/workflows/docker-publish.yml`
- `.github/workflows/deploy.yml`

Do not use this skill if the user only wants local git help, only wants a PR, or wants deployment without waiting for the image build.

## Required Checks

Before changing git or GitHub state:

1. Confirm `gh auth status` succeeds.
2. Inspect `git status --short --branch`.
3. Run the most relevant verification that already exists for the current change.
4. If verification fails, stop and report the failure before creating a branch or PR.

Prefer lightweight repo-appropriate verification over inventing a full new test plan.

## Workflow

### 1. Prepare branch

- If already on a suitable feature branch, keep using it.
- If on `main` or another unsuitable branch, create a feature branch with a concise name.
- Never discard unrelated user changes.

### 2. Commit and push

- Review the diff for the files relevant to the request.
- Stage only the intended files.
- Create a focused commit message.
- Push with `git push -u origin <branch>`.

### 3. Create PR

- Create the PR with `gh pr create`.
- Base branch should normally be `main`.
- PR body should include:
  - `## Summary`
  - `## Test Plan`
- Capture and report the PR URL.

### 4. Manually trigger Docker image build

- After the PR is created, manually trigger the Docker workflow for the branch:

```bash
gh workflow run docker-publish.yml --ref <branch>
```

- Find the workflow-dispatch run for the current branch with `gh run list --workflow "Docker Image CI" --branch <branch>`.
- Wait for that run with `gh run watch <run-id> --exit-status`.
- If the build fails, stop and report the run URL instead of deploying.

### 5. Deploy to staging

- Trigger deploy with:

```bash
gh workflow run deploy.yml -f environment=Staging
```

- Find the new `Deploy` run and wait for it to complete.
- If it fails, report the deploy run URL and failure status clearly.

## Final Response

Always report:

- branch name
- PR URL
- Docker Image CI run URL and final status
- Deploy run URL and final status

If anything failed, say exactly which stage failed and do not imply deployment succeeded.

## Common Mistakes

- Watching the wrong workflow run because another branch finished more recently
- Assuming a branch push is the build trigger for this skill
- Deploying before `Docker Image CI` has completed successfully
- Creating a PR without a clear `Summary` and `Test Plan`
- Reporting success without including the GitHub Actions links
