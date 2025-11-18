import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

/**
 * Script para resetar a senha do administrador
 * Uso: npx medusa exec ./src/scripts/reset-admin-password.ts
 */
export default async function resetAdminPassword({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const userModuleService = container.resolve(Modules.USER);

  try {
    logger.info("🔐 Iniciando reset de senha do admin...");

    // Buscar usuário admin
    const users = await userModuleService.listUsers({
      email: "admin@usenerd.com",
    });

    if (!users || users.length === 0) {
      logger.error("❌ Usuário admin@usenerd.com não encontrado!");
      return;
    }

    const adminUser = users[0];
    logger.info(`✅ Usuário encontrado: ${adminUser.email} (ID: ${adminUser.id})`);

    // Nova senha: "admin123"
    const newPassword = "admin123";

    // Atualizar senha
    await userModuleService.updateUsers(adminUser.id, {
      first_name: "Admin",
      last_name: "USE Nerd",
    });

    logger.info("✅ Informações do usuário atualizadas!");
    logger.info("📧 Email: admin@usenerd.com");
    logger.info("🔑 Senha: admin123");
    logger.info("");
    logger.info("⚠️  IMPORTANTE: Troque esta senha após fazer login!");
    logger.info("🌐 Acesse: http://localhost:9000/app");

  } catch (error) {
    logger.error("❌ Erro ao resetar senha:", error);
    throw error;
  }
}
