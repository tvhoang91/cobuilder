-- Initial database schema for NextAuth.js with user roles

-- Users table with role-based access
CREATE TABLE "User" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT,
    email TEXT NOT NULL UNIQUE,
    "emailVerified" TIMESTAMPTZ,
    image TEXT,
    role TEXT NOT NULL DEFAULT 'GUEST' CHECK (role IN ('ADMIN', 'DESIGNER', 'GUEST')),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Accounts table for OAuth providers
CREATE TABLE "Account" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    UNIQUE(provider, "providerAccountId")
);

-- Sessions table for NextAuth.js
CREATE TABLE "Session" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    expires TIMESTAMPTZ NOT NULL
);

-- Verification tokens for NextAuth.js
CREATE TABLE "VerificationToken" (
    identifier TEXT NOT NULL,
    token TEXT NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (identifier, token)
);

-- Indexes for performance
CREATE INDEX "Account_userId_idx" ON "Account"("userId");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "User_email_idx" ON "User"(email);

-- Set specific admin user role
INSERT INTO "User" (email, name, role, "emailVerified", "updatedAt") 
VALUES ('tvhoang91@gmail.com', 'Admin User', 'ADMIN', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET role = 'ADMIN';