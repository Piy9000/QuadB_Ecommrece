
interface Sender {
    _id: string;
    name: string;
    pic: string;
  }
  
  interface LatestMessage {
    _id?: string;
    sender?: User;
  }
  
  export interface Participant {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    pic: string;
    isAdmin: boolean;
    timeStamp: number;
    __v?: number;
  }
  

   interface User {
    _id: string; 
    name: string; 
    email: string; 
    username: string; 
    password: string; 
  }
  
  
  interface Chat {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    users: {
      participants: Participant;
      timestamps: string;
      _id: string;
    }[];
    createdAt: string;
    updatedAt: string;
    deleteBy: string[];
    latestMessage?: LatestMessage | undefined;
  }
  
  export interface MessageInfo {
    _id: string;
    sender: Sender;
    content: string;
    chat?: Chat;
    readBy: string[];
    deleteBy: string[];
    createdAt: string;
    updatedAt: string;
  }

  export interface CartItem {
    productId: string; // ID of the product in the cart
    quantity: number; // Quantity of the product in the cart
  }
  
  export interface Cart {
    _id: string; 
    userId: string; 
    items: CartItem[]; 
    createdAt: string; 
    updatedAt: string; 
  }
  