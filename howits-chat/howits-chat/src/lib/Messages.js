const redis = require('redis');
const redisClient = require('../redisClient');
const shortid = require('shortid');
const _ = require('lodash');

function Messages() {
    this.client = redisClient.getClient();
};

module.exports = new Messages();

Messages.prototype.upsert = function ({ roomId, message, userId, username }) {
    this.client.hset(
        'messages' + roomId,
        shortid.generate(),
        JSON.stringify({
            userId,
            username,
            message,
            when: Date.now()
        }),
        err => {
            if (err)
                console.log(err);
        }
    )
};

Messages.prototype.list = function (roomId,callback) {

    let messageList = [];

    this.client.hgetall('messages'+roomId, function (err, messages) {
        if (err) {
            console.log(err);
            return callback([]);
        }

        for (let message in messages) {
            messageList.push(JSON.parse(messages[message]));
        }
        return callback(_.orderBy(messageList, 'when', 'asc'));
    });

};
