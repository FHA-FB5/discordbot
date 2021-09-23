import { MessageActionRow, MessageSelectMenu, SelectMenuInteraction, GuildMember, GuildMemberRoleManager } from 'discord.js';
import { getMessage } from '@/utils';
import { SuccessMessageEmbed, ErrorMessageEmbed } from '@/embeds';
import * as semesterMenu from '@/interactions/selectMenus/chooseSemester/semester';
import { StudyProgram, User, StudyProgramModule } from '@/models';

export default {
  customId: 'choose-semester.study-program',
  cooldown: 10000,
  defaultPermission: false,
  data: new MessageSelectMenu()
    .setCustomId('choose-semester.study-program')
    .setPlaceholder(getMessage('selectMenu.noOptionSelected')),
  async execute(interaction: SelectMenuInteraction, context: any) {
    if (context.guild) {

      //TODO
      //TODO
      //TODO
      //TODO
      //TODO
      //TODO
      //TODO
      //TODO
      //TODO
      //TODO
      //TODO
      //TODO
      //TODO
      //TODO
      //TODO
      //TODO
      //TODO
      //TODO

      await User.findOne({
        _id: context.user._id,
      }, async function (err: any, result: any) {
        await result.guilds.forEach(async function (guild: any) {
          if (guild.guild == context.guild._id) {
            guild.studyPrograms = [];
            guild.studyProgramModules = [];
            guild.save();
          }
        });
      });

      //get selected study program
      const selectedStudyProgram = await StudyProgram.findOne({
        _id: interaction.values[0],
      }).populate('modules.module');

      //add role to user
      if (interaction.member instanceof GuildMember) {
        const role = await interaction.guild?.roles.fetch(selectedStudyProgram.roleId);
        if (role) {
          interaction.member?.roles.add(role);
        } else {
          return interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('selectMenu.studyProgram.noRole') })] });
        }
      }

      //set study program for user
      const studyProgramInsert = await User.findOne({
        _id: context.user._id,
        guilds: {
          $elemMatch: {
            guild: context.guild._id,
            studyPrograms: {
              $elemMatch: {
                studyProgram: selectedStudyProgram._id,
              },
            },
          },
        },
      });
      if (!studyProgramInsert) {
        await User.findOneAndUpdate({
          _id: context.user._id,
        }, {
          $addToSet: {
            'guilds.$[elem].studyPrograms': {
              studyProgram: selectedStudyProgram,
            },
          },
        }, {
          arrayFilters: [
            {
              'elem.guild': context.guild,
            },
          ],
        }).exec();
      }

      if (selectedStudyProgram.modules.length > 0) {
        //get highest possible semester from added modules
        const highestSemester = await StudyProgram.findOne({
          _id: selectedStudyProgram._id,
        }).sort({ 'modules.semester': 'desc' }).exec();

        // get highest semester
        let highestSemesterInt = 1;
        highestSemester.modules.forEach((module: any) => {
          if (module.semester > highestSemesterInt) {
            highestSemesterInt = module.semester;
          }
        });

        //add possible semesters to the menu
        for (let i = 1; i <= highestSemesterInt; i++) {
          semesterMenu.default.data.addOptions({
            value: selectedStudyProgram._id + '__' + i.toString(),
            label: i + '. Semester',
          });
        }

        const menuRow = new MessageActionRow();
        menuRow.addComponents(semesterMenu.default.data);

        interaction.reply({
          embeds: [new SuccessMessageEmbed({
            description: getMessage('selectMenu.chooseSemester.studyProgram.success', { parameter: { studyProgram: selectedStudyProgram.name } }),
          })], components: [menuRow], ephemeral: true,
        });
        semesterMenu.default.data.options = [];
      } else {
        await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('selectMenu.chooseSemester.studyProgram.noModules') })], ephemeral: true });
      }
    } else {
      await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('error.guildIsNull') })] });
    }
  },
};