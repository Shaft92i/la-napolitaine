import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Imports complets pour éviter tout oubli
import { 
  Pizza, Sandwich, Disc, Utensils, ShoppingCart, 
  Navigation, Phone, Star, MapPin, Search, X, Plus, Minus, 
  ShieldCheck, CheckCircle, Download, ChevronRight, Clock, 
  CreditCard, Loader2, Bell, Check, Trash2 
} from 'lucide-react';
import { jsPDF } from "jspdf";

// Utilisation du format .jpg comme demandé
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
  const [checkoutStep, setCheckoutStep] = useState(0); // 0:Panier, 1:Infos, 2:Paiement, 3:Succès
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', time: '20:00' });
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '' });
  const [errors, setErrors] = useState({});
  const [lastOrder, setLastOrder] = useState(null);

  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [tempItem, setTempItem] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({ sauces: [], crudites: ["Salade", "Tomate", "Oignon"], boisson: 'Coca Cola' });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'merchant') setIsMerchantMode(true);

    const timer = setTimeout(() => setIsLoading(false), 2500);
    const checkStatus = () => {
      const now = new Date();
      const day = now.getDay();
      const time = now.getHours() + now.getMinutes() / 60;
      let open = false;
      if (day !== 0) { //
        if (day === 5) open = (time >= 15 && time < 24);
        else open = (time >= 11.5 && time < 24);
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

  // --- FONCTION QUI ÉTAIT MANQUANTE OU MAL NOMMÉE ---
  const handleCheckoutInfo = () => {
    if (!formData.name || formData.name.length < 2) {
      return setErrors({name: "Nom complet requis"});
    }
    setErrors({});
    setCheckoutStep(2); // Passage au paiement
  };

  const handlePaymentSubmit = () => {
    setIsProcessingPayment(true);
    const finalItems = [...cart];
    setTimeout(() => {
      const newOrder = {
        id: Date.now(),
        client: formData,
        items: finalItems,
        total: cartTotal,
        status: 'new',
        timestamp: new Date().toLocaleTimeString('fr-FR')
      };
      setOrders(prev => [newOrder, ...prev]);
      setLastOrder(finalItems);
      setIsProcessingPayment(false);
      setCheckoutStep(3); 
      setCart([]);
      localStorage.removeItem('cart');
    }, 3000);
  };

  const generatePDF = (orderData) => {
    if (!orderData) return;
    const doc = new jsPDF();
    doc.setFillColor(0, 146, 70); doc.rect(0, 0, 70, 15, 'F');
    doc.setFillColor(255, 255, 255); doc.rect(70, 0, 70, 15, 'F');
    doc.setFillColor(206, 43, 55); doc.rect(140, 0, 70, 15, 'F');
    doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.text("LA NAPOLITAINE", 105, 30, { align: "center" });
    doc.line(20, 45, 190, 45);
    doc.setFontSize(10); doc.text(`COMMANDE PAYÉE - CLIENT : ${formData.name}`, 20, 55);
    let y = 75;
    orderData.forEach(item => {
      doc.text(`1x ${item.name} - ${item.price.toFixed(2)}e`, 20, y);
      if (item.options) doc.text(`  > Sauces: ${item.options.sauces.join(', ')}`, 20, y + 5);
      y += 12;
    });
    doc.save(`reçu_${formData.name}.pdf`);
  };

  // --- MODE MARCHAND ---
  if (isMerchantMode) {
    return (
      <div className="min-h-screen bg-black text-white p-6 font-sans">
        <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h1 className="text-2xl font-black italic uppercase text-[#ce2b37]">Cuisine Dashboard</h1>
          <button onClick={() => window.location.href = '/'} className="text-[10px] uppercase font-black opacity-30 underline">Quitter</button>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <div key={order.id} className={`p-6 rounded-[2.5rem] border ${order.status === 'new' ? 'bg-[#ce2b37]/10 border-[#ce2b37]/50' : 'bg-neutral-900 border-white/5'}`}>
              <div className="flex justify-between mb-4">
                <div><h3 className="font-black text-xl uppercase italic">{order.client.name}</h3><p className="text-[#009246] font-bold text-xs">{order.client.phone}</p></div>
                <span className="text-[10px] opacity-40">{order.timestamp}</span>
              </div>
              <div className="space-y-2 mb-6 border-y border-white/5 py-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="text-sm font-bold">1x {item.name} {item.options && <span className="text-[10px] block font-normal opacity-50 italic">{item.options.sauces.join(', ')}</span>}</div>
                ))}
              </div>
              <div className="flex justify-between items-center"><p className="font-black text-lg italic">{order.client.time}</p><button onClick={() => setOrders(orders.filter(o => o.id !== order.id))} className="bg-[#009246] p-3 rounded-full hover:scale-110 transition"><Check size={20}/></button></div>
            </div>
          ))}
        </div>
        {orders.length === 0 && <div className="h-96 flex flex-col items-center justify-center opacity-20"><Utensils size={64} className="mb-4" /><p className="font-black uppercase tracking-widest">En attente de commandes...</p></div>}
      </div>
    );
  }

  // --- INTERFACE CLIENT ---
  if (isLoading) return <div className="h-screen bg-black text-white flex flex-col items-center justify-center"><h1 className="text-3xl font-black italic uppercase mb-8 tracking-tighter"><span style={{color: ITALIAN_GREEN}}>La </span>Napol<span style={{color: ITALIAN_RED}}>itaine</span></h1><div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-4"><motion.div initial={{left: "-100%"}} animate={{left: "100%"}} transition={{repeat: Infinity, duration: 1.5}} className="relative h-full w-full bg-white"/></div><p className="text-[10px] uppercase tracking-[0.4em] font-black animate-pulse">Chargement des saveurs...</p></div>;

  return (
    <div className={`min-h-screen bg-neutral-950 text-white font-sans ${isCartOpen ? 'overflow-hidden' : ''}`}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,600&display=swap');`}</style>
      
      <nav className="sticky top-0 z-40 flex items-center justify-between bg-black/95 px-6 py-4 border-b border-white/10 shadow-xl backdrop-blur-md">
        <h1 className="text-xl font-black italic uppercase tracking-tighter">La Napolitaine</h1>
        <button onClick={() => setIsCartOpen(true)} className="relative p-2 bg-white/5 rounded-full border border-white/10">
          <ShoppingCart size={20} className="text-[#009246]" />
          {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[#ce2b37] text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center">{cart.length}</span>}
        </button>
      </nav>

      <header className="relative h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" /><img src={heroBg} className="absolute inset-0 h-full w-full object-cover opacity-80" alt="Hero" />
        <h2 className="relative z-20 text-5xl sm:text-8xl font-black italic uppercase tracking-tighter"><span style={{ color: ITALIAN_GREEN }}>La</span> Napol<span style={{ color: ITALIAN_RED }}>itaine</span></h2>
      </header>

      <section className="max-w-4xl mx-auto -mt-10 relative z-30 px-4">
        <div className="bg-neutral-900 rounded-[2.5rem] p-6 border border-white/10 flex justify-between items-center shadow-2xl">
          <div className="flex items-center gap-4"><div className="bg-white p-3 rounded-2xl text-blue-500 shadow-inner"><Search size={24} /></div><div><div className="flex text-yellow-500 gap-1"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div><p className="text-[10px] font-bold uppercase opacity-40 tracking-widest mt-1">4.9/5 sur Google</p></div></div>
          <div className="flex gap-4"><a href="tel:0171040098" className="bg-white/5 p-4 rounded-full text-[#009246] hover:bg-[#009246] hover:text-white transition-all"><Phone size={20} /></a><a href="https://maps.google.com/?cid=5809889047366286244&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ2" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-4 rounded-full text-[#ce2b37] hover:bg-[#ce2b37] hover:text-white transition-all"><Navigation size={20} /></a></div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="flex justify-start sm:justify-center gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(cat => (
            <button key={cat.name} onClick={() => setActiveTab(cat.name)} className={`flex flex-col items-center gap-2 transition-all shrink-0 ${activeTab === cat.name ? 'scale-110 opacity-100' : 'opacity-30'}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${activeTab === cat.name ? 'border-[#ce2b37] bg-[#ce2b37]' : 'border-white/10 bg-white/5'}`}>{cat.icon}</div>
              <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {INITIAL_MENU.filter(i => i.category === activeTab).map(item => (
            <div key={item.id} className="bg-neutral-900/80 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/5 flex flex-col group hover:border-[#009246]/50 transition-all duration-500 shadow-2xl">
              <div className="flex justify-between items-start mb-4"><h4 className="font-black text-xl italic uppercase tracking-tighter leading-none">{item.name}</h4><span className="text-[#009246] font-black">{item.price.toFixed(2)} €</span></div>
              <p className="text-white/40 text-xs mb-8 italic flex-1">{item.desc}</p>
              <button onClick={() => handleAddToCartClick(item)} className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#ce2b37] hover:text-white transition-all shadow-lg flex items-center justify-center gap-2"><Plus size={14}/> Ajouter au panier</button>
            </div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {isOptionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-neutral-900 border border-white/10 p-8 rounded-[3rem] w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center mb-8"><div><h3 className="text-2xl font-black italic uppercase tracking-tighter">Personnalisation</h3><p className="text-[10px] opacity-40 uppercase font-bold tracking-[0.2em] mt-1">Street Food Selection</p></div><button onClick={() => setIsOptionModalOpen(false)} className="p-2 bg-white/5 rounded-full"><X /></button></div>
              <div className="space-y-8">
                <div><label className="text-[10px] uppercase font-black opacity-40 mb-3 block tracking-widest">1. Choisissez vos Sauces (2 max)</label><div className="grid grid-cols-2 gap-2">{OPTIONS.sauces.map(s => (<button key={s} onClick={() => toggleSauce(s)} className={`py-4 rounded-2xl text-[10px] font-bold border transition-all ${selectedOptions.sauces.includes(s) ? 'bg-[#ce2b37] border-[#ce2b37]' : 'bg-white/5 border-white/10 opacity-50'}`}>{s}</button>))}</div></div>
                <div><label className="text-[10px] uppercase font-black opacity-40 mb-3 block tracking-widest">2. Crudités / Boisson</label><div className="bg-white/5 p-4 rounded-2xl border border-white/5"><p className="text-[10px] italic opacity-40">Options standards incluses par défaut.</p></div></div>
                <button onClick={() => addToCart(tempItem, selectedOptions)} className="w-full bg-[#ce2b37] py-5 rounded-[1.5rem] font-black uppercase text-xs shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">Confirmer mon choix <ChevronRight size={18}/></button>
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
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-black/40">
                <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                  {checkoutStep === 2 ? <CreditCard className="text-[#009246]" /> : <ShoppingCart className="text-[#ce2b37]" />}
                  {checkoutStep === 0 ? "Panier" : checkoutStep === 1 ? "Infos" : checkoutStep === 2 ? "Paiement" : "Succès"}
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 bg-white/5 rounded-full"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                {checkoutStep === 0 && (cart.length === 0 ? <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4"><Pizza size={48}/><p className="text-[10px] font-black uppercase tracking-widest">Le panier est vide</p></div> : 
                  cart.map(item => (
                    <div key={item.cartId} className="bg-white/5 p-5 rounded-[1.5rem] border border-white/5 mb-4 group">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-xs uppercase italic tracking-tight">{item.name}</span>
                        <button onClick={() => removeFromCart(item.cartId)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={16}/></button>
                      </div>
                      {item.options && <p className="text-[10px] opacity-40 italic mb-2">{item.options.sauces.join(', ') || 'Sans sauce'}</p>}
                      <p className="text-[#009246] font-black text-sm">{item.price.toFixed(2)} €</p>
                    </div>
                  ))
                )}
                
                {checkoutStep === 1 && (
                  <div className="space-y-6">
                    <div><label className="text-[10px] uppercase font-black opacity-40 mb-3 block tracking-widest">Prénom & Nom</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:border-[#009246] outline-none transition-all shadow-inner"/>{errors.name && <p className="text-[9px] text-red-500 mt-2 font-bold uppercase">{errors.name}</p>}</div>
                    <div><label className="text-[10px] uppercase font-black opacity-40 mb-3 block tracking-widest">Numéro de Mobile</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:border-[#009246] outline-none" placeholder="06 .. .. .. .."/></div>
                    <div><label className="text-[10px] uppercase font-black opacity-40 mb-3 block tracking-widest">Heure de retrait souhaitée</label><input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:border-[#009246] outline-none"/></div>
                  </div>
                )}

                {checkoutStep === 2 && (
                  <div className="space-y-8">
                    <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-[1.5rem] text-[9px] text-blue-200 uppercase font-black tracking-[0.2em] leading-relaxed text-center">Liaison API Stripe sécurisée...</div>
                    <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 space-y-6 shadow-2xl">
                       <div><label className="text-[9px] uppercase font-black opacity-40 mb-2 block">Numéro de carte</label><input type="text" maxLength="16" value={cardData.number} onChange={(e) => setCardData({...cardData, number: e.target.value})} placeholder="4242 4242 4242 4242" className="w-full bg-transparent border-b border-white/10 py-3 outline-none font-mono text-sm tracking-[0.3em]"/></div>
                       <div className="flex gap-8"><div className="flex-1"><label className="text-[9px] uppercase font-black opacity-40 mb-2 block">Date</label><input type="text" maxLength="5" value={cardData.expiry} onChange={(e) => setCardData({...cardData, expiry: e.target.value})} placeholder="MM/YY" className="w-full bg-transparent border-b border-white/10 py-3 outline-none font-mono text-sm"/></div><div className="flex-1"><label className="text-[9px] uppercase font-black opacity-40 mb-2 block">CVC</label><input type="text" maxLength="3" value={cardData.cvc} onChange={(e) => setCardData({...cardData, cvc: e.target.value})} placeholder="***" className="w-full bg-transparent border-b border-white/10 py-3 outline-none font-mono text-sm"/></div></div>
                    </div>
                    <p className="text-[9px] text-white/20 italic text-center px-4 uppercase tracking-widest font-black">Simulation Master MICSI • Aucun débit réel</p>
                  </div>
                )}

                {checkoutStep === 3 && <div className="h-full flex flex-col items-center justify-center text-center space-y-8 px-6"><motion.div initial={{scale: 0}} animate={{scale: 1}} transition={{type: "spring"}} className="p-6 bg-[#009246]/10 rounded-full"><CheckCircle size={80} className="text-[#009246]"/></motion.div><div><h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Grazie Mille !</h3><p className="text-sm opacity-40 italic">Paiement validé par la banque.</p></div><button onClick={() => generatePDF(lastOrder)} className="w-full bg-white text-black py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl hover:bg-[#009246] hover:text-white transition-all"><Download size={20}/> Reçu de Commande PDF</button></div>}
              </div>

              {checkoutStep < 3 && cart.length > 0 && (
                <div className="p-8 border-t border-white/10 bg-black/60 backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-6"><div><span className="text-[10px] font-black uppercase opacity-40 tracking-widest block">Total TTC</span><span className="text-3xl font-black text-[#009246] tracking-tighter italic">{cartTotal.toFixed(2)} €</span></div></div>
                  {/* APPEL À LA FONCTION CORRIGÉE handleCheckoutInfo */}
                  {checkoutStep === 0 && <button onClick={() => setCheckoutStep(1)} className="w-full bg-[#ce2b37] py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Valider le panier</button>}
                  {checkoutStep === 1 && <button onClick={handleCheckoutInfo} className="w-full bg-[#ce2b37] py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl">Procéder au paiement</button>}
                  {checkoutStep === 2 && <button onClick={handlePaymentSubmit} disabled={isProcessingPayment} className="w-full bg-[#009246] py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">{isProcessingPayment ? <Loader2 className="animate-spin" /> : "Confirmer le Paiement"}</button>}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FOOTER CORRIGÉ : Sans overflow-hidden pour que le tooltip soit visible */}
      <footer style={{ backgroundColor: '#0a1a0f' }} className="py-24 px-8 border-t border-white/5 relative text-center md:text-left">
        <div className="absolute top-0 left-0 right-0 h-1 flex"><div className="w-1/3" style={{ backgroundColor: ITALIAN_GREEN }}></div><div className="w-1/3 bg-white"></div><div className="w-1/3" style={{ backgroundColor: ITALIAN_RED }}></div></div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 items-center">
          <div><h5 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter mb-4">La Napolitaine</h5><p className="text-white/40 text-[11px] sm:text-sm tracking-wide">7 Bd de la Seine, 92000 Nanterre</p></div>
          <div className="flex flex-col items-center"><div className="text-3xl sm:text-4xl font-black mb-1 italic tracking-tighter">4.9 / 5</div><div className="text-yellow-500 text-lg">★★★★★</div><p className="text-[10px] font-bold opacity-30 mt-2 uppercase tracking-widest">Sur Google Maps</p></div>
          <div className="text-sm font-bold text-white/60 text-center md:text-right flex flex-col gap-2">
             <div className="group relative cursor-help">
               <p className="border-b border-white/10 pb-2 mb-1 flex items-center justify-center md:justify-end gap-3"><Clock size={16}/> Horaires : 11:30 – 00:00 (Ven: 15h)</p>
               <div className="absolute bottom-full right-1/2 translate-x-1/2 md:translate-x-0 md:right-0 mb-5 w-64 bg-neutral-900 border border-white/10 p-6 rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-50 text-[10px] uppercase tracking-[0.2em] leading-loose">
                  <p className="flex justify-between border-b border-white/5 mb-1"><span>Lun - Jeu</span> <span className="font-black">11:30 - 00:00</span></p>
                  <p className="flex justify-between border-b border-white/5 mb-1 text-[#ce2b37]"><span>Vendredi</span> <span className="font-black">15:00 - 00:00</span></p>
                  <p className="flex justify-between border-b border-white/5 mb-1"><span>Samedi</span> <span className="font-black">11:30 - 00:00</span></p>
                  <p className="flex justify-between text-white/30"><span>Dimanche</span> <span className="font-black italic italic">Fermé</span></p>
               </div>
             </div>
             <p className={isOpen ? 'text-green-500 font-black' : 'text-red-500 font-black italic'}>{isOpen ? '● Actuellement Ouvert' : '● Actuellement Fermé'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;