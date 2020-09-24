import delay from 'delay'
import { nanoid } from 'nanoid'


(async () => {
    for (; ;) {
        const time = new Date().getTime()
        let event = {
            "@timestamp": time,
            user_id: nanoid(10),
            create_at: time,
            type: 'signup',
            game: {
                id: nanoid(5)
            }
        }
        console.log(JSON.stringify(event))
        await delay(1000 * 5);
    }
})();

