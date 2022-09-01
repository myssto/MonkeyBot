const Discord = require('discord.js');
const math = require('mathjs');

module.exports = {
    name: "mafia",
    description: "Starts a game of mafia in your voice channel",
    usage: `\`${process.env.PREFIX}mafia\``,
    disabled: false,
    slash: true,
    permission: ['MOVE_MEMBERS'],
    execute(interaction){
        let vc = interaction.member.voice?.channel;
        let randGen = [];

        if (vc && vc.members.size >= 3){
            let vcSize = vc.members.size;
            for(let [snowflake, guildMember] of vc.members){
                if(guildMember.user.bot) vcSize--;
            }
            if(vcSize < 3) return interaction.reply({ content: 'Voice channel must have 3 non-bot users!' });
            let mafiaCount = math.ceil(vc.members.size / 3);
            for (i = 1; i <= vc.members.size; i++){
                randGen.push(0);
            }
            for (i = 0; i <= (mafiaCount - 1); i++){
                randGen[i] = 1;
            }
            let ii = 0
            randGen = shuffle(randGen);
            for(let [snowflake, guildMember] of vc.members){
                const str = randGen[ii] == 0 ? `You've been selected to be a **villager**!` : `You've been selected to be part of the **mafia**!`;
                guildMember.send({ content: str });
                ii++;
            }
        } else return interaction.reply("You must be in a voice channel with at least 3 users!");
        
        //Fisher-Yates Shuffle
        function shuffle(array){
            var currentIndex = array.length, tempVal, randomIndex;
            while (0 !== currentIndex){
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                tempVal = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = tempVal;
            }
            return array;
        }
    }
}