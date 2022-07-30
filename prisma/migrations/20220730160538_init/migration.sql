-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "occupation" TEXT,
    "employer" TEXT,
    "email" TEXT NOT NULL,
    "married" BOOLEAN NOT NULL,
    "spouseFirstName" TEXT,
    "spouseMiddleName" TEXT,
    "spouseLastName" TEXT,
    "spouseEmail" TEXT,
    "spouseOccupation" TEXT,
    "spouseEmployer" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "phone" TEXT,
    "clientId" TEXT NOT NULL,
    "childParent" TEXT NOT NULL,
    CONSTRAINT "Child_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
