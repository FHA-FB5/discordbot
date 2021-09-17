import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import { getMessage } from '@/utils';
import { ErrorMessageEmbed, SuccessMessageEmbed } from '@/embeds';
import { User, StudyProgram, StudyProgramModule } from '@/models';

export default {
  name: 'semester-admin',
  cooldown: 10000,
  defaultPermission: false,
  data: new SlashCommandBuilder()
    .setName('semester-admin')
    .setDescription(getMessage('command.admin.semesterAdmin.description'))
    .addSubcommandGroup(group =>
      group.setName('set')
        .setDescription(getMessage('command.admin.semesterAdmin.set.description'))
        .addSubcommand(cmd =>
          cmd.setName('study-program')
            .setDescription(getMessage('command.admin.semesterAdmin.set.studyProgram.description'))
            .addUserOption(option =>
              option.setName('user')
                .setDescription(getMessage('command.admin.semesterAdmin.set.studyProgram.user.description'))
                .setRequired(true))
            .addRoleOption(option =>
              option.setName('name')
                .setDescription(getMessage('command.admin.semesterAdmin.set.studyProgram.name.description'))
                .setRequired(true))
            .addIntegerOption(option =>
              option.setName('semester')
                .setDescription(getMessage('command.admin.semesterAdmin.set.studyProgram.semester.description'))
                .setRequired(true)))
        .addSubcommand(cmd =>
          cmd.setName('study-program-module')
            .setDescription(getMessage('command.admin.semesterAdmin.set.studyProgramModule.description'))
            .addUserOption(option =>
              option.setName('user')
                .setDescription(getMessage('command.admin.semesterAdmin.set.studyProgramModule.user.description'))
                .setRequired(true))
            .addRoleOption(option =>
              option.setName('name')
                .setDescription(getMessage('command.admin.semesterAdmin.set.studyProgramModule.name.description'))
                .setRequired(true))))
    .addSubcommandGroup(group =>
      group.setName('remove')
        .setDescription(getMessage('command.admin.semesterAdmin.remove.description'))
        .addSubcommand(cmd =>
          cmd.setName('study-program')
            .setDescription(getMessage('command.admin.semesterAdmin.remove.studyProgram.description'))
            .addUserOption(option =>
              option.setName('user')
                .setDescription(getMessage('command.admin.semesterAdmin.remove.studyProgram.user.description'))
                .setRequired(true))
            .addRoleOption(option =>
              option.setName('name')
                .setDescription(getMessage('command.admin.semesterAdmin.remove.studyProgram.name.description'))
                .setRequired(true)))
        .addSubcommand(cmd =>
          cmd.setName('study-program-module')
            .setDescription(getMessage('command.admin.semesterAdmin.remove.studyProgramModule.description'))
            .addUserOption(option =>
              option.setName('user')
                .setDescription(getMessage('command.admin.semesterAdmin.remove.studyProgramModule.user.description'))
                .setRequired(true))
            .addRoleOption(option =>
              option.setName('name')
                .setDescription(getMessage('command.admin.semesterAdmin.remove.studyProgramModule.name.description'))
                .setRequired(true))))
    .addSubcommandGroup(group =>
      group.setName('list')
        .setDescription(getMessage('command.admin.semesterAdmin.list.description'))
        .addSubcommand(cmd =>
          cmd.setName('all')
            .setDescription(getMessage('command.admin.semesterAdmin.list.all.description'))
            .addUserOption(option =>
              option.setName('user')
                .setDescription(getMessage('command.admin.semesterAdmin.list.all.user.description'))
                .setRequired(true)))),
  async execute(interaction: CommandInteraction, context: any) {
    if (context.guild) {
      //get user from db
      const user = await User.findOne({
        userID: interaction.options.getUser('user')?.id,
      }).populate({
        path: 'guilds',
        populate: {
          path: 'studyPrograms',
          populate: {
            path: 'studyProgram',
          },
        },
      }).exec();

      //check if user exists
      if (user) {
        //get guild entry inside user and username
        const userGuildEntrySet = user.guilds.find((element: any) => element.guild._id.toString() == context.guild._id.toString());
        const member = (interaction.options.getMember('user') as GuildMember);

        switch (interaction.options.getSubcommandGroup()) {
          case 'set':
            switch (interaction.options.getSubcommand()) {
              case 'study-program':
                //get studyProgram from db
                const studyProgramSet = await StudyProgram.findOne({
                  roleId: interaction.options.getRole('name')?.id,
                });

                //check if studyProgram exists
                if (studyProgramSet) {
                  //check if user has already this studyProgram
                  if (!userGuildEntrySet.studyPrograms.some((element: any) => element.studyProgram._id.toString() == studyProgramSet._id.toString())) {
                    //get highest semester from db

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

                    const highestSemesterSet = await StudyProgram.findOne({
                      _id: studyProgramSet._id,
                    }).sort({ 'modules.semester': 'desc' }).exec();

                    // get highest semester
                    let highestSemesterSetInt = 1;
                    highestSemesterSet.modules.forEach((module: any) => {
                      if (module.semester > highestSemesterSetInt) {
                        highestSemesterSetInt = module.semester;
                      }
                    });

                    //check if entered semester fits to the studyProgram
                    const semesterSet = interaction.options.getInteger('semester');
                    if (semesterSet && semesterSet > 0 && semesterSet <= highestSemesterSetInt) {

                      //add role to user
                      const studyProgramRole = await interaction.guild?.roles.fetch(studyProgramSet.roleId);
                      if (studyProgramRole) {
                        member.roles.add(studyProgramRole);
                      } else {
                        return interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.semesterAdmin.set.studyProgram.error.noRole') })] });
                      }

                      //Set study program for user
                      await User.findOneAndUpdate({
                        _id: user._id,
                      }, {
                        $addToSet: {
                          'guilds.$[elem].studyPrograms': {
                            studyProgram: studyProgramSet,
                            semester: semesterSet,
                          },
                        },
                      }, {
                        arrayFilters: [
                          {
                            'elem.guild': context.guild,
                          },
                        ],
                      }).exec();

                      await interaction.reply({ embeds: [new SuccessMessageEmbed({ description: getMessage('command.admin.semesterAdmin.set.studyProgram.success', { parameter: { studyProgram: studyProgramSet.name, userName: member.nickname } }) })] });
                    } else {
                      await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.semesterAdmin.set.studyProgram.error.semesterRange') })] });
                    }
                  } else {
                    await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.semesterAdmin.set.studyProgram.error.alreadyAdded') })] });
                  }
                } else {
                  await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.semesterAdmin.set.studyProgram.error.noStudyProgram') })] });
                }
                break;
              case 'study-program-module':
                //get studyProgramModule from db
                const studyProgramModuleSet = await StudyProgramModule.findOne({
                  roleId: interaction.options.getRole('name')?.id,
                });

                //check if studyProgram exists
                if (studyProgramModuleSet) {
                  //check if user has already this studyProgramModule
                  if (!userGuildEntrySet.studyProgramModules.some((element: any) => element._id.toString() == studyProgramModuleSet._id.toString())) {

                    //add role to user
                    const studyProgramModuleRole = await interaction.guild?.roles.fetch(studyProgramModuleSet.roleId);
                    if (studyProgramModuleRole) {
                      member.roles.add(studyProgramModuleRole);
                    } else {
                      return interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.semesterAdmin.set.studyProgramModule.error.noRole') })] });
                    }

                    //Set studyProgramModule for user
                    await User.findOneAndUpdate({
                      _id: user._id,
                    }, {
                      $addToSet: {
                        'guilds.$[elem].studyProgramModules': studyProgramModuleSet,
                      },
                    }, {
                      arrayFilters: [
                        {
                          'elem.guild': context.guild,
                        },
                      ],
                    }).exec();

                    await interaction.reply({ embeds: [new SuccessMessageEmbed({ description: getMessage('command.admin.semesterAdmin.set.studyProgramModule.success', { parameter: { studyProgramModule: studyProgramModuleSet.name, userName: member.nickname } }) })] });
                  } else {
                    await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.semesterAdmin.set.studyProgramModule.error.alreadyAdded') })] });
                  }
                } else {
                  await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.semesterAdmin.set.studyProgramModule.error.noStudyProgram') })] });
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
                //get studyProgram from db
                const studyProgramRemove = await StudyProgram.findOne({
                  roleId: interaction.options.getRole('name')?.id,
                });

                //check if studyProgram exists
                if (studyProgramRemove) {
                  //check if user has this studyProgram
                  if (userGuildEntrySet.studyPrograms.some((element: any) => element.studyProgram._id.toString() == studyProgramRemove._id.toString())) {
                    //remove role from user
                    const studyProgramRole = await interaction.guild?.roles.fetch(studyProgramRemove.roleId);
                    if (studyProgramRole) {
                      member.roles.remove(studyProgramRole);
                    } else {
                      return interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.semesterAdmin.remove.studyProgram.error.noRole') })] });
                    }

                    //Remove study program for user
                    await User.findOneAndUpdate({
                      _id: user._id,
                    }, {
                      $pull: {
                        'guilds.$[elem].studyPrograms': {
                          studyProgram: studyProgramRemove,
                        },
                      },
                    }, {
                      arrayFilters: [
                        {
                          'elem.guild': context.guild,
                        },
                      ],
                    }).exec();

                    await interaction.reply({ embeds: [new SuccessMessageEmbed({ description: getMessage('command.admin.semesterAdmin.remove.studyProgram.success', { parameter: { studyProgram: studyProgramRemove.name, userName: member.nickname } }) })] });
                  } else {
                    await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.semesterAdmin.remove.studyProgram.error.notAdded') })] });
                  }
                } else {
                  await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.semesterAdmin.remove.studyProgram.error.noStudyProgram') })] });
                }
                break;
              case 'study-program-module':
                //get studyProgramModule from db
                const studyProgramModuleRemove = await StudyProgramModule.findOne({
                  roleId: interaction.options.getRole('name')?.id,
                });

                //check if studyProgramModule exists
                if (studyProgramModuleRemove) {
                  //check if user has this studyProgramModule
                  if (userGuildEntrySet.studyProgramModules.some((element: any) => element._id.toString() == studyProgramModuleRemove._id.toString())) {
                    //remove role from user
                    const studyProgramModuleRole = await interaction.guild?.roles.fetch(studyProgramModuleRemove.roleId);
                    if (studyProgramModuleRole) {
                      member.roles.remove(studyProgramModuleRole);
                    } else {
                      return interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.semesterAdmin.remove.studyProgramModule.error.noRole') })] });
                    }

                    await User.findOne({
                      _id: user._id,
                    }, function (err: any, result: any) {
                      result.guilds.forEach(function (guild: any) {
                        if (guild.guild == context.guild._id) {
                          guild.studyProgramModules.pull(studyProgramModuleRemove);
                        }
                      });
                      result.save();
                    });

                    await interaction.reply({ embeds: [new SuccessMessageEmbed({ description: getMessage('command.admin.semesterAdmin.remove.studyProgramModule.success', { parameter: { studyProgramModule: studyProgramModuleRemove.name, userName: member.nickname } }) })] });
                  } else {
                    await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.semesterAdmin.remove.studyProgramModule.error.notAdded') })] });
                  }
                } else {
                  await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.semesterAdmin.remove.studyProgramModule.error.noStudyProgram') })] });
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
                //add all study programs to the message
                let studyProgramsMessage: string = '';
                userGuildEntrySet.studyPrograms.forEach((element: any) => {
                  studyProgramsMessage += '    - ' + element.studyProgram.name + '(' + element.semester + '. Semester)\n';
                });

                //add all modules to the message
                let studyProgramModulesMessage: string = '';
                userGuildEntrySet.studyProgramModules.forEach((element: any) => {
                  studyProgramModulesMessage += '    - ' + element.name + '\n';
                });

                await interaction.reply({ embeds: [new SuccessMessageEmbed({ description: getMessage('command.admin.semesterAdmin.list.all.success', { parameter: { studyPrograms: studyProgramsMessage, studyProgramModules: studyProgramModulesMessage, userName: member.nickname } }) })] });
                break;
              default:
                await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('error.unknown') })] });
                break;
            }
            break;
          default:
            await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('error.unknown') })] });
            break;
        }
      } else {
        await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('command.admin.semesterAdmin.error.userNotInDB') })] });
      }
    } else {
      await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('error.guildIsNull') })] });
    }
  },
};