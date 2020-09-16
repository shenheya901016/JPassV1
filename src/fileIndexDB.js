import Base from "lowdb/adapters/Base";
import Dexie from "dexie";

const db = new Dexie("JPassDatabase1");
db.version(1).stores({ t_file: "key,value" });

class fileIndexDB extends Base {
  read() {
    return db.open().then(async () => {
      if ((await db.t_file.where({ key: this.source }).count()) === 0) {
        await db.t_file.add({ key: this.source, value: this.defaultValue });
      }
      let data = await db.t_file
        .where("key")
        .equals(this.source)
        .first();
      return data.value;
    });
  }

  write(data) {
    return db.t_file.put({ key: this.source, value: data });
  }
}

export default fileIndexDB;
