const Message = require('../models/Message.model');
const Chat = require('../models/chat.model');

module.exports.createMessage = (req, res, next) => {
    const messageData = {
        ...req.body,
        sender: req.currentUserId,
        chat: req.params.id,
        date: new Date()
    }

    Message.create(messageData)
        .then((message) => {
            createdMessage = message;
            return Chat.findByIdAndUpdate(message.chat, { $push: { messages: message._id } }, { new: true })
        })
        .then((updatedChat) => {
            res.json(res.json({ message: createdMessage, chat: updatedChat }));
        })
        .catch((error) => {
            next(error);
        });
}

module.exports.messageRead = (req, res, next) => {
    const readStatus = 'read'
    Message.findByIdAndUpdate(req.params.id, { status: readStatus }, { new: true })
        .then((message) => {
            res.json(message)
        })
        .catch(next)
}