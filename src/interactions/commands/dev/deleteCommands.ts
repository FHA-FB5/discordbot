import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage, logger } from '@/utils';
import { SuccessMessageEmbed, ErrorMessageEmbed } from '@/embeds';

export default {
  name: 'delete-commands',
  dev: true,
  cooldown: 30000,
  data: new SlashCommandBuilder()
    .setName('delete-commands')
    .setDescription(getMessage('command.dev.deleteCommands.description')),
  async execute(interaction: CommandInteraction) {
    if (interaction.inGuild()) {
      const guild = interaction.client.guilds.cache.get(interaction.guildId);

      if (guild) {
        const guildCommands = await guild.commands.fetch();
        guildCommands.forEach(cmd => {
          logger.log('info', 'Deleted command ' + cmd.name + ' while executing /delete-commands.');
          guild.commands.delete(cmd);
        });

        await interaction.reply({
          embeds: [new SuccessMessageEmbed({ description: getMessage('command.dev.deleteCommands.success') })],
        });
      } else {
        await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('error.unknown') })] });
      }
    }

  },
};