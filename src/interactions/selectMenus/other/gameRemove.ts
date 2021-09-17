import { GuildMember, MessageSelectMenu, SelectMenuInteraction } from 'discord.js';
import { getMessage } from '@/utils';
import { SuccessMessageEmbed, ErrorMessageEmbed } from '@/embeds';
import { Game, User } from '@/models';

export default {
  customId: 'other.game.remove',
  cooldown: 10000,
  defaultPermission: false,
  data: new MessageSelectMenu()
    .setCustomId('other.game.remove')
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
          //DELETE NOT WORKING

          //remove games from user
          await User.findOne({
            _id: context.user._id,
          }, function (err: any, result: any) {
            result.guilds.forEach(function (guild: any) {
              if (guild.guild == context.guild._id) {
                guild.games.pull(game._id);
              }
            });
            result.save();
          });

          //remove role from user
          if (interaction.member instanceof GuildMember) {
            const role = await interaction.guild?.roles.fetch(game.roleId);
            if (role) {
              interaction.member?.roles.remove(role);
            } else {
              return interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('selectMenu.other.game.remove.error.role') })] });
            }
          }

          //create game name string
          gameNames += '   - ' + game.name + '\n';
        }
      }

      interaction.reply({ embeds: [new SuccessMessageEmbed({ description: getMessage('selectMenu.other.game.remove.success', { parameter: { games: gameNames } }) })], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('error.guildIsNull') })] });
    }
  },
};