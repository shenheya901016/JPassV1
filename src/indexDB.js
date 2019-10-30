import Base from 'lowdb/adapters/Base';
import Dexie from 'dexie';

const db = new Dexie("JPassDatabase");
db.version(1).stores({t_data: "key,value"});

class indexDB extends Base {
    read() {
        return db.open().then(async () => {
            if ((await db.t_data.where({key: this.source}).count()) === 0) {
                await db.t_data.add({key: this.source, value: this.defaultValue});
            }
            let data = await db.t_data.where("key").equals(this.source).first();
            return data.value;
        });
    }

    write(data) {
        return db.t_data.put({key: this.source, value: data});
    }
}

export default indexDB;
