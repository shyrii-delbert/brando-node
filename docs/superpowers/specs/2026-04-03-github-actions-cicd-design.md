# GitHub Actions CI/CD Design

**Goal:** Add GitHub Actions workflows for Docker image publishing and manual deploys in `brando-node`, following the `r2-proxy` conventions while adapting the primary branch rule to this repository's `main` branch.

## Scope

- Add one workflow to build and push the Docker image.
- Add one workflow to deploy through SSH with manual environment selection.
- Reuse the same secret names and deploy input names used in `r2-proxy`.

## Docker Publish Design

- Trigger on `push` for all branches and on `workflow_dispatch`.
- Log in to Docker Hub with `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`.
- Publish `${{ secrets.DOCKERHUB_USERNAME }}/brando-node:main` and `${{ secrets.DOCKERHUB_USERNAME }}/brando-node:latest` when `github.ref_name` is `main`.
- Publish only `${{ secrets.DOCKERHUB_USERNAME }}/brando-node:latest` for any other branch.

## Deploy Design

- Trigger only on `workflow_dispatch`.
- Keep the `environment` input choices as `Online` and `Staging`.
- Keep the deploy secrets and command names as `SSH_PRIVATE_KEY`, `SSH_DST`, `DEPLOY_COMMAND`, and `DEPLOY_STAGING_COMMAND`.

## Verification

- Parse both workflow YAML files locally.
- Inspect the rendered diff before commit.
