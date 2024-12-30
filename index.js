const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const scdl = require('soundcloud-downloader').default;

const TOKEN = 'BOT_TOKEN';
const SOUNDCLOUD_CLIENT_ID = 'YOUR_SOUNDCLOUD_CLIENT_ID'; // No longer Works because soundcloud will no longer be processing API application

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

let currentPlayer;
let currentConnection;

bot.once('ready', () => {
    console.log(`${bot.user.username} is online and ready to play music!`);
});

bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'play') {
        const searchQuery = options.getString('query');
        if (!interaction.member.voice.channel) {
            return interaction.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });
        }

        try {
            const searchResults = await scdl.search(searchQuery, 'track', SOUNDCLOUD_CLIENT_ID);
            if (!searchResults.length) {
                return interaction.reply({ content: 'No results found. Try a different query.', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle('Select a Song')
                .setDescription(
                    searchResults.slice(0, 5).map((track, index) => `${index + 1}. **${track.title}** by ${track.user.username}`).join('\n')
                )
                .setColor('Aqua')
                .setFooter({ text: 'Reply with the number of your choice.' });

            await interaction.reply({ embeds: [embed] });

            const filter = (msg) => msg.author.id === interaction.user.id;
            const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 15000 });
            const choice = parseInt(collected.first().content);

            if (!choice || choice < 1 || choice > 5) {
                return interaction.followUp({ content: 'Invalid choice. Command canceled.', ephemeral: true });
            }

            const selectedTrack = searchResults[choice - 1];
            const streamUrl = await scdl.downloadFormat(selectedTrack.permalink_url, scdl.FORMATS.MP3, SOUNDCLOUD_CLIENT_ID);

            const connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });
            currentConnection = connection;

            const player = createAudioPlayer();
            const resource = createAudioResource(streamUrl);
            player.play(resource);
            connection.subscribe(player);
            currentPlayer = player;

            const nowPlayingEmbed = new EmbedBuilder()
                .setTitle('Now Playing')
                .setDescription(`**${selectedTrack.title}** by ${selectedTrack.user.username}`)
                .setURL(selectedTrack.permalink_url)
                .setColor('Green')
                .setFooter({ text: 'Enjoy the music!' });

            interaction.followUp({ embeds: [nowPlayingEmbed] });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'An error occurred while trying to play the track.', ephemeral: true });
        }
    }

    else if (commandName === 'stop') {
        if (currentPlayer) {
            currentPlayer.stop();
            const embed = new EmbedBuilder()
                .setTitle('Song Stopped')
                .setDescription('The current song has been stopped.')
                .setColor('Red')
                .setFooter({ text: 'Use /play to start playing again!' });

            interaction.reply({ embeds: [embed] });
        } else {
            interaction.reply({ content: 'No song is currently playing.', ephemeral: true });
        }
    }

    else if (commandName === 'disconnect') {
        if (currentConnection) {
            currentConnection.destroy();
            currentConnection = null;

            const embed = new EmbedBuilder()
                .setTitle('Disconnected')
                .setDescription('The bot has left the voice channel.')
                .setColor('Purple')
                .setFooter({ text: 'Thanks for listening!' });

            interaction.reply({ embeds: [embed] });
        } else {
            interaction.reply({ content: 'The bot is not connected to any voice channel.', ephemeral: true });
        }
    }
});

bot.on('ready', async () => {
    const commands = [
        new SlashCommandBuilder()
            .setName('play')
            .setDescription('Plays a song from SoundCloud.')
            .addStringOption((option) =>
                option.setName('query').setDescription('The song or artist to search for').setRequired(true)
            ),
        new SlashCommandBuilder().setName('stop').setDescription('Stops the current song.'),
        new SlashCommandBuilder().setName('disconnect').setDescription('Disconnects the bot from the voice channel.'),
    ];

    const rest = new REST({ version: '10' }).setToken(TOKEN);
    try {
        console.log('Registering slash commands...');
        await rest.put(Routes.applicationCommands(bot.user.id), { body: commands });
        console.log('Slash commands registered.');
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
});

bot.login(TOKEN);
