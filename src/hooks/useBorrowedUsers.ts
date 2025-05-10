import { create } from "zustand";
import {
  BorrowedUser,
  getInvitationsResponse,
  UserInvitation,
    InsertBorrowedUserType
} from "../type/NeonApiInterface";
import { NeonClientApi } from "../common/NeonApiClient";
import { getMonthlyReport, useDashBoard } from "./useDashBoard";

interface BorrowedUsersState {
  selectedUserId: string | null;
  borrowedUsers: BorrowedUser[];
  setSelectedUserId: (id: string | null) => void;
  setBorrowedUsers: (users: BorrowedUser[]) => void;
}
const client = new NeonClientApi();

export const getBorrowedUsers = async (): Promise<BorrowedUser[]> => {
  try {
    const result = await client.getBorrowedUsers({
      userInfo: {
        accessToken:
          localStorage.getItem("income-expense-history-accessToken") || "",
      },
    });
    return result;
  } catch (error) {
    return [];
  }
};
export const getInvitation = async (
  code: string
): Promise<{ invitation: UserInvitation; user: BorrowedUser }> => {
  try {
    const result = await client.getInvitation({ code });
    return result;
  } catch (error) {
    return {
      invitation: {
        id: 0,
        invitation_code: "",
        expires_at: "",
        created_at: "",
        borrowed_user_id: 0,
      },
      user: {
        id: 0,
        name: "",
        email: null,
        status: "pending",
        created_at: "",
      },
    };
  }
};
export const createBorrowedUser = async (
  name: string,
  mode : InsertBorrowedUserType,
  email?: string
): Promise<Omit<BorrowedUser, "id"> | null> => {
  const newUser: Omit<BorrowedUser, "id"> = {
    name,
    email: email || null,
    status: "pending",
    created_at: new Date().toISOString()
  };
  await client.insertBorrowedUser({
    userInfo: {
      accessToken:
        localStorage.getItem("income-expense-history-accessToken") || "",
    },
    mode,
    ...newUser,
  });
  return newUser;
};

export const createInvitation = async (
  borrowed_user_id: string
): Promise<Omit<UserInvitation, "id"> | null> => {
  const userId: number = +borrowed_user_id;
  const invitation: Omit<UserInvitation, "id"> = {
    invitation_code: crypto.randomUUID(),
    expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    created_at: new Date().toISOString(),
    borrowed_user_id: userId,
  };
  await client.insertInvitation({
    userInfo: {
      accessToken:
        localStorage.getItem("income-expense-history-accessToken") || "",
    },
    ...invitation,
  });
  return invitation;
};

export const getInvitationByCode = async (
  code: string
): Promise<{ invitation: UserInvitation; user: BorrowedUser } | null> => {
  const { invitation, user } = await getInvitation(code);
  if (invitation.invitation_code !== code) return null;
  if (user.id == 0) return null;
  return { invitation, user };
};

export const useBorrowedUsers = create<BorrowedUsersState>((set) => ({
  selectedUserId: null,
  borrowedUsers: [],
  setSelectedUserId: (id) => {
    set({ selectedUserId: id });
  },
  setBorrowedUsers: (users) => set({ borrowedUsers: users }),
}));
