export const AUTH_BYPASS = false;

export const DEMO_USER = {
  firstname: "Devansh",
  lastname: "Demo",
  username: "devansh@digipay.local",
};

export const DEMO_USERS = [
  {
    _id: "demo-user-1",
    firstname: "Aarav",
    lastname: "Sharma",
    username: "aarav@demo.pay",
  },
  {
    _id: "demo-user-2",
    firstname: "Ananya",
    lastname: "Rao",
    username: "ananya@demo.pay",
  },
  {
    _id: "demo-user-3",
    firstname: "Kabir",
    lastname: "Mehta",
    username: "kabir@demo.pay",
  },
];

export const DEMO_PAYMENTS = [
  {
    _id: "demo-payment-1",
    amount: 18500,
    status: "pending",
    executeAt: "2026-04-08T09:30:00.000Z",
    toUserId: DEMO_USERS[1],
  },
  {
    _id: "demo-payment-2",
    amount: 7200,
    status: "success",
    executeAt: "2026-04-02T14:15:00.000Z",
    toUserId: DEMO_USERS[0],
  },
];
