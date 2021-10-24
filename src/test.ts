import * as fs from 'fs';

export class Test {
    public getFileSizeInBytes(file, callback) {
        fs.stat(file, function (err, stat) {
            if (err) {
                return callback(err);
            }
            callback(null, stat.size);
        });
    }
}
