const Message = require('../models/Comment.model');

const messagesController = {
    // Crear un nuevo mensaje
    sendMessage: async (req, res) => {
      try {
        const { sender, recipient, content } = req.body;
        
        // Crear el mensaje en la base de datos
        const newMessage = await Message.create({
          sender,
          recipient,
          content
        });
  
        res.status(201).json(newMessage);
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    },
  
    // Obtener mensajes enviados por el usuario actual
    getSentMessages: async (req, res) => {
      try {
        const userId = req.user._id; // ID del usuario autenticado
  
        // Buscar mensajes enviados por el usuario actual
        const sentMessages = await Message.find({ sender: userId });
  
        res.json(sentMessages);
      } catch (error) {
        console.error('Error al obtener mensajes enviados:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    },
  
    // Obtener mensajes recibidos por el usuario actual
    getReceivedMessages: async (req, res) => {
      try {
        const userId = req.user._id; // ID del usuario autenticado
  
        // Buscar mensajes recibidos por el usuario actual
        const receivedMessages = await Message.find({ recipient: userId });
  
        res.json(receivedMessages);
      } catch (error) {
        console.error('Error al obtener mensajes recibidos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    },
  
    // Obtener detalles de un mensaje específico
    getMessageDetails: async (req, res) => {
      try {
        const messageId = req.params.id;
  
        // Buscar el mensaje por su ID
        const message = await Message.findById(messageId);
  
        if (!message) {
          return res.status(404).json({ error: 'Mensaje no encontrado' });
        }
  
        res.json(message);
      } catch (error) {
        console.error('Error al obtener detalles del mensaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    },
  
    // Marcar un mensaje como leído
    markMessageAsRead: async (req, res) => {
      try {
        const messageId = req.params.id;
  
        // Actualizar el mensaje para marcarlo como leído
        await Message.findByIdAndUpdate(messageId, { $set: { isRead: true } });
  
        res.json({ message: 'Mensaje marcado como leído' });
      } catch (error) {
        console.error('Error al marcar el mensaje como leído:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    },
  
    // Eliminar un mensaje
    deleteMessage: async (req, res) => {
      try {
        const messageId = req.params.id;
  
        // Eliminar el mensaje de la base de datos
        await Message.findByIdAndDelete(messageId);
  
        res.json({ message: 'Mensaje eliminado correctamente' });
      } catch (error) {
        console.error('Error al eliminar el mensaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  };
  
  module.exports = messagesController;