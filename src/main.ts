import {parallelLimit} from 'async';
import sleepFn from 'sleep';
export class Main {
    private readonly tasks = [1, 2, 3, 4, 5];

    public async logTime(fn: any) {
        const start: Date = new Date();
        await fn();
        console.log(
            `Completed after ${new Date().getTime() - start.getTime()} seconds`,
        );
    }

    private readonly fn = async (index: number) => {
        const time = Math.floor(Math.random() * 10) + 1;
        // let i = 0;
        //   while (i < time * 1000000000) {
        //     i++;
        //   }
        await this.sleep(time * 1000);

        return index;
    };

    public async sleep(time: number) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    public async parallel() {
        const start: Date = new Date();
        await parallelLimit(
            this.tasks.map((_, i) => async () => await this.fn(i)),
            2,
        );
        console.log('done', new Date().getTime() - start.getTime());
    }

    public serie() {
        this.tasks.forEach(() => {
            const time = Math.floor(Math.random() * 10) + 1;
            sleepFn.sleep(time);
            console.log(`Completed after ${time} seconds`);
        });
    }
}
