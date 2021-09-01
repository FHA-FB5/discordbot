import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';

export default {
  name: 'permission',
  cooldown: 10000,
  defaultPermission: false,
  data: new SlashCommandBuilder()
    .setName('permission')
    .setDescription(getMessage('command.admin.permission.description'))
    .addSubcommandGroup(
      new SlashCommandSubcommandGroupBuilder()
        .setName('user')
        .setDescription(getMessage('command.admin.permission.user.description'))
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName('get')
            .setDescription(getMessage('command.admin.permission.user.get.description'))
            .addUserOption(option =>
              option
                .setName('user')
                .setDescription(getMessage('command.admin.permission.user.get.user.description'))
                .setRequired(true),
            ),
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName('set')
            .setDescription(getMessage('command.admin.permission.user.set.description'))
            .addUserOption(option =>
              option
                .setName('user')
                .setDescription(getMessage('command.admin.permission.user.set.user.description'))
                .setRequired(true),
            ),
        ),
    )
    .addSubcommandGroup(
      new SlashCommandSubcommandGroupBuilder()
        .setName('role')
        .setDescription(getMessage('command.admin.permission.role.description'))
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName('get')
            .setDescription(getMessage('command.admin.permission.role.get.description'))
            .addRoleOption(option =>
              option
                .setName('role')
                .setDescription(getMessage('command.admin.permission.role.get.role.description'))
                .setRequired(true),
            ),
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName('set')
            .setDescription(getMessage('command.admin.permission.role.set.description'))
            .addRoleOption(option =>
              option
                .setName('role')
                .setDescription(getMessage('command.admin.permission.role.set.role.description'))
                .setRequired(true),
            ),
        ),
    ),
  async execute(interaction: CommandInteraction) {

    await interaction.reply({
      content: 'Pong!',
    });
  },
};