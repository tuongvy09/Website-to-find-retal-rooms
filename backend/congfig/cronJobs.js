const cron = require('node-cron');
const Post = require('../models/Post'); // Đảm bảo bạn đã import model Post

cron.schedule('0 * * * *', async () => { // Chạy mỗi giờ
  try {
    // Lấy các bài viết có visibility là 'visible'
    const posts = await Post.find({ visibility: 'visible' });

    if (posts.length > 0) {
      const operations = posts.map((post) => {
        if (post.daysRemaining > 0 || post.hoursRemaining > 0) {
          if (post.hoursRemaining > 0) {
            post.hoursRemaining -= 1;
          } else {
            post.daysRemaining -= 1;
            post.hoursRemaining = 23;
          }

          // Nếu hết hạn, thay đổi visibility
          if (post.daysRemaining === 0 && post.hoursRemaining === 0) {
            post.visibility = 'hidden';
          }

          // Trả về một operation cho bulkWrite
          return {
            updateOne: {
              filter: { _id: post._id },
              update: {
                $set: {
                  daysRemaining: post.daysRemaining,
                  hoursRemaining: post.hoursRemaining,
                  visibility: post.visibility,
                },
              },
            },
          };
        }
      }).filter(Boolean); // Loại bỏ các giá trị undefined

      // Thực thi bulkWrite nếu có operations
      if (operations.length > 0) {
        await Post.bulkWrite(operations);
        console.log(`Updated ${operations.length} posts successfully.`);
      }
    } else {
      console.log('No posts to update.');
    }
  } catch (error) {
    console.error('Error updating posts:', error);
  }
});
