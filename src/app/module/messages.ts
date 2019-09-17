// import { Message } from "@angular/compiler/src/i18n/i18n_ast";
// import { MongoObservable } from 'meteor-rxjs';
// import { MessageType } from './chats';

// const Messages = new MongoObservable.Collection<Message>('messages');

// Meteor.methods({
//     addMessage(type: MessageType, chatId: string, content: string) {
//       check(type, Match.OneOf(String, [ MessageType.TEXT ]));
  //  check(chatId, nonEmptyString);
   // check(content, nonEmptyString);
 
//   const chatExists = !!Chat.collection.find(chatId).count();
   
//       if (!chatExists) {
//         throw new Meteor.Error('chat-not-exists',
//           'Chat doesn\'t exist');
//       }
   
//       return {
//         messageId: Messages.collection.insert({
//           chatId: chatId,
//           content: content,
//           createdAt: new Date(),
//           type: type
//         })
//       };
//     }
//   });
// const nonEmptyString = Match.Where((str) => {
//     check(str, String);
//     return str.length > 0;
//   });

