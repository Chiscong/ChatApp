export const unReadNotificationsFunc = (notifications,userChats,allUser) => {
    return notifications.filter((n) => n.isRead === false);
};
