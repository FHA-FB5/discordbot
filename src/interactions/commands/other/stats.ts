import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';
import { InfoMessageEmbed, ErrorMessageEmbed } from '@/embeds';
import { User, StudyProgram } from '@/models';

export default {
  name: 'stats',
  cooldown: 10000,
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription(getMessage('command.other.stats.description'))
    .setDefaultPermission(true),
  async execute(interaction: CommandInteraction, context: any) {
    if (context.guild) {
      let countMessage = '';
      
      //get all users from this guild
      const allUsers = await User.countDocuments({
        guilds: {
          $elemMatch: {
            guild: context.guild,
          },
        },
      });
      countMessage += 'All Users: ' + allUsers + '\n\n';

      //get all study programs from this guild
      const allStudyPrograms = await StudyProgram.find({
        guild: context.guild,
      });

      //list all study programs
      for (const program of allStudyPrograms) {
        const studyProgramUsers = await User.countDocuments({
          guilds: {
            $elemMatch: {
              guild: context.guild,
              studyPrograms: {
                $elemMatch: {
                  studyProgram: program,
                },
              },
            },
          },
        });
        countMessage += program.name + ': ' + studyProgramUsers + '\n';
      }

      await interaction.reply({ embeds: [new InfoMessageEmbed({ description: getMessage('command.other.stats.success', { parameter: { counts: countMessage } }) })] });
    } else {
      await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('error.guildIsNull') })] });
    }
  },
};