import { MessageActionRow, MessageSelectMenu, SelectMenuInteraction } from 'discord.js';
import { getMessage } from '@/utils';
import { SuccessMessageEmbed, ErrorMessageEmbed } from '@/embeds';
import * as moduleMenu from '@/interactions/selectMenus/chooseSemester/module';
import { User, StudyProgramModule } from '@/models';

export default {
  customId: 'choose-semester.semester',
  cooldown: 10000,
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
      await User.findOneAndUpdate({
        _id: context.user._id,
      }, {
        $addToSet: {
          'guilds.$[elem].studyPrograms.$[elem2]': {
            semester: semester,
          },
        },
      }, {
        arrayFilters: [
          {
            'elem.guild': context.guild,
          },
          {
            'elem2.studyProgram._id': studyProgramID,
          },
        ],
      }).exec();

      //get all modules
      const allModules = await StudyProgramModule.find({
        guild: context.guild,
      });

      //add possible modules to the menu
      for (const module of allModules) {
        moduleMenu.default.data.addOptions({
          value: module._id.toString(),
          label: module.abbreviation,
          description: module.name,
        });
      }

      moduleMenu.default.data.setMinValues(1);
      moduleMenu.default.data.setMinValues(Math.min(allModules.length, 25));
      
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