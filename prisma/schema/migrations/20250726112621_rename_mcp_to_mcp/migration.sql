/*
  Warnings:

  - You are about to drop the `MCP` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MCPChat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MCPGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MCPGroupMCPs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MCP" DROP CONSTRAINT "MCP_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "MCPChat" DROP CONSTRAINT "MCPChat_mcpId_fkey";

-- DropForeignKey
ALTER TABLE "MCPGroup" DROP CONSTRAINT "MCPGroup_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "_MCPGroupMCPs" DROP CONSTRAINT "_MCPGroupMCPs_A_fkey";

-- DropForeignKey
ALTER TABLE "_MCPGroupMCPs" DROP CONSTRAINT "_MCPGroupMCPs_B_fkey";

-- DropTable
DROP TABLE "MCP";

-- DropTable
DROP TABLE "MCPChat";

-- DropTable
DROP TABLE "MCPGroup";

-- DropTable
DROP TABLE "_MCPGroupMCPs";

-- CreateTable
CREATE TABLE "McpGroup" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "deployed" BOOLEAN NOT NULL DEFAULT false,
    "deployedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "McpGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mcp" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mcp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "McpChat" (
    "id" TEXT NOT NULL,
    "mcpId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "role" "MCPChatRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "McpChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_McpGroupMcps" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_McpGroupMcps_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_McpGroupMcps_B_index" ON "_McpGroupMcps"("B");

-- AddForeignKey
ALTER TABLE "McpGroup" ADD CONSTRAINT "McpGroup_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mcp" ADD CONSTRAINT "Mcp_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "McpChat" ADD CONSTRAINT "McpChat_mcpId_fkey" FOREIGN KEY ("mcpId") REFERENCES "Mcp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_McpGroupMcps" ADD CONSTRAINT "_McpGroupMcps_A_fkey" FOREIGN KEY ("A") REFERENCES "Mcp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_McpGroupMcps" ADD CONSTRAINT "_McpGroupMcps_B_fkey" FOREIGN KEY ("B") REFERENCES "McpGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
