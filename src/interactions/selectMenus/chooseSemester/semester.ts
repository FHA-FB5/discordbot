import { MessageActionRow, MessageSelectMenu, SelectMenuInteraction } from 'discord.js';
import { getMessage } from '@/utils';
import { SuccessMessageEmbed, ErrorMessageEmbed } from '@/embeds';
import * as moduleMenu from '@/interactions/selectMenus/chooseSemester/module';
import { User } from '@/models';

export default {
  customId: 'choose-semester.semester',
  cooldown: 1000,
  defaultPermission: false,
  data: new MessageSelectMenu()
    .setCustomId('choose-semester.semester')
    .setPlaceholder(getMessage('selectMenu.noOptionSelected')),
  async execute(interaction: SelectMenuInteraction, context: any) {
    if (context.guild) {
      //read selected values
      const studyProgramID = interaction.values[0].split('__')[0];
      const semester = interaction.values[0].split('__')[1];

      //Set semester for user
      await User.findOne({
        _id: context.user._id,
      }, function (err: any, result: any) {
        result.guilds.forEach(function (guild: any) {
          if (guild.guild == context.guild._id) {
            guild.studyPrograms.forEach(function (studyProgram: any) {
              if (studyProgram.studyProgram == studyProgramID) {
                studyProgram.semester = semester;
              }
            });
          }
        });
        result.save();
      });

      //get all modules
      const allStudyPrograms = await User.find({
        _id: context.user._id,
        guilds: {
          $elemMatch: {
            guild: context.guild._id,
          },
        },
      }).populate({
        path: 'guilds',
        populate: {
          path: 'studyPrograms',
          populate: {
            path: 'studyProgram',
            populate: {
              path: 'modules',
              populate: {
                path: 'module',
              },
            },
          },
        },
      });

      //add possible modules to the menu
      let moduleCount = 0;
      allStudyPrograms[0].guilds[0].studyPrograms.forEach((program: any) => {
        program.studyProgram.modules.forEach((entry: any) => {
          moduleCount++;
          moduleMenu.default.data.addOptions({
            value: entry.module._id.toString(),
            label: entry.module.abbreviation,
            description: entry.module.name,
          });
        });
      });

      moduleMenu.default.data.setMinValues(1);
      moduleMenu.default.data.setMaxValues(Math.min(moduleCount, 25));
      
      const menuRow = new MessageActionRow();
      menuRow.addComponents(moduleMenu.default.data);

      interaction.reply({ 
        embeds: [new SuccessMessageEmbed({ 
          description: getMessage('selectMenu.chooseSemester.semester.success', { parameter: { semester: semester } }),
        })], components: [menuRow], ephemeral: true });
      moduleMenu.default.data.options = [];
    } else {
      await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('error.guildIsNull') })] });
    }
  },
};