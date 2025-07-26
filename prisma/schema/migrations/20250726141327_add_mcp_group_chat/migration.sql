-- CreateTable
CREATE TABLE "McpGroupChat" (
    "id" TEXT NOT NULL,
    "mcpGroupId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "role" "McpChatRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "McpGroupChat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "McpGroupChat" ADD CONSTRAINT "McpGroupChat_mcpGroupId_fkey" FOREIGN KEY ("mcpGroupId") REFERENCES "McpGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
