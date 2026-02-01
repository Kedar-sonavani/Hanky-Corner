'use client';

import { motion } from 'framer-motion';
import { Scissors, Leaf, ShieldCheck, HeartHandshake } from 'lucide-react';

const features = [
    {
        icon: Scissors,
        title: "Handcrafted Precision",
        description: "Each handkerchief is cut and hemmed by master artisans with decades of experience."
    },
    {
        icon: Leaf,
        title: "Sustainable Fabrics",
        description: "We source only 100% organic cotton and ethically produced silk from certified suppliers."
    },
    {
        icon: ShieldCheck,
        title: "Quality Guaranteed",
        description: "Rigorous quality checks ensure that every piece meets our uncompromising standards."
    },
    {
        icon: HeartHandshake,
        title: "Fair Trade",
        description: "We believe in fair wages and safe working conditions for every person in our supply chain."
    }
];

export function StorySection() {
    return (
        <section className="py-16 bg-muted/30">
            <div className="container max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Our Philosophy</span>
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                            More than just a <br />
                            <span className="italic text-muted-foreground font-serif">square of fabric.</span>
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                            At {process.env.NEXT_PUBLIC_SITE_NAME || "Hanky Corner"}, we believe that true elegance lies in the details. A handkerchief is a subtle signal of character, a nod to tradition, and a canvas for personal expression.
                        </p>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Our journey began with a simple mission: to revive the lost art of the gentleman's accessory, reimagined for the modern individual who values authenticity over fast fashion.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-200">
                            {/* Placeholder for a lifestyle image - using a colored div or a generic placeholder for now as we don't have local assets guaranteed */}
                            <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400">
                                <span className="font-heading italic">Lifestyle Imagery</span>
                            </div>
                        </div>
                        {/* Decorative element */}
                        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl z-[-1]" />
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary rounded-full blur-3xl z-[-1]" />
                    </motion.div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-background p-8 rounded-2xl border border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all group"
                        >
                            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-heading font-bold text-lg text-foreground mb-3">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
