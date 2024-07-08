import { writable } from 'svelte/store';

export const APP_STATUS = {
  INIT: 0,
  LOADING: 1,
  CHAT_MODE: 2,
  ERROR: -1,
  QUOTA: -2
};

export const appStatus = writable(APP_STATUS.INIT);
export const appStatusInfo = writable({ id: '', url: '', pages: 0 });
// export const appStatusInfo = writable({ 
//   id: 'ed3a2e03d5027f316f701d6cd0e568ee', 
//   url: 'https://res.cloudinary.com/drskp38ux/image/upload/v1720398959/pdf/v3i2yqb0zq5fwisyoqd4.pdf', 
//   pages: 1 });

export const setAppStatusLoading = () => {
  appStatus.set(APP_STATUS.LOADING);
}

export const setAppStatusError = () => {
  appStatus.set(APP_STATUS.ERROR);
}

export const setAppStatusQuota = () => {
  appStatus.set(APP_STATUS.QUOTA);
}

export const setAppStatusChatMode = (
  { id, url, pages }:
    { id: string, url: string, pages: number }) => {
  appStatus.set(APP_STATUS.CHAT_MODE);
}
