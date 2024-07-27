window.Telegram.WebApp.ready();

const user = window.Telegram.WebApp.initDataUnsafe.user;

if (user) {
    document.getElementById('profile-pic').src = user.photo_url;
    document.getElementById('user-name').innerText = user.first_name + ' ' + user.last_name;
    document.getElementById('username').innerText = '@' + user.username;
} else {
    document.getElementById('user-info').innerText = 'No user information available.';
}
