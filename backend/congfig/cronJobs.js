const cron = require('node-cron');
const Post = require('../models/Post'); // Đảm bảo rằng đường dẫn đến model Post là chính xác

// Cron job chạy mỗi ngày lúc 00:00
cron.schedule('0 0 * * *', async () => {
  try {
    const posts = await Post.find({ visibility: 'visible' });

    for (const post of posts) {
      if (post.daysRemaining > 0 || post.hoursRemaining > 0) {
        if (post.hoursRemaining > 0) {
          post.hoursRemaining -= 1;
        } else {
          post.daysRemaining -= 1;
          post.hoursRemaining = 23;
        }

        if (post.daysRemaining === 0 && post.hoursRemaining === 0) {
          post.visibility = 'hidden';
        }

        await post.save();
      }
    }

    console.log(`Checked and updated visibility for posts`);
  } catch (error) {
    console.error('Error updating posts:', error);
  }
});