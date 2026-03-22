# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brando is a Node.js application for photo and album management, deployed on Tencent Cloud SCF (Serverless Cloud Function). It provides APIs for managing images, albums, and user data with S3 integration for storage and gRPC for authentication.

## Common Development Commands

```bash
# Install dependencies
pnpm install

# Build and run locally
pnpm start

# Build only (development)
pnpm build

# Build for production
pnpm build_prd

# Generate TypeScript from protobuf definitions
pnpm gen-idl
```

## Architecture

### Core Structure
- **Entry Point**: `src/app.ts` - Express application setup with middleware, routes, and error handling
- **Build System**: Uses ESBuild (configured in `config/build.js`) with TypeScript compilation
- **Database**: MariaDB with Sequelize ORM (`src/db/`)
- **File Storage**: AWS S3 integration for image storage (`src/utils/s3.ts`)

### Key Directories
- `src/routes/` - Express API routes organized by version (v1)
  - `api/v1/images/` - Image management endpoints
  - `api/v1/albums/` - Album management endpoints
  - `api/v1/user/` - User-related endpoints
- `src/db/models/` - Sequelize database models (Photo, Album, Image, Reaction)
- `src/middlewares/` - Express middleware (logging, error handling, auth)
- `src/rpc/` - gRPC client implementations for authentication
- `src/rpc-gen/` - Auto-generated TypeScript from protobuf definitions
- `rpc-idl/idl/sso/` - Protobuf definition files for gRPC services

### Database Setup
- Uses MariaDB with Sequelize ORM
- Connection details configured via environment variables
- Auto-sync in development mode (`NODE_ENV !== 'production'`)
- Models: Photo, Album, Image, Reaction

### gRPC Integration
- Uses Buf for protobuf management
- Generates TypeScript clients from `.proto` files
- SSO authentication service integration
- Configuration in `buf.yaml` and `buf.gen.yaml`

### Environment Configuration
- Environment variables loaded via `dotenv` in `src/env.ts`
- Required: DB_HOST, DB_NAME, DB_USER, DB_PASS, S3 credentials
- Default timezone set to Asia/Shanghai

## Development Notes

### Build Process
- ESBuild bundles the application for Node.js platform
- External dependencies: pg, sqlite3, tedious, pg-hstore, sharp (not bundled)
- Source maps enabled for debugging
- Production builds include minification

### TypeScript Path Aliases
- Uses `$` prefix for absolute imports (e.g., `$db/models/index.ts`)
- Path mapping configured in tsconfig.json

### Dependencies
- **Core**: Express.js with TypeScript
- **Database**: Sequelize with MariaDB driver
- **File Processing**: Sharp for image processing, Multer for uploads
- **Storage**: AWS SDK v2 for S3 integration
- **RPC**: @grpc/grpc-js with bufbuild protobuf
- **Logging**: log4js
- **Image Metadata**: exifr for EXIF data extraction