/*
  Warnings:

  - Changed the type of `role` on the `McpChat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "McpChatRole" AS ENUM ('USER', 'ASSISTANT');

-- AlterTable
ALTER TABLE "McpChat" DROP COLUMN "role",
ADD COLUMN     "role" "McpChatRole" NOT NULL;

-- DropEnum
DROP TYPE "MCPChatRole";
