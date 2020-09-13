import { Client } from '@elastic/elasticsearch'

const ELASTICSEARCH_URL = 'http://localhost:9200'
const INDEX_NAME = 'user-events-0913'
const INDEX_MAPPING = {
    "properties": {
        "@timestamp": {
            "type": "date",
            "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
        },
        "user_id": {
            "type": "keyword"
        },
        "create_at": {
            "type": "date",
            "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
        },
        "type": {
            "type": "keyword"
        },
        "game.id": {
            "type": "keyword"
        },
        "game.first_open": {
            "type": "date",
            "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
        },
        "game.scene_id": {
            "type": "keyword"
        },
        "game.retention": {
            "type": "boolean"
        }
    }
}
const client = new Client({
    node: ELASTICSEARCH_URL
})

async function init() {
    await createIndexMapping()
}

async function createIndexMapping() {
    await client.indices.create({
        index: INDEX_NAME,
        body: {
            mappings: INDEX_MAPPING
        }
    }, { ignore: [400] })
}

async function setRefresh(value) {
    await client.indices.putSettings({
        index: INDEX_NAME,
        body: {
            refresh_interval: value
        }
    })
}


async function output(events) {
    const body = events.flatMap(doc => [{ index: { _index: INDEX_NAME } }, doc])
    const { body: bulkResponse } = await client.bulk({ refresh: false, body })

    if (bulkResponse.errors) {
        const erroredDocuments = []
        bulkResponse.items.forEach((action, i) => {
            const operation = Object.keys(action)[0]
            if (action[operation].error) {
                erroredDocuments.push({
                    status: action[operation].status,
                    error: action[operation].error,
                    operation: body[i * 2],
                    document: body[i * 2 + 1]
                })
            }
        })

        console.log(erroredDocuments)
    }
}


export { output, init, setRefresh }