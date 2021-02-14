class Room {
    constructor(params) {    
        if(!params.name) {
            throw 'Parameter name not set';
        }      

        this.name = params.name;
        this.type = params.type;
        this.nsfw = params.nsfw || false;
        this.type = params.type; 
        this.parentname = params.category;
    }


    FindChannel(msg) {
        //If Channel is not already set, tries to find it.
        if(!this.channel) {
            this.channel = msg.guild.channels.find( c => c.name == this.name && c.type == this.type  && c.parent.name == this.parentname );
        }           

        if(!this.channel) {     
            return false;
        }

        return true;
    }

    FindParent(msg) {
         //If Parent is not already set, tries to find it.
        if(!this.parent) {
            this.parent = msg.guild.channels.find( c => c.name == this.parentname && c.type == "category" );
        }           
        
        if(!this.parent) {
            return false;
        }

        return this.parent;
    }

    Create(msg) {
        msg.guild.createChannel(this.name,this);
        return true;
    }

    toString() {
        return this.name;
    }


}

module.exports = Room;