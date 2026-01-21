import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pizza, Sandwich, Disc, Utensils, ShoppingCart, 
  Navigation, Phone, Star, MapPin, Search, X, Plus, Minus, ShieldCheck, CheckCircle, Download
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
  { id: 21, name: "Il Burratina", category: "Signatures", price: 15.90, desc: "Sauce tomate, tomates confites, roquette, burrata, basilic." },
  { id: 22, name: "Stracciatella", category: "Signatures", price: 15.90, desc: "Sauce tomate, fior di latte, tomates confites, stracciatella, pesto." },
  { id: 23, name: "Il Cannibale", category: "Signatures", price: 14.90, desc: "Sauce barbecue, bœuf haché, poulet, merguez, oignons confits, poivrons." },
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

const ITALIAN_GREEN = "#009246";
const ITALIAN_RED = "#ce2b37";

function App() {
  const [activeTab, setActiveTab] = useState("Pizzas");
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0); 
  const [formData, setFormData] = useState({ name: '', phone: '', time: '20:00' });
  const [errors, setErrors] = useState({});
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    const hour = new Date().getHours();
    setIsOpen(hour >= 11 && hour < 23);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    setCheckoutStep(0);
    setIsCartOpen(true);
  };

  const updateQuantity = (id, change) => {
    setCart(prev => prev.map(item => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item)));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const cartTotal = cart.reduce((t, i) => t + (i.price * i.quantity), 0);
  const cartCount = cart.reduce((c, i) => c + i.quantity, 0);

  const generatePDF = (orderData) => {
    const doc = new jsPDF();
    doc.setFillColor(0, 146, 70); doc.rect(0, 0, 70, 15, 'F');
    doc.setFillColor(255, 255, 255); doc.rect(70, 0, 70, 15, 'F');
    doc.setFillColor(206, 43, 55); doc.rect(140, 0, 70, 15, 'F');
    doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.text("LA NAPOLITAINE", 105, 30, { align: "center" });
    doc.text(`REÇU CLIENT : ${orderData.name}`, 20, 55);
    let y = 80;
    orderData.items.forEach(item => {
      doc.text(`${item.quantity}x ${item.name} - ${(item.price * item.quantity).toFixed(2)}e`, 20, y);
      y += 8;
    });
    doc.text(`TOTAL : ${orderData.total.toFixed(2)}e`, 190, y + 10, { align: "right" });
    doc.save(`reçu_napolitaine_${orderData.name}.pdf`);
  };

  const handleCheckout = () => {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    const phoneRegex = /^(0[1-9])(\d{8})$/;
    let newErrors = {};
    if (!nameRegex.test(formData.name)) newErrors.name = "Nom invalide";
    if (!phoneRegex.test(formData.phone)) newErrors.phone = "Format: 0612345678";
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);
    setLastOrder({...formData, items: [...cart], total: cartTotal});
    setErrors({}); setCheckoutStep(2); setCart([]); localStorage.removeItem('cart');
  };

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
      
      {/* Navigation Responsive */}
      <nav className="sticky top-0 z-40 flex items-center justify-between bg-black/95 px-4 sm:px-6 py-4 backdrop-blur-md border-b border-white/10 shadow-xl">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-7 w-10 sm:h-8 sm:w-12 overflow-hidden rounded shadow-sm border border-white/20">
            <div className="w-1/3" style={{ backgroundColor: ITALIAN_GREEN }}></div>
            <div className="w-1/3 bg-white flex items-center justify-center text-black font-bold text-[8px] sm:text-[10px]">LN</div>
            <div className="w-1/3" style={{ backgroundColor: ITALIAN_RED }}></div>
          </div>
          <h1 className="text-sm sm:text-xl font-black uppercase tracking-tighter italic">
            <span style={{ color: ITALIAN_GREEN }}>La </span>Napol<span style={{ color: ITALIAN_RED }}>itaine</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[8px] font-black uppercase border ${isOpen ? 'border-green-500/50 text-green-500' : 'border-red-500/50 text-red-500'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="hidden xs:inline">{isOpen ? 'Ouvert' : 'Fermé'}</span>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsCartOpen(true)} className="relative bg-white/5 p-2 rounded-full border border-white/10">
            <ShoppingCart size={18} className="text-[#009246]" />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ce2b37] text-[8px] font-bold">{cartCount}</span>}
          </motion.button>
        </div>
      </nav>

      {/* Hero Section Responsive */}
      <header className="relative h-[450px] sm:h-[650px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img src={heroBg} className="absolute inset-0 h-full w-full object-cover opacity-90 scale-105" alt="Pizza" />
        <div className="relative z-20 text-center px-4 max-w-4xl">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6 }} className="text-4xl sm:text-6xl md:text-9xl font-black italic uppercase leading-tight mb-6 sm:mb-8 tracking-tighter drop-shadow-2xl">
            <span style={{ color: ITALIAN_GREEN }}>La</span><br className="sm:hidden" /><span className="text-white"> Napol</span><span style={{ color: ITALIAN_RED }}>itaine</span>
          </motion.h2>
          <p className="text-lg sm:text-2xl md:text-3xl text-white/90 mb-8 sm:mb-12 tracking-wide italic" style={{ fontFamily: "'Playfair Display', serif" }}>L'art de la qualité Italienne à Nanterre.</p>
          <button onClick={() => window.scrollTo({ top: window.innerHeight - 50, behavior: 'smooth' })} className="bg-[#ce2b37] px-8 sm:px-12 py-4 sm:py-5 rounded-full font-black uppercase text-xs sm:text-sm hover:scale-105 transition ring-2 ring-white/10 flex items-center gap-3 mx-auto shadow-2xl">
            <ShoppingCart size={20} /> Commander (À emporter)
          </button>
        </div>
      </header>

      {/* Badge Google & Actions Responsive */}
      <section className="max-w-4xl mx-auto -mt-10 relative z-30 px-4">
        <div className="bg-neutral-900 rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 backdrop-blur-md">
          <div className="flex items-center gap-3 sm:gap-4">
            <a href="https://www.google.com/search?q=La+Napolitaine+Nanterre+avis" target="_blank" rel="noopener noreferrer" className="bg-white p-2.5 sm:p-3 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner hover:scale-110 transition-transform">
              <Search size={20} sm:size={24} strokeWidth={3} />
            </a>
            <div>
              <div className="flex text-yellow-500 gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
                <Star size={14} sm:size={18} fill="currentColor" /><Star size={14} sm:size={18} fill="currentColor" /><Star size={14} sm:size={18} fill="currentColor" /><Star size={14} sm:size={18} fill="currentColor" /><Star size={14} sm:size={18} fill="currentColor" />
              </div>
              <p className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-white/40">Excellent • 4.9/5 sur Google</p>
            </div>
          </div>
          <div className="flex gap-3 sm:gap-4 w-full md:w-auto justify-center">
            <a href="tel:0171040098" className="flex-1 md:flex-none bg-white/5 p-3 sm:p-4 rounded-full text-[#009246] hover:bg-[#009246] hover:text-white transition-all border border-white/5 flex items-center justify-center gap-2">
                <Phone size={18} sm:size={24} /> <span className="md:hidden text-[10px] font-black uppercase">Appeler</span>
            </a>
            <a href="https://www.google.com/maps/place/La+Napolitaine/@48.8953155,2.203923,17z/data=!4m8!3m7!1s0x47e665977a5e9e03:0x4d59a5840d866a1e!8m2!3d48.895312!4d2.2064979!9m1!1b1!16s%2Fg%2F11f_v6m7g6?entry=ttu" target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none bg-white/5 p-3 sm:p-4 rounded-full text-[#ce2b37] hover:bg-[#ce2b37] hover:text-white transition-all border border-white/5 flex items-center justify-center gap-2">
                <Navigation size={18} sm:size={24} /> <span className="md:hidden text-[10px] font-black uppercase">Itinéraire</span>
            </a>
          </div>
        </div>
      </section>

      {/* Catégories Défilantes Horizontalement sur Mobile */}
      <section className="max-w-6xl mx-auto pt-16 sm:pt-24 pb-16 sm:pb-32 px-4 sm:px-6">
        <div className="flex justify-start sm:justify-center gap-4 sm:gap-6 mb-12 sm:mb-20 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button key={cat.name} onClick={() => setActiveTab(cat.name)} className={`flex flex-col items-center gap-2 sm:gap-3 transition-all shrink-0 ${activeTab === cat.name ? 'scale-105 sm:scale-110 opacity-100' : 'opacity-40'}`}>
              <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-2 shadow-lg ${activeTab === cat.name ? 'border-[#ce2b37] bg-[#ce2b37]' : 'border-white/10 bg-white/5'}`}>{cat.icon}</div>
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Grille du Menu Adaptative : 1 col mobile, 2 col tablette, 3 col PC */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          <AnimatePresence mode="wait">
            {INITIAL_MENU.filter(i => i.category === activeTab).map((item) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-neutral-900/80 backdrop-blur-sm rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border border-white/5 flex flex-col group hover:border-[#009246]/50 transition-all duration-500 shadow-2xl">
                <div className="p-6 sm:p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-black text-lg sm:text-2xl italic uppercase tracking-tighter leading-none">{item.name}</h4>
                    <span className="text-[#009246] font-black text-sm sm:text-lg">{item.price.toFixed(2)} €</span>
                  </div>
                  <p className="text-white/50 text-[11px] sm:text-sm mb-6 sm:mb-8 leading-relaxed italic flex-1">{item.desc}</p>
                  <button onClick={() => addToCart(item)} className="w-full bg-white text-black py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest hover:bg-[#ce2b37] hover:text-white transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart size={14} sm:size={16} /> Ajouter au panier
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* SIDEBAR PANIER RESPONSIVE (Pleine largeur sur mobile) */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed inset-y-0 right-0 w-full md:max-w-md bg-neutral-900 border-l border-white/10 z-50 flex flex-col shadow-2xl">
              <div className="p-5 sm:p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                <h2 className="text-lg sm:text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                  {checkoutStep === 1 ? <ShieldCheck className="text-[#009246]" /> : <ShoppingCart className="text-[#ce2b37]" />}
                  {checkoutStep === 1 ? "Validation" : "Mon Panier"}
                </h2>
                <button onClick={() => setIsCartOpen(false)}><X size={20} sm:size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">
                {checkoutStep === 0 && (cart.length === 0 ? <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4 text-center"><Pizza size={40}/><p className="text-[10px] font-black uppercase">Votre panier attend des pizzas...</p></div> : 
                  cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5 mb-3 sm:mb-4">
                      <div className="flex-1"><p className="font-bold text-[11px] sm:text-xs uppercase italic">{item.name}</p><p className="text-[#009246] font-black text-xs">{item.price.toFixed(2)} €</p></div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 bg-black/30 rounded-full p-1 border border-white/10">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-0.5"><Minus size={12}/></button>
                          <span className="font-bold text-[11px] sm:text-xs w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-0.5"><Plus size={12}/></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-white/20 hover:text-red-500 transition"><X size={14}/></button>
                      </div>
                    </div>
                  ))
                )}
                {checkoutStep === 1 && (
                  <div className="space-y-4">
                    <div><label className="text-[9px] sm:text-[10px] uppercase font-black text-white/40 mb-2 block tracking-widest">Nom complet</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl p-3.5 sm:p-4 text-sm focus:outline-none focus:border-[#009246]`}/>{errors.name && <p className="text-[9px] text-red-500 mt-1">{errors.name}</p>}</div>
                    <div><label className="text-[9px] sm:text-[10px] uppercase font-black text-white/40 mb-2 block tracking-widest">Téléphone</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`w-full bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl p-3.5 sm:p-4 text-sm focus:outline-none focus:border-[#009246]`} placeholder="0612345678"/>{errors.phone && <p className="text-[9px] text-red-500 mt-1">{errors.phone}</p>}</div>
                    <div><label className="text-[9px] sm:text-[10px] uppercase font-black text-white/40 mb-2 block tracking-widest">Heure de retrait</label><input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 sm:p-4 text-sm focus:outline-none"/></div>
                  </div>
                )}
                {checkoutStep === 2 && <div className="h-full flex flex-col items-center justify-center text-center space-y-6 px-4"><CheckCircle size={56} className="text-[#009246] animate-bounce"/><div><h3 className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter mb-2">Grazie Mille !</h3><p className="text-xs sm:text-sm text-white/50 italic">Commande validée. Retrait prévu à {lastOrder?.time}.</p></div><button onClick={() => generatePDF(lastOrder)} className="w-full sm:w-auto bg-white text-black px-6 py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 shadow-xl"><Download size={18}/> Reçu PDF</button></div>}
              </div>
              {checkoutStep < 2 && cart.length > 0 && (
                <div className="p-5 sm:p-6 border-t border-white/10 bg-black/50">
                  <div className="flex justify-between items-center mb-4"><span className="text-[10px] font-black uppercase text-white/40">Total TTC</span><span className="text-xl sm:text-2xl font-black italic text-[#009246]">{cartTotal.toFixed(2)} €</span></div>
                  {checkoutStep === 0 ? <button onClick={() => setCheckoutStep(1)} className="w-full bg-[#ce2b37] py-4 rounded-full font-black uppercase text-[11px] sm:text-xs shadow-xl hover:scale-[1.02] transition">Passer à la validation</button> : <button onClick={handleCheckout} className="w-full bg-[#009246] py-4 rounded-full font-black uppercase text-[11px] sm:text-xs">Confirmer la commande</button>}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Pied de page Responsive */}
      <footer style={{ backgroundColor: '#0a1a0f' }} className="py-12 sm:py-20 px-6 sm:px-8 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 flex"><div className="w-1/3" style={{ backgroundColor: ITALIAN_GREEN }}></div><div className="w-1/3 bg-white"></div><div className="w-1/3" style={{ backgroundColor: ITALIAN_RED }}></div></div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 sm:gap-16 items-center text-center md:text-left">
          <div><h5 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter mb-4"><span style={{ color: ITALIAN_GREEN }}>La </span>Napol<span style={{ color: ITALIAN_RED }}>itaine</span></h5><p className="text-white/40 text-[11px] sm:text-sm">7 Bd de la Seine, 92000 Nanterre</p></div>
          <div className="flex flex-col items-center"><div className="text-2xl sm:text-3xl font-black mb-1 italic tracking-tighter">4.9 / 5</div><div className="text-yellow-500 text-base sm:text-lg">★★★★★</div><p className="text-[8px] uppercase tracking-widest text-white/20 mt-1">Avis certifiés</p></div>
          <div className="text-[11px] sm:text-sm font-bold text-white/60 space-y-1">
             <p>Ouvert jusqu'à 00:00</p>
             <p className={isOpen ? 'text-green-500' : 'text-red-500'}>{isOpen ? '● Actuellement Ouvert' : '● Actuellement Fermé'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;