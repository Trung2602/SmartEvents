import React, { useState, useEffect } from 'react';
import { User, Bell, Settings, HelpCircle, CheckCircle2, X, Save } from 'lucide-react';
import { UserProfile } from '../../types';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveUser: (updatedUser: UserProfile) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose, user, onSaveUser }) => {
  const [activeTab, setActiveTab] = useState('Account');
  
  // Local state for form handling
  const [formData, setFormData] = useState<UserProfile>(user);

  useEffect(() => {
    setFormData(user);
  }, [user, isOpen]);
  
  if (!isOpen) return null;

  const tabs = [
    { id: 'Account', icon: User },
    { id: 'Privacy', icon: CheckCircle2 },
    { id: 'Notifications', icon: Bell },
    { id: 'References', icon: Settings },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSaveUser(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#121212] w-full max-w-4xl h-[600px] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-200">
        <div className="w-full md:w-64 bg-gray-50 dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-white/5 p-6 flex flex-col">
           <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8">Settings</h2>
           <nav className="space-y-1">
             {tabs.map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
               >
                 <tab.icon size={18} />
                 {tab.id}
               </button>
             ))}
           </nav>
           <div className="mt-auto pt-6 border-t border-gray-200 dark:border-white/5">
              <div className="text-xs font-semibold text-gray-400 uppercase mb-4">Other</div>
              <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <HelpCircle size={18} />
                Help & Support
              </button>
           </div>
        </div>
        
        <div className="flex-1 p-8 md:p-12 overflow-y-auto relative bg-white dark:bg-[#121212]">
           <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
             <X size={24} className="text-gray-500" />
           </button>
           
           <h2 className="text-3xl font-light text-gray-400 dark:text-gray-600 mb-8 border-b border-gray-100 dark:border-white/5 pb-4">{activeTab}</h2>
           
           <div className="space-y-6">
              {activeTab === 'Account' && (
                <div className="space-y-8 max-w-lg">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-2xl font-bold">
                        {formData.avatarUrl.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                        <button className="text-sm bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-medium hover:opacity-80 transition-opacity">
                            Change Avatar
                        </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Display Name</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                        <input 
                            type="text" 
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all" 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                        <input 
                            type="text" 
                            name="bio"
                            value={formData.bio || ''}
                            onChange={handleInputChange}
                            placeholder="Tell us a bit about yourself"
                            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all" 
                        />
                      </div>
                  </div>

                  <div className="pt-4">
                      <button 
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-brand-purple text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors"
                      >
                          <Save size={18} />
                          Save Changes
                      </button>
                  </div>
                </div>
              )}
              {activeTab !== 'Account' && (
                <div className="text-center text-gray-400 py-12 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Settings className="text-gray-300" size={32} />
                    </div>
                    <p>Settings for {activeTab} are coming soon.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDialog;