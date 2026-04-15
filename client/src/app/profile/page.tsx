'use client';

import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, ShoppingBag, ArrowRight, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
    const { user, isAdmin, signOut, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="h-12 w-12 rounded-full border-4 border-zinc-200 border-t-zinc-900 animate-spin" />
            </div>
        );
    }

    if (!user) {
        // This should be handled by a higher-level auth guard, 
        // but adding local handling for safety.
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-zinc-50">
              <div className="p-6 rounded-[2.5rem] bg-white shadow-2xl shadow-zinc-200 mb-8">
                <Shield className="h-12 w-12 text-zinc-900" />
              </div>
              <h1 className="text-3xl font-heading font-black uppercase tracking-tighter mb-4">Account Access</h1>
              <p className="text-zinc-500 max-w-xs mb-8">Please sign in to view your profile and manage your orders.</p>
              <Link href="/auth">
                <Button className="rounded-full px-8 py-6 font-bold uppercase tracking-widest text-xs">Sign In</Button>
              </Link>
            </div>
        );
    }

    const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0];
    const joinedDate = new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    const menuItems = [
        {
            title: "My Orders",
            desc: "View status and history of your purchases",
            icon: ShoppingBag,
            href: "/profile/orders",
            color: "bg-blue-50 text-blue-600"
        },
        {
            title: "Personal Details",
            desc: "Manage your profile information",
            icon: User,
            href: "#",
            color: "bg-zinc-100 text-zinc-600"
        }
    ];

    return (
        <main className="min-h-screen bg-zinc-50 pt-24 pb-20">
            <div className="container max-w-3xl">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-24 w-24 rounded-[2rem] bg-zinc-900 text-white flex items-center justify-center text-3xl font-bold shadow-2xl shadow-zinc-200"
                    >
                        {displayName[0].toUpperCase()}
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-center md:text-left space-y-2"
                    >
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <h1 className="text-4xl font-heading font-black uppercase tracking-tighter text-zinc-900">
                                {displayName}
                            </h1>
                            {isAdmin && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest">
                                    <Shield className="h-3 w-3 mr-1" /> Curator
                                </span>
                            )}
                        </div>
                        <p className="text-zinc-500 font-medium flex items-center justify-center md:justify-start gap-2">
                             <Calendar className="h-4 w-4" /> Member since {joinedDate}
                        </p>
                    </motion.div>

                    <Button 
                        variant="outline" 
                        onClick={signOut}
                        className="md:ml-auto rounded-2xl border-2 border-zinc-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all font-bold uppercase tracking-widest text-[10px]"
                    >
                        <LogOut className="h-4 w-4 mr-2" /> Sign Out
                    </Button>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <Card className="p-6 border-zinc-200/60 shadow-xl shadow-zinc-200/40 rounded-3xl overflow-hidden group">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-zinc-100 text-zinc-500 flex items-center justify-center transition-colors group-hover:bg-zinc-900 group-hover:text-white">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Address</p>
                                <p className="text-sm font-bold text-zinc-900">{user.email}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 border-zinc-200/60 shadow-xl shadow-zinc-200/40 rounded-3xl overflow-hidden group">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-zinc-100 text-zinc-500 flex items-center justify-center transition-colors group-hover:bg-zinc-900 group-hover:text-white">
                                <Shield className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Account Type</p>
                                <p className="text-sm font-bold text-zinc-900">{isAdmin ? 'Curator' : 'Standard Member'}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Action Grid */}
                <div className="space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 mb-6 px-2">Account Management</h2>
                    {menuItems.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Link href={item.href}>
                                <Card className="p-6 border-zinc-200/60 hover:border-zinc-900 shadow-sm hover:shadow-2xl hover:shadow-zinc-200 transition-all rounded-3xl group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", item.color)}>
                                                <item.icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-zinc-900">{item.title}</h3>
                                                <p className="text-xs text-zinc-500 font-medium">{item.desc}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-zinc-300 group-hover:text-zinc-900 transition-colors group-hover:translate-x-1" />
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {isAdmin && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 p-8 rounded-[2.5rem] bg-zinc-900 text-white"
                    >
                        <div className="flex items-center justify-between gap-6">
                            <div className="space-y-2">
                                <h3 className="text-xl font-heading font-black uppercase tracking-tight italic">Atelier Controls</h3>
                                <p className="text-zinc-400 text-sm font-medium">You have curator access. You can manage inventory, categories, and review all customer orders.</p>
                            </div>
                            <Link href="/admin">
                                <Button className="bg-white text-black hover:bg-zinc-200 rounded-full font-black uppercase tracking-widest text-[10px] px-8 py-6 shadow-2xl">
                                    Dashboard
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
