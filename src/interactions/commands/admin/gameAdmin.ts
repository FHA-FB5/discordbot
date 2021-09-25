import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Role } from 'discord.js';
import { getMessage } from '@/utils';
import { ErrorMessageEmbed, InfoMessageEmbed, SuccessMessageEmbed } from '@/embeds';
import { Game } from '@/models';

export default {
  name: 'game-admin',
  cooldown: 1000,
  ownerHasPermissionOnDefault: true,
  data: new SlashCommandBuilder()
    .setName('game-admin')
    .setDescription(getMessage('command.admin.gameAdmin.description'))
    .setDefaultPermission(false)
    .addSubcommand(cmd => 
      cmd.setName('add')
        .setDescription(getMessage('command.admin.gameAdmin.add.description'))
        .addStringOption(option => 
          option.setName('name')
            .setDescription(getMessage('command.admin.gameAdmin.add.name.description'))
            .setRequired(true))
        .addStringOption(option => 
          option.setName('abbreviation')
            .setDescription(getMessage('command.admin.gameAdmin.add.abbreviation.description'))
            .setRequired(true)))
    .addSubcommand(cmd => 
      cmd.setName('remove')
        .setDescription(getMessage('command.admin.gameAdmin.remove.description'))
        .addRoleOption(option =>
          option.setName('name')
            .setDescription(getMessage('command.admin.gameAdmin.remove.name.description'))
            .setRequired(true)))
    .addSubcommand(cmd =>
      cmd.setName('list')
        .setDescription(getMessage('command.admin.gameAdmin.list.description'))),
  async execute(interaction: CommandInteraction, context: any) {
    //Check if guild is initialized
    if (context.guild) {
      switch (interaction.options.getSubcommand(true)) {
        case 'add':
          const gameName = interaction.options.getString('name');
          const gameAbbreviation = interaction.options.getString('abbreviation');

          //Check if game exists
          const foundGameCountAdd = await Game.countDocuments({
            guild: context.guild,
            $or: [
              { name: gameName },
              { abbreviation: gameAbbreviation },
            ],
          });

          //Check if game already exists
          if (foundGameCountAdd == 0) { 
            //Create role for the game
            const roleAdd = await interaction.guild?.roles.create({
              name: gameAbbreviation || '',
              permissions: [],
              reason: '/game-admin add ' + gameName + ' ' + gameAbbreviation,
            });

            //Check if role creation was successful
            if (!roleAdd) {
              return interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.gameAdmin.add.error.role') })] });
            }

            //Insert game into database
            const game = new Game({
              guild: context.guild,
              name: gameName,
              abbreviation: gameAbbreviation,
              roleId: roleAdd.id,
            });
            game.save();

            interaction.reply({ embeds: [new SuccessMessageEmbed({ description: getMessage('command.admin.gameAdmin.add.success', { parameter: { name: gameName, abbreviation: gameAbbreviation } }) })] });
          } else {
            interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.gameAdmin.add.error.duplicate') })] });
          }

          break;
        case 'remove':
          const roleRemove = interaction.options.getRole('name');

          //Check if role is game
          const foundGameCountRemove = await Game.countDocuments({
            guild: context.guild,
            roleId: roleRemove?.id,
          });

          if (foundGameCountRemove > 0) {
            //Delete game from database
            Game.findOneAndDelete({
              guild: context.guild,
              roleId: roleRemove?.id,
            }).exec();

            //Delete role
            if (roleRemove instanceof Role) {
              roleRemove.delete();
            }

            interaction.reply({ embeds: [new SuccessMessageEmbed({ description: getMessage('command.admin.gameAdmin.remove.success') })] });
          } else {
            interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.gameAdmin.remove.error.noGame') })] });
          }
          break;
        case 'list':
          //Get all games from database
          const allGames = await Game.find({
            guild: context.guild,
          });

          //Add all game names to string
          let gameNames = '';
          for (let i = 0; i < allGames.length; i++) {
            gameNames += allGames[i].name + ' (' + allGames[i].abbreviation + ')';
            if (i != allGames.length - 1) {
              gameNames += '\n';
            }
          }
          
          interaction.reply({ embeds: [new InfoMessageEmbed({ description: getMessage('command.admin.gameAdmin.list.success', { parameter: { games: gameNames } }) })] });
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