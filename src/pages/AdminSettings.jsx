import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';
import { 
  User, 
  CreditCard, 
  MessageSquare, 
  ShieldCheck, 
  Save, 
  Landmark,
  Smartphone,
  Globe,
  Camera,
  Share2,
  Video,
  Mail,
  DollarSign,
  UserCircle,
  Award
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminSettings() {
  const { admin, updateAdmin } = useAdmin();
  const [activeSubTab, setActiveSubTab] = useState('biodata');
  const [profileInfo, setProfileInfo] = useState({ name: '', email: '', whatsapp: '', tiktok: '', instagram: '', facebook: '', youtube: '', profilePicture: '' });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({
    bankAccounts: [
      { bankName: '', accountName: '', accountNumber: '' },
      { bankName: '', accountName: '', accountNumber: '' },
      { bankName: '', accountName: '', accountNumber: '' }
    ],
    whatsappNumber: ''
  });
  const [exchangeRates, setExchangeRates] = useState({ USD: 1550 });
  const [certificateInfo, setCertificateInfo] = useState({
    name: 'Hajjo Dollars Admin',
    signature: ''
  });
  const [signatureFile, setSignatureFile] = useState(null);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_URL}/settings/payment_info`);
      if (res.data && res.data.value) setPaymentInfo(res.data.value);
    } catch (err) { console.error('Settings fetch failed'); }
    
    try {
      const res = await axios.get(`${API_URL}/settings/exchange_rates`);
      if (res.data && res.data.value) setExchangeRates(res.data.value);
    } catch (err) { console.error('Exchange rates fetch failed'); }
    
    try {
      const res = await axios.get(`${API_URL}/settings/certificate_info`);
      if (res.data && res.data.value) setCertificateInfo(res.data.value);
    } catch (err) { console.error('Certificate settings fetch failed'); }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/profile`);
      if (res.data) setProfileInfo(res.data);
    } catch (err) { console.error('Profile fetch failed'); }
  };

  useEffect(() => {
    fetchSettings();
    fetchProfile();
  }, []);
  
  const handleSaveRates = async () => {
    try {
      await axios.post(`${API_URL}/settings`, { key: 'exchange_rates', value: exchangeRates });
      alert('Exchange rates updated!');
    } catch (err) { alert('Error saving exchange rates.'); }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      let updatedProfilePicture = profileInfo.profilePicture;
      
      if (profilePictureFile) {
        const formDataImg = new FormData();
        formDataImg.append('images', profilePictureFile);
        const imgRes = await axios.post(`${API_URL}/upload`, formDataImg);
        updatedProfilePicture = imgRes.data.urls[0];
      }
      
      const updatedData = { ...profileInfo, profilePicture: updatedProfilePicture };
      const res = await axios.put(`${API_URL}/auth/profile`, updatedData);
      
      updateAdmin(res.data);
      setProfileInfo(updatedData);
      
      alert('Profile protocol updated.');
    } catch (err) { alert('Error updating profile.'); }
  };

  const handleSavePayment = async () => {
    try {
      await axios.post(`${API_URL}/settings`, { key: 'payment_info', value: paymentInfo });
      alert('Gateway configuration secured.');
    } catch (err) { alert('Error saving gateway settings.'); }
  };
  
  const handleSaveCertificate = async () => {
    try {
      let updatedSignature = certificateInfo.signature;
      
      if (signatureFile) {
        const formDataImg = new FormData();
        formDataImg.append('images', signatureFile);
        const imgRes = await axios.post(`${API_URL}/upload`, formDataImg);
        updatedSignature = imgRes.data.urls[0];
      }
      
      const updatedData = { ...certificateInfo, signature: updatedSignature };
      await axios.post(`${API_URL}/settings`, { key: 'certificate_info', value: updatedData });
      
      setCertificateInfo(updatedData);
      setSignatureFile(null);
      
      alert('Certificate settings updated!');
    } catch (err) { alert('Error saving certificate settings.'); }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-foreground uppercase tracking-tight transition-colors duration-300">System <span className="text-primary italic transition-colors">Configuration</span></h2>
        <p className="text-muted-foreground text-xs mt-1 uppercase tracking-widest font-mono transition-colors duration-300">Modify core platform parameters and identity data.</p>
      </div>

      {/* TABS */}
      <div className="flex gap-4 border-b border-border pb-1 overflow-x-auto transition-colors duration-300">
        {[
          { id: 'biodata', label: 'Identity Profile', icon: User },
          { id: 'payment', label: 'Payment Gateway', icon: CreditCard },
          { id: 'receipts', label: 'Receipt Protocol', icon: MessageSquare },
          { id: 'certificates', label: 'Certificate Settings', icon: Award }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative flex-shrink-0 transition-colors duration-300
              ${activeSubTab === tab.id ? 'text-primary' : 'text-muted-foreground/30 hover:text-foreground'}
            `}
          >
            <tab.icon size={16} />
            {tab.label}
            {activeSubTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full transition-colors" />}
          </button>
        ))}
      </div>

      <div className="max-w-4xl">
        
        {/* IDENTITY PROFILE */}
        {activeSubTab === 'biodata' && (
          <form onSubmit={handleSaveProfile} className="bg-card border border-border rounded-[2rem] p-8 space-y-8 transition-colors duration-300 shadow-sm">
            {/* Profile Picture Upload */}
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest transition-colors">Profile Avatar</label>
                <label className="group cursor-pointer">
                  <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-primary to-emerald-700 p-1 overflow-hidden relative">
                    {profileInfo.profilePicture ? (
                      <img
                        src={profileInfo.profilePicture}
                        alt={profileInfo.name}
                        className="w-full h-full object-cover rounded-[1.8rem]"
                      />
                    ) : (
                      <div className="w-full h-full rounded-[1.8rem] bg-card flex items-center justify-center text-primary font-black text-2xl">
                        {admin?.name ? admin.name[0] : 'A'}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 rounded-[1.8rem] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <Camera size={24} className="text-white" />
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setProfilePictureFile(file);
                        setProfileInfo({ ...profileInfo, profilePicture: URL.createObjectURL(file) });
                      }
                    }}
                  />
                </label>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest transition-colors">Administrator Name</label>
                    <input type="text" className="w-full bg-background border border-border rounded-2xl py-4 px-6 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all font-bold uppercase tracking-tight transition-colors" value={profileInfo.name} onChange={e => setProfileInfo({...profileInfo, name: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest transition-colors">Public Email Address</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/20 transition-colors" />
                      <input type="email" className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-6 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all font-mono transition-colors" value={profileInfo.email} onChange={e => setProfileInfo({...profileInfo, email: e.target.value})} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest transition-colors">Direct Contact (WhatsApp)</label>
                    <div className="relative">
                      <Smartphone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/20 transition-colors" />
                      <input type="text" className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-6 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all font-mono transition-colors" value={profileInfo.whatsapp} onChange={e => setProfileInfo({...profileInfo, whatsapp: e.target.value})} />
                    </div>
                 </div>
              </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] transition-colors">Social Media Handlers</h4>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {[
                   { id: 'tiktok', icon: Globe, label: 'TikTok Username' },
                   { id: 'instagram', icon: Camera, label: 'Instagram Handle' },
                   { id: 'facebook', icon: Share2, label: 'Facebook Name' },
                   { id: 'youtube', icon: Video, label: 'YouTube Channel' },
                 ].map(soc => (
                   <div key={soc.id} className="space-y-2">
                     <label className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-widest transition-colors">{soc.label}</label>
                     <div className="relative">
                        <soc.icon size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/20 transition-colors" />
                        <input type="text" className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-xs text-foreground focus:border-primary/30 transition-all transition-colors" value={profileInfo[soc.id]} onChange={e => setProfileInfo({...profileInfo, [soc.id]: e.target.value})} />
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-border transition-colors">
               <button type="submit" className="flex items-center gap-3 px-8 py-4 bg-primary text-black text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/10 hover:shadow-primary/30 transition-all transition-colors">
                  <Save size={16}/> Save Profile
               </button>
            </div>
          </form>
        )}

        {/* PAYMENT GATEWAY */}
        {activeSubTab === 'payment' && (
          <div className="space-y-6">
            {/* Exchange Rate Section */}
            <div className="bg-card border border-border rounded-[2rem] p-8 space-y-6 relative overflow-hidden group transition-colors duration-300">
               <div className="absolute top-0 right-0 p-8 text-foreground opacity-5 group-hover:opacity-10 transition-opacity transition-colors">
                  <DollarSign size={80} />
               </div>
               <div className="flex items-center gap-3 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-xs transition-colors">FX</div>
                  <h4 className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] transition-colors">Currency Exchange Rates</h4>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 transition-colors">
                  <div className="space-y-2">
                     <label className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-widest transition-colors">USD to NGN Rate</label>
                     <input type="number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-xs text-primary font-mono transition-colors" value={exchangeRates.USD} onChange={e => setExchangeRates({...exchangeRates, USD: parseFloat(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-widest transition-colors">Action</label>
                     <button onClick={handleSaveRates} className="w-full py-3 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                        Update Rate
                     </button>
                  </div>
               </div>
            </div>
            
            {/* Bank Accounts */}
            {paymentInfo.bankAccounts.map((acc, i) => (
              <div key={i} className="bg-card border border-border rounded-[2rem] p-8 space-y-6 relative overflow-hidden group transition-colors duration-300">
                <div className="absolute top-0 right-0 p-8 text-foreground opacity-5 group-hover:opacity-10 transition-opacity transition-colors">
                   <Landmark size={80} />
                </div>
                <div className="flex items-center gap-3 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-xs transition-colors">0{i+1}</div>
                  <h4 className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] transition-colors">Bank Interface {i+1}</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 transition-colors">
                   <div className="space-y-2">
                      <label className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-widest transition-colors">Bank Name</label>
                      <input type="text" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-xs text-foreground transition-colors" value={acc.bankName} onChange={e => { const narr = [...paymentInfo.bankAccounts]; narr[i].bankName = e.target.value; setPaymentInfo({...paymentInfo, bankAccounts: narr}); }} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-widest transition-colors">Account Name</label>
                      <input type="text" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-xs text-foreground transition-colors" value={acc.accountName} onChange={e => { const narr = [...paymentInfo.bankAccounts]; narr[i].accountName = e.target.value; setPaymentInfo({...paymentInfo, bankAccounts: narr}); }} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-widest transition-colors">Number</label>
                      <input type="text" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-xs text-primary font-mono transition-colors" value={acc.accountNumber} onChange={e => { const narr = [...paymentInfo.bankAccounts]; narr[i].accountNumber = e.target.value; setPaymentInfo({...paymentInfo, bankAccounts: narr}); }} />
                   </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end transition-colors">
               <button onClick={handleSavePayment} className="px-10 py-5 bg-gradient-to-r from-primary to-emerald-600 text-black text-[11px] font-black uppercase tracking-widest rounded-[2rem] shadow-2xl transition-all active:scale-[0.98] transition-colors shadow-primary/10 hover:shadow-primary/20">
                  Commit Gateway Configuration
               </button>
            </div>
          </div>
        )}

        {/* RECEIPT PROTOCOL */}
        {activeSubTab === 'receipts' && (
          <div className="bg-card border border-border rounded-[2rem] p-8 space-y-6 transition-colors duration-300">
             <div className="transition-colors">
                <h4 className="text-sm font-black text-foreground uppercase tracking-tight transition-colors">Receipt Verification Node</h4>
                <p className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.2em] mt-1 transition-colors">Configure the secure endpoint for transaction proofs.</p>
             </div>
             
             <div className="max-w-md space-y-4 transition-colors">
                <div className="space-y-2 transition-colors">
                   <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest transition-colors">WhatsApp Receipt Receiver</label>
                   <div className="relative transition-colors">
                      <MessageSquare size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/20 transition-colors" />
                      <input type="text" className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-6 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-colors" placeholder="e.g. 2348012345678" value={paymentInfo.whatsappNumber} onChange={e => setPaymentInfo({...paymentInfo, whatsappNumber: e.target.value})} />
                   </div>
                </div>
                <button onClick={handleSavePayment} className="w-full py-4 bg-muted hover:bg-primary hover:text-black border border-border text-muted-foreground/40 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all transition-colors">Update Receiving Node</button>
             </div>
          </div>
        )}
        
        {/* CERTIFICATE SETTINGS */}
        {activeSubTab === 'certificates' && (
          <div className="bg-card border border-border rounded-[2rem] p-8 space-y-6 transition-colors duration-300">
             <div className="transition-colors">
                <h4 className="text-sm font-black text-foreground uppercase tracking-tight transition-colors">Certificate Authority Configuration</h4>
                <p className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.2em] mt-1 transition-colors">Set up certificate issuance details and signature.</p>
             </div>
             
             <div className="space-y-6 transition-colors">
                <div className="space-y-2 transition-colors">
                   <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest transition-colors">Issuer Name</label>
                   <input 
                     type="text" 
                     className="w-full bg-background border border-border rounded-2xl py-4 px-6 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-colors" 
                     placeholder="e.g. Hajjo Dollars Admin"
                     value={certificateInfo.name}
                     onChange={e => setCertificateInfo({...certificateInfo, name: e.target.value})}
                   />
                </div>
                
                <div className="space-y-3 transition-colors">
                   <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest transition-colors">Signature Upload</label>
                   <p className="text-[9px] text-amber-600 font-bold uppercase tracking-widest mb-2">
                     ⚠️ Please use a signature with a <strong>transparent background</strong> for best results!
                   </p>
                   <label className="group cursor-pointer">
                     <div className="w-full h-40 bg-background border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-primary/40 transition-all">
                       {certificateInfo.signature || signatureFile ? (
                         <img 
                           src={signatureFile ? URL.createObjectURL(signatureFile) : certificateInfo.signature}
                           alt="Signature preview"
                           className="h-full object-contain p-4"
                         />
                       ) : (
                         <>
                           <Award size={32} className="text-muted-foreground/30" />
                           <p className="text-xs text-muted-foreground/30 uppercase tracking-widest">Click to upload signature</p>
                         </>
                       )}
                     </div>
                     <input
                       type="file"
                       accept="image/*"
                       className="hidden"
                       onChange={(e) => {
                         const file = e.target.files[0];
                         if (file) setSignatureFile(file);
                       }}
                     />
                   </label>
                </div>
                
                <button 
                  onClick={handleSaveCertificate}
                  className="w-full py-4 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/10 hover:shadow-primary/30 transition-all"
                >
                  Save Certificate Configuration
                </button>
             </div>
          </div>
        )}

      </div>

    </div>
  );
}
