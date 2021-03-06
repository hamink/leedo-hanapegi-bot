const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const express = require('express');
const app = express();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

app.get('/',(req, res) => res.send('Hello World'));

app.listen(3000, ()=> console.log('Example Server for Intro Bot'));

client.on("ready", () => {
    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId('apply_button')
        .setLabel('Generate Link')
        .setStyle('PRIMARY'),
    );

    const embed = new MessageEmbed()
    .setColor('#8964bc')
    .setDescription('Create a link that connects the Hanapegi game and your Discord ID.\n After connecting to the link, your Hanapegi game points will be added to your team.');

    client.channels.fetch('952055287815237683')
    .then(channel => channel.send({ content: '하나빼기 게임과 디스코드 아이디를 연결하는 링크를 생성합니다.\n 링크에 연결 후에 본인의 하나빼기 게임 포인트가 본인의 팀으로 추가됩니다.', ephemeral: true, embeds: [embed], components: [row] }))
    
    console.log(`Logged in as ${client.user.tag}`)
})

client.on('interactionCreate', async interaction => {
    const user = `${interaction.user.username}#${interaction.user.discriminator}`
    const role = interaction.member.roles.cache.find(role => role.name === 'blue' || role.name === 'white' || role.name === 'gold')

    const encodedUser = encodeURI(user);

	if (interaction.customId === 'apply_button' && role) {
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setLabel('Link')
            .setURL(`http://localhost:3000?discordid='${encodedUser}'&teamname='${role.name}'`)
            .setStyle('LINK'),
    );
		await interaction.reply({ content: 'Click the link below to join the Hanapegi game.```링크를 클릭하시면 하나빼기 게임으로 조인합니다.```\n', ephemeral: true, components: [row] });
	} else {
    await interaction.reply({ content: 'You are not currently assigned a team role. Please create a ticket and contact supporters.```현재 팀 롤이 부여되어 있지 않습니다. 티켓을 만들어서 서포터에게 문의하세요.```', ephemeral: true});
  }
});

client.login(process.env.TOKEN_ID);
