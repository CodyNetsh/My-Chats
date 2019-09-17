export enum MessageType {
    TEXT = <any>'text',
    LOCATION = <any>'location',
    PICTURE = <any>'picture'
  }
   
  export interface Chat {
    id?: string;
    nickname?: string;
    picture?: string;
    lastMessage?: Message;
  }
   
  export interface Message {
    id?: string;
    chatId?: string;
    content?: string;
    createdAt?: Date;
    type?: MessageType;
    ownership?: string;
  }