// types.ts
export type User = {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  role: 'student' | 'teacher';
  profileImage?: string;
  token: string; // Add this if you're storing auth tokens
  purchasedCourses?: string[]; // Add this for course purchases
};
  
  export type Message = {
    _id: string;
    text: string;
    sender: string; // user._id
    receiver: string; // user._id
    createdAt: string;
    read: boolean;
  };
  
  export type Chat = {
    _id: string;
    participants: User[];
    lastMessage?: Message;
    unreadCount: number;
  };