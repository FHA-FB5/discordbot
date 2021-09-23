import { ButtonInteraction, CommandInteraction, GuildMember, MessageComponentInteraction, Permissions, SelectMenuInteraction } from 'discord.js';
import { getMessage, keyv, logger } from '@/utils';
import { InfoMessageEmbed } from '@/embeds';
import GuildCacheHandler from '@/cacheHandler/GuildCacheHandler';
import UserCacheHandler from '@/cacheHandler/UserCacheHandler';
import { User } from '@/models';

async function cooldownHandler(key: string, cooldown: number, interaction: ButtonInteraction | CommandInteraction | MessageComponentInteraction | SelectMenuInteraction): Promise<boolean> {
  const cooldowns = keyv('cooldowns');
  const cooldownResponses = keyv('cooldownResponses');

  // get key
  let cooldownKey = `${key}:${interaction.user.id}`;
  if (interaction.inGuild()) {
    cooldownKey += `:${interaction.guildId}`;
  }

  const now = Date.now();
  const cooldownTimestamp = await cooldowns.get(cooldownKey);
  if (cooldownTimestamp) {
    const cooldownExpirationTime = cooldownTimestamp + cooldown;
    const cooldownResponseTimestamp = await cooldownResponses.get(cooldownKey);

    // return if cooldown response is on cooldown
    if (cooldownResponseTimestamp) {
      return true;
    }

    if (now < cooldownExpirationTime) {
      interaction.reply({
        embeds: [
          new InfoMessageEmbed({
            description: getMessage('command.cooldown', {
              count: Math.floor((cooldownExpirationTime - now) / 1000),
            }),
          }),
        ],
        ephemeral: true,
      });

      // set cooldown for cooldown response
      let cooldownResponseIgnoreTimestamp = cooldown * 0.2;
      if (cooldownResponseIgnoreTimestamp < 5000) {
        cooldownResponseIgnoreTimestamp = 5000;
      }
      await cooldownResponses.set(cooldownKey, now, cooldownResponseIgnoreTimestamp);
      return true;
    }
  }
  await cooldowns.set(cooldownKey, now, cooldown);
  return false;
}

async function interactionButton(interaction: ButtonInteraction, context: any) {
  const button = interaction.client.buttons.get(interaction.customId);

  if (!button) return;

  // check for coolodown
  if (button.cooldown) {
    if (await cooldownHandler(`button:${button.customId}`, button.cooldown, interaction)) return;
  }

  try {
    await button.execute(interaction, context);
  } catch (error) {
    logger.log('error', 'discord interactionCreate button.execute.error', error);
    await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
  }
}

async function interactionCommand(interaction: CommandInteraction, context: any) {
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) return;

  // check for coolodown
  if (command.cooldown) {
    if (await cooldownHandler(`command:${command.name}`, command.cooldown, interaction)) return;
  }

  try {
    await command.execute(interaction, context);
  } catch (error) {
    logger.log('error', 'discord interactionCreate command.execute.error', error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
}

async function interactionSelectMenu(interaction: SelectMenuInteraction, context: any) {
  const selectMenu = interaction.client.selectMenus.get(interaction.customId);

  if (!selectMenu) return;

  // check for coolodown
  if (selectMenu.cooldown) {
    if (await cooldownHandler(`selectMenu:${selectMenu.customId}`, selectMenu.cooldown, interaction)) return;
  }

  try {
    await selectMenu.execute(interaction, context);
  } catch (error) {
    logger.log('error', 'discord interactionCreate selectMenu.execute.error', error);
    await interaction.reply({ content: 'There was an error while executing this selectMenu!', ephemeral: true });
  }
}

async function createUser(member: GuildMember, thisGuild: any) {
  const user = await new UserCacheHandler(member.id).get();

  //Check if user exists
  if (user) {
    //Insert guild inside user (only ifr not existent (addToSet looks if its unique))
    const guildInsert = await User.findOne({
      _id: user._id,
      guilds: {
        $elemMatch: {
          guild: thisGuild._id,
        },
      },
    });
    if (!guildInsert) {
      User.findOneAndUpdate({
        _id: user._id,
      }, {
        $addToSet: {
          guilds: {
            guild: thisGuild,
          },
        },
      }).exec();
    }

  } else {
    //create user and insert guild
    const newUser = new User({
      userID: member.id,
      guilds: {
        guild: thisGuild,
      },
    });
    newUser.save();
  }
}

async function interactionHandler(interaction: MessageComponentInteraction) {
  let context: {
    guild: any,
    user: any,
  } = {
    guild: null,
    user: null,
  };

  // check for guild
  if (interaction.inGuild()) {
    // get guild and set if exists
    const guild = await new GuildCacheHandler(interaction.guildId).get();
    if (guild) {
      context.guild = guild;
    }
  }

  //Create or update user object inside database
  if (context.guild && interaction.inGuild() && interaction.member instanceof GuildMember) {
    await createUser(interaction.member, context.guild);
  }

  // set user
  const user = await new UserCacheHandler(interaction.user.id).get();
  if (user) {
    context.user = user;
  }

  // check interaction and try to execute
  if (interaction.isCommand()) {
    await interactionCommand(interaction, context);
  } else if (interaction.isButton()) {
    await interactionButton(interaction, context);
  } else if (interaction.isSelectMenu()) {
    await interactionSelectMenu(interaction, context);
  } else {
    logger.log('warn', 'discord interactionCreate.unknown', interaction);
  }
}

export default {
  name: 'interactionCreate',
  async execute(interaction: MessageComponentInteraction) {
    await interactionHandler(interaction);
  },
};
