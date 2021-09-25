import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';
import { SuccessMessageEmbed, ErrorMessageEmbed } from '@/embeds';
import { User } from '@/models';

export default {
  name: 'select-first-semester',
  cooldown: 10000,
  ownerHasPermissionOnDefault: true,
  data: new SlashCommandBuilder()
    .setName('select-first-semester')
    .setDescription(getMessage('command.admin.selectFirstSemester.description'))
    .setDefaultPermission(false)
    .addSubcommand(cmd =>
      cmd.setName('set')
        .setDescription(getMessage('command.admin.selectFirstSemester.set.description')))
    .addSubcommand(cmd =>
      cmd.setName('remove')
        .setDescription(getMessage('command.admin.selectFirstSemester.remove.description'))),
  async execute(interaction: CommandInteraction, context: any) {
    if (context.guild) {
      switch (interaction.options.getSubcommand()) {
        case 'set':
          const roleSet = await interaction.guild?.roles.create({
            name: 'Ersti',
            permissions: [],
            reason: '/select-first-semester command execution',
          });

          //Check if role was created
          if (roleSet) {
            //Get all users from this guild with a studyProgram in the first semester
            const users = await User.find({
              guilds: {
                $elemMatch: {
                  guild: context.guild._id,
                  studyPrograms: {
                    $elemMatch: {
                      semester: 1,
                    },
                  },
                },
              },
            });

            //Set role for each user
            users.forEach(async (user: any) => {
              const member = await interaction.guild?.members.fetch(user.userID);
              if (member) {
                member.roles.add(roleSet);
              }
            });

            interaction.reply({ embeds: [new SuccessMessageEmbed({ description: getMessage('command.admin.selectFirstSemester.set.success') })] });
          } else {
            await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('error.unknown') })] });
          }
          break;
        case 'remove':
          //Get role with name 'Ersti'
          const roleRemove = interaction.guild?.roles.cache.find(role => role.name === 'Ersti');

          //Check if role was found and delete it
          if (roleRemove) {
            roleRemove.delete();
          }

          interaction.reply({ embeds: [new SuccessMessageEmbed({ description: getMessage('command.admin.selectFirstSemester.remove.success') })] });
          break;
        default:
          await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('error.unknown') })] });
          break;
      }
    } else {
      await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('error.guildIsNull') })] });
    }
  },
};