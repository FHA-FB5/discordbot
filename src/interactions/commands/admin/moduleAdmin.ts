import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow, Role } from 'discord.js';
import { getMessage } from '@/utils';
import { SuccessMessageEmbed, ErrorMessageEmbed, InfoMessageEmbed } from '@/embeds';
import * as studyProgramMenu from '@/interactions/selectMenus/chooseSemester/studyProgram';
import { StudyProgram, StudyProgramModule, User } from '@/models';

export default {
  name: 'module-admin',
  cooldown: 10000,
  defaultPermission: false,
  data: new SlashCommandBuilder()
    .setName('module-admin')
    .setDescription(getMessage('command.admin.moduleAdmin.description'))
    .addSubcommandGroup(group => 
      group.setName('add')
        .setDescription(getMessage('command.admin.moduleAdmin.add.description'))
        .addSubcommand(cmd => 
          cmd.setName('study-program')
            .setDescription(getMessage('command.admin.moduleAdmin.add.studyProgram.description'))
            .addStringOption(option =>
              option.setName('name')
                .setDescription(getMessage('command.admin.moduleAdmin.add.studyProgram.name.description'))
                .setRequired(true))
            .addStringOption(option =>
              option.setName('abbreviation')
                .setDescription(getMessage('command.admin.moduleAdmin.add.studyProgram.abbreviation.description'))
                .setRequired(true)))
        .addSubcommand(cmd => 
          cmd.setName('study-program-module')
            .setDescription(getMessage('command.admin.moduleAdmin.add.studyProgramModule.description'))
            .addRoleOption(option =>
              option.setName('study-program')
                .setDescription(getMessage('command.admin.moduleAdmin.add.studyProgramModule.studyProgram.description'))
                .setRequired(true))
            .addStringOption(option =>
              option.setName('name')
                .setDescription(getMessage('command.admin.moduleAdmin.add.studyProgramModule.name.description'))
                .setRequired(true))
            .addStringOption(option =>
              option.setName('abbreviation')
                .setDescription(getMessage('command.admin.moduleAdmin.add.studyProgramModule.abbreviation.description'))
                .setRequired(true))
            .addIntegerOption(option =>
              option.setName('semester')
                .setDescription(getMessage('command.admin.moduleAdmin.add.studyProgramModule.semester.description'))
                .setRequired(true))))
    .addSubcommandGroup(group => 
      group.setName('remove')
        .setDescription(getMessage('command.admin.moduleAdmin.remove.description'))
        .addSubcommand(cmd => 
          cmd.setName('study-program')
            .setDescription(getMessage('command.admin.moduleAdmin.remove.studyProgram.description'))
            .addRoleOption(option =>
              option.setName('name')
                .setDescription(getMessage('command.admin.moduleAdmin.remove.studyProgram.name.description'))
                .setRequired(true)))
        .addSubcommand(cmd => 
          cmd.setName('study-program-module')
            .setDescription(getMessage('command.admin.moduleAdmin.remove.studyProgramModule.description'))
            .addRoleOption(option =>
              option.setName('name')
                .setDescription(getMessage('command.admin.moduleAdmin.remove.studyProgramModule.name.description'))
                .setRequired(true))
            .addRoleOption(option =>
              option.setName('study-program')
                .setDescription(getMessage('command.admin.moduleAdmin.remove.studyProgramModule.studyProgram.description'))
                .setRequired(false))))
    .addSubcommandGroup(group =>
      group.setName('setup')
        .setDescription(getMessage('command.admin.moduleAdmin.setup.description'))
        .addSubcommand(cmd =>
          cmd.setName('channel')
            .setDescription(getMessage('command.admin.moduleAdmin.setup.channel.description'))))
    .addSubcommandGroup(group =>
      group.setName('list')
        .setDescription(getMessage('command.admin.moduleAdmin.list.description'))
        .addSubcommand(cmd =>
          cmd.setName('all')
            .setDescription(getMessage('command.admin.moduleAdmin.list.all.description')))),
  async execute(interaction: CommandInteraction, context: any) {
    if (context.guild) {
      switch (interaction.options.getSubcommandGroup()) {
        case 'add':
          const name = interaction.options.getString('name');
          const abbreviation = interaction.options.getString('abbreviation');
          switch (interaction.options.getSubcommand()) {
            case 'study-program':
  
              //Check if studyProgram exists
              const studyProgramCountAdd = await StudyProgram.countDocuments({
                guild: context.guild,
                $or: [
                  { name: name },
                  { abbreviation: abbreviation },
                ],
              });
  
              if (studyProgramCountAdd == 0) {
                //Create role for the studyProgram
                const roleStudyProgramAdd = await interaction.guild?.roles.create({
                  name: abbreviation || '',
                  permissions: [],
                  reason: '/module-admin add ' + name + ' ' + abbreviation,
                });
  
                //Check if role creation was successful
                if (!roleStudyProgramAdd) {
                  return interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.moduleAdmin.add.studyProgram.error.role') })] });
                }
  
                //Insert studyProgram into database
                const studyProgram = new StudyProgram({
                  guild: context.guild,
                  name: name,
                  abbreviation: abbreviation,
                  roleId: roleStudyProgramAdd.id,
                });
                studyProgram.save();
  
                interaction.reply({ embeds: [new SuccessMessageEmbed({ description: getMessage('command.admin.moduleAdmin.add.studyProgram.success', { parameter: { name: name, abbreviation: abbreviation } }) })] });
              } else {
                interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.moduleAdmin.add.studyProgram.error.duplicate') })] });
              }
              break;
            case 'study-program-module':
              //Check if role is studyProgram
              const studyProgramAddModule = await StudyProgram.findOne({
                guild: context.guild,
                roleId: interaction.options.getRole('study-program')?.id,
              }).populate('modules.module');
  
              //Check if the selected role is a studyProgram
              if (studyProgramAddModule) {
                //Check if studyProgramModule exists
                const studyProgramModuleAddModule = await StudyProgramModule.findOne({
                  guild: context.guild,
                  name: name,
                  abbreviation: abbreviation,
                });
  
                //Check if the studyProgramModule exists
                if (!studyProgramModuleAddModule) {
                  //Modul is new and never used
  
                  //Create role for the module
                  const roleStudyProgramModuleAdd = await interaction.guild?.roles.create({
                    name: abbreviation || '',
                    permissions: [],
                    reason: '/module-admin add ' + name + ' ' + abbreviation,
                  });
  
                  //Check if role creation was successful
                  if (!roleStudyProgramModuleAdd) {
                    return interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.moduleAdmin.add.studyProgramModule.error.role') })] });
                  }
  
                  //Insert studyProgramModule into database
                  const newStudyProgramModule = new StudyProgramModule({
                    guild: context.guild,
                    name: name,
                    abbreviation: abbreviation,
                    roleId: roleStudyProgramModuleAdd.id,
                  });
                  newStudyProgramModule.save();
  
                  //Add module to study program
                  StudyProgram.findOneAndUpdate({
                    _id: studyProgramAddModule._id,
                  }, {
                    $push: {
                      modules: {
                        module: newStudyProgramModule,
                        semester: interaction.options.getInteger('semester'),
                      },
                    },
                  }).exec();
                    
                  interaction.reply({ embeds: [new SuccessMessageEmbed({ description: getMessage('command.admin.moduleAdmin.add.studyProgramModule.successNew', { parameter: { studyProgram: studyProgramAddModule.name, name: name, abbreviation: abbreviation } }) })] });
                } else {
                  //Module is used before, check if its already added to the studyProgram
  
                  //Check if module is already added to studyProgram
                  if (studyProgramAddModule.modules.some((entry: any) => entry.module._id.toString() === studyProgramModuleAddModule._id.toString())) {
                    //Add module to study program
                    StudyProgram.findOneAndUpdate({
                      _id: studyProgramAddModule._id,
                    }, {
                      $push: {
                        modules: {
                          module: studyProgramModuleAddModule,
                          semester: interaction.options.getInteger('semester'),
                        },
                      },
                    }).exec();
  
                    interaction.reply({ embeds: [new SuccessMessageEmbed({ description: getMessage('command.admin.moduleAdmin.add.studyProgramModule.success', { parameter: { studyProgram: studyProgramAddModule.name, name: name, abbreviation: abbreviation } }) })] });
                  } else {
                    interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.moduleAdmin.add.studyProgramModule.error.alreadyAdded') })] });
                  }
                }
              } else {
                interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.moduleAdmin.add.studyProgramModule.error.noStudyProgram') })] });
              }
              break;
            default:
              await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('error.unknown') })] });
              break;
          }
          break;
        case 'remove':
          switch (interaction.options.getSubcommand()) {
            case 'study-program':
              const studyProgramRoleRemove = interaction.options.getRole('name');

              //Check if role is studyProgram
              const studyProgramRemove = await StudyProgram.findOne({
                guild: context.guild,
                roleId: studyProgramRoleRemove?.id,
              });

              //check if role is a studyProgram
              if (studyProgramRemove) {
  
                //Remove studyProgram from user
                await User.updateMany({
                  guilds: {
                    $elemMatch: {
                      guild: context.guild,
                      studyProgram: {
                        $elemMatch: studyProgramRemove,
                      },
                    },
                  },
                }, {
                  $pull: {
                    guilds: {
                      studyProgram: studyProgramRemove,
                    },
                  },
                }).exec();
  
                //Delete discord role
                if (studyProgramRoleRemove instanceof Role) {
                  studyProgramRoleRemove?.delete();
                }
                
                //Delete module from database
                StudyProgram.findOneAndDelete({
                  _id: studyProgramRemove._id,
                }).exec();
                
                interaction.reply({ embeds: [new SuccessMessageEmbed({ description: getMessage('command.admin.moduleAdmin.remove.studyProgram.success', { parameter: { name: studyProgramRemove.name } }) })] });
              } else {
                interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.moduleAdmin.remove.studyProgram.error.noStudyProgram') })] });
              }
              break;
            case 'study-program-module':
              //Check if remove is for the whole module or only from a studyProgram
              if (interaction.options.getRole('study-program')) {
                //Check if role is studyProgramModule
                const studyProgramRemoveModule = await StudyProgram.findOne({
                  guild: context.guild,
                  roleId: interaction.options.getRole('study-program')?.id,
                }).populate('modules.module');

                if (studyProgramRemoveModule) {
                  //Check if role is studyProgramModule
                  const studyProgramModuleRemoveModule = await StudyProgramModule.findOne({
                    guild: context.guild,
                    roleId: interaction.options.getRole('name')?.id,
                  });
                  if (studyProgramModuleRemoveModule) { 
                    //Check if module is part of the studyProgram
                    if (studyProgramRemoveModule.modules.some((entry: any) => entry.module._id.toString() === studyProgramModuleRemoveModule._id.toString())) {
                      //Remove module from study programs
                      await StudyProgram.updateOne({
                        _id: studyProgramRemoveModule._id,
                      }, {
                        $pull: {
                          modules: {
                            module: studyProgramModuleRemoveModule,
                          },
                        },
                      }).exec();
  
                      interaction.reply({ embeds: [new SuccessMessageEmbed({ description: getMessage('command.admin.moduleAdmin.remove.studyProgramModule.success.studyProgram', { parameter: { name: studyProgramModuleRemoveModule.name, studyProgram: studyProgramRemoveModule.name } }) })] });
                    } else {
                      interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.moduleAdmin.remove.studyProgramModule.error.notMemberOfStudyProgram') })] });
                    }
                  } else {
                    interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.moduleAdmin.remove.studyProgramModule.error.noStudyProgramModule') })] });
                  }
                } else {
                  interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.moduleAdmin.remove.studyProgramModule.error.noStudyProgram') })] });
                }
              } else {
                //Check if role is studyProgramModule
                const studyProgramModuleRoleRemoveModule = interaction.options.getRole('name');
                const studyProgramModuleRemoveModule2 = await StudyProgramModule.findOne({
                  guild: context.guild,
                  roleId: studyProgramModuleRoleRemoveModule?.id,
                });
                if (studyProgramModuleRemoveModule2) {
                  //Remove module from all study programs
  
                  await StudyProgram.updateMany({
                    guild: context.guild,
                    modules: {
                      $elemMatch: {
                        module: studyProgramModuleRemoveModule2,
                      },
                    },
                  }, {
                    $pull: {
                      modules: {
                        module: studyProgramModuleRemoveModule2, 
                      },
                    },
                  }).exec();
  
                  //Remove module from users
                  await User.updateMany({
                    guilds: {
                      $elemMatch: {
                        guild: context.guild,
                        studyProgramModules: {
                          $elemMatch: studyProgramModuleRemoveModule2,
                        },
                      },
                    },
                  }, {
                    $pull: {
                      guilds: {
                        studyProgramModules: studyProgramModuleRemoveModule2,
                      },
                    },
                  }).exec();
  
                  //Delete discord role
                  if (studyProgramModuleRoleRemoveModule instanceof Role) {
                    studyProgramModuleRoleRemoveModule?.delete();
                  }
  
                  //Delete module from database
                  StudyProgramModule.findOneAndDelete({
                    _id: studyProgramModuleRemoveModule2._id,
                  }).exec();
  
                  interaction.reply({ embeds: [new SuccessMessageEmbed({ description: getMessage('command.admin.moduleAdmin.remove.studyProgramModule.success.studyProgramModule', { parameter: { name: studyProgramModuleRemoveModule2.name } }) })] });
                } else {
                  interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.moduleAdmin.remove.studyProgramModule.error.noStudyProgramModule') })] });
                }
              }
              break;
            default:
              await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('error.unknown') })] });
              break;
          }
          break;
        case 'setup':
          switch (interaction.options.getSubcommand()) {
            case 'channel':
              await interaction.deferReply();
              const menuRow = new MessageActionRow();
  
              //Get all studyPrograms from the database
              const allStudyPrograms = await StudyProgram.find({
                guild: context.guild,
              });
  
              if (allStudyPrograms.length > 0) {
                //add all studyPrograms to the select menu
                allStudyPrograms.forEach((oneStudyProgram: any) => {
                  studyProgramMenu.default.data.addOptions({
                    label: oneStudyProgram.abbreviation,
                    description: oneStudyProgram.name,
                    value: oneStudyProgram._id.toString(),
                  });
                });
  
                menuRow.addComponents(studyProgramMenu.default.data);
                if (interaction.channel) {
                  interaction.channel.send({ embeds: [new InfoMessageEmbed({ description: getMessage('selectMenu.chooseSemester.start.message') })], components: [menuRow] });
                  studyProgramMenu.default.data.options = [];
                  await interaction.deleteReply();
                } else {
                  await interaction.editReply({ embeds: [new ErrorMessageEmbed({ description: getMessage('error.unknown') })] });
                }
              } else {
                await interaction.editReply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.moduleAdmin.setup.channel.error.noStudyPrograms') })] });
              }
              break;
            default:
              await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('error.unknown') })] });
              break;
          }
          break;
        case 'list': 
          switch (interaction.options.getSubcommand()) {
            case 'all':
  
              //get all studyPrograms and modules from db
              const allPrograms = await StudyProgram.find({
                guild: context.guild,
              }).populate('modules.module');
  
              const allModules = await StudyProgramModule.find({
                guild: context.guild,
              });
              
              //add studyPrograms and the modules to the string
              let allProgramsText = '';
              await allPrograms.forEach(async (p: any) => {
                allProgramsText += p.name + ' (' + p.abbreviation + ')\n';
                await p.modules.forEach(async (m: any) => {
                  allProgramsText += '   - ' + m.module.abbreviation + ' (Semester: ' + m.semester + ')\n';
                });
              });
  
              //add all modules to the string
              let allModulesText = '';
              allModules.forEach((m: any) => {
                allModulesText += m.name + ' (' + m.abbreviation + ')\n';
              });
  
              interaction.reply({ embeds: [new InfoMessageEmbed({ description: getMessage('command.admin.moduleAdmin.list.all.success', { parameter: { programs: allProgramsText, modules: allModulesText } }) })] });
              break;
          }
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