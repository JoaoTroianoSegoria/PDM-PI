-- CreateTable
CREATE TABLE `Student` (
    `id` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `matricula` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Student_cpf_key`(`cpf`),
    UNIQUE INDEX `Student_matricula_key`(`matricula`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Disciplina` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `turma` VARCHAR(191) NOT NULL,
    `professor` VARCHAR(191) NOT NULL,
    `media` DECIMAL(4, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Boletim` (
    `id` VARCHAR(191) NOT NULL,
    `notaP1` DECIMAL(4, 2) NOT NULL,
    `notaP2` DECIMAL(4, 2) NOT NULL,
    `frequencia` INTEGER NOT NULL,
    `disciplinaId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Boletim_disciplinaId_key`(`disciplinaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fatura` (
    `id` VARCHAR(191) NOT NULL,
    `mes` VARCHAR(191) NOT NULL,
    `vencimento` DATETIME(3) NOT NULL,
    `valor` DECIMAL(12, 2) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Boletim` ADD CONSTRAINT `Boletim_disciplinaId_fkey` FOREIGN KEY (`disciplinaId`) REFERENCES `Disciplina`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
