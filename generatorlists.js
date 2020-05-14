const fs = require('fs');

class GeneratorLists {
    constructor() {          
        this.Lists = {};
        this.Lists.Places = [];
        this.FilePath = "./lists.json"
    }

    Add(list,str) {
        list =  this.Lists[list];
        str = str.trim();

        //Checks if string already exists in the array
        if(list.includes(str)) {
            return "Dublett, ej tillagd";
        }
        else if (str.length == 0) {
            return "Beskrivning tom, ej tillagd";
        }

        list.push(str);         
        return true;   
    }

    Remove(list,str) {
        list =  this.Lists[list];
        str = str.trim();

        let index = list.indexOf(str);
        if(index == -1) { return "Radering missluckades, inte funnen."};
        list = list.splice(index,1);
        console.log(this);
        return true;   
    }

    List(list) {
        list =  this.Lists[list];    
        return list.join(", ");   
    }


    GetRandom(list) {
        let max = this.Lists[list].length -1;
        let r = this.Rand(0,max);

        if(max < 0) {
            return false;
        }

        return this.Lists[list][r];
    }

    Load() {    
        fs.readFile(this.FilePath, (err, data) => {
            if (err) {
                return (err);
            }
            if(data) {
                this.Lists = JSON.parse(data);
            }
          })    
    }

    Save() {
        if(this.Lists < 0) { return false; }


        console.log(this.Lists);
        let jsonData = JSON.stringify(this.Lists, null, 4);
        fs.writeFileSync(this.FilePath, jsonData);
    }

    Rand(min,max) {
        let rand =  Math.round(Math.random()*max) + min
        console.log("Max: "+max+"\nMin: "+min+"\nResult: "+rand+"\n");
        return rand;
    }

 
    // toString() {
    //     return this.Name +" ("+this.Id+")";
    // }


}

module.exports = GeneratorLists;