import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildApplicationCommandPermissionData } from 'discord.js';
import { getMessage, logger } from '@/utils';
import { Guild } from '@/models';
import { SuccessMessageEmbed } from '@/embeds';
import commandsOwnerHasPermissionOnDefaultIDs from '@/../commandsOwnerHasPermissionOnDefaultIDs.json';

export default {
  name: 'dev-init',
  dev: true,
  cooldown: 30000,
  data: new SlashCommandBuilder()
    .setName('dev-init')
    .setDescription(getMessage('command.dev.devInit.description')),
  async execute(interaction: CommandInteraction) {
    if (interaction.inGuild()) {
      const guild = interaction.client.guilds.cache.get(interaction.guildId);

      if (guild) {
        Guild.findOneAndUpdate({ guildId: interaction.guildId }, {
          guildId: guild.id,
          primaryLocale: guild.preferredLocale,
        }, {
          upsert: true,
          setDefaultsOnInsert: true,
        }, (error) => {
          if (error) {
            logger.log('error', 'command.dev.devInit guild.findOneAndUpdate', error);
          }
        });

        // build owner permissions
        if (commandsOwnerHasPermissionOnDefaultIDs) {
          const fullPermissions: GuildApplicationCommandPermissionData[] = [];
          commandsOwnerHasPermissionOnDefaultIDs.forEach((id: string) => {
            fullPermissions.push({
              id,
              permissions: [{
                id: guild.ownerId,
                type: 'USER',
                permission: true,
              }],
            });
          });

          if (fullPermissions) {
            guild.commands.permissions.set({
              fullPermissions,
            });
          }
        }

        await interaction.reply({
          embeds: [new SuccessMessageEmbed({ description: getMessage('command.dev.devInit.success') })],
        });
      } else {
        logger.log('error', 'command.dev.devInit guilds.cache.notfound');
      }
    }

  },
};