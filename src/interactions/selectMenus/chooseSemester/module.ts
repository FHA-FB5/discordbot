import { MessageSelectMenu, SelectMenuInteraction, GuildMember } from 'discord.js';
import { getMessage } from '@/utils';
import { SuccessMessageEmbed, ErrorMessageEmbed } from '@/embeds';
import { StudyProgramModule, User } from '@/models';

export default {
  customId: 'choose-semester.module',
  cooldown: 10000,
  defaultPermission: false,
  data: new MessageSelectMenu()
    .setCustomId('choose-semester.module')
    .setPlaceholder(getMessage('selectMenu.noOptionSelected')),
  async execute(interaction: SelectMenuInteraction, context: any) {
    if (context.guild) {
      let moduleMessage = '';

      //add modules to user and the the message
      for (const moduleID of interaction.values) {
        const module = await StudyProgramModule.findOne({
          _id: moduleID,
        });
        if (module) {
          //add role to user
          if (interaction.member instanceof GuildMember) {
            const role = await interaction.guild?.roles.fetch(module.roleId);
            if (role) {
              interaction.member?.roles.add(role);
            } else {
              return interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('selectMenu.chooseSemester.modules.noRole') })] });
            }
          }

          //Set module for user
          await User.findOneAndUpdate({
            _id: context.user._id,
          }, {
            $addToSet: {
              'guilds.$[elem].studyProgramModules': module,
            },
          }, {
            arrayFilters: [
              {
                'elem.guild': context.guild,
              },
            ],
          }).exec();

          moduleMessage += '    - ' + module.name + '\n';
        } else {
          return interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('selectMenu.chooseSemester.modules.notFound') })], ephemeral: true });
        }
      }

      interaction.reply({ 
        embeds: [new SuccessMessageEmbed({ 
          description: getMessage('selectMenu.chooseSemester.modules.success', { parameter: { modules: moduleMessage } }),
        })], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('error.guildIsNull') })] });
    }
  },
};