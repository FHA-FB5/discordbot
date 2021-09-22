import GuildCacheHandler from '@/cacheHandler/GuildCacheHandler';
import { User } from '@/models';
import { GuildMember } from 'discord.js';

async function createUser(member: GuildMember) {
  const thisGuild = await new GuildCacheHandler(member.guild.id).get();

  //Get user from database
  const user = await User.findOne({
    userID: member.id,
  });

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
    //TODO
    //TODO
    //TODO
    //TODO
    //TODO
    //TODO
    //TODO
    //TODO
    //TODO
    //UPDATE NOT UNIQUE

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

export default {
  name: 'guildMemberAdd',
  once: false,
  execute(member: GuildMember) {
    createUser(member);
  },
};