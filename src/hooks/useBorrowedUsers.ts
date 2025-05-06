import { create } from "zustand";
import { BorrowedUser, UserInvitation } from "../type/NeonApiInterface";
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
export const getInvitations = async (): Promise<UserInvitation[]> => {
  try {
    const result = await client.getInvitations({
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
export const createBorrowedUser = async (
  name: string,
  email?: string
): Promise<Omit<BorrowedUser, "id"> | null> => {
  const newUser: Omit<BorrowedUser, "id"> = {
    name,
    email: email || null,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  await client.insertBorrowedUser({
    userInfo: {
      accessToken:
        localStorage.getItem("income-expense-history-accessToken") || "",
    },
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
  const invitations = await getInvitations();
  const invitation = invitations.find((i) => i.invitation_code === code);
  if (!invitation) return null;
  const borrowedUsers = await getBorrowedUsers();
  const user = borrowedUsers.find((u) => u.id === invitation.borrowed_user_id);
  if (!user) return null;
  // console.log(user)
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
