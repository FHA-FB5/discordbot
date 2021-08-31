import { ButtonInteraction, CommandInteraction, MessageComponentInteraction, SelectMenuInteraction } from 'discord.js';
import { getMessage, GuildOptions, keyv, logger } from '@/utils';
import { InfoMessageEmbed } from '@/embeds';

async function cooldownHandler(key: string, cooldown: number, interaction: ButtonInteraction | CommandInteraction | MessageComponentInteraction | SelectMenuInteraction): boolean {
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
    if (await cooldownHandler(`${button.customId}`, button.cooldown, interaction)) return;
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
    if (await cooldownHandler(`${command.name}`, command.cooldown, interaction)) return;
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
    if (await cooldownHandler(`${selectMenu.customId}`, selectMenu.cooldown, interaction)) return;
  }

  try {
    await selectMenu.execute(interaction, context);
  } catch (error) {
    logger.log('error', 'discord interactionCreate selectMenu.execute.error', error);
    await interaction.reply({ content: 'There was an error while executing this selectMenu!', ephemeral: true });
  }
}

async function interactionHandler(interaction: MessageComponentInteraction) {
  let context: {
    guildOptions: any
  } = {
    guildOptions: null,
  };

  // check for guild
  if (interaction.inGuild()) {

    // get guild options and set if exists
    const guildOptions = await new GuildOptions(interaction.guildId).get();

    if (guildOptions) {
      context.guildOptions = guildOptions;
    }
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
