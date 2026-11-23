-- CreateEnum
CREATE TYPE "Papel" AS ENUM ('ADMIN', 'CLIENTE');

-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "criadoPorId" INTEGER;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "papel" "Papel" NOT NULL DEFAULT 'CLIENTE';

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
