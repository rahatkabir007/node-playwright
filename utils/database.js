import { Constants } from "./constants";

let db = null

export class Database {
    static init() {
        const Fjsondb = require('fjsondb');
        db = new Fjsondb(Constants.dbPath);
    }

    static set(key, value) {
        console.log(`Database set`)
        return db.set(key, value);
    }

    static get(key) {
        console.log(`Database get`)
        return db.get(key);
    }

    static has(key) {
        console.log(`Database has`)
        return db.has(key);
    }

    static delete(key) {
        console.log(`Database delete`)
        return db.delete(key);
    }
}