document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const quoteInput = document.getElementById('quote-text');
    const authorInput = document.getElementById('author');
    const cardQuote = document.getElementById('card-quote');
    const cardAuthor = document.getElementById('card-author');
    const card = document.getElementById('card');
    const styleBtns = document.querySelectorAll('.style-btn');
    const fontSelect = document.getElementById('font-select');
    const colorBtns = document.querySelectorAll('.color-btn');
    const bgImageUpload = document.getElementById('bg-image-upload');
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');
    const newCardBtn = document.getElementById('new-card-btn');
    const shareModal = document.getElementById('share-modal');
    const closeBtn = document.querySelector('.close-btn');
    const shareOptions = document.querySelectorAll('.share-option');
    const shareLink = document.getElementById('share-link');
    const copyLinkBtn = document.getElementById('copy-link-btn');

    // Update quote text when input changes
    quoteInput.addEventListener('input', function() {
        cardQuote.textContent = this.value ? `"${this.value}"` : '';
    });

    // Update author when input changes
    authorInput.addEventListener('input', function() {
        cardAuthor.textContent = this.value ? `- ${this.value}` : '';
    });

    // Change card style
    styleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            styleBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Remove all style classes from card
            card.classList.remove('elegant', 'minimal', 'vibrant', 'dark', 'collage1', 'collage2', 'vintage');
            
            // Add selected style class
            const style = this.getAttribute('data-style');
            card.classList.add(style);
            
            // Adjust text color based on background for better readability
            if (style === 'dark') {
                cardQuote.style.color = 'white';
                cardAuthor.style.color = 'white';
            } else {
                cardQuote.style.color = '#333';
                cardAuthor.style.color = '#333';
            }
        });
    });

    // Change font style
    fontSelect.addEventListener('change', function() {
        cardQuote.style.fontFamily = this.value;
        cardAuthor.style.fontFamily = this.value;
    });

    // 添加自定义背景图片上传功能
    bgImageUpload.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // 移除所有样式类
                card.classList.remove('elegant', 'minimal', 'vibrant', 'dark', 'collage1', 'collage2', 'vintage', 'mushroom');
                
                // 添加自定义类
                card.classList.add('custom-bg');
                
                // 设置背景图片
                card.style.backgroundImage = `url(${e.target.result})`;
                card.style.backgroundSize = 'cover';
                card.style.backgroundPosition = 'center';
                
                // 重置活动按钮
                styleBtns.forEach(btn => btn.classList.remove('active'));
            };
            
            reader.readAsDataURL(this.files[0]);
        }
    });

    // 修改卡片样式切换，确保自定义背景被清除
    styleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除活动类
            styleBtns.forEach(b => b.classList.remove('active'));
            
            // 添加活动类到点击的按钮
            this.classList.add('active');
            
            // 移除所有样式类
            card.classList.remove('elegant', 'minimal', 'vibrant', 'dark', 'collage1', 'collage2', 'vintage', 'mushroom', 'custom-bg');
            
            // 清除自定义背景
            card.style.backgroundImage = '';
            
            // 添加选择的样式类
            const style = this.getAttribute('data-style');
            card.classList.add(style);
            
            // 根据背景调整文本颜色以提高可读性
            if (style === 'dark' || style === 'mushroom') {
                cardQuote.style.color = 'white';
                cardAuthor.style.color = 'white';
            } else {
                cardQuote.style.color = '#333';
                cardAuthor.style.color = '#333';
            }
        });
    });

    // 文本颜色选择功能
    if (colorBtns) {
        colorBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // 移除活动类
                colorBtns.forEach(b => b.classList.remove('active'));
                
                // 添加活动类到点击的按钮
                this.classList.add('active');
                
                // 设置文本颜色
                const color = this.getAttribute('data-color');
                cardQuote.style.color = color;
                cardAuthor.style.color = color;
            });
        });
    }

    // 下载卡片为图片
    downloadBtn.addEventListener('click', function() {
        // 添加下载动画
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        // 保存原始旋转状态
        const originalTransform = card.style.transform;
        // 临时移除旋转效果以便正确捕获
        card.style.transform = 'none';
        
        // 确保背景图片已加载
        const bgImages = [];
        const styles = ['collage1', 'collage2', 'mushroom', 'custom-bg'];
        
        // 预加载所有可能的背景图片
        Promise.all(styles.map(style => {
            if (card.classList.contains(style)) {
                if (style === 'custom-bg') {
                    // 自定义背景已经加载，不需要额外处理
                    return Promise.resolve();
                } else {
                    return new Promise((resolve) => {
                        const img = new Image();
                        img.onload = () => resolve();
                        img.onerror = () => resolve(); // 即使加载失败也继续
                        img.src = `images/${style}.jpg`;
                        bgImages.push(img);
                    });
                }
            }
            return Promise.resolve();
        })).then(() => {
            // 等待一小段时间确保样式已应用
            setTimeout(() => {
                html2canvas(card, {
                    scale: 2, // 更高质量的图片
                    backgroundColor: null,
                    useCORS: true, // 允许跨域图片
                    allowTaint: true, // 允许污染画布
                    logging: false // 关闭日志以提高性能
                }).then(canvas => {
                    // 恢复原始旋转状态
                    card.style.transform = originalTransform;
                    
                    const link = document.createElement('a');
                    link.download = 'gold-sentence-card.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    
                    // 恢复按钮文本
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-download"></i> Download Card';
                    }, 1000);
                }).catch(err => {
                    console.error('Download failed:', err);
                    this.innerHTML = '<i class="fas fa-download"></i> Download Card';
                    alert('Download failed, please try again');
                });
            }, 500);
        });
    });
 // Open share modal
    shareBtn.addEventListener('click', function() {
        // Generate a dummy share link (in a real app, this would be a unique URL)
        shareLink.value = window.location.href;
        shareModal.style.display = 'flex';
    });

    // Close share modal
    closeBtn.addEventListener('click', function() {
        shareModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === shareModal) {
            shareModal.style.display = 'none';
        }
    });

    // Share options
    shareOptions.forEach(option => {
        option.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            const text = encodeURIComponent(`${cardQuote.textContent} ${cardAuthor.textContent}`);
            const url = encodeURIComponent(window.location.href);
            
            let shareUrl;
            
            switch(platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'pinterest':
                    shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&description=${text}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=Check out this Gold Sentence&body=${text} ${url}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank');
            }
        });
    });

    // Copy share link
    copyLinkBtn.addEventListener('click', function() {
        shareLink.select();
        document.execCommand('copy');
        this.textContent = 'Copied!';
        setTimeout(() => {
            this.textContent = 'Copy Link';
        }, 2000);
    });

    // Create new card
    newCardBtn.addEventListener('click', function() {
        quoteInput.value = '';
        authorInput.value = '';
        cardQuote.textContent = '"Your quote will appear here"';
        cardAuthor.textContent = '- Author';
        
        // Reset to default style
        card.classList.remove('elegant', 'minimal', 'vibrant', 'dark', 'collage1', 'collage2', 'vintage');
        card.classList.add('elegant');
        
        // Reset active button
        styleBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-style="elegant"]').classList.add('active');
        
        // Reset font
        fontSelect.value = "'Playfair Display', serif";
        cardQuote.style.fontFamily = "'Playfair Display', serif";
        cardAuthor.style.fontFamily = "'Playfair Display', serif";
        
        // Reset text color
        cardQuote.style.color = '#333';
        cardAuthor.style.color = '#333';
    });

    // Initialize with active elegant style
    document.querySelector('[data-style="elegant"]').classList.add('active');
    
    // Add card hover effect
    card.addEventListener('mouseover', function() {
        this.style.transform = 'rotate(0deg) scale(1.02)';
    });
    
    card.addEventListener('mouseout', function() {
        this.style.transform = 'rotate(-2deg) scale(1)';
    });

    
    // Payment functionality
    // Get payment related elements
    const supportBtn = document.getElementById('support-btn');
    const paymentModal = document.getElementById('payment-modal');
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customAmount = document.getElementById('custom-amount');
    const alipayBtn = document.getElementById('alipay-btn');
    const qrcodeDisplay = document.getElementById('qrcode-display');
    const paymentMethods = document.querySelector('.payment-methods');
    const backToMethodsBtn = document.getElementById('back-to-methods');
    const paymentQrcode = document.getElementById('payment-qrcode');
    const qrcodeText = document.getElementById('qrcode-text');
    const paymentTypeLabel = document.getElementById('payment-type-label');
    
    // Default amount
    let selectedAmount = 10;
    
    // Open payment modal
    if (supportBtn) {
        supportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            paymentModal.style.display = 'block';
            // Ensure payment methods are shown, hide QR code
            if (paymentMethods && qrcodeDisplay) {
                paymentMethods.style.display = 'flex';
                qrcodeDisplay.style.display = 'none';
            }
        });
    }
    
    // Close payment modal
    if (paymentModal) {
        const closeBtn = paymentModal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                paymentModal.style.display = 'none';
            });
        }
    
        // Close when clicking outside the modal
        window.addEventListener('click', function(e) {
            if (e.target === paymentModal) {
                paymentModal.style.display = 'none';
            }
        });
    }
    
    // Select amount
    if (amountBtns) {
        amountBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                amountBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                selectedAmount = parseFloat(this.getAttribute('data-amount'));
                if (customAmount) {
                    customAmount.value = '';
                }
                
                // If QR code is already displayed, update amount
                if (qrcodeDisplay && qrcodeDisplay.style.display === 'block') {
                    updateQRCodeAndLink();
                }
            });
        });
    }
    
    // Custom amount
    if (customAmount) {
        customAmount.addEventListener('input', function() {
            if (this.value) {
                selectedAmount = parseFloat(this.value);
                if (amountBtns) {
                    amountBtns.forEach(btn => btn.classList.remove('active'));
                }
                
                // If QR code is already displayed, update amount
                if (qrcodeDisplay && qrcodeDisplay.style.display === 'block') {
                    updateQRCodeAndLink();
                }
            }
        });
    }
    
    // Alipay payment - show QR code
    if (alipayBtn) {
        alipayBtn.addEventListener('click', function() {
            if (selectedAmount <= 0) {
                alert('Please select or enter a valid amount');
                return;
            }
            
            // Show Alipay QR code
            showQRCode('alipay');
        });
    }
    
    // Return to payment method selection
    if (backToMethodsBtn) {
        backToMethodsBtn.addEventListener('click', function() {
            if (paymentMethods && qrcodeDisplay) {
                paymentMethods.style.display = 'flex';
                qrcodeDisplay.style.display = 'none';
            }
        });
    }
    
    // Get PayPal button element
    const paypalBtn = document.getElementById('paypal-btn');
    
    // PayPal payment - show link
    if (paypalBtn) {
        paypalBtn.addEventListener('click', function() {
            if (selectedAmount <= 0) {
                alert('Please select or enter a valid amount');
                return;
            }
            
            // Show PayPal payment link
            showQRCode('paypal');
        });
    }
    
    // Show QR code and link
    function showQRCode(method) {
        if (paymentMethods && qrcodeDisplay) {
            // Hide payment method selection, show QR code
            paymentMethods.style.display = 'none';
            qrcodeDisplay.style.display = 'block';
            
            if (method === 'alipay') {
                // Alipay QR code
                updateQRCodeAndLink('alipay');
                
                // Hide PayPal link container
                if (paypalLinkContainer) {
                    paypalLinkContainer.style.display = 'none';
                }
            } else if (method === 'paypal') {
                // PayPal payment
                updateQRCodeAndLink('paypal');
                
                // Show PayPal link container
                if (paypalLinkContainer) {
                    paypalLinkContainer.style.display = 'block';
                }
            }
        }
    }
    
    // Update QR code and link
    function updateQRCodeAndLink(method) {
        if (method === 'alipay') {
            // Alipay QR code
            if (paymentQrcode) {
                paymentQrcode.src = 'alipay-qrcode.png';
            }
            if (qrcodeText) {
                qrcodeText.textContent = `Scan this QR code to pay $${selectedAmount} with Alipay`;
            }
            if (paymentTypeLabel) {
                paymentTypeLabel.textContent = 'Alipay Payment';
                paymentTypeLabel.className = 'payment-type-label alipay';
            }
        } else if (method === 'paypal') {
            // PayPal payment
            if (paymentQrcode) {
                paymentQrcode.src = 'paypal-qrcode.png'; // If you have a PayPal QR code image
            }
            if (qrcodeText) {
                qrcodeText.textContent = `Use PayPal to pay $${selectedAmount}`;
            }
            if (paymentTypeLabel) {
                paymentTypeLabel.textContent = 'PayPal Payment';
                paymentTypeLabel.className = 'payment-type-label paypal';
            }
            
            // Update PayPal link
            if (paypalDirectLink) {
                paypalDirectLink.href = `https://www.paypal.com/paypalme/YourPayPalUsername/${selectedAmount}`;
            }
        }
    }

    // Get PayPal link container and direct link elements
    const paypalLinkContainer = document.getElementById('paypal-link-container');
    const paypalDirectLink = document.getElementById('paypal-direct-link');
});

