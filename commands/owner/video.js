const common = require('@util/common');
const Discord = require('discord.js');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs');

// Abandoned command for now

module.exports = {
    name: "video",
    description: "downloads video from a link and sends it back to the channel",
    usage: `\`${process.env.PREFIX}video\``,
    alias: ["video", "dl"],
    disabled: true,
    execute(message, args){ 

        if(!args[0]){
            message.reply(" invalid arguments!");
            return;
        }

        let id = message.id;
        let dir = `./videocache`;
        let url = args.shift();

        if (fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        

        const video = youtubedl(url);
        let filename

        video.on('info', function(info) {
            console.log('Download started')
            console.log(`filename: ${info.filename}`);
            console.log(`size: ` + info.size);
            filename = info.filename;
        });

        video.pipe(fs.createWriteStream(`./videocache/${filename}.mp4`));
      
    }
}