import './style.css'

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

class Cart {
  private items: CartItem[] = [];
  private cartCountEl = document.getElementById('cartCount');
  private cartItemsEl = document.getElementById('cartItems');
  private cartTotalEl = document.getElementById('cartTotal');
  private cartSidebar = document.getElementById('cartSidebar');
  private cartOverlay = document.getElementById('cartOverlay');

  constructor() {
    // Load from localStorage if exists
    const savedCart = localStorage.getItem('localKitchenCart');
    if (savedCart) {
      this.items = JSON.parse(savedCart);
    }
    this.init();
    this.updateUI();

    // Auto-open cart if URL parameter exists
    if (window.location.search.includes('openCart=true')) {
      setTimeout(() => this.openCart(), 300);
    }
  }

  private init() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = (e.target as HTMLElement).closest('.menu-card') as HTMLElement;
        const name = card.dataset.name || '';
        const price = parseInt(card.dataset.price || '0');
        this.addItem(name, price);
        this.openCart();
      });
    });

    // Toggle cart
    document.getElementById('viewCartBtn')?.addEventListener('click', () => this.openCart());
    document.getElementById('closeCart')?.addEventListener('click', () => this.closeCart());
    this.cartOverlay?.addEventListener('click', () => this.closeCart());
    
    // Checkout redirection
    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
      if (this.items.length > 0) {
        window.location.href = '/checkout.html';
      } else {
        alert('Your cart is empty!');
      }
    });

    // Empty cart
    document.getElementById('emptyCartBtn')?.addEventListener('click', () => {
      if (this.items.length > 0) {
        if (confirm('Are you sure you want to empty your cart?')) {
          this.clear();
        }
      }
    });

    // Custom Cake Form
    const customCakeForm = document.getElementById('customCakeForm') as HTMLFormElement;
    if (customCakeForm) {
      customCakeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(customCakeForm);
        
        let occasion = formData.get('occasion') as string;
        if (occasion === 'Others') {
          occasion = formData.get('occasion_specify') as string;
        }
        
        const size = formData.get('size') as string;
        const flavor = formData.get('flavor') as string;
        const filling = formData.get('filling') as string;
        
        // Pricing logic
        let price = 0;
        if (size === '6-inch') price = 1500;
        else if (size === '8-inch') price = 2000;
        else if (size === '10-inch') price = 2500;

        const customData = {
          occasion,
          size,
          flavor,
          filling,
          requests: formData.get('requests'),
          ref_link: formData.get('ref_link'),
          price
        };
        
        // Save to a separate state for custom orders
        localStorage.setItem('localKitchenCustomOrder', JSON.stringify(customData));
        
        // Redirect to a specialized custom payment page
        window.location.href = '/custom-payment.html';
      });
    }
  }

  public addItem(name: string, price: number) {
    const existingItem = this.items.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ name, price, quantity: 1 });
    }
    this.save();
    this.updateUI();
  }

  private removeItem(name: string) {
    this.items = this.items.filter(item => item.name !== name);
    this.save();
    this.updateUI();
  }

  public updateQuantity(name: string, delta: number) {
    const item = this.items.find(i => i.name === name);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeItem(name);
      } else {
        this.save();
        this.updateUI();
      }
    }
  }

  private save() {
    localStorage.setItem('localKitchenCart', JSON.stringify(this.items));
    if (this.items.length === 0) {
      localStorage.removeItem('localKitchenTempAddons');
    }
  }

  private updateUI() {
    if (this.cartCountEl) {
      this.cartCountEl.textContent = this.items.reduce((sum, item) => sum + item.quantity, 0).toString();
    }

    if (this.cartItemsEl) {
      this.cartItemsEl.innerHTML = this.items.map(item => `
        <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
          <div class="cart-item-info">
            <h4 style="margin: 0; font-size: 0.95rem;">${item.name}</h4>
            <p style="margin: 5px 0 0; color: var(--primary); font-weight: 600;">${item.price > 0 ? `₱${item.price.toLocaleString()}` : 'Price TBD'}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="quantity-controls" style="display: flex; align-items: center; gap: 8px; background: #f5f5f5; border-radius: 20px; padding: 2px 8px;">
              <button class="qty-btn minus" data-name="${item.name}" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; line-height: 1; padding: 0 5px;">-</button>
              <span style="font-size: 0.9rem; min-width: 20px; text-align: center;">${item.quantity}</span>
              <button class="qty-btn plus" data-name="${item.name}" style="background: none; border: none; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0 5px;">+</button>
            </div>
            <button class="remove-item" data-name="${item.name}" style="background: none; border: none; color: #ff4444; cursor: pointer; font-size: 1.2rem; padding: 0 5px;">&times;</button>
          </div>
        </div>
      `).join('');

      // Add quantity listeners
      this.cartItemsEl.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          const name = target.dataset.name || '';
          const isPlus = target.classList.contains('plus');
          this.updateQuantity(name, isPlus ? 1 : -1);
        });
      });

      // Add remove listeners
      this.cartItemsEl.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const name = (e.target as HTMLElement).dataset.name || '';
          this.removeItem(name);
        });
      });
    }

    if (this.cartTotalEl) {
      const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      this.cartTotalEl.textContent = `₱${total.toLocaleString()}`;
    }
  }

  public openCart() {
    this.cartSidebar?.classList.add('active');
    this.cartOverlay?.classList.add('active');
  }

  public closeCart() {
    this.cartSidebar?.classList.remove('active');
    this.cartOverlay?.classList.remove('active');
  }

  public clear() {
    this.items = [];
    this.save();
    this.updateUI();
  }
}

// Initialize Cart
new Cart();

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(20px)';
  section.style.transition = 'all 0.6s ease-out';
  observer.observe(section);
});

const style = document.createElement('style');
style.textContent = `.fade-in { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);

// Mobile Menu Toggle Logic
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });

  // Close menu when clicking a link
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });
}
