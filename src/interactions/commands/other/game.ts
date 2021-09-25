import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow } from 'discord.js';
import { getMessage } from '@/utils';
import { InfoMessageEmbed, ErrorMessageEmbed } from '@/embeds';
import * as gameSetMenu from '@/interactions/selectMenus/other/gameSet';
import * as gameRemoveMenu from '@/interactions/selectMenus/other/gameRemove';
import { Game, User } from '@/models';

export default {
  name: 'game',
  cooldown: 10000,
  data: new SlashCommandBuilder()
    .setName('game')
    .setDescription(getMessage('command.other.game.description'))
    .setDefaultPermission(true)
    .addSubcommand(cmd =>
      cmd.setName('set')
        .setDescription(getMessage('command.other.game.set.description')))
    .addSubcommand(cmd =>
      cmd.setName('remove')
        .setDescription(getMessage('command.other.game.remove.description'))),
  async execute(interaction: CommandInteraction, context: any) {
    if (context.guild && context.user) {
      const menueRow = new MessageActionRow();

      //get all games from user
      const user = await User.findOne({
        _id: context.user._id,
      });
      const userGames = user.guilds.find((entry: any) => entry.guild._id.toString() == context.guild._id.toString()).games;
      
      switch (interaction.options.getSubcommand()) {
        case 'set':

          //get all games the user has not on the profile
          const allGames = await Game.find({
            guild: context.guild,
            _id: {
              $nin: userGames,
            },
          });

          //check if guild has games
          if (allGames.length > 0 && allGames.length <= 25) {

            gameSetMenu.default.data.setMinValues(1);
            gameSetMenu.default.data.setMaxValues(Math.min(25, allGames.length));

            //Add games to select menu
            allGames.forEach((game: any) => {
              gameSetMenu.default.data.addOptions({
                label: game.abbreviation,
                description: game.name,
                value: game._id.toString(),
              });
            });

            menueRow.addComponents(gameSetMenu.default.data);
            await interaction.reply({ embeds: [new InfoMessageEmbed({ description: getMessage('command.other.game.set.success') })], components: [menueRow], ephemeral: true });
            gameSetMenu.default.data.options = [];
          } else {
            return interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.other.game.error.noGames') })] });
          }
          break;
        case 'remove':
          //check if user has games
          if (userGames.length > 0) {
            gameRemoveMenu.default.data.setMinValues(1);
            gameRemoveMenu.default.data.setMaxValues(Math.min(25, userGames.length));

            let count = 0;
            //Add games to select menu
            for (const gameID of userGames) {
              //get game from database
              const game = await Game.findOne({
                _id: gameID,
              });
              //add game to select menu
              gameRemoveMenu.default.data.addOptions({
                label: game.abbreviation,
                description: game.name,
                value: game._id.toString(),
              });
              count++;
              if (count == 25) {
                break;
              }
            }

            menueRow.addComponents(gameRemoveMenu.default.data);
            await interaction.reply({ embeds: [new InfoMessageEmbed({ description: getMessage('command.other.game.remove.success') })], components: [menueRow], ephemeral: true });
            gameRemoveMenu.default.data.options = [];
          } else {
            return interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.other.game.error.noGamesAdded') })] });
          }
          break;
      }
    } else {
      await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('error.guildIsNull') })] });
    }
  },
};