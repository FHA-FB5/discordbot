import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from '@discordjs/builders';
import { ApplicationCommandPermissionData, CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';
import commandsData from '@/../commandsData.json';
import { ErrorMessageEmbed, InfoMessageEmbed, SuccessMessageEmbed } from '@/embeds';

export default {
  name: 'permission',
  ownerHasPermissionOnDefault: true,
  data: new SlashCommandBuilder()
    .setName('permission')
    .setDescription(getMessage('command.admin.permission.description'))
    .setDefaultPermission(false)
    .addSubcommandGroup(
      new SlashCommandSubcommandGroupBuilder()
        .setName('list')
        .setDescription(getMessage('command.admin.permission.list.description'))
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName('all')
            .setDescription(getMessage('command.admin.permission.list.all.description')),
        ),
    )
    .addSubcommandGroup(
      new SlashCommandSubcommandGroupBuilder()
        .setName('user')
        .setDescription(getMessage('command.admin.permission.user.description'))
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName('del')
            .setDescription(getMessage('command.admin.permission.user.del.description'))
            .addStringOption(option =>
              option
                .setName('command')
                .setDescription(getMessage('command.admin.permission.user.del.command.description'))
                .setRequired(true),
            )
            .addUserOption(option =>
              option
                .setName('user')
                .setDescription(getMessage('command.admin.permission.user.del.user.description'))
                .setRequired(true),
            ),
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName('add')
            .setDescription(getMessage('command.admin.permission.user.add.description'))
            .addStringOption(option =>
              option
                .setName('command')
                .setDescription(getMessage('command.admin.permission.user.add.command.description'))
                .setRequired(true),
            )
            .addUserOption(option =>
              option
                .setName('user')
                .setDescription(getMessage('command.admin.permission.user.add.user.description'))
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
            .setName('del')
            .setDescription(getMessage('command.admin.permission.role.del.description'))
            .addStringOption(option =>
              option
                .setName('command')
                .setDescription(getMessage('command.admin.permission.role.del.command.description'))
                .setRequired(true),
            )
            .addRoleOption(option =>
              option
                .setName('role')
                .setDescription(getMessage('command.admin.permission.role.del.role.description'))
                .setRequired(true),
            ),
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName('add')
            .setDescription(getMessage('command.admin.permission.role.add.description'))
            .addStringOption(option =>
              option
                .setName('command')
                .setDescription(getMessage('command.admin.permission.role.add.command.description'))
                .setRequired(true),
            )
            .addRoleOption(option =>
              option
                .setName('role')
                .setDescription(getMessage('command.admin.permission.role.add.role.description'))
                .setRequired(true),
            ),
        ),
    ),
  async execute(interaction: CommandInteraction) {
    switch (interaction.options.getSubcommandGroup()) {
      case 'list':
        switch (interaction.options.getSubcommand()) {
          case 'all':
            interaction.reply({
              embeds: [new InfoMessageEmbed({
                description: JSON.stringify(commandsData),
              })],
            });
            break;
          default:
            await interaction.reply({
              embeds: [new ErrorMessageEmbed({
                description: getMessage('error.unknown'),
              })],
            });
            break;
        }
        break;
      case 'user':
        switch (interaction.options.getSubcommand()) {
          case 'del':
            if (interaction.options.getUser('user')?.id) {
              const command = await interaction.client.guilds.cache.get(interaction.guildId as string)?.commands.fetch(interaction.options.getString('command') as string);
              const permissions: ApplicationCommandPermissionData[] = [
                {
                  id: interaction.options.getUser('user')?.id as string,
                  type: 'USER',
                  permission: false,
                },
              ];
              if (command) {
                await command.permissions.add({ permissions });
                interaction.reply({
                  embeds: [new SuccessMessageEmbed({
                    description: getMessage('command.admin.permission.user.del.success'),
                  })],
                });
              } else {
                await interaction.reply({
                  embeds: [new ErrorMessageEmbed({
                    description: getMessage('command.admin.permission.user.del.error.command.notFound'),
                  })],
                });
              }
            } else {
              await interaction.reply({
                embeds: [new ErrorMessageEmbed({
                  description: getMessage('command.admin.permission.user.del.error.user.notFound'),
                })],
              });
            }
            break;
          case 'add':
            if (interaction.options.getUser('user')?.id) {
              const command = await interaction.client.guilds.cache.get(interaction.guildId as string)?.commands.fetch(interaction.options.getString('command') as string);
              const permissions: ApplicationCommandPermissionData[] = [
                {
                  id: interaction.options.getUser('user')?.id as string,
                  type: 'USER',
                  permission: true,
                },
              ];
              if (command) {
                await command.permissions.add({ permissions });
                interaction.reply({
                  embeds: [new SuccessMessageEmbed({
                    description: getMessage('command.admin.permission.user.add.success'),
                  })],
                });
              } else {
                await interaction.reply({
                  embeds: [new ErrorMessageEmbed({
                    description: getMessage('command.admin.permission.user.add.error.command.notFound'),
                  })],
                });
              }
            } else {
              await interaction.reply({
                embeds: [new ErrorMessageEmbed({
                  description: getMessage('command.admin.permission.user.add.error.user.notFound'),
                })],
              });
            }
            break;
          default:
            await interaction.reply({
              embeds: [new ErrorMessageEmbed({
                description: getMessage('error.unknown'),
              })],
            });
            break;
        }
        break;
      case 'role':
        switch (interaction.options.getSubcommand()) {
          case 'del':
            if (interaction.options.getRole('role')?.id) {
              const command = await interaction.client.guilds.cache.get(interaction.guildId as string)?.commands.fetch(interaction.options.getString('command') as string);
              const permissions: ApplicationCommandPermissionData[] = [
                {
                  id: interaction.options.getRole('role')?.id as string,
                  type: 'ROLE',
                  permission: false,
                },
              ];
              if (command) {
                await command.permissions.add({ permissions });
                interaction.reply({
                  embeds: [new SuccessMessageEmbed({
                    description: getMessage('command.admin.permission.role.del.success'),
                  })],
                });
              } else {
                await interaction.reply({
                  embeds: [new ErrorMessageEmbed({
                    description: getMessage('command.admin.permission.role.del.error.command.notFound'),
                  })],
                });
              }
            } else {
              await interaction.reply({
                embeds: [new ErrorMessageEmbed({
                  description: getMessage('command.admin.permission.role.del.error.role.notFound'),
                })],
              });
            }
            break;
          case 'add':
            console.log('TEST');
            if (interaction.options.getRole('role')?.id) {
              const command = await interaction.client.guilds.cache.get(interaction.guildId as string)?.commands.fetch(interaction.options.getString('command') as string);
              const permissions: ApplicationCommandPermissionData[] = [
                {
                  id: interaction.options.getRole('role')?.id as string,
                  type: 'ROLE',
                  permission: true,
                },
              ];
              if (command) {
                await command.permissions.add({ permissions });
                interaction.reply({
                  embeds: [new SuccessMessageEmbed({
                    description: getMessage('command.admin.permission.role.add.success'),
                  })],
                });
              } else {
                await interaction.reply({
                  embeds: [new ErrorMessageEmbed({
                    description: getMessage('command.admin.permission.role.add.error.command.notFound'),
                  })],
                });
              }
            } else {
              await interaction.reply({
                embeds: [new ErrorMessageEmbed({
                  description: getMessage('command.admin.permission.role.add.error.role.notFound'),
                })],
              });
            }
            break;
          default:
            await interaction.reply({
              embeds: [new ErrorMessageEmbed({
                description: getMessage('error.unknown'),
              })],
            });
            break;
        }
        break;
      default:
        await interaction.reply({
          embeds: [new ErrorMessageEmbed({
            description: getMessage('error.unknown'),
          })],
        });
        break;
    }
  },
};