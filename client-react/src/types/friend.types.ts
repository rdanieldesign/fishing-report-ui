// Copied verbatim from src/app/friends/interfaces/friends.interfaces.ts
// and src/app/friends/enums/friend-enum.ts — do not modify

export enum FriendStatus {
  Requested = 1,
  Confirmed = 2,
  Rejected = 3,
}

export interface IFriendship {
  userOneId: number;
  userTwoId: number;
  actionUserId: number;
  status: FriendStatus;
}

export interface IFriendshipDetails extends IFriendship {
  friendName: string;
  friendId: string;
}
