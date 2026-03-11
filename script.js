const marker = document.querySelector('#marker');
const items = document.querySelectorAll('nav li');

function moveMarker(target) {
  // Tính toán vị trí và độ rộng của nút được chọn
  marker.style.left = target.offsetLeft + "px";
  marker.style.width = target.offsetWidth + "px";
}

items.forEach(item => {
  // 1. Hiệu ứng khi Click
  item.addEventListener('click', (e) => {
    // Xóa class active cũ và thêm vào nút mới
    items.forEach(li => li.classList.remove('active'));
    item.classList.add('active');
    
    // Di chuyển thanh mảnh theo nút được click
    moveMarker(item);
  });

  // 2. Hiệu ứng trượt tạm thời khi Hover
  item.addEventListener('mouseenter', (e) => {
    moveMarker(item);
  });
});

// Trả thanh trượt về vị trí nút Active khi không hover nữa
document.querySelector('#nav-list').addEventListener('mouseleave', () => {
  const activeItem = document.querySelector('nav li.active');
  moveMarker(activeItem);
});

// Khởi tạo vị trí ban đầu cho marker
moveMarker(document.querySelector('nav li.active'));

