export const CONSUMER_SIGNUP_BONUS_POINTS = 500;
export const CONSUMER_SIGNUP_BONUS_SOURCE_TYPE = "new_consumer_registration";
export const CONSUMER_SIGNUP_BONUS_DESCRIPTION = "新戶註冊綠點";

export function consumerSignupBonusSourceId(profileId: string) {
  return `new-consumer-registration:${profileId}`;
}
