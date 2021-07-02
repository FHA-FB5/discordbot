import { Client } from 'discord.js';

export default {
  name: 'ready',
  once: true,
  execute(client: Client) {
    client.user?.setActivity('servers', { type: 'LISTENING' });
  },
};
