const guildSettings = require('@schema/guildSchema');

module.exports = {
    globalCache: {},
    async getGuildSettings(guildID) {
        if(!(guildID in this.globalCache)){
            let settings = await guildSettings.findOne({_id: guildID});
            if(!settings){
                settings = await guildSettings.create({ _id: guildID });
                settings.userinfo = {};
                settings.save();
            }
            this.globalCache[guildID] = settings;
            return this.globalCache[guildID];
        } else return this.globalCache[guildID];
    },

    async getGuildUserProfile(guildID, userID) {
        let userdata;
        if(!(guildID in this.globalCache)) await this.getGuildSettings(guildID);
        if(!(userID in this.globalCache[guildID].userinfo)){
            this.globalCache[guildID].userinfo[userID] = {};
            let path = `userinfo.${userID}`;
            await guildSettings.findOneAndUpdate({_id: guildID}, { [path]: {}});
            return userdata = this.globalCache[guildID].userinfo[userID];
        } else return userdata = this.globalCache[guildID].userinfo[userID];
    },

    async updateUserProfile(guildID, path, data) {
        let newdat = await guildSettings.findOneAndUpdate({ _id: guildID }, { [path]: data }, {new: true})
        this.globalCache[guildID] = newdat;
    }
}