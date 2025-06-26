-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
