//Hamburger Menü
const hamburger = document.querySelector('.hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

//Sidebar & Overlay auf mobiler Ansicht einblenden
function openMenu() {
  sidebar.classList.add('active');
  overlay.classList.add('active');
}

//Ansonsten Sidebar & Overlay schließen
function closeMenu() {
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
}

//Nur wenn alle Elemente vorhanden sind EventListener hinzufügen
if (hamburger && sidebar && overlay) {
  hamburger.addEventListener('click', openMenu);
  overlay.addEventListener('click', closeMenu);
}

//Produkte & Preise
const products = [
  { id: 1, name: '6er Campusbier Hell', price: 12.0 },
  { id: 2, name: '6er Campusbier Hell Geschenk', price: 15.0 },
  { id: 3, name: 'Kiste Campusbier hell', price: 39.5 },
  { id: 4, name: '6er Campusbier Dunkel', price: 12.0 },
  { id: 5, name: '6er Campusbier Dunkel Geschenk', price: 15.0 },
  { id: 6, name: 'Kiste Campusbier Dunkel', price: 39.5 },
  { id: 7, name: '6er Campusbier Duo', price: 12.0 },
  { id: 8, name: '6er Campusbier Duo Geschenk', price: 15.0 },
  { id: 9, name: 'Kiste Campusbier Duo', price: 39.5 },
  { id: 10, name: 'Bierseife Campusbier Hell', price: 8.6 },
  { id: 11, name: 'Bierseife Campusbier Dunkel', price: 8.6 },
  { id: 12, name: 'Campusbier-Geschenkgutschein', price: 25.0 },
  { id: 13, name: 'Kleine Hochschulfreude', price: 14.99 },
  { id: 14, name: 'Kleine Hochschulfreude alkoholfrei', price: 14.99 },
];

//Lade die Produkte aus dem LocalStorage (Warenkorb), ansonsten nichts anzeigen
function getCart() {
  return JSON.parse(localStorage.getItem('campusbier_cart')) || [];
}

//Warenkorb im LocalStorage speichern und Navbar aktualisieren
function saveCart(cart) {
  localStorage.setItem('campusbier_cart', JSON.stringify(cart));
  updateNavbarTotal();
  displayCartPage();
}

//Gesamtpreis des Warenkorbs berechnen
function getTotal(cart) {
  let total = 0;
  for (const item of cart) {
    total += item.price * item.quantity;
  }
  return total;
}

//Gesamtpreis in der Navbar aktualisieren und anzeigen
function updateNavbarTotal() {
  const totalElement = document.getElementById('cart-total');
  if (totalElement) {
    totalElement.textContent = '€' + getTotal(getCart()).toFixed(2);
  }
}

//Produkt hinzufügen oder Menge erhöhen, wenn es bereits im Warenkorb ist
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  saveCart(cart);
}

//Menge um +1 erhöhen, -1 verringern oder Produkt entfernen, wenn Menge=0 ist
function changeQuantity(productId, change) {
  let cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  item.quantity += change;

  if (change === 0 || item.quantity <= 0) {
    cart = cart.filter((i) => i.id !== productId);
  }

  saveCart(cart);
}

//Produkte in der Warenkorb-Seite anzeigen
function displayCartPage() {
  const cartContainer = document.getElementById('cart-container');
  const pageTotal = document.getElementById('cart-page-total');
  const pageSubtotal = document.getElementById('cart-page-subtotal');

  //Nichts tun wenn auf der Warenkorb-Seite nichts vorhanden ist
  if (!cartContainer || !pageTotal) return;

  const cart = getCart();
  const total = '€' + getTotal(cart).toFixed(2);

  //Wenn der Warenkorb leer ist, Nachricht + Link zum Shop anzeigen, ansonsten Produkte auflisten und Preise & Buttons anzeigen
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-empty">
        <p>Dein Warenkorb ist aktuell leer.</p>
        <a href="cb_shop.html" class="green-button">Jetzt einkaufen</a>
      </div>`;
  } else {
    let html = '';

    for (const item of cart) {
      const itemTotal = item.price * item.quantity;
      html += `
        <div class="cart-item">
          <div class="cart-item-info">
            <h3 class="cart-item-name">${item.name}</h3>
            <span class="cart-item-unit">Einzelpreis: €${item.price.toFixed(2)}</span>
          </div>
          <div class="cart-qty">
            <button class="cart-qty-btn" onclick="changeQuantity(${item.id}, -1)" aria-label="Weniger">−</button>
            <span class="cart-qty-number">${item.quantity}</span>
            <button class="cart-qty-btn" onclick="changeQuantity(${item.id}, 1)" aria-label="Mehr">+</button>
          </div>
          <span class="cart-item-price">€${itemTotal.toFixed(2)}</span>
          <button class="cart-remove" onclick="changeQuantity(${item.id}, 0)">Entfernen</button>
        </div>`;
    }

    cartContainer.innerHTML = html;
  }

  //Gesamtpreis auf der Seite anzeigen
  pageTotal.textContent = total;
  if (pageSubtotal) pageSubtotal.textContent = total;
}

//Startet die Funktionen, sobald die Seite geladen ist
document.addEventListener('DOMContentLoaded', function () {
  updateNavbarTotal();
  displayCartPage();

  //Jeder "In den Warenkorb"-Button wird über sein data-id im HTML mit dem Produkt verknüpft
  const buttons = document.querySelectorAll('.product-card button');

  buttons.forEach(function (button) {
    //data-id wird als Text gelesen und mit Number() in eine Zahl umwandeln
    const productId = Number(button.dataset.id);
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    button.addEventListener('click', function () {
      addToCart(product);

      //Anzeigen, wenn ein Produkt hinzugefügt wird
      button.textContent = 'Hinzugefügt! ✓';
      setTimeout(function () {
        button.textContent = 'In den Warenkorb';
      }, 1000);
    });
  });
});
