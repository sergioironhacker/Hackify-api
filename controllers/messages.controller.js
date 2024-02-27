const User = require('../models/User.model');
const Message = require('../models/Message.model');

const messagesController = {
    // Crear un nuevo mensaje
    sendMessage: async (req, res) => {
      try {
        console.log('ruta mensaje');
        const { recipient, content, sender } = req.body;
    /*     console.log(recipient, req.body); */
        // Verificar si req.currentUserId está definido
      
        // Buscar al usuario destinatario por su nombre de usuario
        const recipientUser = await User.findOne({ username: recipient });
    /*     console.log('hola', recipientUser); */
        if (!recipientUser) {
          console.log('Usuario destinatario no encontrado:', recipient);
          return res.status(404).json({ error: 'Usuario destinatario no encontrado' });
        }

        // Crear el mensaje en la base de datos con el sender establecido
      /*   console.log('holahhh', recipientUser); */
       /*  console.log(sender); */
        const newMessage = await Message.create({
          sender: sender, // Establecer el sender con el ID del usuario autenticado
          recipient: recipientUser.id,
          content: content
        });
  
        console.log('Mensaje enviado:', newMessage);
        res.status(201).json(newMessage);
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    },
  
    // Obtener mensajes enviados por el usuario actual
    getSentMessages: async (req, res) => {
      try {
       
        const userId = req.currentUserId; // undefined /////////////////////

        console.log('ID del usuario autenticado:', userId);
  
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
        const userId = req.currentUserId; // undefined /////////////////////

        console.log('mensages:', userId);
  
        // Buscar mensajes recibidos por el usuario actual
        const receivedMessages = await Message.find({ recipient: userId });

        //

        console.log('Mensajes recibidos:', receivedMessages);

  
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

        //

        console.log('Detalles del mensaje:', message);
  
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

        //
        console.log('ID del mensaje a marcar como leído:', messageId);
  
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

        //

        console.log('ID del mensaje a eliminar:', messageId);
  
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
