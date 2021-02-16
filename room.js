class Room {
    constructor(params) {    
        if(!params.name) {
            throw 'Parameter name not set';
        }      

        this.name = params.name;
        this.type = params.type;
        this.nsfw = params.nsfw || false;
        this.type = params.type; 
        this.parentName = params.category;
        
        this.owner = null;
        this.id = null;
    }

    /**
     * Tries to find the room on the discordserver, if found loads the channel into this.channel
     *
     * @param Message msg
     * @returns True if found, otherwise false.
     * @memberof Room
     */
    FindChannel(guild) {
        //If Channel is not already set, tries to find it.
        if(!this.channel) {
            //If parentName is given, searches for that too.
            if(this.parentName) {
                this.channel = guild.channels.find( c => c.name == this.name && c.type == this.type  && c.parent.name == this.parentName );
            }
            else {
                this.channel = guild.channels.find( c => c.name == this.name && c.type == this.type );
            }
        }           

        if(!this.channel) {     
            return false;
        }

        return true;
    }

    FindParent(guild) {
         //If Parent is not already set, tries to find it.
        if(!this.parent) {
            this.parent = guild.channels.find( c => c.name == this.parentName && c.type == "category" );
        }           

        if(!this.parent) {
            return false;
        }

        return this.parent;
    }

    Create(guild) {
        guild.createChannel(this.name,this);
        return true;
    }

    toString() {
        return this.name;
    }
}

module.exports = Room;