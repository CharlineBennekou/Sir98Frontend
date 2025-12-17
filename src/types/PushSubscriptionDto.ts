export type PushSubscriptionDto = {
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
};

export type DeletePushSubscriptionArgs = {
  userId: string;
  endpoint: string;
};