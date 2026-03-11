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

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('#nav-list a');
    const mainContent = document.querySelector('main');

    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            const href = link.getAttribute('href');
            
            // Nếu link dẫn đến trang bên ngoài, cứ để nó chạy bình thường
            if (href.startsWith('http') || href.startsWith('#')) return;

            e.preventDefault();
            console.log("Đang cố gắng tải trang:", href);
            await loadPage(href);
            window.history.pushState({ path: href }, '', href);
        });
    });

    async function loadPage(url) {
        try {
            // Sử dụng URL tương đối trực tiếp để tránh lỗi thư mục con trên GitHub
            const response = await fetch(url);
            
            if (!response.ok) {
                console.error("Fetch thất bại với trạng thái:", response.status);
                // Nếu fetch lỗi, chuyển hướng truyền thống luôn
                window.location.href = url;
                return;
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newContent = doc.querySelector('main');

            if (newContent) {
                mainContent.innerHTML = newContent.innerHTML;
                // Nếu bạn có class riêng cho main ở mỗi trang, cập nhật nó luôn
                mainContent.className = newContent.className; 
                console.log("Tải nội dung thành công!");
            }

            updateActiveLink(url);
        } catch (error) {
            console.error('Lỗi thực thi:', error);
            window.location.href = url;
        }
    }

    function updateActiveLink(url) {
        document.querySelectorAll('#nav-list li').forEach(li => {
            const a = li.querySelector('a');
            const linkHref = a.getAttribute('href');
            // So sánh tên file để bật class active
            if (url.includes(linkHref)) {
                li.classList.add('active');
            } else {
                li.classList.remove('active');
            }
        });
    }

    window.onpopstate = () => {
        // Lấy tên file từ URL hiện tại để load lại khi nhấn Back
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        loadPage(currentPage);
    };
});