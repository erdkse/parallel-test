import fs from 'fs';

export class Test {
    public getFileSizeInBytes(file: string, callback: any) {
        fs.stat(file, function (err, stat) {
            if (err) {
                return callback(err);
            }
            callback(null, stat.size);
        });
    }
}
