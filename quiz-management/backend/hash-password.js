import bcrypt from 'bcrypt';

// Hash mật khẩu '123456'
const password = '123456';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Lỗi:', err);
    return;
  }
  console.log('\n✅ Mật khẩu đã hash:');
  console.log(hash);
  console.log('\n📋 Chạy SQL này trong MySQL:');
  console.log(`UPDATE users SET password = '${hash}' WHERE username IN ('admin1', 'teacher1', 'student1');`);
});