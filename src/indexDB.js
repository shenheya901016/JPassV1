import Base from 'lowdb/adapters/Base';
import Dexie from 'dexie';
import CryptoJS from 'crypto-js';

let db = new Dexie("JPassDatabase");
db.version(1).stores({t_data: "key,value"});

class indexDB extends Base {

    read() {
        return db.open().then(async () => {
            if ((await db.t_data.where({key: this.source}).count()) === 0) {
                await db.t_data.add({key: this.source, value: this.defaultValue});
            }
            let data = await db.t_data.where("key").equals(this.source).first();
            if (JSON.stringify(data.value) === "{}") {
                return data.value;
            }else {
                let bytes  = CryptoJS.AES.decrypt(data.value, 'secret key 123');
                let originalText = bytes.toString(CryptoJS.enc.Utf8);
                return JSON.parse(originalText);
            }
        });
    }

    write(data) {
        data=CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123').toString();
        return db.t_data.put({key: this.source, value: data});
    }

}

export default indexDB;
