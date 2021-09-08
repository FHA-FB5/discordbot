import { GuildMember, MessageSelectMenu, SelectMenuInteraction } from 'discord.js';
import { getMessage } from '@/utils';
import { SuccessMessageEmbed, ErrorMessageEmbed } from '@/embeds';
import { Game, User } from '@/models';

export default {
  customId: 'other.game.set',
  cooldown: 10000,
  defaultPermission: false,
  data: new MessageSelectMenu()
    .setCustomId('other.game.set')
    .setPlaceholder(getMessage('selectMenu.noOptionSelected')),
  async execute(interaction: SelectMenuInteraction, context: any) {
    if (context.user && context.guild) {
      let gameNames = '';

      for (const selectedGameID of interaction.values) {
        //get game
        const game = await Game.findOne({
          _id: selectedGameID,
        });

        //check if game is valid
        if (game) {
          //insert games into user
          User.findOneAndUpdate({
            _id: context.user._id,
          }, {
            $addToSet: {
              'guilds.$[elem].games': game,
            },
          }, {
            arrayFilters: [
              {
                'elem.guild': context.guild,
              },
            ],
          }).exec();

          //add role to user
          if (interaction.member instanceof GuildMember) {
            const role = await interaction.guild?.roles.fetch(game.roleId);
            if (role) {
              interaction.member?.roles.add(role);
            } else {
              return interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('selectMenu.other.game.set.error.role') })] });
            }
          }

          //create game name string
          gameNames += '   - ' + game.name + '\n';
        }
      }

      interaction.reply({ embeds: [new SuccessMessageEmbed({ description: getMessage('selectMenu.other.game.set.success', { parameter: { games: gameNames } }) })], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('error.guildIsNull') })] });
    }
  },
};