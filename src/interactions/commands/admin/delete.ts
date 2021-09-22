import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';
import { ErrorMessageEmbed, SuccessMessageEmbed } from '@/embeds';

export default {
  name: 'delete',
  cooldown: 10000,
  ownerHasPermissionOnDefault: true,
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription(getMessage('command.admin.delete.description'))
    .setDefaultPermission(false)
    .addIntegerOption(option => 
      option.setName('count')
        .setDescription(getMessage('command.admin.delete.count.description'))
        .setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const count = interaction.options.getInteger('count');
    if (count) {
      if (count > 0 && count <= 99) {
        await interaction.deferReply();
        const thisReplyID = (await interaction.fetchReply()).id;
      
        if (interaction.channel) {
          for (const msg of (await interaction.channel.messages.fetch({ limit: count + 1 })).values()) {
            if (msg.id !== thisReplyID) {
              await msg.delete();
            }
          }
            
          interaction.editReply({ embeds: [new SuccessMessageEmbed({ description: getMessage('command.admin.delete.success', { parameter: { count: count } }) })] });
        } else {
          await interaction.reply({
            embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.delete.error') })],
          });
        }
      } else {
        await interaction.reply({
          embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.delete.count.error') })],
        });
      }
    }
  },
};