import { nanoid } from 'nanoid'

const SCENE_ID_LENGTH = 6

function generate(gameCount) {
    let games = []

    for (let i = 0; i < gameCount; i++) {
        let game = {}
        game.id = `game-${i+1}`
        game.scenes = []
        for (let j = 0; j < 10; j++) {
            game.scenes.push(nanoid(SCENE_ID_LENGTH))
        }
        games.push(game)
    }

    return games
}

export default generate