import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pizza, Sandwich, Disc, Utensils, ShoppingCart, 
  Navigation, Phone, Star, MapPin, Search, X, Plus, Minus, ShieldCheck, CheckCircle, Download, ChevronRight, Clock, CreditCard, Loader2, Bell, Check, Trash2
} from 'lucide-react';
import { jsPDF } from "jspdf";

import heroBg from './assets/pizza_napo.jpg';

// --- BASE DE DONNÉES COMPLÈTE (39 articles) ---
const INITIAL_MENU = [
  { id: 1, name: "Margherita di Bobo", category: "Pizzas", price: 10.00, desc: "Sauce tomate, fior di latte, filet d'huile d'olive." },
  { id: 2, name: "Regina di Biba", category: "Pizzas", price: 10.00, desc: "Sauce tomate, fior di latte, jambon de dinde, champignons frais." },
  { id: 3, name: "4 Fromaggi di Mimi", category: "Pizzas", price: 10.00, desc: "Sauce tomate, fior di latte, gorgonzola, chèvre, copeaux de parmesan." },
  { id: 4, name: "4 Fromaggi Napoletana", category: "Pizzas", price: 10.00, desc: "Crème, fior di latte, gorgonzola, chèvre, copeaux de parmesan." },
  { id: 5, name: "La Fermière", category: "Pizzas", price: 10.00, desc: "Crème, blanc de poulet fumé, champignons, pommes de terre, origan." },
  { id: 6, name: "Campione", category: "Pizzas", price: 10.00, desc: "Sauce tomate, fior di latte, champignons, viande hachée, œuf." },
  { id: 7, name: "Capra al Miele", category: "Pizzas", price: 10.00, desc: "Crème, fior di latte, chèvre, miel, noix." },
  { id: 8, name: "L'Orientale", category: "Pizzas", price: 10.00, desc: "Sauce tomate, merguez, oignons confits, poivrons, œuf." },
  { id: 9, name: "La Paysanne", category: "Pizzas", price: 10.00, desc: "Crème, fior di latte, mix poulet curry & tandoori, champignons, courgettes grillées." },
  { id: 10, name: "La Burger", category: "Pizzas", price: 10.00, desc: "Sauce tomate, fior di latte, oignons confits, cornichon, steak burger." },
  { id: 11, name: "Al Tonno", category: "Pizzas", price: 10.00, desc: "Sauce tomate, thon, thon, origan, œuf." },
  { id: 12, name: "Al Pollo", category: "Pizzas", price: 10.00, desc: "Crème, fior di latte, mix poulet curry & tandoori, olives, oignons." },
  { id: 13, name: "4 Staggion", category: "Pizzas", price: 10.00, desc: "Sauce tomate, fior di latte, jambon dinde, champignons, artichaut." },
  { id: 14, name: "Calzone", category: "Pizzas", price: 10.00, desc: "Sauce tomate, fior di latte, jambon de dinde, œuf, champignons frais." },
  { id: 15, name: "Capricciosa", category: "Pizzas", price: 10.00, desc: "Sauce tomate, fior di latte, oignons confits." },
  { id: 16, name: "Pesto Verde", category: "Pizzas", price: 10.00, desc: "Pesto, fior di latte, tomates confites, jambon, roquette, crème balsamique." },
  { id: 17, name: "La Spicquante", category: "Pizzas", price: 10.00, desc: "Sauce tomate, chorizo, piment, poivrons." },
  { id: 18, name: "La Napolitaine", category: "Signatures", price: 16.90, desc: "Sauce tomate, pastrami, roquette, tomates confites, parmesan, burrata." },
  { id: 19, name: "La Dialy", category: "Signatures", price: 16.90, desc: "Sauce tomate, fior di latte, carpaccio de veau séché, stracciatella." },
  { id: 20, name: "Il Tartufo", category: "Signatures", price: 15.90, desc: "Crème de truffe, burrata, crème balsamique, parmesan, roquette." },
  { id: 21, name: "Il Burratina", category: "Signatures", price: 15.90, desc: "Sauce tomate, fior di latte, tomates confites, roquette, burrata." },
  { id: 22, name: "Stracciatella", category: "Signatures", price: 15.90, desc: "Sauce tomate, fior di latte, tomates confites, stracciatella, pesto." },
  { id: 23, name: "Il Cannibale", category: "Signatures", price: 14.90, desc: "Sauce barbecue, bœuf haché, poulet, merguez, oignons, poivrons." },
  { id: 24, name: "Vegetarienne", category: "Signatures", price: 14.00, desc: "Sauce tomate, courgettes, aubergines, artichaut à la romaine, tomates confites." },
  { id: 25, name: "Al Salmone", category: "Signatures", price: 14.00, desc: "Crème, fior di latte, filet d'huile d'olive, saumon fumé." },
  { id: 26, name: "Cheese", category: "Burgers", price: 3.50, desc: "Steak, fromage. (Menu: 6.50€)" },
  { id: 27, name: "Double Cheese", category: "Burgers", price: 4.50, desc: "Double steak, double fromage. (Menu: 7.50€)" },
  { id: 28, name: "Cheese Bacon", category: "Burgers", price: 4.50, desc: "Steak, fromage, bacon. (Menu: 7.50€)" },
  { id: 29, name: "Giant", category: "Burgers", price: 5.50, desc: "Format généreux, sauce Giant. (Menu: 8.50€)" },
  { id: 30, name: "Big", category: "Burgers", price: 6.00, desc: "Le classique à double étage. (Menu: 9.00€)" },
  { id: 31, name: "Mike Bacon", category: "Burgers", price: 7.00, desc: "Bœuf, bacon, oignons. (Menu: 10.00€)" },
  { id: 32, name: "Smooky", category: "Burgers", price: 7.00, desc: "Goût fumé intense. (Menu: 10.00€)" },
  { id: 33, name: "Poulet Curry", category: "Sandwichs", price: 9.00, desc: "Poulet mariné au curry. (Menu: 10.00€)" },
  { id: 34, name: "Poulet Tandoori", category: "Sandwichs", price: 9.00, desc: "Poulet mariné tandoori. (Menu: 10.00€)" },
  { id: 35, name: "Steak Haché", category: "Sandwichs", price: 9.00, desc: "Steak haché de bœuf. (Menu: 10.00€)" },
  { id: 36, name: "Kefta", category: "Sandwichs", price: 9.00, desc: "Viande hachée épicée. (Menu: 10.00€)" },
  { id: 37, name: "Américain", category: "Sandwichs", price: 11.00, desc: "Steak haché, dinde, œuf. (Menu: 13.00€)" },
  { id: 38, name: "Arabi", category: "Sandwichs", price: 11.00, desc: "Kefta, jambon de dinde, œuf. (Menu: 13.00€)" },
  { id: 39, name: "Italien", category: "Sandwichs", price: 11.00, desc: "Steak, jambon de dinde, œuf. (Menu: 13.00€)" },
  { id: 40, name: "Croque Poulet", category: "Croques", price: 4.00, desc: "Poulet, fromage. (Menu: 7.00€)" },
  { id: 41, name: "Croque Pastrami", category: "Croques", price: 4.50, desc: "Pastrami, fromage. (Menu: 7.50€)" },
  { id: 42, name: "Croque Truffe", category: "Croques", price: 4.50, desc: "Crème de truffe, fromage. (Menu: 7.50€)" },
  { id: 43, name: "Croque Pesto", category: "Croques", price: 4.50, desc: "Pesto, fromage. (Menu: 7.50€)" },
  { id: 44, name: "Croque Chèvre-Miel", category: "Croques", price: 4.50, desc: "Chèvre, miel. (Menu: 7.50€)" },
];

const categories = [
  { name: "Pizzas", icon: <Pizza /> },
  { name: "Signatures", icon: <Star /> },
  { name: "Burgers", icon: <Utensils /> },
  { name: "Sandwichs", icon: <Sandwich /> },
  { name: "Croques", icon: <Disc /> },
];

const OPTIONS = {
  sauces: ["Algérienne", "Samouraï", "Blanche", "Mayo", "Ketchup", "Harissa"],
  crudites: ["Salade", "Tomate", "Oignon"],
  boissons: ["Coca Cola", "Fuze Tea", "Evian", "Oasis"]
};

const ITALIAN_GREEN = "#009246";
const ITALIAN_RED = "#ce2b37";

function App() {
  const [activeTab, setActiveTab] = useState("Pizzas");
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isMerchantMode, setIsMerchantMode] = useState(false);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('merchantOrders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // États Tunnel
  const [checkoutStep, setCheckoutStep] = useState(0); 
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', time: '20:00' });
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '' });
  const [errors, setErrors] = useState({});

  // États Options
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [tempItem, setTempItem] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({ sauces: [], crudites: ["Salade", "Tomate", "Oignon"], boisson: 'Coca Cola' });

  useEffect(() => {
    // Détection Mode Marchand via URL: ?view=merchant
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'merchant') setIsMerchantMode(true);

    const timer = setTimeout(() => setIsLoading(false), 2500);
    const checkStatus = () => {
      const now = new Date();
      const day = now.getDay();
      const time = now.getHours() + now.getMinutes() / 60;
      let open = false;
      if (day !== 0) { //
        if (day === 5) open = (time >= 15 && time < 24); // Vendredi 15h
        else open = (time >= 11.5 && time < 24); // Autres 11h30
      }
      setIsOpen(open);
    };
    checkStatus();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('merchantOrders', JSON.stringify(orders));
  }, [cart, orders]);

  const toggleSauce = (sauce) => {
    setSelectedOptions(prev => {
      if (prev.sauces.includes(sauce)) return { ...prev, sauces: prev.sauces.filter(s => s !== sauce) };
      if (prev.sauces.length < 2) return { ...prev, sauces: [...prev.sauces, sauce] }; 
      return prev;
    });
  };

  const handleAddToCartClick = (item) => {
    if (["Sandwichs", "Burgers"].includes(item.category)) {
      setTempItem(item);
      setSelectedOptions({ sauces: [], crudites: ["Salade", "Tomate", "Oignon"], boisson: 'Coca Cola' });
      setIsOptionModalOpen(true);
    } else {
      addToCart(item);
    }
  };

  const addToCart = (item, options = null) => {
    const cartItem = { ...item, cartId: Math.random().toString(36).substr(2, 9), options: options };
    setCart(prev => [...prev, cartItem]);
    setIsOptionModalOpen(false);
    setIsCartOpen(true);
    setCheckoutStep(0);
  };

  const removeFromCart = (cartId) => setCart(prev => prev.filter(i => i.cartId !== cartId));
  const cartTotal = cart.reduce((t, i) => t + (i.price), 0);

  const handlePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const newOrder = {
        id: Date.now(),
        client: formData,
        items: [...cart],
        total: cartTotal,
        status: 'new', // new, preparing, ready
        timestamp: new Date().toLocaleTimeString('fr-FR')
      };
      setOrders(prev => [newOrder, ...prev]);
      setIsProcessingPayment(false);
      setCheckoutStep(3); 
      setCart([]);
      localStorage.removeItem('cart');
    }, 2000);
  };

  // Logique Marchand
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const generatePDF = (orderItems) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("LA NAPOLITAINE - REÇU", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Client: ${formData.name}`, 20, 40);
    let y = 60;
    orderItems.forEach(item => {
      doc.text(`1x ${item.name}`, 20, y);
      if (item.options) doc.text(`Sauces: ${item.options.sauces.join(', ')}`, 25, y + 5);
      y += 10;
    });
    doc.save(`recu_${formData.name}.pdf`);
  };

  // --- INTERFACE MARCHAND (Kitchen Dashboard) ---
  if (isMerchantMode) {
    return (
      <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans">
        <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-[#ce2b37]">Cuisine Dashboard</h1>
            <p className="text-white/40 text-xs mt-1">7 Bd de la Seine - Nanterre</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-neutral-900 px-4 py-2 rounded-full flex items-center gap-2">
              <Bell className="text-[#009246]" size={16} />
              <span className="font-bold">{orders.filter(o => o.status === 'new').length} Nouvelles</span>
            </div>
            <button onClick={() => window.location.href = '/'} className="text-[10px] uppercase font-black opacity-30">Quitter</button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {orders.map(order => (
              <motion.div 
                key={order.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-6 rounded-[2rem] border ${order.status === 'new' ? 'bg-[#ce2b37]/10 border-[#ce2b37]/50' : 'bg-neutral-900 border-white/5'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-black text-xl uppercase italic">{order.client.name}</h3>
                    <p className="text-[#009246] font-bold text-sm">{order.client.phone}</p>
                  </div>
                  <span className="text-[10px] font-black opacity-40 bg-white/5 px-2 py-1 rounded-md">{order.timestamp}</span>
                </div>

                <div className="space-y-3 mb-6 border-y border-white/5 py-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-sm">
                      <p className="font-black uppercase tracking-tight">1x {item.name}</p>
                      {item.options && (
                        <p className="text-[10px] text-white/40 italic ml-2">
                          {item.options.sauces.join(', ')} • {item.options.crudites.join('/')} • {item.options.boisson}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <p className="text-[9px] uppercase font-black text-white/40">Retrait prévu</p>
                    <p className="text-lg font-black italic">{order.client.time}</p>
                  </div>
                  <div className="flex gap-2">
                    {order.status !== 'ready' ? (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="bg-[#009246] p-3 rounded-full hover:scale-110 transition"
                      >
                        <Check size={20} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => deleteOrder(order.id)}
                        className="bg-white/5 p-3 rounded-full text-red-500"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
                {order.status === 'ready' && <p className="text-[10px] text-[#009246] font-black uppercase mt-4 text-center">✓ Commande prête</p>}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {orders.length === 0 && (
          <div className="h-96 flex flex-col items-center justify-center opacity-20">
            <Utensils size={64} className="mb-4" />
            <p className="font-black uppercase tracking-widest">En attente de commandes...</p>
          </div>
        )}
      </div>
    );
  }

  // --- INTERFACE CLIENT (Identique à la version "parfaite") ---
  if (isLoading) {
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center z-50 relative px-4 text-center">
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter mb-12">
          <span style={{ color: ITALIAN_GREEN }}>La </span>Napol<span style={{ color: ITALIAN_RED }}>itaine</span>
        </motion.div>
        <div className="w-full max-w-xs h-1.5 bg-white/10 rounded-full overflow-hidden relative mb-6">
           <div className="absolute inset-0 h-full w-full flex">
              <div className="h-full w-1/3" style={{backgroundColor: ITALIAN_GREEN}}></div>
              <div className="h-full w-1/3 bg-white"></div>
              <div className="h-full w-1/3" style={{backgroundColor: ITALIAN_RED}}></div>
           </div>
           <motion.div initial={{ left: "-100%" }} animate={{ left: "100%" }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} className="absolute top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
        <p className="text-white text-[10px] uppercase tracking-[0.4em] font-black animate-pulse">Chargement des saveurs...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-neutral-950 font-sans antialiased text-white ${isCartOpen ? 'overflow-hidden' : ''}`}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,600&display=swap');`}</style>
      
      <nav className="sticky top-0 z-40 flex items-center justify-between bg-black/95 px-4 sm:px-6 py-4 backdrop-blur-md border-b border-white/10 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-10 sm:h-8 sm:w-12 overflow-hidden rounded shadow-sm border border-white/20">
            <div className="w-1/3" style={{ backgroundColor: ITALIAN_GREEN }}></div>
            <div className="w-1/3 bg-white flex items-center justify-center text-black font-bold text-[8px] sm:text-[10px]">LN</div>
            <div className="w-1/3" style={{ backgroundColor: ITALIAN_RED }}></div>
          </div>
          <h1 className="text-sm sm:text-xl font-black uppercase tracking-tighter italic">La Napolitaine</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[8px] font-black uppercase border ${isOpen ? 'border-green-500/50 text-green-500' : 'border-red-500/50 text-red-500'}`}>
            <span className={`w-1 h-1 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            {isOpen ? 'Ouvert' : 'Fermé'}
          </div>
          <motion.button onClick={() => setIsCartOpen(true)} className="relative p-2 bg-white/5 rounded-full border border-white/10">
            <ShoppingCart size={18} className="text-[#009246]" />
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[#ce2b37] text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center">{cart.length}</span>}
          </motion.button>
        </div>
      </nav>

      <header className="relative h-[450px] sm:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img src={heroBg} className="absolute inset-0 h-full w-full object-cover opacity-80" alt="Hero" />
        <div className="relative z-20 text-center px-4">
          <h2 className="text-5xl sm:text-8xl font-black italic uppercase tracking-tighter mb-4">
            <span style={{ color: ITALIAN_GREEN }}>La</span> Napol<span style={{ color: ITALIAN_RED }}>itaine</span>
          </h2>
          <p className="text-lg sm:text-2xl italic opacity-90" style={{ fontFamily: "'Playfair Display', serif" }}>L'art de la qualité Italienne à Nanterre.</p>
        </div>
      </header>

      {/* Quick Actions */}
      <section className="max-w-4xl mx-auto -mt-10 relative z-30 px-4">
        <div className="bg-neutral-900 rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a href="https://www.google.com/search?q=La+Napolitaine+Nanterre+avis" target="_blank" className="bg-white p-3 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner hover:scale-110 transition-transform cursor-pointer">
              <Search size={24} strokeWidth={3} />
            </a>
            <div>
              <div className="flex text-yellow-500 gap-1 mb-1"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Excellent • 4.9/5 sur Google</p>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <a href="tel:0171040098" className="flex-1 md:flex-none bg-white/5 p-4 rounded-full text-[#009246] hover:bg-[#009246] hover:text-white transition-all border border-white/5 flex items-center justify-center"><Phone size={20} /></a>
            <a href="https://www.google.com/maps/search/?api=1&query=La+Napolitaine+7+Bd+de+la+Seine+92000+Nanterre&query_place_id=ChIJ7Z99reZl5kcRpDuzdE7foFA" target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none bg-white/5 p-4 rounded-full text-[#ce2b37] hover:bg-[#ce2b37] hover:text-white transition-all border border-white/5 flex items-center justify-center"><Navigation size={20} /></a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="flex justify-start sm:justify-center gap-4 sm:gap-6 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(cat => (
            <button key={cat.name} onClick={() => setActiveTab(cat.name)} className={`flex flex-col items-center gap-2 transition-all shrink-0 ${activeTab === cat.name ? 'scale-110 opacity-100' : 'opacity-40'}`}>
              <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-2 ${activeTab === cat.name ? 'border-[#ce2b37] bg-[#ce2b37]' : 'border-white/10 bg-white/5'}`}>{cat.icon}</div>
              <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {INITIAL_MENU.filter(i => i.category === activeTab).map(item => (
            <div key={item.id} className="bg-neutral-900/80 backdrop-blur-sm p-6 sm:p-8 rounded-[2rem] border border-white/5 shadow-2xl flex flex-col group hover:border-[#009246]/50 transition-all duration-500">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-black text-xl sm:text-2xl italic uppercase tracking-tighter leading-none">{item.name}</h4>
                <span className="text-[#009246] font-black">{item.price.toFixed(2)} €</span>
              </div>
              <p className="text-white/40 text-xs sm:text-sm mb-8 italic flex-1">{item.desc}</p>
              <button onClick={() => handleAddToCartClick(item)} className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#ce2b37] hover:text-white transition-colors flex items-center justify-center gap-2 shadow-md">
                <ShoppingCart size={16} /> Ajouter au panier
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL OPTIONS */}
      <AnimatePresence>
        {isOptionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-neutral-900 border border-white/10 p-6 sm:p-8 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                <div><h3 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter">Personnalisation</h3><p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">2 sauces maximum</p></div>
                <button onClick={() => setIsOptionModalOpen(false)}><X /></button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase font-black text-white/40 mb-3 block">1. Sauces ({selectedOptions.sauces.length}/2)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {OPTIONS.sauces.map(s => (
                      <button key={s} onClick={() => toggleSauce(s)} className={`py-3 rounded-xl text-[10px] font-bold border transition-all ${selectedOptions.sauces.includes(s) ? 'bg-[#ce2b37] border-[#ce2b37]' : 'bg-white/5 border-white/10 opacity-50'}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-white/40 mb-3 block">2. Crudités</label>
                  <div className="flex gap-2">
                    {OPTIONS.crudites.map(c => (
                      <button key={c} onClick={() => {
                        const newC = selectedOptions.crudites.includes(c) ? selectedOptions.crudites.filter(x => x !== c) : [...selectedOptions.crudites, c];
                        setSelectedOptions({...selectedOptions, crudites: newC});
                      }} className={`flex-1 py-3 rounded-xl text-[10px] font-bold border transition-all ${selectedOptions.crudites.includes(c) ? 'bg-[#009246] border-[#009246]' : 'bg-white/5 border-white/10 opacity-50'}`}>{c}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-white/40 mb-3 block">3. Boisson</label>
                  <div className="grid grid-cols-2 gap-2">
                    {OPTIONS.boissons.map(b => (
                      <button key={b} onClick={() => setSelectedOptions({...selectedOptions, boisson: b})} className={`py-3 rounded-xl text-[10px] font-bold border transition-all ${selectedOptions.boisson === b ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 opacity-50'}`}>{b}</button>
                    ))}
                  </div>
                </div>
                <button onClick={() => addToCart(tempItem, selectedOptions)} className="w-full bg-[#ce2b37] py-4 rounded-2xl font-black uppercase text-xs shadow-xl flex items-center justify-center gap-2 mt-4">Confirmer mon choix <ChevronRight size={16}/></button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-y-0 right-0 w-full max-md:w-full md:max-w-md bg-neutral-900 border-l border-white/10 z-50 flex flex-col shadow-2xl">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                  {checkoutStep === 2 ? <CreditCard className="text-[#009246]" /> : <ShoppingCart className="text-[#ce2b37]" />}
                  {checkoutStep === 0 ? "Mon Panier" : checkoutStep === 1 ? "Vérification" : checkoutStep === 2 ? "Paiement Sécurisé" : "Succès"}
                </h2>
                <button onClick={() => setIsCartOpen(false)}><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                {checkoutStep === 0 && (cart.length === 0 ? <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4"><Pizza size={48}/><p className="text-xs font-black uppercase">Vide</p></div> : 
                  cart.map(item => (
                    <div key={item.cartId} className="bg-white/5 p-4 rounded-2xl border border-white/5 mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-xs uppercase italic">{item.name}</span>
                        <button onClick={() => removeFromCart(item.cartId)} className="text-red-500 hover:scale-110 transition"><X size={16}/></button>
                      </div>
                      {item.options && (
                        <p className="text-[10px] text-white/30 italic mb-2 tracking-wide">
                          {item.options.sauces.join(', ') || 'Sans sauce'} • {item.options.crudites.join('/')} • {item.options.boisson}
                        </p>
                      )}
                      <p className="text-[#009246] font-black text-sm">{item.price.toFixed(2)} €</p>
                    </div>
                  ))
                )}
                {checkoutStep === 1 && (
                  <div className="space-y-4">
                    <div><label className="text-[10px] uppercase font-black text-white/40 mb-2 block">Nom complet</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-[#009246] outline-none"/>{errors.name && <p className="text-[9px] text-red-500 mt-1">{errors.name}</p>}</div>
                    <div><label className="text-[10px] uppercase font-black text-white/40 mb-2 block">Téléphone</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-[#009246] outline-none" placeholder="0612345678"/></div>
                    <div><label className="text-[10px] uppercase font-black text-white/40 mb-2 block">Heure de retrait estimée</label><input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-[#009246] outline-none"/></div>
                  </div>
                )}
                {checkoutStep === 2 && (
                  <div className="space-y-6">
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-[10px] text-blue-200 uppercase font-black tracking-widest">Liaison API Stripe sécurisée...</div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                       <div><label className="text-[9px] uppercase font-black text-white/40 mb-1 block">Numéro de carte</label><input type="text" maxLength="16" value={cardData.number} onChange={(e) => setCardData({...cardData, number: e.target.value})} placeholder="4242 4242 4242 4242" className="w-full bg-transparent border-b border-white/10 py-2 outline-none"/></div>
                       <div className="flex gap-4">
                          <div className="flex-1"><label className="text-[9px] uppercase font-black text-white/40 mb-1 block">Date</label><input type="text" maxLength="5" value={cardData.expiry} onChange={(e) => setCardData({...cardData, expiry: e.target.value})} placeholder="MM/YY" className="w-full bg-transparent border-b border-white/10 py-2 outline-none"/></div>
                          <div className="flex-1"><label className="text-[9px] uppercase font-black text-white/40 mb-1 block">CVC</label><input type="text" maxLength="3" value={cardData.cvc} onChange={(e) => setCardData({...cardData, cvc: e.target.value})} placeholder="***" className="w-full bg-transparent border-b border-white/10 py-2 outline-none"/></div>
                       </div>
                    </div>
                  </div>
                )}
                {checkoutStep === 3 && <div className="h-full flex flex-col items-center justify-center text-center space-y-6 px-4"><CheckCircle size={64} className="text-[#009246] animate-bounce"/><h3>Grazie Mille !</h3><p className="text-sm text-white/50 italic">Paiement validé. Retrait à {formData.time}.</p><button onClick={() => generatePDF(lastOrder)} className="bg-white text-black px-6 py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 shadow-xl"><Download size={18}/> Télécharger mon reçu PDF</button></div>}
              </div>
              {checkoutStep < 3 && cart.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-black/50">
                  <div className="flex justify-between items-center mb-4"><span>Total TTC</span><span className="text-2xl font-black text-[#009246]">{cartTotal.toFixed(2)} €</span></div>
                  {checkoutStep === 0 && <button onClick={() => setCheckoutStep(1)} className="w-full bg-[#ce2b37] py-4 rounded-full font-black uppercase text-xs">Suivant</button>}
                  {checkoutStep === 1 && <button onClick={handleCheckoutInfo} className="w-full bg-[#ce2b37] py-4 rounded-full font-black uppercase text-xs">Payer {cartTotal.toFixed(2)} €</button>}
                  {checkoutStep === 2 && <button onClick={handlePayment} disabled={isProcessingPayment} className="w-full bg-[#009246] py-4 rounded-full font-black uppercase text-xs flex items-center justify-center gap-2">{isProcessingPayment ? <Loader2 className="animate-spin" /> : "Confirmer le Paiement"}</button>}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer style={{ backgroundColor: '#0a1a0f' }} className="py-20 px-8 border-t border-white/5 relative text-center md:text-left">
        <div className="absolute top-0 left-0 right-0 h-1 flex"><div className="w-1/3" style={{ backgroundColor: ITALIAN_GREEN }}></div><div className="w-1/3 bg-white"></div><div className="w-1/3" style={{ backgroundColor: ITALIAN_RED }}></div></div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 sm:gap-16 items-center">
          <div><h5 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter mb-4">La Napolitaine</h5><p className="text-white/40 text-[11px] sm:text-sm">7 Bd de la Seine, 92000 Nanterre</p></div>
          <div className="flex flex-col items-center"><div className="text-2xl sm:text-3xl font-black mb-1 italic tracking-tighter">4.9 / 5</div><div className="text-yellow-500 text-lg">★★★★★</div></div>
          
          <div className="text-sm font-bold text-white/60 text-center md:text-right flex flex-col gap-1">
             <div className="group relative cursor-help">
               <p className="border-b border-white/10 pb-1 mb-1 flex items-center justify-center md:justify-end gap-2"><Clock size={14}/> Horaires : 11:30 – 00:00 (Ven: 15h)</p>
               <div className="absolute bottom-full right-1/2 translate-x-1/2 md:translate-x-0 md:right-0 mb-4 w-56 bg-neutral-900 border border-white/10 p-5 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-50 text-[10px] uppercase">
                  <p className="flex justify-between border-b border-white/5 mb-1"><span>Lun - Jeu</span> <span>11:30 - 00:00</span></p>
                  <p className="flex justify-between border-b border-white/5 mb-1 text-[#ce2b37]"><span>Vendredi</span> <span>15:00 - 00:00</span></p>
                  <p className="flex justify-between border-b border-white/5 mb-1"><span>Samedi</span> <span>11:30 - 00:00</span></p>
                  <p className="flex justify-between text-white/30"><span>Dimanche</span> <span className="italic">Fermé</span></p>
               </div>
             </div>
             <p className={isOpen ? 'text-green-500 font-black' : 'text-red-500 font-black'}>{isOpen ? '● Ouvert actuellement' : '● Actuellement Fermé'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;