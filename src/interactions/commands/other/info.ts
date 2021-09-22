import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow } from 'discord.js';
import { getMessage } from '@/utils';
import { EmptyMessageEmbed } from '@/embeds';
import * as astaWebsiteButton from '@/interactions/buttons/other/infoAStAWebsite';
import * as bibSearchButton from '@/interactions/buttons/other/infoBibliothekSearch';
import * as campusOfficeLinkButton from '@/interactions/buttons/other/infoCampusOfficeLink';
import * as emailInformationButton from '@/interactions/buttons/other/infoEMailInformation';
import * as emailWebmailButton from '@/interactions/buttons/other/infoEMailWebmail';
import * as fsrWebsiteButton from '@/interactions/buttons/other/infoFSRWebsite';
import * as iliasLinkButton from '@/interactions/buttons/other/infoIliasLink';
import * as qisLinkButton from '@/interactions/buttons/other/infoQISLink';
import * as servicesLinkButton from '@/interactions/buttons/other/infoServicesLink';
import * as testatLinkButton from '@/interactions/buttons/other/infoTestatLink';
import * as videoLinkButton from '@/interactions/buttons/other/infoVideoLink';
import * as vpnInformationButton from '@/interactions/buttons/other/infoVPNInformation';
import * as vpnTestButton from '@/interactions/buttons/other/infoVPNTest';

export default {
  name: 'info',
  cooldown: 10000,
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription(getMessage('command.other.info.description'))
    .setDefaultPermission(true)
    .addStringOption(option =>
      option.setName('target')
        .setDescription(getMessage('command.other.info.target.description'))
        .setRequired(true)
        .addChoice('FSR', 'fsr')
        .addChoice('ESP', 'esp')
        .addChoice('AStA', 'asta')
        .addChoice('CampusOffice', 'campusoffice')
        .addChoice('QIS', 'qis')
        .addChoice('Services', 'services')
        .addChoice('Ilias', 'ilias')
        .addChoice('Bibliothek', 'bib')
        .addChoice('Video (früher Electures)', 'video')
        .addChoice('Testatverwaltung', 'testat')
        .addChoice('E-Mail', 'email')
        .addChoice('VPN', 'vpn')
        .addChoice('Ersti-Reader', 'erstireader')
        .addChoice('Discord-Bot', 'discordbot')),
  async execute(interaction: CommandInteraction) {
    const embed = new EmptyMessageEmbed({ 
      title: getMessage('command.other.info.target.' + interaction.options.getString('target') + '.title'), 
      description: getMessage('command.other.info.target.' + interaction.options.getString('target') + '.text'),
      color: '#34dbcd',
    });
    const buttonRow = new MessageActionRow();
    switch (interaction.options.getString('target')) {
      case 'fsr':
        buttonRow.addComponents(fsrWebsiteButton.default.data);
        break;
      case 'asta':
        buttonRow.addComponents(astaWebsiteButton.default.data);
        break;
      case 'campusoffice':
        buttonRow.addComponents(campusOfficeLinkButton.default.data);
        break;
      case 'qis':
        buttonRow.addComponents(qisLinkButton.default.data);
        break;
      case 'services':
        buttonRow.addComponents(servicesLinkButton.default.data);
        break;
      case 'ilias':
        buttonRow.addComponents(iliasLinkButton.default.data);
        break;
      case 'bib':
        buttonRow.addComponents(bibSearchButton.default.data);
        break;
      case 'video':
        buttonRow.addComponents(videoLinkButton.default.data);
        break;
      case 'testat':
        buttonRow.addComponents(testatLinkButton.default.data);
        break;
      case 'email':
        buttonRow.addComponents(emailInformationButton.default.data);
        buttonRow.addComponents(emailWebmailButton.default.data);
        break;
      case 'vpn':
        buttonRow.addComponents(vpnInformationButton.default.data);
        buttonRow.addComponents(vpnTestButton.default.data);
        break;
      case 'discordbot':
        embed.addField(getMessage('command.other.info.target.discordbot.github.title'), getMessage('command.other.info.target.discordbot.github.text'));
        embed.addField(getMessage('command.other.info.target.discordbot.copyright.title'), getMessage('command.other.info.target.discordbot.copyright.text'));
        break;
    }

    if (buttonRow.components.length > 0) {
      await interaction.reply({ embeds: [embed], components: [buttonRow] });
    } else {
      await interaction.reply({ embeds: [embed] });
    }
  },
};