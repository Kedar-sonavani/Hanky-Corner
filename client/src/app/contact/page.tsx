'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMasterSwitch } from '@/context/MasterSwitchContext';

export default function ContactPage() {
    const { whatsappNumber } = useMasterSwitch();

    const handleWhatsApp = () => {
        window.open(`https://wa.me/${whatsappNumber}?text=Hi! I have an inquiry about a product.`, '_blank');
    };

    return (
        <main className="min-h-screen bg-zinc-50/50 pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-6xl">

                <div className="text-center mb-20 space-y-4">
                    <h1 className="font-heading text-6xl md:text-8xl font-black uppercase tracking-tighter text-zinc-900">
                        Get In Touch
                    </h1>
                    <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs">Direct Line to the Atelier</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* CONTACT INFO */}
                    <div className="lg:col-span-5 space-y-12">
                        <section className="space-y-6">
                            <h2 className="text-2xl font-heading font-black uppercase tracking-tight text-zinc-900">Archive Inquiries</h2>
                            <p className="text-zinc-500 font-medium leading-relaxed">
                                Whether you're seeking a custom commission or have questions about our existing collection, our team is here to assist.
                            </p>
                        </section>

                        <div className="space-y-6">
                            <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-zinc-100 shadow-lg shadow-zinc-200/50">
                                <div className="p-4 rounded-2xl bg-zinc-900 text-white">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Address</p>
                                    <p className="font-bold text-zinc-900">hello@hankycorner.com</p>
                                </div>
                            </div>

                            <div
                                onClick={handleWhatsApp}
                                className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-zinc-100 shadow-lg shadow-zinc-200/50 cursor-pointer hover:border-green-200 hover:bg-green-50/30 transition-all group"
                            >
                                <div className="p-4 rounded-2xl bg-green-500 text-white shadow-xl shadow-green-200">
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">WhatsApp Concierge</p>
                                    <p className="font-bold text-zinc-900">+{whatsappNumber}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-zinc-100 shadow-lg shadow-zinc-200/50">
                                <div className="p-4 rounded-2xl bg-zinc-100 text-zinc-900">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Atelier Studio</p>
                                    <p className="font-bold text-zinc-900">Mumbai, Maharashtra, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CONTACT FORM */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-zinc-200/60 border border-zinc-100">
                            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-1">Your Name</label>
                                        <Input placeholder="John Doe" className="h-14 rounded-2xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all px-6" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-1">Email Address</label>
                                        <Input placeholder="john@example.com" className="h-14 rounded-2xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all px-6" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-1">Subject</label>
                                    <Input placeholder="Archive Inquiry" className="h-14 rounded-2xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all px-6" />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-1">Message</label>
                                    <textarea
                                        className="w-full min-h-[200px] rounded-3xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-zinc-900/5 transition-all p-6 text-sm font-medium outline-none resize-none"
                                        placeholder="Tell us about your requirements..."
                                    />
                                </div>

                                <Button className="w-full py-8 rounded-3xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-zinc-900/20 group">
                                    Send Message
                                    <Send className="h-4 w-4 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
