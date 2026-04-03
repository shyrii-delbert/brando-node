# GitHub Actions CI/CD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add GitHub Actions workflows that publish the `brando-node` Docker image and support manual SSH deploys using the same secret names and deployment inputs as `r2-proxy`.

**Architecture:** Introduce two standalone workflow files under `.github/workflows`. The Docker workflow computes tags from the current branch name, treating `main` as the primary branch. The deploy workflow mirrors the existing `r2-proxy` SSH flow and selects the remote command from a manual environment input.

**Tech Stack:** GitHub Actions YAML, Docker Buildx, Docker Hub, SSH agent action

---

### Task 1: Add workflow files

**Files:**
- Create: `.github/workflows/docker-publish.yml`
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Write the workflow files**

Add the Docker publish workflow with branch-sensitive tags and the manual deploy workflow with `Online` and `Staging` inputs.

- [ ] **Step 2: Inspect the diff**

Run: `git diff -- .github/workflows`
Expected: two new workflow files with Docker publish and deploy jobs

### Task 2: Verify workflow syntax

**Files:**
- Test: `.github/workflows/docker-publish.yml`
- Test: `.github/workflows/deploy.yml`

- [ ] **Step 1: Parse both YAML files**

Run: `npx --yes js-yaml .github/workflows/docker-publish.yml >/dev/null && npx --yes js-yaml .github/workflows/deploy.yml >/dev/null`
Expected: exit code `0`

- [ ] **Step 2: Review git status**

Run: `git status --short`
Expected: new docs and workflow files listed for commit
